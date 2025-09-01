// 1) Год в футере
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('mo-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// 2) Отправка формы через бэкенд
function moSendMail(e) {
  e.preventDefault();

  const nomEl = document.getElementById('mo-nom');
  const emailEl = document.getElementById('mo-email');
  const msgEl = document.getElementById('mo-msg');

  const nom = (nomEl?.value || '').trim();
  const email = (emailEl?.value || '').trim();
  const msg = (msgEl?.value || '').trim();

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, email, msg })
  })
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(() => {
      const ok = document.getElementById('mo-ok');
      if (ok) {
        ok.textContent = 'Merci, votre message a été envoyé.';
        ok.hidden = false;
        ok.style.color = '';
      }
    })
    .catch(() => {
      const ok = document.getElementById('mo-ok');
      if (ok) {
        ok.textContent = "Une erreur s'est produite. Veuillez réessayer.";
        ok.hidden = false;
        ok.style.color = 'red';
      }
    });
}
