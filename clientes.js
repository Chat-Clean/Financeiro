// ============================================================
// clientes.js v3 — Clientes, Drawer, Contrato, NF
// ============================================================

function renderClientes() {
  const t = today();
  const ativos   = clientes.filter(c => c.status==='ativo');
  const mrr      = ativos.reduce((s,c)=>s+c.mensal,0);
  const venc5    = getVencendo5();
  const aguard   = clientes.filter(c=>c.contratoStatus==='aguardando').length;

  setHTML('cli-kpis', `
    <div class="kpi-grid kpi-grid-4">
      <div class="kpi k-green">
        <div class="kpi-label">Clientes Ativos</div>
        <div class="kpi-value">${ativos.length}</div>
        <div class="kpi-sub">de ${clientes.length} cadastrados</div>
      </div>
      <div class="kpi k-blue">
        <div class="kpi-label">MRR Recorrente</div>
        <div class="kpi-value">${fmt(mrr)}</div>
        <div class="kpi-sub">mensalidades ativas</div>
      </div>
      <div class="kpi ${venc5.length?'k-amber':'k-green'}">
        <div class="kpi-label">Vencendo em 5 dias</div>
        <div class="kpi-value">${venc5.length}</div>
        <div class="kpi-sub">${venc5.length?'⚠️ Cobrar agora':'✅ Tudo ok'}</div>
      </div>
      <div class="kpi ${aguard?'k-amber':'k-green'}">
        <div class="kpi-label">Contratos Pendentes</div>
        <div class="kpi-value">${aguard}</div>
        <div class="kpi-sub">aguardando assinatura</div>
      </div>
    </div>`);

  // Notif vencimentos
  if (venc5.length) {
    setHTML('cli-notif', `
      <div class="notif-bar">
        <div class="notif-icon">🔔</div>
        <div>
          <div class="notif-title">⚠️ ${venc5.length} cliente(s) com fatura vencendo em até 5 dias!</div>
          ${venc5.map(c=>`
            <div class="notif-item">• <strong>${c.nome}</strong> — dia ${c.dia} — ${fmt(c.mensal)}
              ${c.tel?`<button class="btn btn-wa btn-xs" style="margin-left:8px" onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱 WA</button>`:''}
              ${c.email?`<button class="btn btn-mail btn-xs" onclick="enviarEmail('${c.email}','${c.nome}',${c.mensal})">📧</button>`:''}
            </div>`).join('')}
        </div>
      </div>`);
  } else {
    setHTML('cli-notif','');
  }

  _renderCliTable();
}

function _renderCliTable() {
  let items = clientes;
  const t = today();

  if (cliFilter === 'vence5') {
    items = getVencendo5();
  } else if (cliFilter === 'aguardando') {
    items = clientes.filter(c => c.contratoStatus === 'aguardando');
  } else if (cliFilter !== 'todos') {
    items = clientes.filter(c => c.status === cliFilter);
  }

  if (cliTxt) {
    const q = cliTxt.toLowerCase();
    items = items.filter(c =>
      c.nome.toLowerCase().includes(q) ||
      (c.resp||'').toLowerCase().includes(q) ||
      (c.vend||'').toLowerCase().includes(q)
    );
  }

  const canE = currentUser?.perfil !== 'usuario';
  renderTable('cli-tbody', items, [
    c => `<span class="cli-link" onclick="abrirDrawer(${c.id})" style="cursor:pointer;font-weight:600;color:var(--text);text-decoration:none">${c.nome}</span>${c.obs?`<br><small style="color:var(--muted)">${c.obs}</small>`:''}`,
    c => c.resp||'—',
    c => c.tel ? `<button class="btn btn-wa btn-xs" onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱 ${c.tel}</button>` : '—',
    c => c.vend||'—',
    c => c.mensal>0?`<span class="mono">${fmt(c.mensal)}</span>`:'<span style="color:var(--muted)">PERMUTA</span>',
    c => vencChip(c.dia),
    c => `<span class="badge badge-${c.status}">${c.status.toUpperCase()}</span>`,
    c => `<span class="badge badge-${c.contratoStatus==='assinado'?'assinado':'aguardando'}">${c.contratoStatus==='assinado'?'✅ Assinado':'⏳ Aguardando'}</span>`,
    c => {
      const canal = getCanal(c.canal);
      return `<span class="canal-chip" style="background:${canal.cor}18;color:${canal.cor}">${canal.icon} ${canal.nome}</span>`;
    },
    c => canE ? `
      <button class="action-btn btn-edit" onclick="abrirDrawer(${c.id})" title="Ver perfil">👁</button>
      <button class="action-btn btn-edit" onclick="editarCliente(${c.id})" title="Editar">✏️</button>
      <button class="action-btn btn-del"  onclick="deletarCliente(${c.id})" title="Excluir">🗑</button>
    ` : `<button class="action-btn" onclick="abrirDrawer(${c.id})">👁</button>`,
  ]);
}

function setCliFilter(f,el) {
  cliFilter=f;
  document.querySelectorAll('#page-clientes .ftab').forEach(t=>t.classList.remove('active'));
  if(el) el.classList.add('active');
  _renderCliTable();
}
function filtrarClientes(v) { cliTxt=v; _renderCliTable(); }

// ── Vencimento chip ──────────────────────────────────────────
function vencChip(dia) {
  if (!dia) return '—';
  const t = today();
  const venc = new Date(t.getFullYear(), t.getMonth(), parseInt(dia));
  const diff = Math.ceil((venc-t)/86400000);
  if (diff < 0)   return `<span class="venc-chip venc-late">⚠️ +${Math.abs(diff)}d</span>`;
  if (diff === 0) return `<span class="venc-chip venc-today">🔴 Hoje</span>`;
  if (diff <= 5)  return `<span class="venc-chip venc-warn">⏰ ${diff}d</span>`;
  return `<span class="venc-chip venc-ok">✅ dia ${dia}</span>`;
}

function getVencendo5() {
  const t = today();
  return clientes.filter(c => {
    if (c.status !== 'ativo') return false;
    const dia = parseInt(c.dia); if (!dia) return false;
    const venc = new Date(t.getFullYear(), t.getMonth(), dia);
    const diff = Math.ceil((venc-t)/86400000);
    return diff >= 0 && diff <= 5;
  });
}

// ── DRAWER — Perfil do cliente ───────────────────────────────
function abrirDrawer(id) {
  const c = clientes.find(x=>x.id===id);
  if (!c) return;

  const canal    = getCanal(c.canal);
  const etapa    = getCrmEtapa(c.crmEtapa);
  const vend     = getVendedor(c.vendedorId);

  setHTML('drawer-content', `
    <div class="drawer-header">
      <div>
        <div style="font-family:var(--font-display);font-size:18px;font-weight:700">${c.nome}</div>
        <div style="font-size:12px;color:var(--muted2);margin-top:2px">${c.cnpj||'CNPJ não informado'}</div>
      </div>
      <button class="drawer-close" onclick="fecharDrawer()">✕</button>
    </div>
    <div class="drawer-body">

      <!-- Status pills -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px">
        <span class="badge badge-${c.status}">${c.status.toUpperCase()}</span>
        <span class="badge badge-${c.contratoStatus==='assinado'?'assinado':'aguardando'}">${c.contratoStatus==='assinado'?'✅ Contrato Assinado':'⏳ Aguardando Assinatura'}</span>
        <span class="canal-chip" style="background:${canal.cor}18;color:${canal.cor}">${canal.icon} ${canal.nome}</span>
        <span class="badge badge-financeiro" style="background:${etapa.cor}18;color:${etapa.cor}">${etapa.nome}</span>
      </div>

      <!-- Contato -->
      <div class="drawer-section">
        <div class="drawer-section-title">Informações de Contato</div>
        <div class="info-grid">
          <div class="info-item"><div class="info-label">Responsável</div><div class="info-value">${c.resp||'—'}</div></div>
          <div class="info-item"><div class="info-label">Telefone / WhatsApp</div><div class="info-value">
            ${c.tel?`<button class="btn btn-wa btn-sm" onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱 ${c.tel}</button>`:'—'}
          </div></div>
          <div class="info-item"><div class="info-label">E-mail</div><div class="info-value">
            ${c.email?`<button class="btn btn-mail btn-sm" onclick="enviarEmail('${c.email}','${c.nome}',${c.mensal})">📧 ${c.email}</button>`:'—'}
          </div></div>
          <div class="info-item"><div class="info-label">Vendedor</div><div class="info-value">${vend.nome}</div></div>
        </div>
      </div>

      <!-- Financeiro -->
      <div class="drawer-section">
        <div class="drawer-section-title">Dados Financeiros</div>
        <div class="info-grid">
          <div class="info-item"><div class="info-label">Mensalidade</div><div class="info-value" style="color:var(--accent);font-size:18px;font-family:var(--font-display)">${c.mensal>0?fmt(c.mensal):'PERMUTA/ANUAL'}</div></div>
          <div class="info-item"><div class="info-label">Vencimento</div><div class="info-value">Todo dia ${c.dia||'—'} ${vencChip(c.dia)}</div></div>
          <div class="info-item"><div class="info-label">Início</div><div class="info-value">${c.inicio||'—'}</div></div>
          <div class="info-item"><div class="info-label">Aniversário</div><div class="info-value">${c.aniversario?formatarAniversario(c.aniversario):'—'}</div></div>
        </div>
      </div>

      ${c.obs?`<div class="drawer-section"><div class="drawer-section-title">Observações</div><p style="font-size:13px;color:var(--text2)">${c.obs}</p></div>`:''}

      <!-- Ações rápidas -->
      <div class="drawer-section">
        <div class="drawer-section-title">Ações</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="verContrato(${c.id})">📄 Ver Contrato</button>
          <button class="btn btn-ghost" onclick="abrirNF(${c.id})">🧾 Gerar Nota Fiscal</button>
          ${c.tel?`<button class="btn btn-wa" onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱 WhatsApp</button>`:''}
          ${c.email?`<button class="btn btn-mail" onclick="enviarEmail('${c.email}','${c.nome}',${c.mensal})">📧 E-mail</button>`:''}
          <button class="btn btn-ghost can-edit" onclick="editarCliente(${c.id});fecharDrawer()">✏️ Editar</button>
        </div>
      </div>

    </div>`);

  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  applyPermissions();
}

function fecharDrawer() {
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}

function formatarAniversario(str) {
  if (!str) return '—';
  const [y,m,d] = str.split('-');
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d} ${meses[parseInt(m)-1]} ${y?`(${y})`:''}`;
}

// ── CONTRATO ─────────────────────────────────────────────────
function verContrato(id) {
  const c = clientes.find(x=>x.id===id);
  if (!c) return;

  const hoje = new Date();
  const dataFmt = `${hoje.getDate().toString().padStart(2,'0')}/${(hoje.getMonth()+1).toString().padStart(2,'0')}/${hoje.getFullYear()}`;

  let html = CONTRATO_TEMPLATE
    .replace(/{{nome}}/g,        c.nome || '______')
    .replace(/{{cnpj}}/g,        c.cnpj || '______')
    .replace(/{{resp}}/g,        c.resp || '______')
    .replace(/{{mensal}}/g,      c.mensal>0 ? fmt(c.mensal) : '______')
    .replace(/{{dia}}/g,         c.dia || '______')
    .replace(/{{inicio}}/g,      c.inicio || '______')
    .replace(/{{dataContrato}}/g, dataFmt);

  setHTML('contrato-html', html);
  setHTML('contrato-cliente-nome', c.nome);
  setHTML('contrato-status-badge', `<span class="badge badge-${c.contratoStatus==='assinado'?'assinado':'aguardando'}">${c.contratoStatus==='assinado'?'✅ Assinado':'⏳ Aguardando Assinatura'}</span>`);

  // Guardar id para ações
  document.getElementById('modal-contrato').dataset.clienteId = id;
  openModal('modal-contrato');
}

function toggleContratoStatus(id) {
  const c = clientes.find(x=>x.id===id);
  if (!c) return;
  c.contratoStatus = c.contratoStatus==='assinado' ? 'aguardando' : 'assinado';
  save();
  verContrato(id);
  showToast(`📄 Contrato marcado como ${c.contratoStatus}`, 'success');
}

function baixarContrato() {
  const id = parseInt(document.getElementById('modal-contrato').dataset.clienteId);
  const c  = clientes.find(x=>x.id===id);
  const html = document.getElementById('contrato-html').innerHTML;
  const blob = new Blob([`<html><head><meta charset="UTF-8"><title>Contrato ${c?.nome}</title><style>body{font-family:Georgia,serif;font-size:13px;line-height:1.8;padding:40px;color:#222}h1{text-align:center;margin-bottom:20px}h2{margin:20px 0 8px}.field{color:#1a56db;font-weight:600}</style></head><body>${html}</body></html>`], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Contrato_${c?.nome?.replace(/\s/g,'_')}.html`;
  a.click();
  showToast('📄 Contrato baixado!', 'success');
}

function enviarLinkAssinatura() {
  const id = parseInt(document.getElementById('modal-contrato').dataset.clienteId);
  const c  = clientes.find(x=>x.id===id);
  // Simula link de assinatura (em produção, integrar com ClickSign/DocuSign)
  const link = `https://assinar.chatclean.com.br/contrato/${btoa(id+'-'+Date.now())}`;
  const msg  = encodeURIComponent(`Olá ${c?.resp||c?.nome}! 👋\n\nSegue o link para assinar o contrato ChatClean:\n🔗 ${link}\n\nQualquer dúvida, estamos à disposição!`);
  const num  = (c?.tel||'').replace(/\D/g,'');
  if (num) window.open(`https://wa.me/55${num}?text=${msg}`, '_blank');
  else {
    navigator.clipboard?.writeText(link);
    showToast('🔗 Link copiado!', 'success');
  }
}

// ── NOTA FISCAL ───────────────────────────────────────────────
function abrirNF(id) {
  const c = clientes.find(x=>x.id===id);
  if (!c) return;
  const hoje = new Date();
  document.getElementById('nf-cliente-nome').textContent  = c.nome;
  document.getElementById('nf-cliente-cnpj').textContent  = c.cnpj||'—';
  document.getElementById('nf-cliente-email').textContent = c.email||'—';
  document.getElementById('nf-valor').value   = c.mensal||'';
  document.getElementById('nf-descricao').value = `Serviços de plataforma ChatClean — ${MESES_LIST[hoje.getMonth()]}/${hoje.getFullYear()}`;
  document.getElementById('nf-competencia').value = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}`;
  document.getElementById('modal-nf').dataset.clienteId = id;
  openModal('modal-nf');
}

function emitirNF() {
  const id   = parseInt(document.getElementById('modal-nf').dataset.clienteId);
  const c    = clientes.find(x=>x.id===id);
  const val  = document.getElementById('nf-valor').value;
  const desc = document.getElementById('nf-descricao').value;
  const comp = document.getElementById('nf-competencia').value;

  // Em produção: integrar com API eNotas/Omie/prefeitura
  showToast(`🧾 NF gerada para ${c?.nome}! (Integre com eNotas ou Omie para emissão real)`, 'success');
  closeModal('modal-nf');

  // Simula envio por email
  if (c?.email) {
    setTimeout(()=>showToast(`📧 NF enviada para ${c.email}`, 'success'), 1500);
  }
}

// ── CRUD Clientes ────────────────────────────────────────────
function editarCliente(id) {
  const c = clientes.find(x=>x.id===id);
  if (!c) return;
  editingId = id;
  const fields = ['c-nome','c-cnpj','c-resp','c-tel','c-email','c-mensal','c-dia','c-status','c-inicio','c-aniversario','c-obs'];
  const map = {
    'c-nome':c.nome,'c-cnpj':c.cnpj,'c-resp':c.resp,'c-tel':c.tel,
    'c-email':c.email,'c-mensal':c.mensal,'c-dia':c.dia,'c-status':c.status,
    'c-inicio':c.inicio,'c-aniversario':c.aniversario,'c-obs':c.obs
  };
  fields.forEach(id=>{ if(document.getElementById(id)) document.getElementById(id).value=map[id]||''; });
  if(document.getElementById('c-canal')) document.getElementById('c-canal').value = c.canal||'c6';
  if(document.getElementById('c-vendedor')) document.getElementById('c-vendedor').value = c.vendedorId||'';
  document.getElementById('mo-cli-title').textContent = 'Editar Cliente';
  openModal('modal-cliente');
}

function novoCliente() {
  editingId = null;
  ['c-nome','c-cnpj','c-resp','c-tel','c-email','c-obs','c-aniversario'].forEach(id=>{
    if(document.getElementById(id)) document.getElementById(id).value='';
  });
  ['c-mensal','c-dia'].forEach(id=>{ if(document.getElementById(id)) document.getElementById(id).value=''; });
  if(document.getElementById('c-status')) document.getElementById('c-status').value='ativo';
  if(document.getElementById('c-inicio')) document.getElementById('c-inicio').value='';
  if(document.getElementById('c-canal')) document.getElementById('c-canal').value='c6';
  if(document.getElementById('c-vendedor')) document.getElementById('c-vendedor').value='';
  document.getElementById('mo-cli-title').textContent = 'Novo Cliente';
  openModal('modal-cliente');
}

function salvarCliente() {
  const nome = document.getElementById('c-nome').value.trim();
  if (!nome) { alert('Informe o nome.'); return; }
  const obj = {
    id:         editingId || nextId++,
    nome,
    cnpj:       v('c-cnpj'),
    resp:       v('c-resp'),
    tel:        v('c-tel'),
    email:      v('c-email'),
    mensal:     parseFloat(v('c-mensal'))||0,
    dia:        parseInt(v('c-dia'))||1,
    status:     v('c-status')||'ativo',
    inicio:     v('c-inicio'),
    aniversario:v('c-aniversario'),
    obs:        v('c-obs'),
    canal:      v('c-canal')||'c6',
    vendedorId: v('c-vendedor'),
    vend:       getVendedor(v('c-vendedor')).nome,
    contratoStatus: editingId ? (clientes.find(x=>x.id===editingId)?.contratoStatus||'aguardando') : 'aguardando',
    crmEtapa:   editingId ? (clientes.find(x=>x.id===editingId)?.crmEtapa||'e1') : 'e1',
  };
  if (editingId) { const i=clientes.findIndex(x=>x.id===editingId); if(i>=0) clientes[i]=obj; }
  else clientes.push(obj);
  save(); renderClientes(); checkNotifications(); closeModal('modal-cliente');
  showToast(editingId?'✅ Cliente atualizado!':'✅ Cliente adicionado!','success');
  editingId=null;
}

function deletarCliente(id) {
  if(!confirm('Excluir este cliente?')) return;
  clientes=clientes.filter(x=>x.id!==id);
  save(); renderClientes();
  showToast('🗑 Cliente removido');
}

function v(id) { return document.getElementById(id)?.value||''; }
