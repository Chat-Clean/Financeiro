// ============================================================
// modals.js — Modais, formulários e gestão de usuários
// ============================================================

// ── Abrir modais ───────────────────────────────────────────
function openModal(tipo, subTipo = '') {
  editingId = null;
  if (tipo === 'lancamento') {
    document.getElementById('mo-lanc-title').textContent = 'Novo Lançamento';
    document.getElementById('f-desc').value   = '';
    document.getElementById('f-tipo').value   = subTipo || 'FIXO';
    document.getElementById('f-mes').value    = mesSel;
    document.getElementById('f-valor').value  = '';
    document.getElementById('f-status').value = 'PAGO';
    document.getElementById('mo-lancamento').classList.add('open');
    document.getElementById('f-desc').focus();

  } else if (tipo === 'cliente') {
    document.getElementById('mo-cli-title').textContent = 'Novo Cliente';
    ['c-nome','c-cnpj','c-resp','c-tel','c-email','c-vend','c-obs'].forEach(id =>
      document.getElementById(id).value = ''
    );
    document.getElementById('c-mensal').value = '';
    document.getElementById('c-dia').value    = '';
    document.getElementById('c-status').value = 'ativo';
    document.getElementById('c-inicio').value = '';
    document.getElementById('mo-cliente').classList.add('open');

  } else if (tipo === 'retirada') {
    document.getElementById('r-desc').value  = '';
    document.getElementById('r-valor').value = '';
    document.getElementById('r-mes').value   = mesSel;
    const today = new Date();
    document.getElementById('r-data').value  = today.toISOString().split('T')[0];
    document.getElementById('mo-retirada').classList.add('open');

  } else if (tipo === 'usuario') {
    ['u-nome','u-login','u-senha'].forEach(id =>
      document.getElementById(id).value = ''
    );
    document.getElementById('u-perfil').value = 'usuario';
    document.getElementById('mo-usuario').classList.add('open');
  }
}

// ── Fechar modais ──────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function closeMoClick(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

// ── Usuários ───────────────────────────────────────────────
function renderUsuarios() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  tbody.innerHTML = usuarios.map(u => `
    <tr>
      <td style="font-weight:500">${u.nome}</td>
      <td class="mono">${u.login}</td>
      <td><span class="badge b-${u.perfil}">${u.perfil.toUpperCase()}</span></td>
      <td style="color:var(--muted2)">${u.criado}</td>
      <td>
        ${u.id !== currentUser?.id
          ? `<button class="ab db" onclick="deletarUser(${u.id})" title="Excluir">🗑</button>`
          : '—'}
      </td>
    </tr>`).join('');
}

function salvarUsuario() {
  const nome   = document.getElementById('u-nome').value.trim();
  const login  = document.getElementById('u-login').value.trim();
  const senha  = document.getElementById('u-senha').value;
  const perfil = document.getElementById('u-perfil').value;

  if (!nome || !login || !senha) { alert('Preencha todos os campos.'); return; }
  if (usuarios.find(u => u.login === login)) { alert('Este login já existe.'); return; }

  const hoje   = new Date();
  const criado = `${String(hoje.getDate()).padStart(2,'0')}/${String(hoje.getMonth()+1).padStart(2,'0')}/${hoje.getFullYear()}`;

  usuarios.push({ id: nextId++, nome, login, senha, perfil, criado });
  save();
  renderUsuarios();
  closeModal('mo-usuario');
  showToast('✅ Usuário criado!');
}

function deletarUser(id) {
  if (!confirm('Excluir este usuário?')) return;
  usuarios = usuarios.filter(u => u.id !== id);
  save();
  renderUsuarios();
  showToast('🗑 Usuário removido');
}
