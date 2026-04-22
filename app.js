// ============================================================
// app.js — Estado global, autenticação, navegação e utilitários
// ============================================================

// ── Estado global ──────────────────────────────────────────
let lancamentos = JSON.parse(localStorage.getItem('cc_lanc') || 'null') || LANC_INIT;
let clientes    = JSON.parse(localStorage.getItem('cc_cli')  || 'null') || CLI_INIT;
let retiradas   = JSON.parse(localStorage.getItem('cc_ret')  || 'null') || RET_INIT;
let usuarios    = JSON.parse(localStorage.getItem('cc_usr')  || 'null') || USERS_INIT;

let nextId      = 2000;
let mesSel      = 'Abril';
let currentUser = null;

// Filtros
let lancFilter = 'todos', lancTxt = '';
let cliFilter  = 'todos', cliTxt  = '';
let retFilter  = 'todos', retTxt  = '';

// Edição
let editingId = null;

// ── Persistência ───────────────────────────────────────────
function save() {
  localStorage.setItem('cc_lanc', JSON.stringify(lancamentos));
  localStorage.setItem('cc_cli',  JSON.stringify(clientes));
  localStorage.setItem('cc_ret',  JSON.stringify(retiradas));
  localStorage.setItem('cc_usr',  JSON.stringify(usuarios));
}

// ── Autenticação ───────────────────────────────────────────
function fazerLogin() {
  const u = document.getElementById('l-user').value.trim();
  const p = document.getElementById('l-pass').value;
  const found = usuarios.find(x => x.login === u && x.senha === p);

  if (!found) {
    document.getElementById('l-error').style.display = 'block';
    return;
  }

  currentUser = found;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  // Preencher chip de usuário
  document.getElementById('u-av').textContent   = found.nome.charAt(0).toUpperCase();
  document.getElementById('u-name').textContent = found.nome;
  const roles = { admin:'Administrador', financeiro:'Financeiro', usuario:'Visualizador' };
  document.getElementById('u-role').textContent = roles[found.perfil] + ' · Sair';

  // Esconder menu de usuários para não-admins
  if (found.perfil !== 'admin') {
    document.getElementById('nav-usuarios').style.display = 'none';
  }

  applyPermissions();
  renderAll();
  checkNotificacoes();
}

function applyPermissions() {
  const canEdit = currentUser && currentUser.perfil !== 'usuario';
  document.querySelectorAll('.can-edit').forEach(el => {
    el.style.display = canEdit ? '' : 'none';
  });
}

function logout() {
  currentUser = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('l-user').value = '';
  document.getElementById('l-pass').value = '';
  document.getElementById('l-error').style.display = 'none';
}

// ── Navegação ──────────────────────────────────────────────
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
  renderPage(id);
}

function renderPage(id) {
  const map = {
    dashboard:    renderDashboard,
    clientes:     renderClientes,
    lancamentos:  renderLancamentos,
    fixos:        () => renderTipoTabela('fixos-tbody','FIXO'),
    variaveis:    () => renderTipoTabela('variaveis-tbody','VARIÁVEL'),
    despesas:     () => renderTipoTabela('despesas-tbody','DESPESA'),
    retiradas:    renderRetiradas,
    'comp-socios': renderCompSocios,
    comparativo:  renderComparativo,
    usuarios:     renderUsuarios,
  };
  if (map[id]) map[id]();
}

function renderAll() {
  renderDashboard();
  renderLancamentos();
  renderTipoTabela('fixos-tbody','FIXO');
  renderTipoTabela('variaveis-tbody','VARIÁVEL');
  renderTipoTabela('despesas-tbody','DESPESA');
  renderRetiradas();
  renderCompSocios();
  renderComparativo();
  renderUsuarios();
  // Clientes renderizado separado por ter notif
  renderClientes();
}

// ── Mês ────────────────────────────────────────────────────
function getMes() { return mesSel; }

function mudarMes(m) {
  mesSel = m;
  document.getElementById('dash-sub').textContent = `${m} 2026 · Visão financeira geral`;
  document.getElementById('donut-mes').textContent = m.toUpperCase();
  document.getElementById('f-mes').value = m;
  renderDashboard();
  renderLancamentos();
  renderTipoTabela('fixos-tbody','FIXO');
  renderTipoTabela('variaveis-tbody','VARIÁVEL');
  renderTipoTabela('despesas-tbody','DESPESA');
  renderRetiradas();
}

// ── Utilitários ────────────────────────────────────────────
function fmt(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 });
}

function getTotais(mes) {
  const d = lancamentos.filter(x => x.mes === mes);
  const fixos     = d.filter(x => x.tipo === 'FIXO').reduce((s,x) => s+x.valor, 0);
  const variaveis = d.filter(x => x.tipo === 'VARIÁVEL').reduce((s,x) => s+x.valor, 0);
  const despesas  = d.filter(x => x.tipo === 'DESPESA').reduce((s,x) => s+x.valor, 0);
  const total     = fixos + variaveis + despesas;
  const pendentes = d.filter(x => x.status === 'PENDENTE').reduce((s,x) => s+x.valor, 0);
  return { fixos, variaveis, despesas, total, pendentes };
}

// ── Toast ──────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── ESC fecha modais ───────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.mo.open').forEach(m => m.classList.remove('open'));
});

// ── Enter no login ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ['l-user','l-pass'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') fazerLogin();
    });
  });
});
