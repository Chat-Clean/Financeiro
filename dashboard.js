// ============================================================
// dashboard.js — Dashboard principal, KPIs, gráficos
// ============================================================

function renderDashboard() {
  const m   = getMes();
  const t   = getTotais(m);
  const rec = RECEITAS[m] || 0;
  const res = rec - t.total;

  // KPIs
  document.getElementById('kpi-grid').innerHTML = `
    <div class="kpi k-b">
      <div class="kpi-lbl">Custos Fixos</div>
      <div class="kpi-val">${fmt(t.fixos)}</div>
      <div class="kpi-sub">${((t.fixos / (t.total||1)) * 100).toFixed(1)}% do total</div>
    </div>
    <div class="kpi k-a">
      <div class="kpi-lbl">Custos Variáveis</div>
      <div class="kpi-val">${fmt(t.variaveis)}</div>
      <div class="kpi-sub">${((t.variaveis / (t.total||1)) * 100).toFixed(1)}% do total</div>
    </div>
    <div class="kpi k-r">
      <div class="kpi-lbl">Despesas</div>
      <div class="kpi-val">${fmt(t.despesas)}</div>
      <div class="kpi-sub">${((t.despesas / (t.total||1)) * 100).toFixed(1)}% do total</div>
    </div>
    <div class="kpi ${res >= 0 ? 'k-g' : 'k-r'}">
      <div class="kpi-lbl">Resultado</div>
      <div class="kpi-val">${fmt(res)}</div>
      <div class="kpi-sub">${res >= 0 ? '✅ Positivo' : '⚠️ Negativo'}</div>
    </div>`;

  // Summary bar
  document.getElementById('sum-bar').innerHTML = `
    <div class="sum-item"><div class="sum-lbl">Total Custos</div><div class="sum-val">${fmt(t.total)}</div></div>
    <div class="sum-div"></div>
    <div class="sum-item"><div class="sum-lbl">Receita Est.</div><div class="sum-val" style="color:var(--accent)">${fmt(rec)}</div></div>
    <div class="sum-div"></div>
    <div class="sum-item"><div class="sum-lbl">Pendente</div><div class="sum-val" style="color:var(--warn)">${fmt(t.pendentes)}</div></div>
    <div class="sum-div"></div>
    <div class="sum-item"><div class="sum-lbl">Lançamentos</div><div class="sum-val">${lancamentos.filter(x => x.mes === m).length}</div></div>`;

  renderDonut(t);
  renderBarChart(m);
  renderDashTabela();
  checkNotificacoes();
}

// ── Donut ──────────────────────────────────────────────────
function renderDonut(t) {
  const cats = [
    { lbl:'Fixos',     val:t.fixos,     cor:'#3b82f6' },
    { lbl:'Variáveis', val:t.variaveis, cor:'#f59e0b' },
    { lbl:'Despesas',  val:t.despesas,  cor:'#ef4444' },
  ];
  const total = t.total || 1;
  const cx = 70, cy = 70, r = 52, inn = 32;
  let start = -Math.PI / 2, paths = '';

  cats.forEach(c => {
    const ang  = (c.val / total) * Math.PI * 2;
    const end  = start + ang;
    const x1   = cx + r * Math.cos(start),   y1  = cy + r * Math.sin(start);
    const x2   = cx + r * Math.cos(end),     y2  = cy + r * Math.sin(end);
    const ix1  = cx + inn * Math.cos(start), iy1 = cy + inn * Math.sin(start);
    const ix2  = cx + inn * Math.cos(end),   iy2 = cy + inn * Math.sin(end);
    const lg   = ang > Math.PI ? 1 : 0;
    paths += `<path d="M${ix1},${iy1} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2}
               L${ix2},${iy2} A${inn},${inn} 0 ${lg},0 ${ix1},${iy1}"
               fill="${c.cor}" opacity="0.88"/>`;
    start = end;
  });

  document.getElementById('donut-svg').innerHTML =
    paths +
    `<text x="70" y="66" text-anchor="middle" fill="#e2e8f0"
       font-family="Syne,sans-serif" font-size="10" font-weight="700">TOTAL</text>
     <text x="70" y="80" text-anchor="middle" fill="#4ade80"
       font-family="DM Mono,monospace" font-size="9">${fmt(total)}</text>`;

  document.getElementById('donut-leg').innerHTML = cats.map(c => `
    <div class="leg-item">
      <div class="leg-dot" style="background:${c.cor}"></div>
      <div class="leg-nm">${c.lbl}</div>
      <div class="leg-vl">${fmt(c.val)}</div>
    </div>`).join('');
}

// ── Bar chart top gastos ───────────────────────────────────
function renderBarChart(mes) {
  const d    = lancamentos.filter(x => x.mes === mes).slice().sort((a,b) => b.valor - a.valor).slice(0,7);
  const max  = d[0]?.valor || 1;
  const colors = { 'FIXO':'#3b82f6', 'VARIÁVEL':'#f59e0b', 'DESPESA':'#ef4444' };

  document.getElementById('bar-chart').innerHTML = d.map(x => `
    <div class="bar-row">
      <div class="bar-info">
        <span class="bar-nm">${x.desc}</span>
        <span class="mono">${fmt(x.valor)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${(x.valor/max*100).toFixed(1)}%;background:${colors[x.tipo]}"></div>
      </div>
    </div>`).join('');
}

// ── Tabela dashboard ───────────────────────────────────────
function renderDashTabela(txt = '') {
  const m = getMes();
  let items = lancamentos.filter(x => x.mes === m);
  if (txt) items = items.filter(x => x.desc.toLowerCase().includes(txt.toLowerCase()));
  renderTabela('dash-tbody', items, true, true);
}

function filtrarDash(v) { renderDashTabela(v); }
