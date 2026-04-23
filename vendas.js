// ============================================================
// vendas.js v3 — Dashboard de Vendas, Metas, Ranking
// ============================================================

function renderVendas() {
  const m = getMes();

  // Calcular vendas por vendedor no mês
  const vendStats = vendedores.filter(v=>v.ativo).map(vend => {
    const cliMes = clientes.filter(c => c.vendedorId === vend.id && c.inicio && c.inicio.startsWith(mesParaAno(m)));
    const recExtra = receitasExtra.filter(r => r.mes === m && r.vendedorId === vend.id);
    const totalNovos = cliMes.reduce((s,c)=>s+c.mensal,0) + recExtra.reduce((s,r)=>s+r.valor,0);
    const totalRecorr = clientes.filter(c=>c.vendedorId===vend.id&&c.status==='ativo').reduce((s,c)=>s+c.mensal,0);
    const meta = metas.find(mt => mt.vendedorId === vend.id && mt.mes === m)?.meta || 0;
    const pct  = meta > 0 ? Math.min(Math.round((totalNovos/meta)*100), 999) : 0;
    return { ...vend, totalNovos, totalRecorr, meta, pct, qtdClientes: cliMes.length };
  }).sort((a,b) => b.totalNovos - a.totalNovos);

  const totalVendido = vendStats.reduce((s,v)=>s+v.totalNovos,0);
  const totalMeta    = vendStats.reduce((s,v)=>s+v.meta,0);
  const pctGeral     = totalMeta>0 ? Math.round((totalVendido/totalMeta)*100) : 0;

  // KPIs gerais
  setHTML('vendas-kpis', `
    <div class="kpi-grid kpi-grid-4">
      <div class="kpi k-green">
        <div class="kpi-label">Total Vendido ${m}</div>
        <div class="kpi-value">${fmt(totalVendido)}</div>
        <div class="kpi-sub">${vendStats.filter(v=>v.totalNovos>0).length} vendedores ativos</div>
      </div>
      <div class="kpi k-blue">
        <div class="kpi-label">Meta Total</div>
        <div class="kpi-value">${fmt(totalMeta)}</div>
        <div class="kpi-sub">${pctGeral}% atingido</div>
      </div>
      <div class="kpi ${pctGeral>=100?'k-green':'k-amber'}">
        <div class="kpi-label">% Meta Geral</div>
        <div class="kpi-value">${pctGeral}%</div>
        <div class="kpi-trend ${pctGeral>=100?'up':'down'}">${pctGeral>=100?'🎯 Meta batida!':'📊 Em andamento'}</div>
      </div>
      <div class="kpi k-purple">
        <div class="kpi-label">MRR da Equipe</div>
        <div class="kpi-value">${fmt(vendStats.reduce((s,v)=>s+v.totalRecorr,0))}</div>
        <div class="kpi-sub">recorrência total</div>
      </div>
    </div>`);

  // Progress geral
  setHTML('meta-progress', `
    <div class="card" style="margin-bottom:20px">
      <div class="card-title">Meta Geral do Time — ${m} <small>${pctGeral}% atingida</small></div>
      <div style="margin-bottom:8px">
        <div class="progress-wrap" style="height:12px">
          <div class="progress-fill" style="width:${Math.min(pctGeral,100)}%;background:${pctGeral>=100?'var(--green)':pctGeral>=70?'var(--amber)':'var(--red)'}"></div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted2)">
        <span>R$ 0</span>
        <span style="font-weight:600;color:var(--text)">${fmt(totalVendido)} vendido</span>
        <span>${fmt(totalMeta)} (meta)</span>
      </div>
    </div>`);

  // Ranking
  setHTML('vendas-ranking', vendStats.map((v, i) => {
    const classes = ['gold','silver','bronze'];
    const cls = classes[i]||'';
    return `
    <div class="ranking-item">
      <div class="ranking-pos ${cls}">${i+1}</div>
      <div class="ranking-info">
        <div class="ranking-name">${v.nome}</div>
        <div class="ranking-sub">
          ${v.qtdClientes} novos · Meta: ${fmt(v.meta)}
          <div class="progress-wrap" style="margin-top:4px;height:4px;width:140px">
            <div class="progress-fill" style="width:${Math.min(v.pct,100)}%;background:${v.pct>=100?'var(--green)':v.pct>=70?'var(--amber)':'var(--blue)'}"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="ranking-val">${fmt(v.totalNovos)}</div>
        <div style="font-size:11px;color:${v.pct>=100?'var(--green)':'var(--muted2)'};text-align:right">${v.pct}%</div>
      </div>
    </div>`;
  }).join(''));

  // Tabela individual
  renderTable('vendas-tbody', vendStats, [
    v => `<span style="font-weight:600">${v.nome}</span>`,
    v => `<span class="mono">${fmt(v.meta)}</span>`,
    v => `<span class="mono" style="color:var(--accent)">${fmt(v.totalNovos)}</span>`,
    v => `<span class="mono">${fmt(v.meta - v.totalNovos > 0 ? v.meta - v.totalNovos : 0)}</span>`,
    v => {
      const pct = Math.min(v.pct,100);
      return `<div style="display:flex;align-items:center;gap:8px">
        <div class="progress-wrap" style="width:80px"><div class="progress-fill" style="width:${pct}%;background:${v.pct>=100?'var(--green)':v.pct>=70?'var(--amber)':'var(--blue)'}"></div></div>
        <span style="font-size:12px;color:${v.pct>=100?'var(--green)':'var(--text2)'}">${v.pct}%</span>
      </div>`;
    },
    v => `<span class="mono" style="color:var(--muted2)">${fmt(v.totalRecorr)}</span>`,
    v => (currentUser?.perfil!=='usuario') ? `<button class="btn btn-ghost btn-sm" onclick="editarMeta('${v.id}','${v.nome}')">🎯 Meta</button>` : '',
  ]);

  // Preencher select de vendedores nos filtros
  preencherSelectVendedores();
}

function mesParaAno(mes) {
  const map = {Janeiro:'2026-01',Fevereiro:'2026-02',Março:'2026-03',Abril:'2026-04',Maio:'2026-05',Junho:'2026-06',Julho:'2026-07',Agosto:'2026-08',Setembro:'2026-09',Outubro:'2026-10',Novembro:'2026-11',Dezembro:'2026-12'};
  return map[mes]||'2026-04';
}

function preencherSelectVendedores() {
  const sel = document.getElementById('f-vendedor-meta');
  if (!sel) return;
  sel.innerHTML = vendedores.filter(v=>v.ativo).map(v=>`<option value="${v.id}">${v.nome}</option>`).join('');
}

function editarMeta(vendId, nome) {
  document.getElementById('f-vendedor-meta').value = vendId;
  document.getElementById('f-mes-meta').value      = getMes();
  const atual = metas.find(m=>m.vendedorId===vendId && m.mes===getMes());
  document.getElementById('f-valor-meta').value    = atual?.meta||'';
  document.getElementById('modal-meta-title').textContent = `Meta — ${nome}`;
  openModal('modal-meta');
}

function salvarMeta() {
  const vendId = v('f-vendedor-meta');
  const mes    = v('f-mes-meta');
  const meta   = parseFloat(v('f-valor-meta'))||0;
  const idx    = metas.findIndex(m=>m.vendedorId===vendId && m.mes===mes);
  if (idx>=0) metas[idx].meta = meta;
  else metas.push({id:`m${nextId++}`,vendedorId:vendId,mes,meta});
  save(); renderVendas(); closeModal('modal-meta');
  showToast('🎯 Meta atualizada!','success');
}

function salvarVendedor() {
  const nome = v('f-vend-nome');
  if (!nome) { alert('Informe o nome.'); return; }
  vendedores.push({id:`v${nextId++}`,nome,email:v('f-vend-email'),ativo:true});
  save(); renderVendas(); closeModal('modal-vendedor');
  showToast('✅ Vendedor cadastrado!','success');
}
