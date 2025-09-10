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

    /* ===== 3) Services: аккордеон ===== */
    const toggles = document.querySelectorAll('#services .service-toggle');

    const alignPanelHeights = () => {
      const openPanels = document.querySelectorAll('#services .service-panel:not([hidden])');
      if (openPanels.length === 0) return;

      let maxHeight = 0;
      openPanels.forEach(panel => {
        panel.style.minHeight = '';
        panel.style.maxHeight = '';
        maxHeight = Math.max(maxHeight, panel.scrollHeight);
      });

      openPanels.forEach(panel => {
        panel.style.maxHeight = maxHeight + 'px';
        panel.style.minHeight = maxHeight + 'px';
      });
    };

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
          panel.style.maxHeight = panel.scrollHeight + 'px'; // Сначала своя высота
          panel.style.opacity = '1';
          alignPanelHeights(); // Затем выравниваем все открытые
        });
      };

      const close = () => {
        card.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
        panel.style.minHeight = '0px';
        panel.style.opacity = '0';
        const onEnd = (e) => {
          if (e.propertyName === 'max-height') {
            panel.hidden = true;               // прячем из таб-цикла после схлопывания
            panel.removeEventListener('transitionend', onEnd);
            alignPanelHeights(); // Выравниваем оставшиеся панели
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
          alignPanelHeights();
        }
      });
      ro.observe(panel);
    });
  }

  /* ===== 4) Contact section hover effects ===== */
  const contactContainer = document.querySelector('.contact-container');
  const contactItems = document.querySelectorAll('.contact-item');
  if (contactContainer && contactItems.length && window.innerWidth >= 640) {
    contactItems.forEach((item) => {
      const bgColor = item.dataset.bgcolor;
      const hoverBgColor = item.dataset.hoverbghexcolor;
      const textColor = item.dataset.textcolor;

      item.addEventListener('mouseover', () => {
        document.documentElement.style.setProperty('--active-bg-color', hoverBgColor);
        contactContainer.classList.remove('bg-neutral-100', 'text-neutral-800');
        contactContainer.classList.add(bgColor, textColor);
      });

      item.addEventListener('mouseout', () => {
        document.documentElement.style.setProperty('--active-bg-color', '#f8fafc');
        contactContainer.classList.remove(bgColor, textColor);
        contactContainer.classList.add('bg-neutral-100', 'text-neutral-800');
      });
    });
  }
});
