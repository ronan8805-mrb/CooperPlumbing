document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;

  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  });

  const form = document.getElementById('quote-form');
  if (form) {
    const errorBox = document.getElementById('form-error');

    const showError = (message) => {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.add('visible');
        errorBox.setAttribute('role', 'alert');
      }
    };

    const clearError = () => {
      if (errorBox) {
        errorBox.textContent = '';
        errorBox.classList.remove('visible');
        errorBox.removeAttribute('role');
      }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const name = form.querySelector('#name').value.trim();
      const phone = form.querySelector('#phone').value.trim();
      const email = form.querySelector('#email').value.trim();
      const service = form.querySelector('#service').value;
      const message = form.querySelector('#message').value.trim();

      if (!name || !phone || !email || !service) {
        showError('Please fill in all required fields marked with an asterisk.');
        form.querySelector(!name ? '#name' : !phone ? '#phone' : !email ? '#email' : '#service').focus();
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError('Please enter a valid email address.');
        form.querySelector('#email').focus();
        return;
      }

      const phonePattern = /^[\d\s+()-]{7,}$/;
      if (!phonePattern.test(phone)) {
        showError('Please enter a valid phone number.');
        form.querySelector('#phone').focus();
        return;
      }

      form.classList.add('hidden');
      form.setAttribute('aria-hidden', 'true');

      const success = document.getElementById('form-success');
      if (success) {
        success.classList.add('visible');
        success.setAttribute('aria-hidden', 'false');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', clearError);
    });
  }
});