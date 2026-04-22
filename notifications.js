// ============================================================
// notifications.js — Notificações de vencimento e integrações
// ============================================================

// ── Verificar vencimentos ──────────────────────────────────
function checkNotificacoes() {
  const today   = new Date();
  const vencendo = _getVencendo5(today);

  // Badge no menu
  const badge = document.getElementById('notif-badge');
  if (vencendo.length > 0) {
    badge.style.display = 'block';
    badge.textContent   = vencendo.length;
  } else {
    badge.style.display = 'none';
  }

  // Banner no dashboard
  _renderNotifBanner('dash-notif', vencendo, true);
}

function _getVencendo5(today) {
  return clientes.filter(c => {
    if (c.status !== 'ativo') return false;
    const dia = parseInt(c.dia);
    if (!dia) return false;
    const venc = new Date(today.getFullYear(), today.getMonth(), dia);
    const diff = Math.ceil((venc - today) / 86400000);
    return diff >= 0 && diff <= 5;
  });
}

function _renderNotifBanner(containerId, vencendo, showActions) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!vencendo.length) { el.innerHTML = ''; return; }

  const items = vencendo.map(c => `
    <div class="notif-item">
      • <strong>${c.nome}</strong> — vence dia ${c.dia} — ${fmt(c.mensal)}
      ${showActions ? `
        <button class="btn btn-wa btn-sm" style="margin-left:6px"
          onclick="enviarWA('${c.tel}','${c.nome}',${c.mensal})">📱 WhatsApp</button>
        <button class="btn btn-mail btn-sm"
          onclick="enviarEmail('${c.email}','${c.nome}',${c.mensal})">📧 E-mail</button>
      ` : ''}
    </div>`).join('');

  el.innerHTML = `
    <div class="notif-bar">
      <div class="notif-icon">🔔</div>
      <div>
        <div class="notif-title">
          ⚠️ ${vencendo.length} cliente(s) com fatura vencendo em até 5 dias — envie o boleto!
        </div>
        ${items}
      </div>
    </div>`;
}

// ── Status de vencimento (chip colorido) ───────────────────
function vencimentoStatus(dia) {
  if (!dia) return '—';
  const today = new Date();
  const venc  = new Date(today.getFullYear(), today.getMonth(), parseInt(dia));
  const diff  = Math.ceil((venc - today) / 86400000);

  if (diff < 0)  return `<span class="vc vc-at">⚠️ Atrasado ${Math.abs(diff)}d</span>`;
  if (diff === 0) return `<span class="vc vc-h">🔴 Hoje</span>`;
  if (diff <= 5)  return `<span class="vc vc-u">⏰ ${diff}d</span>`;
  return `<span class="vc vc-ok">✅ dia ${dia}</span>`;
}

// ── WhatsApp ───────────────────────────────────────────────
function enviarWA(tel, nome, valor) {
  const num = (tel || '').replace(/\D/g, '');
  const msg = encodeURIComponent(
    `Olá! 👋 Passando para informar que a fatura da *ChatClean* ` +
    `referente ao serviço de *${nome}* no valor de *${fmt(valor)}* ` +
    `está próxima do vencimento. Por favor, entre em contato para ` +
    `efetuar o pagamento. Obrigado! 🙏`
  );
  const url = num
    ? `https://wa.me/55${num}?text=${msg}`
    : `https://wa.me/?text=${msg}`;
  window.open(url, '_blank');
  showToast('📱 Abrindo WhatsApp...');
}

// ── E-mail ─────────────────────────────────────────────────
function enviarEmail(email, nome, valor) {
  const sub  = encodeURIComponent(`ChatClean - Fatura ${nome}`);
  const body = encodeURIComponent(
    `Olá,\n\nPassamos para informar que a fatura no valor de ${fmt(valor)} ` +
    `referente ao serviço ChatClean está próxima do vencimento.\n\n` +
    `Por favor, entre em contato para regularização.\n\n` +
    `Atenciosamente,\nEquipe ChatClean`
  );
  window.open(`mailto:${email || ''}?subject=${sub}&body=${body}`, '_blank');
  showToast('📧 Abrindo cliente de e-mail...');
}
