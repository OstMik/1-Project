document.addEventListener('DOMContentLoaded', () => {
  /* ===== 1) Год в футере ===== */
  const yearEl = document.getElementById('mo-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window && 'ResizeObserver' in window) {
    /* ===== 2) Reveal-анимация ===== */
    const revealEls = document.querySelectorAll('.mo-reveal');
    if (revealEls.length) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(el => io.observe(el));
    }

    /* ===== 3) Services: аккордеон (без равнения высот) ===== */
    const toggles = document.querySelectorAll('#services .service-toggle');

    toggles.forEach((btn) => {
      if (!btn.hasAttribute('type')) btn.setAttribute('type', 'button');

      const card  = btn.closest('.mo-service');
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!card || !panel) return;

      // Начальное состояние: закрыто
      btn.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      panel.style.maxHeight = '0px';
      panel.style.opacity = '0';

      const open = () => {
        panel.hidden = false;                  // включаем для расчёта высоты
        requestAnimationFrame(() => {
          card.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          panel.style.opacity = '1';
        });
      };

      const close = () => {
        card.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
        panel.style.opacity = '0';
        const onEnd = (e) => {
          if (e.propertyName === 'max-height') {
            panel.hidden = true;               // прячем из таб-цикла после схлопывания
            panel.removeEventListener('transitionend', onEnd);
          }
        };
        panel.addEventListener('transitionend', onEnd);
      };

      // Клик: один тап/клик = действие
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        expanded ? close() : open();
        btn.blur();
      });

      // Клавиатура: Enter/Space
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });

      // Если контент внутри панели изменился — подстроить высоту
      const ro = new ResizeObserver(() => {
        if (btn.getAttribute('aria-expanded') === 'true') {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
      ro.observe(panel);
    });
  }
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', moSendMail);
  }
});

function moSendMail(e) {
  e.preventDefault();
  const nom   = document.getElementById('mo-nom').value.trim();
  const mail  = document.getElementById('mo-email').value.trim();
  const msg   = document.getElementById('mo-msg').value.trim();

  const subject = encodeURIComponent(`Contact via site – ${nom}`);
  const body    = encodeURIComponent('Nom: ' + nom + '\nEmail: ' + mail + '\n\n' + msg);
  window.location.href = `mailto:contact@ostanin-rse.fr?subject=${subject}&body=${body}`;

  const ok = document.getElementById('mo-ok');
  if (ok) { ok.textContent = 'Votre client mail va s’ouvrir.'; ok.hidden = false; }
}
