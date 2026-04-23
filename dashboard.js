// ============================================================
// dashboard.js v3
// ============================================================

function renderDashboard() {
  const m   = getMes();
  const c   = getTotaisCustos(m);
  const r   = getReceitaTotal(m);
  const res = r.total - c.total;
  const mrr = clientes.filter(x => x.status==='ativo' && x.mensal>0).reduce((s,x)=>s+x.mensal,0);

  // KPIs
  setHTML('dash-kpis', `
    <div class="kpi-grid kpi-grid-4">
      <div class="kpi k-green">
        <div class="kpi-label">Receita Total</div>
        <div class="kpi-value">${fmt(r.total)}</div>
        <div class="kpi-sub">Rec: ${fmt(r.recorrente)} + Var: ${fmt(r.variavel)}</div>
      </div>
      <div class="kpi k-blue">
        <div class="kpi-label">Total Custos</div>
        <div class="kpi-value">${fmt(c.total)}</div>
        <div class="kpi-sub">Fixos + Variáveis + Despesas</div>
      </div>
      <div class="kpi ${res>=0?'k-green':'k-red'}">
        <div class="kpi-label">Resultado Líquido</div>
        <div class="kpi-value">${fmt(res)}</div>
        <div class="kpi-trend ${res>=0?'up':'down'}">${res>=0?'▲ Positivo':'▼ Negativo'}</div>
      </div>
      <div class="kpi k-cyan">
        <div class="kpi-label">MRR (Recorrência)</div>
        <div class="kpi-value">${fmt(mrr)}</div>
        <div class="kpi-sub">${clientes.filter(x=>x.status==='ativo').length} clientes ativos</div>
      </div>
    </div>`);

  // Summary bar
  const pendentes = lancamentos.filter(x=>x.mes===m && x.status==='PENDENTE').reduce((s,x)=>s+x.valor,0);
  const venc5 = getVencendo5().length;
  setHTML('dash-summary', `
    <div class="summary-bar">
      <div class="sum-item"><div class="sum-label">Mês</div><div class="sum-value" style="color:var(--accent)">${m} 2026</div></div>
      <div class="sum-div"></div>
      <div class="sum-item"><div class="sum-label">Margem</div><div class="sum-value">${c.total?((res/r.total||0)*100).toFixed(1):0}%</div></div>
      <div class="sum-div"></div>
      <div class="sum-item"><div class="sum-label">Pendente Pagar</div><div class="sum-value" style="color:var(--warn)">${fmt(pendentes)}</div></div>
      <div class="sum-div"></div>
      <div class="sum-item"><div class="sum-label">Vencendo 5d</div><div class="sum-value" style="color:${venc5?'var(--red)':'var(--green)'}">${venc5} clientes</div></div>
      <div class="sum-div"></div>
      <div class="sum-item"><div class="sum-label">Lançamentos</div><div class="sum-value">${lancamentos.filter(x=>x.mes===m).length}</div></div>
    </div>`);

  checkNotifications();
  renderDashCharts(m, c, r);
  renderDashTable(m);
}

function renderDashCharts(m, c, r) {
  // Donut
  const cats = [
    {l:'Fixos',    v:c.fixos,    cor:'#3b9eff'},
    {l:'Variáveis',v:c.variaveis,cor:'#ffb020'},
    {l:'Despesas', v:c.despesas, cor:'#ff4d6d'},
  ];
  const total = c.total||1;
  const cx=70,cy=70,rad=52,inn=32;
  let start=-Math.PI/2, paths='';
  cats.forEach(cat=>{
    const a=((cat.v||0)/total)*Math.PI*2, end=start+a;
    const [x1,y1]=[cx+rad*Math.cos(start),cy+rad*Math.sin(start)];
    const [x2,y2]=[cx+rad*Math.cos(end),  cy+rad*Math.sin(end)];
    const [i1,j1]=[cx+inn*Math.cos(start),cy+inn*Math.sin(start)];
    const [i2,j2]=[cx+inn*Math.cos(end),  cy+inn*Math.sin(end)];
    const lg=a>Math.PI?1:0;
    if(cat.v>0) paths+=`<path d="M${i1},${j1}L${x1},${y1}A${rad},${rad} 0 ${lg},1 ${x2},${y2}L${i2},${j2}A${inn},${inn} 0 ${lg},0 ${i1},${j1}" fill="${cat.cor}" opacity=".9"/>`;
    start=end;
  });
  setHTML('dash-donut','');
  const svg=document.getElementById('dash-donut-svg');
  if(svg){
    svg.innerHTML=paths+`<text x="70" y="67" text-anchor="middle" fill="#e8edf5" font-family="Clash Display,sans-serif" font-size="10" font-weight="700">CUSTOS</text><text x="70" y="81" text-anchor="middle" fill="#00d68f" font-family="DM Mono,monospace" font-size="9">${fmt(c.total)}</text>`;
  }
  setHTML('dash-legend', cats.map(cat=>`
    <div class="leg-item">
      <div class="leg-dot" style="background:${cat.cor}"></div>
      <div class="leg-name">${cat.l}</div>
      <div class="leg-val">${fmt(cat.v)}</div>
    </div>`).join(''));

  // Top gastos
  const top = lancamentos.filter(x=>x.mes===m).sort((a,b)=>b.valor-a.valor).slice(0,6);
  const maxV = top[0]?.valor||1;
  const cols = {'FIXO':'#3b9eff','VARIÁVEL':'#ffb020','DESPESA':'#ff4d6d'};
  setHTML('dash-topbar', top.map(x=>`
    <div class="bar-row">
      <div class="bar-info"><span class="bar-name">${x.desc}</span><span class="mono">${fmt(x.valor)}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${(x.valor/maxV*100).toFixed(1)}%;background:${cols[x.tipo]||'#5a7090'}"></div></div>
    </div>`).join(''));

  // Crescimento canvas
  renderGrowthChart();
}

function renderGrowthChart() {
  const canvas = document.getElementById('growth-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth - 44;
  canvas.height = 160;

  const meses = MESES_LIST.slice(0,6);
  const recRows = meses.map(m => getReceitaTotal(m).total);
  const cusRows = meses.map(m => getTotaisCustos(m).total);
  const maxV = Math.max(...recRows,...cusRows,1);
  const w=canvas.width, h=canvas.height;
  const pad={t:16,b:28,l:10,r:10};

  ctx.clearRect(0,0,w,h);

  // Draw lines
  const drawLine = (data, color, fill) => {
    const pts = data.map((v,i)=>({
      x: pad.l + i*(w-pad.l-pad.r)/(meses.length-1),
      y: h-pad.b - (v/maxV)*(h-pad.t-pad.b)
    }));
    ctx.beginPath();
    pts.forEach((p,i)=> i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
    ctx.strokeStyle = color; ctx.lineWidth=2; ctx.stroke();
    if(fill){
      ctx.lineTo(pts[pts.length-1].x,h-pad.b);
      ctx.lineTo(pts[0].x,h-pad.b);
      ctx.closePath();
      ctx.fillStyle=fill; ctx.fill();
    }
    pts.forEach(p=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2);
      ctx.fillStyle=color; ctx.fill();
    });
  };

  drawLine(recRows,'#00d68f','rgba(0,214,143,.08)');
  drawLine(cusRows,'#ff4d6d','rgba(255,77,109,.05)');

  // Labels
  meses.forEach((m,i)=>{
    const x=pad.l+i*(w-pad.l-pad.r)/(meses.length-1);
    ctx.fillStyle='#5a7090'; ctx.font='9px DM Mono,monospace'; ctx.textAlign='center';
    ctx.fillText(m.slice(0,3),x,h-6);
  });

  // Legend
  ctx.fillStyle='#00d68f'; ctx.fillRect(8,4,20,3);
  ctx.fillStyle='#8096b8'; ctx.font='9px DM Mono'; ctx.textAlign='left';
  ctx.fillText('Receita',32,8);
  ctx.fillStyle='#ff4d6d'; ctx.fillRect(82,4,20,3);
  ctx.fillStyle='#8096b8'; ctx.fillText('Custos',106,8);
}

function renderDashTable(m) {
  const items = lancamentos.filter(x=>x.mes===m);
  const canE = currentUser?.perfil !== 'usuario';
  renderTable('dash-tbody', items, [
    x => x.desc,
    x => `<span class="badge badge-${x.tipo.toLowerCase().replace('á','a').replace('é','e')}">${x.tipo}</span>`,
    x => `<span class="mono">${fmt(x.valor)}</span>`,
    x => `<button class="status-toggle" onclick="toggleStatus(${x.id})">${x.status==='PAGO'?'<span class="badge badge-pago">PAGO</span>':'<span class="badge badge-pendente">PENDENTE</span>'}</button>`,
    x => canE ? `<button class="action-btn btn-del" onclick="deletarLanc(${x.id})">🗑</button>` : '',
  ]);
}

function filtrarDash(v) { renderDashTable(getMes()); }

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
