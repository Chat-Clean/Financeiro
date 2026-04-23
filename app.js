// ============================================================
// app.js v3 — Estado global, autenticação, navegação
// ============================================================

// ── Estado global ───────────────────────────────────────────
let lancamentos   = JSON.parse(localStorage.getItem('cc3_lanc') || 'null') || LANC_INIT;
let clientes      = JSON.parse(localStorage.getItem('cc3_cli')  || 'null') || CLI_INIT;
let retiradas     = JSON.parse(localStorage.getItem('cc3_ret')  || 'null') || RET_INIT;
let usuarios      = JSON.parse(localStorage.getItem('cc3_usr')  || 'null') || USERS_INIT;
let receitasExtra = JSON.parse(localStorage.getItem('cc3_rex')  || 'null') || RECEITAS_EXTRA_INIT;
let vendedores    = JSON.parse(localStorage.getItem('cc3_vend') || 'null') || VENDEDORES_DEFAULT;
let metas         = JSON.parse(localStorage.getItem('cc3_meta') || 'null') || METAS_DEFAULT;
let canais        = JSON.parse(localStorage.getItem('cc3_can')  || 'null') || CANAIS_DEFAULT;
let crmEtapas     = JSON.parse(localStorage.getItem('cc3_crm')  || 'null') || CRM_ETAPAS_DEFAULT;

let nextId      = 5000;
let mesSel      = 'Abril';
let currentUser = null;
let editingId   = null;

// Filtros
let lancFilter = 'todos', lancTxt  = '';
let cliFilter  = 'todos', cliTxt   = '';
let retFilter  = 'todos', retTxt   = '';
let rexFilter  = 'todos', rexTxt   = '';

// ── Persistência ────────────────────────────────────────────
function save() {
  localStorage.setItem('cc3_lanc', JSON.stringify(lancamentos));
  localStorage.setItem('cc3_cli',  JSON.stringify(clientes));
  localStorage.setItem('cc3_ret',  JSON.stringify(retiradas));
  localStorage.setItem('cc3_usr',  JSON.stringify(usuarios));
  localStorage.setItem('cc3_rex',  JSON.stringify(receitasExtra));
  localStorage.setItem('cc3_vend', JSON.stringify(vendedores));
  localStorage.setItem('cc3_meta', JSON.stringify(metas));
  localStorage.setItem('cc3_can',  JSON.stringify(canais));
  localStorage.setItem('cc3_crm',  JSON.stringify(crmEtapas));
}

// ── Auth ─────────────────────────────────────────────────────
function fazerLogin() {
  const u = document.getElementById('l-user').value.trim();
  const p = document.getElementById('l-pass').value;
  const found = usuarios.find(x => x.login === u && x.senha === p);
  if (!found) { document.getElementById('l-error').style.display = 'block'; return; }

  currentUser = found;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  document.getElementById('u-av').textContent   = found.nome.charAt(0).toUpperCase();
  document.getElementById('u-name').textContent = found.nome;
  const roles = {admin:'Administrador', financeiro:'Financeiro', usuario:'Visualizador'};
  document.getElementById('u-role').textContent = (roles[found.perfil]||found.perfil) + ' · Sair';

  if (found.perfil !== 'admin') document.getElementById('nav-usuarios').style.display = 'none';

  applyPermissions();
  renderAll();
  checkNotifications();
}

function applyPermissions() {
  const canEdit = currentUser && currentUser.perfil !== 'usuario';
  document.querySelectorAll('.can-edit').forEach(el => el.style.display = canEdit ? '' : 'none');
}

function logout() {
  currentUser = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  document.getElementById('l-user').value = '';
  document.getElementById('l-pass').value = '';
  document.getElementById('l-error').style.display = 'none';
}

// ── Navigation ───────────────────────────────────────────────
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');
  if (el) el.classList.add('active');
  renderPage(id);
}

const PAGE_RENDERS = {
  dashboard:    renderDashboard,
  clientes:     renderClientes,
  lancamentos:  renderLancamentos,
  fixos:        () => renderTipoTabela('tbody-fixos','FIXO'),
  variaveis:    () => renderTipoTabela('tbody-variaveis','VARIÁVEL'),
  despesas:     () => renderTipoTabela('tbody-despesas','DESPESA'),
  receitas:     renderReceitas,
  retiradas:    renderRetiradas,
  'socios-comp':renderCompSocios,
  comparativo:  renderComparativo,
  vendas:       renderVendas,
  crm:          renderCRM,
  aniversarios: renderAniversarios,
  relatorios:   renderRelatorios,
  usuarios:     renderUsuarios,
  canais:       renderCanais,
};

function renderPage(id) { PAGE_RENDERS[id]?.(); }

function renderAll() {
  renderDashboard();
  renderClientes();
  renderLancamentos();
  renderTipoTabela('tbody-fixos','FIXO');
  renderTipoTabela('tbody-variaveis','VARIÁVEL');
  renderTipoTabela('tbody-despesas','DESPESA');
  renderReceitas();
  renderRetiradas();
  renderCompSocios();
  renderComparativo();
  renderVendas();
  renderCRM();
  renderAniversarios();
  renderRelatorios();
  renderUsuarios();
  renderCanais();
}

// ── Mês ──────────────────────────────────────────────────────
function getMes() { return mesSel; }

function mudarMes(m) {
  mesSel = m;
  document.getElementById('dash-subtitle')?.['textContent'] != null &&
    (document.getElementById('dash-subtitle').textContent = `${m} 2026`);
  renderDashboard();
  renderLancamentos();
  renderTipoTabela('tbody-fixos','FIXO');
  renderTipoTabela('tbody-variaveis','VARIÁVEL');
  renderTipoTabela('tbody-despesas','DESPESA');
  renderReceitas();
  renderRetiradas();
  renderVendas();
}

// ── Utils ─────────────────────────────────────────────────────
function fmt(v) {
  return 'R$ ' + Number(v||0).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function fmtN(v) {
  return Number(v||0).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function today() {
  return new Date();
}

function getTotaisCustos(mes) {
  const d = lancamentos.filter(x => x.mes === mes);
  const fixos     = d.filter(x => x.tipo==='FIXO').reduce((s,x)=>s+x.valor,0);
  const variaveis = d.filter(x => x.tipo==='VARIÁVEL').reduce((s,x)=>s+x.valor,0);
  const despesas  = d.filter(x => x.tipo==='DESPESA').reduce((s,x)=>s+x.valor,0);
  return { fixos, variaveis, despesas, total: fixos+variaveis+despesas };
}

function getReceitaTotal(mes) {
  // Receita recorrente (clientes ativos)
  const recorrente = clientes
    .filter(c => c.status === 'ativo' && c.mensal > 0)
    .reduce((s,c) => s+c.mensal, 0);
  // Receita extra (implantações, IA, etc)
  const variavel = receitasExtra
    .filter(r => r.mes === mes)
    .reduce((s,r) => s+r.valor, 0);
  return { recorrente, variavel, total: recorrente+variavel };
}

function getVendedor(id) {
  return vendedores.find(v => v.id === id) || { nome: '—' };
}

function getCanal(id) {
  return canais.find(c => c.id === id) || { nome: '—', icon: '📌', cor: '#5a7090' };
}

function getCrmEtapa(id) {
  return crmEtapas.find(e => e.id === id) || { nome: '—', cor: '#5a7090' };
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = 'default') {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.className = 'toast show';
  if (type === 'success') t.style.borderColor = 'rgba(0,214,143,.4)';
  else if (type === 'error') t.style.borderColor = 'rgba(255,77,109,.4)';
  else t.style.borderColor = '';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Modal helpers ─────────────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function closeOnBg(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }

// ── Table render helper ───────────────────────────────────────
function renderTable(tbodyId, items, cols) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  if (!items.length) {
    const span = cols.length || 5;
    tbody.innerHTML = `<tr><td colspan="${span}"><div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">Nenhum registro encontrado</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(item => `<tr>${cols.map(c => `<td>${c(item)}</td>`).join('')}</tr>`).join('');
}

// ── Keyboard shortcuts ────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-overlay.open, .drawer-overlay.open').forEach(el => {
      el.classList.remove('open');
      document.querySelectorAll('.drawer.open').forEach(d => d.classList.remove('open'));
    });
});

document.addEventListener('DOMContentLoaded', () => {
  ['l-user','l-pass'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') fazerLogin();
    });
  });
});
