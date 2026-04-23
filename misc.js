// ============================================================
// misc.js v3 — CRM, Aniversários, Notificações, Lançamentos,
//              Retiradas, Comparativo, Usuários
// ============================================================

// ── NOTIFICAÇÕES ─────────────────────────────────────────────
function checkNotifications() {
  const v5 = getVencendo5();
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.style.display = v5.length ? 'inline-block' : 'none';
    badge.textContent   = v5.length;
  }
  // Dashboard notif
  if (v5.length) {
    const items = v5.map(c=>`
      <div class="notif-item">• <b>${c.nome}</b> — dia ${c.dia} — ${fmt(c.mensal)}
        ${c.tel?`<button class="btn btn-wa btn-xs" style="margin-left:8px" onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱 WA</button>`:''}
      </div>`).join('');
    setHTML('dash-notif',`<div class="notif-bar"><div class="notif-icon">🔔</div><div><div class="notif-title">⚠️ ${v5.length} cliente(s) com fatura vencendo em até 5 dias!</div>${items}</div></div>`);
  } else {
    setHTML('dash-notif','');
  }
}

function enviarWA(tel, nome, valor) {
  const num = (tel||'').replace(/\D/g,'');
  const msg = encodeURIComponent(`Olá! 👋 Passando para informar que a fatura da *ChatClean* referente ao serviço de *${nome}* no valor de *${fmt(valor)}* está próxima do vencimento. Por favor, entre em contato para efetuar o pagamento. Obrigado! 🙏`);
  window.open(num?`https://wa.me/55${num}?text=${msg}`:`https://wa.me/?text=${msg}`,'_blank');
  showToast('📱 Abrindo WhatsApp...','success');
}

function enviarEmail(email, nome, valor) {
  const sub  = encodeURIComponent(`ChatClean - Fatura ${nome}`);
  const body = encodeURIComponent(`Olá,\n\nPassamos para informar que a fatura no valor de ${fmt(valor)} está próxima do vencimento.\n\nAtenciosamente,\nEquipe ChatClean`);
  window.open(`mailto:${email}?subject=${sub}&body=${body}`,'_blank');
  showToast('📧 Abrindo e-mail...','success');
}

// ── ANIVERSÁRIOS ──────────────────────────────────────────────
function renderAniversarios() {
  const hoje = today();
  const mes  = hoje.getMonth()+1;

  const aniversariantes = clientes.filter(c => {
    if (!c.aniversario) return false;
    const [,m] = c.aniversario.split('-');
    return parseInt(m)===mes;
  }).sort((a,b)=>{
    const da=parseInt(a.aniversario.split('-')[2]);
    const db=parseInt(b.aniversario.split('-')[2]);
    return da-db;
  });

  const MESES_PT=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  setHTML('aniv-count', `${aniversariantes.length} aniversariante(s) em ${MESES_PT[mes-1]}`);

  if (!aniversariantes.length) {
    setHTML('aniv-grid','<div class="empty-state"><div class="empty-icon">🎂</div><div class="empty-text">Nenhum aniversariante este mês</div></div>');
    return;
  }

  setHTML('aniv-grid', `<div class="birthday-grid">
    ${aniversariantes.map(c=>{
      const dia = c.aniversario.split('-')[2];
      const hoje2 = hoje.getDate();
      const isHoje = parseInt(dia)===hoje2;
      return `
      <div class="birthday-card" ${isHoje?'style="border-color:var(--pink)"':''}>
        <div class="birthday-avatar">${isHoje?'🎂':'🎁'}</div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">${c.nome}</div>
          <div style="font-size:11px;color:var(--muted2)">${c.resp||'—'} · dia ${dia}</div>
          ${isHoje?'<div style="font-size:11px;color:var(--pink);font-weight:600">🎉 Hoje!</div>':''}
        </div>
        ${c.tel?`<button class="btn btn-wa btn-xs" onclick="enviarPagemens('${c.tel}','${c.resp||c.nome}')">📱 Parabenizar</button>`:''}
      </div>`;
    }).join('')}
  </div>`);
}

function enviarPagemens(tel, nome) {
  const num = (tel||'').replace(/\D/g,'');
  const msg = encodeURIComponent(`Olá ${nome}! 🎂🎉\n\nA equipe ChatClean deseja a você um feliz aniversário! Que seja um dia incrível e que o novo ciclo traga muito sucesso! 🥳✨\n\n*ChatClean® — Sua comunicação inteligente*`);
  window.open(num?`https://wa.me/55${num}?text=${msg}`:'' ,'_blank');
  showToast('🎂 Mensagem enviada!','success');
}

// ── CRM KANBAN ────────────────────────────────────────────────
function renderCRM() {
  const etapas = [...crmEtapas].sort((a,b)=>a.ordem-b.ordem);

  setHTML('crm-board', `<div class="kanban-board">
    ${etapas.map(etapa => {
      const cards = clientes.filter(c => c.crmEtapa === etapa.id);
      return `
      <div class="kanban-col">
        <div class="kanban-col-header">
          <div class="kanban-col-title" style="color:${etapa.cor}">${etapa.nome}</div>
          <span class="kanban-count">${cards.length}</span>
        </div>
        <div class="kanban-cards" id="crm-col-${etapa.id}">
          ${cards.map(c=>`
            <div class="kanban-card" onclick="abrirDrawer(${c.id})">
              <div class="kanban-card-name">${c.nome}</div>
              <div class="kanban-card-sub">${c.resp||'—'}</div>
              <div class="kanban-card-footer">
                <span class="mono" style="font-size:11px;color:var(--accent)">${c.mensal>0?fmt(c.mensal):'PERMUTA'}</span>
                ${c.tel?`<button class="btn btn-wa btn-xs" onclick="event.stopPropagation();enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱</button>`:''}
              </div>
            </div>`).join('')}
        </div>
        ${currentUser?.perfil!=='usuario'?`<button class="kanban-add" onclick="moverParaEtapa('${etapa.id}')">+ Mover cliente aqui</button>`:''}
      </div>`;
    }).join('')}
  </div>`);

  // Total por etapa
  const totalPipeline = clientes.filter(c=>c.status==='ativo').reduce((s,c)=>s+c.mensal,0);
  setHTML('crm-stats', `
    <div class="summary-bar" style="margin-bottom:20px">
      <div class="sum-item"><div class="sum-label">Total no Pipeline</div><div class="sum-value">${clientes.length} clientes</div></div>
      <div class="sum-div"></div>
      <div class="sum-item"><div class="sum-label">MRR Pipeline</div><div class="sum-value" style="color:var(--accent)">${fmt(totalPipeline)}</div></div>
      ${etapas.map(e=>{
        const qtd=clientes.filter(c=>c.crmEtapa===e.id).length;
        return `<div class="sum-div"></div><div class="sum-item"><div class="sum-label" style="color:${e.cor}">${e.nome}</div><div class="sum-value">${qtd}</div></div>`;
      }).join('')}
    </div>`);
}

function moverParaEtapa(etapaId) {
  const nomes = clientes.map((c,i)=>`${i+1}. ${c.nome}`).join('\n');
  const idx   = parseInt(prompt(`Qual cliente mover para "${getCrmEtapa(etapaId).nome}"?\n\n${nomes}`));
  if (!idx || idx<1 || idx>clientes.length) return;
  clientes[idx-1].crmEtapa = etapaId;
  save(); renderCRM();
  showToast('✅ Cliente movido!','success');
}

// ── LANÇAMENTOS ───────────────────────────────────────────────
function renderLancamentos() {
  let items = lancamentos;
  if (lancFilter!=='todos') {
    if(['FIXO','VARIÁVEL','DESPESA'].includes(lancFilter)) items=items.filter(x=>x.tipo===lancFilter);
    else items=items.filter(x=>x.status===lancFilter);
  }
  if(lancTxt) items=items.filter(x=>x.desc.toLowerCase().includes(lancTxt.toLowerCase()));
  const canE = currentUser?.perfil!=='usuario';
  renderTable('lanc-tbody', items, [
    x => x.desc,
    x => `<span class="badge badge-${x.tipo.toLowerCase().replace('á','a').replace('é','e')}">${x.tipo}</span>`,
    x => `<span style="color:var(--muted2)">${x.mes}</span>`,
    x => `<span class="mono">${fmt(x.valor)}</span>`,
    x => `<button class="status-toggle" onclick="toggleStatus(${x.id})">${x.status==='PAGO'?'<span class="badge badge-pago">PAGO</span>':'<span class="badge badge-pendente">PENDENTE</span>'}</button>`,
    x => canE?`<button class="action-btn btn-del" onclick="deletarLanc(${x.id})">🗑</button>`:'',
  ]);
}

function setLancFilter(f,el){
  lancFilter=f;
  document.querySelectorAll('#page-lancamentos .ftab').forEach(t=>t.classList.remove('active'));
  if(el) el.classList.add('active');
  renderLancamentos();
}
function filtrarLanc(val){lancTxt=val;renderLancamentos();}

function renderTipoTabela(tbodyId, tipo){
  const m=getMes();
  const items=lancamentos.filter(x=>x.tipo===tipo&&x.mes===m);
  const canE=currentUser?.perfil!=='usuario';
  renderTable(tbodyId, items, [
    x=>x.desc,
    x=>`<span style="color:var(--muted2)">${x.mes}</span>`,
    x=>`<span class="mono">${fmt(x.valor)}</span>`,
    x=>`<button class="status-toggle" onclick="toggleStatus(${x.id})">${x.status==='PAGO'?'<span class="badge badge-pago">PAGO</span>':'<span class="badge badge-pendente">PENDENTE</span>'}</button>`,
    x=>canE?`<button class="action-btn btn-del" onclick="deletarLanc(${x.id})">🗑</button>`:'',
  ]);
}

function toggleStatus(id){
  const item=lancamentos.find(x=>x.id===id);
  if(!item) return;
  item.status=item.status==='PAGO'?'PENDENTE':'PAGO';
  save(); renderDashboard(); renderLancamentos();
  renderTipoTabela('tbody-fixos','FIXO');
  renderTipoTabela('tbody-variaveis','VARIÁVEL');
  renderTipoTabela('tbody-despesas','DESPESA');
  showToast(item.status==='PAGO'?'✅ Marcado como Pago!':'⏳ Pendente','success');
}

function deletarLanc(id){
  if(!confirm('Excluir?')) return;
  lancamentos=lancamentos.filter(x=>x.id!==id);
  save(); renderDashboard(); renderLancamentos();
  renderTipoTabela('tbody-fixos','FIXO');
  renderTipoTabela('tbody-variaveis','VARIÁVEL');
  renderTipoTabela('tbody-despesas','DESPESA');
  showToast('🗑 Excluído');
}

function salvarLanc(){
  const desc=v('f-lanc-desc'), tipo=v('f-lanc-tipo'), mes=v('f-lanc-mes');
  const valor=parseFloat(v('f-lanc-valor')), status=v('f-lanc-status');
  if(!desc||!valor||valor<=0){alert('Preencha todos os campos.');return;}
  lancamentos.push({id:nextId++,desc:desc.toUpperCase(),tipo,mes,valor,status});
  save(); renderDashboard(); renderLancamentos();
  renderTipoTabela('tbody-fixos','FIXO');
  renderTipoTabela('tbody-variaveis','VARIÁVEL');
  renderTipoTabela('tbody-despesas','DESPESA');
  closeModal('modal-lancamento');
  showToast('✅ Lançamento salvo!','success');
}

// ── RETIRADAS ──────────────────────────────────────────────
function renderRetiradas(){
  const m=getMes();
  const mesRet=retiradas.filter(r=>r.mes===m);
  const totMes=mesRet.reduce((s,r)=>s+r.valor,0);
  const socios=['Fabricio','Albert','Augusto'];
  setHTML('ret-kpis',`
    <div class="kpi-grid kpi-grid-4">
      <div class="kpi k-purple"><div class="kpi-label">Total ${m}</div><div class="kpi-value">${fmt(totMes)}</div></div>
      ${socios.map(s=>{const val=mesRet.filter(r=>r.socio===s).reduce((a,r)=>a+r.valor,0);return`<div class="kpi k-blue"><div class="kpi-label">${s}</div><div class="kpi-value" style="color:var(--purple)">${fmt(val)}</div></div>`;}).join('')}
    </div>`);
  let items=retiradas;
  if(retFilter!=='todos') items=items.filter(r=>r.socio===retFilter);
  if(retTxt) items=items.filter(r=>r.desc.toLowerCase().includes(retTxt.toLowerCase())||r.socio.toLowerCase().includes(retTxt.toLowerCase()));
  const canE=currentUser?.perfil!=='usuario';
  renderTable('ret-tbody',items,[
    r=>`<strong>${r.socio}</strong>`,
    r=>r.desc,
    r=>`<span style="color:var(--muted2)">${r.mes}</span>`,
    r=>`<span style="color:var(--muted2)">${r.data}</span>`,
    r=>`<span class="mono" style="color:var(--purple)">${fmt(r.valor)}</span>`,
    r=>`<span class="badge badge-retirada">${r.cat}</span>`,
    r=>canE?`<button class="action-btn btn-del" onclick="deletarRet(${r.id})">🗑</button>`:'',
  ]);
}

function setRetFilter(f,el){retFilter=f;document.querySelectorAll('#page-retiradas .ftab').forEach(t=>t.classList.remove('active'));if(el)el.classList.add('active');renderRetiradas();}
function filtrarRet(val){retTxt=val;renderRetiradas();}

function deletarRet(id){
  if(!confirm('Excluir?')) return;
  retiradas=retiradas.filter(x=>x.id!==id);
  save(); renderRetiradas(); renderCompSocios();
  showToast('🗑 Excluído');
}

function salvarRetirada(){
  const socio=v('f-ret-socio'), mes=v('f-ret-mes');
  const valor=parseFloat(v('f-ret-valor')), data=v('f-ret-data');
  const cat=v('f-ret-cat'), desc=v('f-ret-desc')||`${cat} ${mes}`;
  if(!valor||valor<=0){alert('Informe o valor.');return;}
  retiradas.push({id:nextId++,socio,desc,mes,data,valor,cat});
  save(); renderRetiradas(); renderCompSocios();
  closeModal('modal-retirada');
  showToast('✅ Retirada registrada!','success');
}

// ── COMPARATIVO SÓCIOS ─────────────────────────────────────
function renderCompSocios(){
  const socios=['Fabricio','Albert','Augusto'];
  const m=getMes();
  const mesRet=retiradas.filter(r=>r.mes===m);
  const tot=mesRet.reduce((s,r)=>s+r.valor,0)||1;
  setHTML('socio-bars',socios.map(s=>{
    const val=mesRet.filter(r=>r.socio===s).reduce((a,r)=>a+r.valor,0);
    return`<div style="flex:1;min-width:130px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:12px;color:var(--muted2);margin-bottom:6px">${s}</div>
      <div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--purple)">${fmt(val)}</div>
      <div style="font-size:11px;color:var(--muted2);margin-top:2px">${((val/tot)*100).toFixed(1)}%</div>
    </div>`;
  }).join(''));

  const canvas=document.getElementById('socios-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.parentElement.clientWidth-44; canvas.height=200;
  const meses=MESES_LIST.slice(0,6);
  const colors={Fabricio:'#3b9eff',Albert:'#b06aff',Augusto:'#ffb020'};
  const w=canvas.width,h=canvas.height,pad={t:20,b:30,l:10,r:10};
  const bw=(w-pad.l-pad.r)/meses.length;
  const allVals=socios.flatMap(s=>meses.map(m2=>retiradas.filter(r=>r.socio===s&&r.mes===m2).reduce((a,r)=>a+r.valor,0)));
  const maxV=Math.max(...allVals,1);
  ctx.clearRect(0,0,w,h);
  const sbw=bw*0.68/socios.length;
  socios.forEach((s,si)=>{
    meses.forEach((m2,mi)=>{
      const val=retiradas.filter(r=>r.socio===s&&r.mes===m2).reduce((a,r)=>a+r.valor,0);
      if(!val) return;
      const bh=(val/maxV)*(h-pad.t-pad.b);
      const x=pad.l+mi*bw+bw*0.16+si*sbw;
      const y=h-pad.b-bh;
      ctx.fillStyle=colors[s]; ctx.globalAlpha=0.85;
      ctx.beginPath(); ctx.roundRect(x,y,sbw*0.9,bh,[3,3,0,0]); ctx.fill();
      ctx.globalAlpha=1;
    });
  });
  meses.forEach((m2,i)=>{ctx.fillStyle='#5a7090';ctx.font='9px DM Mono';ctx.textAlign='center';ctx.fillText(m2.slice(0,3),pad.l+i*bw+bw/2,h-8);});
  socios.forEach((s,i)=>{ctx.fillStyle=colors[s];ctx.fillRect(pad.l+i*80,5,14,7);ctx.fillStyle='#8096b8';ctx.font='9px DM Mono';ctx.textAlign='left';ctx.fillText(s,pad.l+i*80+18,12);});
}

// ── COMPARATIVO MENSAL ─────────────────────────────────────
function renderComparativo(){
  const rows=MESES_LIST.map(m=>{
    const c=getTotaisCustos(m),r=getReceitaTotal(m);
    return{mes:m,...c,...r,resultado:r.total-c.total};
  }).filter(r=>r.total>0||r.recorrente>0);

  renderTable('comp-tbody',rows,[
    r=>`<strong>${r.mes}</strong>`,
    r=>`<span class="mono">${fmt(r.fixos)}</span>`,
    r=>`<span class="mono">${fmt(r.variaveis)}</span>`,
    r=>`<span class="mono">${fmt(r.despesas)}</span>`,
    r=>`<span class="mono" style="font-weight:600">${fmt(r.total)}</span>`,
    r=>`<span class="mono" style="color:var(--accent)">${fmt(r.recorrente+r.variavel)}</span>`,
    r=>`<span class="mono" style="color:${r.resultado>=0?'var(--green)':'var(--red)'}">${r.resultado>=0?'▲':'▼'} ${fmt(Math.abs(r.resultado))}</span>`,
  ]);

  const canvas=document.getElementById('comp-canvas');
  if(!canvas||!rows.length) return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.parentElement.clientWidth-44; canvas.height=180;
  const vals=rows.map(r=>r.total), maxV=Math.max(...vals,1);
  const w=canvas.width,h=canvas.height,pad={t:20,b:28,l:10,r:10};
  const bw=(w-pad.l-pad.r)/vals.length;
  ctx.clearRect(0,0,w,h);
  vals.forEach((val,i)=>{
    const bh=(val/maxV)*(h-pad.t-pad.b);
    const x=pad.l+i*bw+bw*0.15;
    const gr=ctx.createLinearGradient(0,h-pad.b-bh,0,h-pad.b);
    gr.addColorStop(0,'#3b9eff'); gr.addColorStop(1,'rgba(59,158,255,.1)');
    ctx.fillStyle=gr;
    ctx.beginPath(); ctx.roundRect(x,h-pad.b-bh,bw*0.7,bh,[4,4,0,0]); ctx.fill();
    ctx.fillStyle='#5a7090'; ctx.font='9px DM Mono'; ctx.textAlign='center';
    ctx.fillText(rows[i].mes.slice(0,3),x+bw*0.35,h-8);
  });
}

// ── USUÁRIOS ───────────────────────────────────────────────
function renderUsuarios(){
  renderTable('users-tbody',usuarios,[
    u=>`<strong>${u.nome}</strong>`,
    u=>`<span class="mono">${u.login}</span>`,
    u=>`<span class="badge badge-${u.perfil}">${u.perfil.toUpperCase()}</span>`,
    u=>u.criado,
    u=>u.id!==currentUser?.id?`<button class="action-btn btn-del" onclick="deletarUser(${u.id})">🗑</button>`:'—',
  ]);
}

function salvarUsuario(){
  const nome=v('f-u-nome'),login=v('f-u-login'),senha=v('f-u-senha'),perfil=v('f-u-perfil');
  if(!nome||!login||!senha){alert('Preencha todos os campos.');return;}
  if(usuarios.find(u=>u.login===login)){alert('Login já existe.');return;}
  const d=new Date(); const criado=`${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  usuarios.push({id:nextId++,nome,login,senha,perfil,criado});
  save(); renderUsuarios(); closeModal('modal-usuario');
  showToast('✅ Usuário criado!','success');
}

function deletarUser(id){
  if(!confirm('Excluir usuário?')) return;
  usuarios=usuarios.filter(u=>u.id!==id);
  save(); renderUsuarios();
  showToast('🗑 Usuário removido');
}

// ── MODAIS ─────────────────────────────────────────────────
function abrirLancamento(tipo=''){
  editingId=null;
  ['f-lanc-desc','f-lanc-valor'].forEach(id=>{if(document.getElementById(id))document.getElementById(id).value='';});
  if(document.getElementById('f-lanc-tipo')) document.getElementById('f-lanc-tipo').value=tipo||'FIXO';
  if(document.getElementById('f-lanc-mes')) document.getElementById('f-lanc-mes').value=getMes();
  if(document.getElementById('f-lanc-status')) document.getElementById('f-lanc-status').value='PAGO';
  document.getElementById('modal-lanc-title').textContent='Novo Lançamento';
  openModal('modal-lancamento');
}

function abrirRetirada(){
  editingId=null;
  ['f-ret-desc','f-ret-valor'].forEach(id=>{if(document.getElementById(id))document.getElementById(id).value='';});
  if(document.getElementById('f-ret-mes')) document.getElementById('f-ret-mes').value=getMes();
  const d=new Date(); if(document.getElementById('f-ret-data')) document.getElementById('f-ret-data').value=d.toISOString().split('T')[0];
  openModal('modal-retirada');
}

function abrirNovoUsuario(){
  ['f-u-nome','f-u-login','f-u-senha'].forEach(id=>{if(document.getElementById(id))document.getElementById(id).value='';});
  if(document.getElementById('f-u-perfil')) document.getElementById('f-u-perfil').value='usuario';
  openModal('modal-usuario');
}

// Preencher select de canais dinamicamente
function popularSelectCanais(){
  ['f-rex-canal','c-canal'].forEach(selId=>{
    const sel=document.getElementById(selId);
    if(!sel) return;
    sel.innerHTML=canais.map(c=>`<option value="${c.id}">${c.icon} ${c.nome}</option>`).join('');
  });
  const selV=document.getElementById('c-vendedor');
  if(selV) selV.innerHTML=`<option value="">— Selecionar —</option>`+vendedores.filter(v=>v.ativo).map(v=>`<option value="${v.id}">${v.nome}</option>`).join('');
}
