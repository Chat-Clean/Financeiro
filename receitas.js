// ============================================================
// receitas.js v3 — Receitas Variáveis, Canais, Relatórios
// ============================================================

// ── Receitas Extras ──────────────────────────────────────────
function renderReceitas() {
  const m   = getMes();
  const mes = receitasExtra.filter(r => r.mes === m);
  const total = mes.reduce((s,r)=>s+r.valor,0);

  const byTipo = {};
  mes.forEach(r => { byTipo[r.tipo] = (byTipo[r.tipo]||0) + r.valor; });

  setHTML('rex-kpis', `
    <div class="kpi-grid kpi-grid-4">
      <div class="kpi k-green">
        <div class="kpi-label">Total Receita Variável ${m}</div>
        <div class="kpi-value">${fmt(total)}</div>
        <div class="kpi-sub">${mes.length} lançamentos</div>
      </div>
      <div class="kpi k-blue">
        <div class="kpi-label">Implantações</div>
        <div class="kpi-value">${fmt(byTipo['implantacao']||0)}</div>
      </div>
      <div class="kpi k-purple">
        <div class="kpi-label">Vendas de IA</div>
        <div class="kpi-value">${fmt(byTipo['ia']||0)}</div>
      </div>
      <div class="kpi k-cyan">
        <div class="kpi-label">Metrics + Outros</div>
        <div class="kpi-value">${fmt((byTipo['metrics']||0)+(byTipo['outro']||0))}</div>
      </div>
    </div>`);

  let items = rexFilter==='todos' ? receitasExtra : receitasExtra.filter(r=>r.tipo===rexFilter||r.mes===rexFilter);
  if (rexTxt) items = items.filter(r=>r.desc.toLowerCase().includes(rexTxt.toLowerCase()));

  const canE = currentUser?.perfil !== 'usuario';
  renderTable('rex-tbody', items, [
    r => r.desc,
    r => `<span class="badge badge-${r.tipo==='implantacao'?'fixo':r.tipo==='ia'?'variavel2':'variavel'}">${tipoLabel(r.tipo)}</span>`,
    r => `<span style="color:var(--muted2)">${r.mes}</span>`,
    r => {
      const canal = getCanal(r.canalId);
      return `<span class="canal-chip" style="background:${canal.cor}18;color:${canal.cor}">${canal.icon} ${canal.nome}</span>`;
    },
    r => {
      const vend = getVendedor(r.vendedorId);
      return vend.nome;
    },
    r => `<span class="mono" style="color:var(--accent)">${fmt(r.valor)}</span>`,
    r => r.data,
    r => canE ? `<button class="action-btn btn-del" onclick="deletarRex(${r.id})">🗑</button>` : '',
  ]);
}

function tipoLabel(t) {
  const map = {implantacao:'Implantação',ia:'Venda IA',metrics:'Metrics',outro:'Outro'};
  return map[t]||t;
}

function setRexFilter(f,el) {
  rexFilter=f;
  document.querySelectorAll('#page-receitas .ftab').forEach(t=>t.classList.remove('active'));
  if(el) el.classList.add('active');
  renderReceitas();
}
function filtrarRex(v2) { rexTxt=v2; renderReceitas(); }

function novaReceitaExtra() {
  editingId=null;
  ['f-rex-desc','f-rex-valor','f-rex-data'].forEach(id=>{if(document.getElementById(id))document.getElementById(id).value='';});
  if(document.getElementById('f-rex-tipo')) document.getElementById('f-rex-tipo').value='implantacao';
  if(document.getElementById('f-rex-mes')) document.getElementById('f-rex-mes').value=getMes();
  if(document.getElementById('f-rex-canal')) document.getElementById('f-rex-canal').value='c6';
  // Populate vendedor select
  const sel=document.getElementById('f-rex-vendedor');
  if(sel) sel.innerHTML=vendedores.filter(v=>v.ativo).map(v=>`<option value="${v.id}">${v.nome}</option>`).join('');
  const d=new Date(); if(document.getElementById('f-rex-data')) document.getElementById('f-rex-data').value=d.toISOString().split('T')[0];
  openModal('modal-rex');
}

function salvarRex() {
  const desc  = v('f-rex-desc');
  const valor = parseFloat(v('f-rex-valor'));
  if (!desc||!valor) { alert('Preencha os campos obrigatórios.'); return; }
  receitasExtra.push({
    id: nextId++,
    desc, tipo: v('f-rex-tipo'),
    mes: v('f-rex-mes'),
    canalId: v('f-rex-canal'),
    vendedorId: v('f-rex-vendedor'),
    valor, data: v('f-rex-data'),
  });
  save(); renderReceitas(); renderRelatorios(); renderVendas();
  closeModal('modal-rex');
  showToast('✅ Receita registrada!','success');
}

function deletarRex(id) {
  if(!confirm('Excluir este lançamento?')) return;
  receitasExtra=receitasExtra.filter(x=>x.id!==id);
  save(); renderReceitas();
  showToast('🗑 Removido');
}

// ── Canais ───────────────────────────────────────────────────
function renderCanais() {
  // Stats por canal
  const stats = canais.map(canal => {
    const qtd   = clientes.filter(c=>c.canal===canal.id).length;
    const mrr   = clientes.filter(c=>c.canal===canal.id && c.status==='ativo').reduce((s,c)=>s+c.mensal,0);
    const extra = receitasExtra.filter(r=>r.canalId===canal.id).reduce((s,r)=>s+r.valor,0);
    return {...canal, qtd, mrr, extra, total: mrr+extra};
  }).sort((a,b)=>b.total-a.total);

  const totalMrr = stats.reduce((s,c)=>s+c.mrr,0)||1;

  setHTML('canais-cards', `
    <div class="kpi-grid kpi-grid-3" style="margin-bottom:24px">
      ${stats.map(c=>`
        <div class="kpi" style="border-top-color:${c.cor};border-top-width:2px;border-top-style:solid">
          <div class="kpi-label">${c.icon} ${c.nome}</div>
          <div class="kpi-value">${fmt(c.mrr)}</div>
          <div class="kpi-sub">${c.qtd} clientes · ${((c.mrr/totalMrr)*100).toFixed(1)}%</div>
        </div>`).join('')}
    </div>`);

  // Bar chart
  const maxMrr = Math.max(...stats.map(c=>c.mrr),1);
  setHTML('canais-bars', stats.map(c=>`
    <div class="bar-row">
      <div class="bar-info">
        <span class="bar-name">${c.icon} ${c.nome} <small style="color:var(--muted)">(${c.qtd} clientes)</small></span>
        <span class="mono">${fmt(c.mrr)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${(c.mrr/maxMrr*100).toFixed(1)}%;background:${c.cor}"></div>
      </div>
    </div>`).join(''));

  renderTable('canais-tbody', stats, [
    c => `<span class="canal-chip" style="background:${c.cor}18;color:${c.cor}">${c.icon} ${c.nome}</span>`,
    c => String(c.qtd),
    c => `<span class="mono">${fmt(c.mrr)}</span>`,
    c => `<span class="mono">${fmt(c.extra)}</span>`,
    c => `<span class="mono" style="color:var(--accent)">${fmt(c.total)}</span>`,
    c => `${((c.mrr/totalMrr)*100).toFixed(1)}%`,
    c => (currentUser?.perfil==='admin') ? `<button class="action-btn btn-del" onclick="deletarCanal('${c.id}')">🗑</button>` : '',
  ]);
}

function novoCanal() {
  ['f-canal-nome','f-canal-cor'].forEach(id=>{if(document.getElementById(id))document.getElementById(id).value='';});
  if(document.getElementById('f-canal-icon')) document.getElementById('f-canal-icon').value='📌';
  if(document.getElementById('f-canal-cor')) document.getElementById('f-canal-cor').value='#5a7090';
  openModal('modal-canal');
}

function salvarCanal() {
  const nome = v('f-canal-nome');
  if (!nome) { alert('Informe o nome.'); return; }
  canais.push({id:`c${nextId++}`,nome,cor:v('f-canal-cor')||'#5a7090',icon:v('f-canal-icon')||'📌'});
  save(); renderCanais(); closeModal('modal-canal');
  showToast('✅ Canal criado!','success');
}

function deletarCanal(id) {
  if(!confirm('Excluir este canal?')) return;
  canais=canais.filter(c=>c.id!==id);
  save(); renderCanais();
  showToast('🗑 Canal removido');
}

// ── Relatórios ────────────────────────────────────────────────
function renderRelatorios() {
  const MESES = MESES_LIST;

  const rows = MESES.map(mes => {
    const custos   = getTotaisCustos(mes);
    const receita  = getReceitaTotal(mes);
    const resultado = receita.total - custos.total;
    const margem   = receita.total > 0 ? ((resultado/receita.total)*100).toFixed(1) : '0';
    return {mes, ...custos, ...receita, resultado, margem};
  }).filter(r => r.total > 0 || r.recorrente > 0);

  // Summary total
  const totRec   = rows.reduce((s,r)=>s+r.recorrente,0);
  const totVar   = rows.reduce((s,r)=>s+r.variavel,0);
  const totCusto = rows.reduce((s,r)=>s+r.total,0);
  const totRes   = rows.reduce((s,r)=>s+r.resultado,0);

  setHTML('rel-summary', `
    <div class="kpi-grid kpi-grid-4" style="margin-bottom:24px">
      <div class="kpi k-green"><div class="kpi-label">Receita Recorrente (Acum.)</div><div class="kpi-value">${fmt(totRec)}</div></div>
      <div class="kpi k-purple"><div class="kpi-label">Receita Variável (Acum.)</div><div class="kpi-value">${fmt(totVar)}</div></div>
      <div class="kpi k-blue"><div class="kpi-label">Custos (Acum.)</div><div class="kpi-value">${fmt(totCusto)}</div></div>
      <div class="kpi ${totRes>=0?'k-green':'k-red'}"><div class="kpi-label">Resultado (Acum.)</div><div class="kpi-value">${fmt(totRes)}</div></div>
    </div>`);

  renderTable('rel-tbody', rows, [
    r => `<strong>${r.mes}</strong>`,
    r => `<span class="mono" style="color:var(--accent)">${fmt(r.recorrente)}</span>`,
    r => `<span class="mono" style="color:var(--purple)">${fmt(r.variavel)}</span>`,
    r => `<span class="mono" style="color:var(--accent);font-weight:600">${fmt(r.recorrente+r.variavel)}</span>`,
    r => `<span class="mono">${fmt(r.total)}</span>`,
    r => `<span class="mono ${r.resultado>=0?'':''}' style="color:${r.resultado>=0?'var(--green)':'var(--red)'}">${r.resultado>=0?'▲':'▼'} ${fmt(Math.abs(r.resultado))}</span>`,
    r => `<span style="color:${parseFloat(r.margem)>=30?'var(--green)':parseFloat(r.margem)>=10?'var(--amber)':'var(--red)'}">${r.margem}%</span>`,
  ]);

  renderRelCanvas(rows);
}

function renderRelCanvas(rows) {
  const canvas = document.getElementById('rel-canvas');
  if(!canvas||!rows.length) return;
  const ctx=canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth-44;
  canvas.height = 200;

  const recRows = rows.map(r=>r.recorrente+r.variavel);
  const cusRows = rows.map(r=>r.total);
  const maxV = Math.max(...recRows,...cusRows,1);
  const w=canvas.width,h=canvas.height;
  const pad={t:20,b:30,l:10,r:10};
  const bw=(w-pad.l-pad.r)/rows.length;

  ctx.clearRect(0,0,w,h);

  rows.forEach((r,i)=>{
    const x=pad.l+i*bw+bw*0.1;
    const bww=bw*0.38;
    // Receita
    const hRec = (recRows[i]/maxV)*(h-pad.t-pad.b);
    const gr1=ctx.createLinearGradient(0,h-pad.b-hRec,0,h-pad.b);
    gr1.addColorStop(0,'#00d68f'); gr1.addColorStop(1,'rgba(0,214,143,.1)');
    ctx.fillStyle=gr1;
    ctx.beginPath(); ctx.roundRect(x,h-pad.b-hRec,bww,hRec,[3,3,0,0]); ctx.fill();
    // Custo
    const hCus = (cusRows[i]/maxV)*(h-pad.t-pad.b);
    const gr2=ctx.createLinearGradient(0,h-pad.b-hCus,0,h-pad.b);
    gr2.addColorStop(0,'#ff4d6d'); gr2.addColorStop(1,'rgba(255,77,109,.1)');
    ctx.fillStyle=gr2;
    ctx.beginPath(); ctx.roundRect(x+bww+2,h-pad.b-hCus,bww,hCus,[3,3,0,0]); ctx.fill();
    // Label
    ctx.fillStyle='#5a7090'; ctx.font='9px DM Mono'; ctx.textAlign='center';
    ctx.fillText(r.mes.slice(0,3),x+bww,h-8);
  });

  ctx.fillStyle='#00d68f'; ctx.fillRect(8,4,14,6);
  ctx.fillStyle='#8096b8'; ctx.font='9px DM Mono'; ctx.textAlign='left'; ctx.fillText('Receita',26,10);
  ctx.fillStyle='#ff4d6d'; ctx.fillRect(80,4,14,6);
  ctx.fillStyle='#8096b8'; ctx.fillText('Custos',98,10);
}

function exportarPDF() {
  window.print();
  showToast('🖨️ Abrindo impressão/PDF...','success');
}

function exportarExcel() {
  // Gerar CSV simples
  const MESES = MESES_LIST;
  const rows  = MESES.map(mes => {
    const c=getTotaisCustos(mes), r=getReceitaTotal(mes);
    return [mes, r.recorrente.toFixed(2), r.variavel.toFixed(2), (r.recorrente+r.variavel).toFixed(2), c.total.toFixed(2), (r.recorrente+r.variavel-c.total).toFixed(2)];
  }).filter(r=>parseFloat(r[1])>0||parseFloat(r[4])>0);

  const header = ['Mês','Rec.Recorrente','Rec.Variável','Total Receita','Total Custos','Resultado'];
  const csv    = [header,...rows].map(r=>r.join(';')).join('\n');
  const blob   = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const a      = document.createElement('a');
  a.href       = URL.createObjectURL(blob);
  a.download   = 'ChatClean_Financeiro.csv';
  a.click();
  showToast('📊 Excel exportado!','success');
}
