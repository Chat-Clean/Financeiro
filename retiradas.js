// ============================================================
// retiradas.js — Retiradas dos sócios e comparativo mensal
// ============================================================

// ── Retiradas (page) ───────────────────────────────────────
function renderRetiradas() {
  const socios = ['Fabricio', 'Albert', 'Augusto'];
  const mes    = getMes();
  const mesRet = retiradas.filter(r => r.mes === mes);
  const totMes = mesRet.reduce((s, r) => s + r.valor, 0);

  // KPIs
  document.getElementById('ret-kpis').innerHTML = `
    <div class="kpi k-p">
      <div class="kpi-lbl">Total Retiradas ${mes}</div>
      <div class="kpi-val">${fmt(totMes)}</div>
    </div>
    ${socios.map(s => {
      const v = mesRet.filter(r => r.socio === s).reduce((a, r) => a + r.valor, 0);
      return `<div class="kpi k-b">
        <div class="kpi-lbl">${s}</div>
        <div class="kpi-val" style="color:var(--purple)">${fmt(v)}</div>
      </div>`;
    }).join('')}`;

  // Tabela
  let items = retiradas;
  if (retFilter !== 'todos') items = items.filter(r => r.socio === retFilter);
  if (retTxt) {
    const txt = retTxt.toLowerCase();
    items = items.filter(r =>
      r.desc.toLowerCase().includes(txt) ||
      r.socio.toLowerCase().includes(txt)
    );
  }

  const tbody = document.getElementById('ret-tbody');
  if (!tbody) return;
  const canE = currentUser && currentUser.perfil !== 'usuario';

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty"><div class="empty-icon">💰</div><div>Nenhuma retirada registrada</div></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(r => `
    <tr>
      <td><strong>${r.socio}</strong></td>
      <td>${r.desc}</td>
      <td style="color:var(--muted2)">${r.mes}</td>
      <td style="color:var(--muted2)">${r.data}</td>
      <td class="mono" style="color:var(--purple)">${fmt(r.valor)}</td>
      <td><span class="badge b-retirada">${r.cat}</span></td>
      ${canE ? `<td><button class="ab db" onclick="deletarRet(${r.id})">🗑</button></td>` : '<td></td>'}
    </tr>`).join('');
}

function setRetFilter(f, el) {
  retFilter = f;
  document.querySelectorAll('#page-retiradas .ftab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderRetiradas();
}

function filtrarRet(v) { retTxt = v; renderRetiradas(); }

function deletarRet(id) {
  if (!confirm('Excluir esta retirada?')) return;
  retiradas = retiradas.filter(x => x.id !== id);
  save();
  renderRetiradas();
  renderCompSocios();
  showToast('🗑 Retirada excluída');
}

function salvarRetirada() {
  const socio = document.getElementById('r-socio').value;
  const mes   = document.getElementById('r-mes').value;
  const valor = parseFloat(document.getElementById('r-valor').value);
  const data  = document.getElementById('r-data').value;
  const cat   = document.getElementById('r-cat').value;
  const desc  = document.getElementById('r-desc').value.trim() || `${cat} ${mes}`;

  if (!valor || valor <= 0) { alert('Informe o valor.'); return; }

  retiradas.push({ id: nextId++, socio, desc, mes, data, valor, cat });
  save();
  renderRetiradas();
  renderCompSocios();
  closeModal('mo-retirada');
  showToast('✅ Retirada registrada!');
}

// ── Comparativo Sócios ─────────────────────────────────────
function renderCompSocios() {
  const socios = ['Fabricio', 'Albert', 'Augusto'];
  const mes    = getMes();
  const mesRet = retiradas.filter(r => r.mes === mes);
  const total  = mesRet.reduce((s, r) => s + r.valor, 0) || 1;

  // Cards por sócio
  document.getElementById('socio-bars').innerHTML = socios.map(s => {
    const v   = mesRet.filter(r => r.socio === s).reduce((a, r) => a + r.valor, 0);
    const pct = ((v / total) * 100).toFixed(1);
    return `<div class="socio-bar-item">
      <div class="socio-nm">${s}</div>
      <div class="socio-vl">${fmt(v)}</div>
      <div class="socio-pct">${pct}% do total</div>
    </div>`;
  }).join('');

  // Canvas — evolução mensal por sócio
  const canvas = document.getElementById('comp-socios-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth - 44;
  canvas.height = 220;

  const meses  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho'];
  const colors = { Fabricio:'#3b82f6', Albert:'#a855f7', Augusto:'#f59e0b' };
  const w = canvas.width, h = canvas.height;
  const pad = { t:20, b:30, l:10, r:10 };
  const bw  = (w - pad.l - pad.r) / meses.length;

  const allVals = socios.flatMap(s =>
    meses.map(m => retiradas.filter(r => r.socio === s && r.mes === m).reduce((a,r) => a+r.valor, 0))
  );
  const maxV = Math.max(...allVals, 1);

  ctx.clearRect(0, 0, w, h);

  const sbw = bw * 0.7 / socios.length;
  socios.forEach((s, si) => {
    meses.forEach((m, mi) => {
      const v = retiradas.filter(r => r.socio === s && r.mes === m).reduce((a,r) => a+r.valor, 0);
      if (!v) return;
      const bh = (v / maxV) * (h - pad.t - pad.b);
      const x  = pad.l + mi * bw + bw * 0.15 + si * sbw;
      const y  = h - pad.b - bh;
      ctx.fillStyle    = colors[s];
      ctx.globalAlpha  = 0.85;
      ctx.beginPath();
      ctx.roundRect(x, y, sbw * 0.9, bh, [3,3,0,0]);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  });

  // Labels meses
  meses.forEach((m, mi) => {
    ctx.fillStyle   = '#5a6785';
    ctx.font        = '9px DM Mono,monospace';
    ctx.textAlign   = 'center';
    ctx.fillText(m.slice(0,3), pad.l + mi * bw + bw / 2, h - 8);
  });

  // Legenda sócios
  socios.forEach((s, i) => {
    ctx.fillStyle = colors[s];
    ctx.fillRect(pad.l + i * 80, 5, 12, 8);
    ctx.fillStyle = '#8496b0';
    ctx.font      = '10px DM Sans,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(s, pad.l + i * 80 + 16, 13);
  });
}

// ── Comparativo Mensal ─────────────────────────────────────
function renderComparativo() {
  const MESES = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ];

  const rows = MESES.map(m => {
    const t   = getTotais(m);
    const rec = RECEITAS[m] || 0;
    return { mes:m, ...t, receita:rec, resultado:rec - t.total };
  }).filter(r => r.total > 0 || r.receita > 0);

  document.getElementById('comp-tbody').innerHTML = rows.map(r => `
    <tr>
      <td style="font-weight:500">${r.mes}</td>
      <td class="mono">${fmt(r.fixos)}</td>
      <td class="mono">${fmt(r.variaveis)}</td>
      <td class="mono">${fmt(r.despesas)}</td>
      <td class="mono" style="font-weight:600">${fmt(r.total)}</td>
      <td class="mono" style="color:var(--accent)">${fmt(r.receita)}</td>
      <td class="mono ${r.resultado >= 0 ? 'trend-up' : 'trend-down'}">
        ${r.resultado >= 0 ? '▲' : '▼'} ${fmt(Math.abs(r.resultado))}
      </td>
    </tr>`).join('');

  // Canvas bar chart
  const canvas = document.getElementById('comp-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth - 44;
  canvas.height = 200;

  const vals = rows.map(r => r.total);
  const maxV = Math.max(...vals, 1);
  const w = canvas.width, h = canvas.height;
  const pad = { t:20, b:30, l:10, r:10 };
  const bw  = (w - pad.l - pad.r) / vals.length;

  ctx.clearRect(0, 0, w, h);
  vals.forEach((v, i) => {
    const bh = (v / maxV) * (h - pad.t - pad.b);
    const x  = pad.l + i * bw + bw * 0.15;
    const y  = h - pad.b - bh;
    const gr = ctx.createLinearGradient(0, y, 0, h - pad.b);
    gr.addColorStop(0, '#3b82f6');
    gr.addColorStop(1, 'rgba(59,130,246,0.1)');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.roundRect(x, y, bw * 0.7, bh, [4,4,0,0]);
    ctx.fill();
    ctx.fillStyle  = '#5a6785';
    ctx.font       = '9px DM Mono,monospace';
    ctx.textAlign  = 'center';
    ctx.fillText(rows[i].mes.slice(0,3), x + bw * 0.35, h - 8);
  });
}
