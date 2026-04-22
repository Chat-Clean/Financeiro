// ============================================================
// clientes.js — Gestão de clientes recorrentes e cobranças
// ============================================================

function renderClientes() {
  const today     = new Date();
  const ativas    = clientes.filter(c => c.status === 'ativo');
  const mensalTot = ativas.reduce((s, c) => s + c.mensal, 0);
  const venc5     = _clientesVenc5(today);

  // KPIs
  document.getElementById('cli-kpis').innerHTML = `
    <div class="kpi k-g">
      <div class="kpi-lbl">Clientes Ativos</div>
      <div class="kpi-val">${ativas.length}</div>
      <div class="kpi-sub">de ${clientes.length} total</div>
    </div>
    <div class="kpi k-b">
      <div class="kpi-lbl">MRR Estimado</div>
      <div class="kpi-val">${fmt(mensalTot)}</div>
      <div class="kpi-sub">recorrência mensal</div>
    </div>
    <div class="kpi k-a">
      <div class="kpi-lbl">Vencendo em 5 dias</div>
      <div class="kpi-val">${venc5.length}</div>
      <div class="kpi-sub">${venc5.length > 0 ? '⚠️ Ação necessária' : '✅ OK'}</div>
    </div>
    <div class="kpi k-r">
      <div class="kpi-lbl">Cancelados</div>
      <div class="kpi-val">${clientes.filter(c => c.status === 'cancelado').length}</div>
      <div class="kpi-sub">congelados: ${clientes.filter(c => c.status === 'congelado').length}</div>
    </div>`;

  // Banner de vencimentos na página de clientes
  const cliNotif = document.getElementById('cli-notif');
  if (venc5.length > 0) {
    const items = venc5.map(c => `
      <div class="notif-item">
        • <strong>${c.nome}</strong> — dia ${c.dia} — ${fmt(c.mensal)}
        <button class="btn btn-wa btn-sm" style="margin-left:6px"
          onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱 WA</button>
        <button class="btn btn-mail btn-sm"
          onclick="enviarEmail('${c.email}','${c.nome}',${c.mensal})">📧 Email</button>
      </div>`).join('');
    cliNotif.innerHTML = `
      <div class="notif-bar">
        <div class="notif-icon">🔔</div>
        <div>
          <div class="notif-title">Clientes com fatura vencendo nos próximos 5 dias:</div>
          ${items}
        </div>
      </div>`;
  } else {
    cliNotif.innerHTML = '';
  }

  _renderClientesTabela();
}

function _clientesVenc5(today) {
  return clientes.filter(c => {
    if (c.status !== 'ativo') return false;
    const dia = parseInt(c.dia);
    if (!dia) return false;
    const venc = new Date(today.getFullYear(), today.getMonth(), dia);
    const diff = Math.ceil((venc - today) / 86400000);
    return diff >= 0 && diff <= 5;
  });
}

function _renderClientesTabela() {
  const today = new Date();
  let items   = clientes;

  if (cliFilter === 'vence5') {
    items = _clientesVenc5(today);
  } else if (cliFilter !== 'todos') {
    items = clientes.filter(c => c.status === cliFilter);
  }

  if (cliTxt) {
    const txt = cliTxt.toLowerCase();
    items = items.filter(c =>
      c.nome.toLowerCase().includes(txt) ||
      (c.resp || '').toLowerCase().includes(txt) ||
      (c.vend || '').toLowerCase().includes(txt)
    );
  }

  const tbody = document.getElementById('cli-tbody');
  if (!tbody) return;
  const canE = currentUser && currentUser.perfil !== 'usuario';

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8">
      <div class="empty"><div class="empty-icon">🔍</div><div>Nenhum cliente encontrado</div></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(c => `
    <tr>
      <td>
        <strong>${c.nome}</strong>
        ${c.obs ? `<br><small style="color:var(--muted2)">${c.obs}</small>` : ''}
      </td>
      <td>${c.resp || '—'}</td>
      <td>
        ${c.tel
          ? `<button class="btn btn-wa btn-sm"
               onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})"
               title="${c.tel}">📱 ${c.tel}</button>`
          : '—'}
      </td>
      <td style="color:var(--muted2)">${c.vend || '—'}</td>
      <td class="mono">${c.mensal > 0 ? fmt(c.mensal) : 'PERMUTA/ANUAL'}</td>
      <td>${vencimentoStatus(c.dia)}</td>
      <td><span class="badge b-${c.status}">${c.status.toUpperCase()}</span></td>
      <td>
        ${canE ? `
          <button class="ab eb" onclick="editarCliente(${c.id})" title="Editar">✏️</button>
          <button class="ab db" onclick="deletarCliente(${c.id})" title="Excluir">🗑</button>
        ` : '—'}
      </td>
    </tr>`).join('');
}

// ── Filtros ────────────────────────────────────────────────
function setCliFilter(f, el) {
  cliFilter = f;
  document.querySelectorAll('#page-clientes .ftab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  _renderClientesTabela();
}

function filtrarClientes(v) { cliTxt = v; _renderClientesTabela(); }

// ── Editar cliente ─────────────────────────────────────────
function editarCliente(id) {
  const c = clientes.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById('mo-cli-title').textContent = 'Editar Cliente';
  document.getElementById('c-nome').value   = c.nome;
  document.getElementById('c-cnpj').value   = c.cnpj;
  document.getElementById('c-resp').value   = c.resp;
  document.getElementById('c-tel').value    = c.tel;
  document.getElementById('c-email').value  = c.email;
  document.getElementById('c-vend').value   = c.vend;
  document.getElementById('c-mensal').value = c.mensal;
  document.getElementById('c-dia').value    = c.dia;
  document.getElementById('c-status').value = c.status;
  document.getElementById('c-inicio').value = c.inicio;
  document.getElementById('c-obs').value    = c.obs;
  document.getElementById('mo-cliente').classList.add('open');
}

// ── Deletar cliente ────────────────────────────────────────
function deletarCliente(id) {
  if (!confirm('Excluir este cliente?')) return;
  clientes = clientes.filter(x => x.id !== id);
  save();
  renderClientes();
  showToast('🗑 Cliente removido');
}

// ── Salvar cliente ─────────────────────────────────────────
function salvarCliente() {
  const nome = document.getElementById('c-nome').value.trim();
  if (!nome) { alert('Informe o nome da empresa.'); return; }

  const obj = {
    id:     editingId || nextId++,
    nome,
    cnpj:   document.getElementById('c-cnpj').value,
    resp:   document.getElementById('c-resp').value,
    tel:    document.getElementById('c-tel').value,
    email:  document.getElementById('c-email').value,
    vend:   document.getElementById('c-vend').value,
    mensal: parseFloat(document.getElementById('c-mensal').value) || 0,
    dia:    parseInt(document.getElementById('c-dia').value) || 1,
    status: document.getElementById('c-status').value,
    inicio: document.getElementById('c-inicio').value,
    obs:    document.getElementById('c-obs').value,
  };

  if (editingId) {
    const idx = clientes.findIndex(c => c.id === editingId);
    if (idx >= 0) clientes[idx] = obj;
  } else {
    clientes.push(obj);
  }

  save();
  renderClientes();
  checkNotificacoes();
  closeModal('mo-cliente');
  showToast(editingId ? '✅ Cliente atualizado!' : '✅ Cliente adicionado!');
  editingId = null;
}
