// 1) Год в футере
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('mo-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const revealEls = document.querySelectorAll('.mo-reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));

  const serviceCards = document.querySelectorAll('.mo-service');
  serviceCards.forEach(card => {
    const btn = card.querySelector('.service-toggle');
    const panel = card.querySelector('.service-panel');
    if (!btn || !panel) return;

    const open = () => {
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      card.classList.add('is-open');
    };
    const close = () => {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      card.classList.remove('is-open');
    };

    btn.addEventListener('click', e => {
      e.preventDefault();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
      delete card.dataset.hover;
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
    card.addEventListener('mouseenter', () => {
      if (btn.getAttribute('aria-expanded') === 'false') {
        open();
        card.dataset.hover = '1';
      }
    });
    card.addEventListener('mouseleave', () => {
      if (card.dataset.hover) {
        close();
        delete card.dataset.hover;
      }
    });
  });
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
