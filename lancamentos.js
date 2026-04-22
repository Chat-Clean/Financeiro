// ============================================================
// lancamentos.js — Lançamentos financeiros (fixos, variáveis, despesas)
// ============================================================

// ── Tabela genérica ────────────────────────────────────────
function renderTabela(tbId, items, comTipo = false, comAcoes = true) {
  const tbody = document.getElementById(tbId);
  if (!tbody) return;
  const canE = currentUser && currentUser.perfil !== 'usuario';

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8">
      <div class="empty"><div class="empty-icon">🔍</div><div>Nenhum registro encontrado</div></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(x => {
    const tipoBadge = comTipo
      ? `<td><span class="badge b-${x.tipo.toLowerCase().replace('á','a').replace('é','e')}">${x.tipo}</span></td>`
      : '';
    const acoes = comAcoes && canE
      ? `<td><button class="ab db" onclick="deletarLanc(${x.id})" title="Excluir">🗑</button></td>`
      : comAcoes ? '<td></td>' : '';

    return `<tr>
      <td>${x.desc}</td>
      ${tipoBadge}
      <td class="mono" style="color:var(--muted2)">${x.mes || ''}</td>
      <td class="mono">${fmt(x.valor)}</td>
      <td>
        <button class="stg" onclick="toggleStatus(${x.id})">
          ${x.status === 'PAGO'
            ? '<span class="badge b-pago">PAGO</span>'
            : '<span class="badge b-pendente">PENDENTE</span>'}
        </button>
      </td>
      ${acoes}
    </tr>`;
  }).join('');
}

// ── Lançamentos (page) ─────────────────────────────────────
function renderLancamentos() {
  let items = lancamentos;
  if (lancFilter !== 'todos') {
    if (['FIXO','VARIÁVEL','DESPESA'].includes(lancFilter)) {
      items = items.filter(x => x.tipo === lancFilter);
    } else {
      items = items.filter(x => x.status === lancFilter);
    }
  }
  if (lancTxt) items = items.filter(x => x.desc.toLowerCase().includes(lancTxt.toLowerCase()));
  renderTabela('lanc-tbody', items, true, true);
}

function setLancFilter(f, el) {
  lancFilter = f;
  document.querySelectorAll('#page-lancamentos .ftab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderLancamentos();
}

function filtrarLanc(v) { lancTxt = v; renderLancamentos(); }

// ── Tipo filtrado (fixos, variáveis, despesas) ─────────────
function renderTipoTabela(tbId, tipo) {
  const m     = getMes();
  const items = lancamentos.filter(x => x.tipo === tipo && x.mes === m);
  renderTabela(tbId, items, false, true);
}

// ── Ações ──────────────────────────────────────────────────
function toggleStatus(id) {
  const item = lancamentos.find(x => x.id === id);
  if (!item) return;
  item.status = item.status === 'PAGO' ? 'PENDENTE' : 'PAGO';
  save();
  renderAll();
  showToast(item.status === 'PAGO' ? '✅ Marcado como Pago!' : '⏳ Marcado como Pendente');
}

function deletarLanc(id) {
  if (!confirm('Excluir este lançamento?')) return;
  lancamentos = lancamentos.filter(x => x.id !== id);
  save();
  renderAll();
  showToast('🗑 Lançamento excluído');
}

// ── Salvar lançamento ──────────────────────────────────────
function salvarLanc() {
  const desc   = document.getElementById('f-desc').value.trim().toUpperCase();
  const tipo   = document.getElementById('f-tipo').value;
  const mes    = document.getElementById('f-mes').value;
  const valor  = parseFloat(document.getElementById('f-valor').value);
  const status = document.getElementById('f-status').value;

  if (!desc || !valor || valor <= 0) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  lancamentos.push({ id: nextId++, desc, tipo, mes, valor, status });
  save();
  renderAll();
  closeModal('mo-lancamento');
  showToast('✅ Lançamento salvo!');
}
