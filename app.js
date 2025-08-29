// 1) Год в футере
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('mo-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// 2) Mailto без бэкенда
function moSendMail(e) {
  e.preventDefault();

  const nomEl = document.getElementById('mo-nom');
  const emailEl = document.getElementById('mo-email');
  const msgEl = document.getElementById('mo-msg');

  const nom = (nomEl?.value || '').trim();
  const email = (emailEl?.value || '').trim();
  const msg = (msgEl?.value || '').trim();

  const subject = `[Site RSE] Message de ${nom || 'Client'}`;
  const body =
    `Nom: ${nom}\n` +
    `Email: ${email}\n\n` +
    `${msg}`;

  const href = `mailto:contact@ostanin-rse.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;

  const ok = document.getElementById('mo-ok');
  if (ok) ok.hidden = false;
}
