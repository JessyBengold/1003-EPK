// script.js — improved: reveal observer, accessible modal (focus trap, ESC, outside click), copy phone
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

if (reveals && reveals.length) reveals.forEach((el) => observer.observe(el));

// Modal behavior
const modal = document.getElementById('whatsapp-modal');
const toggle = document.getElementById('whatsapp-toggle');
const closeButton = modal ? modal.querySelector('[data-close]') : null;
const copyButton = modal ? modal.querySelector('[data-copy]') : null;
const phoneNumber = '+33601190900';

let lastFocusedEl = null;

function trapFocus(container) {
  const focusable = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return () => {};
  function handle(e) {
    if (e.key !== 'Tab') return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  container.addEventListener('keydown', handle);
  return () => container.removeEventListener('keydown', handle);
}

let removeTrap = null;

function openModal() {
  if (!modal) return;
  lastFocusedEl = document.activeElement;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('is-open');
  toggle?.setAttribute('aria-expanded', 'true');
  const panel = modal.querySelector('.modal-panel') || modal;
  const firstFocusable = panel.querySelector('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
  (firstFocusable || panel).focus();
  removeTrap = trapFocus(panel);
  document.addEventListener('keydown', handleKeyDown);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modal.hidden = true;
  toggle?.setAttribute('aria-expanded', 'false');
  if (removeTrap) { removeTrap(); removeTrap = null; }
  document.removeEventListener('keydown', handleKeyDown);
  if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
}

function handleKeyDown(e) {
  if (e.key === 'Escape') closeModal();
}

toggle?.addEventListener('click', () => {
  const isOpen = modal && modal.getAttribute('aria-hidden') === 'false';
  if (isOpen) closeModal(); else openModal();
});

closeButton?.addEventListener('click', closeModal);

// clicking outside dialog: close
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

// copy phone number to clipboard
copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(phoneNumber);
    copyButton.textContent = 'Numéro copié';
    setTimeout(() => { copyButton.textContent = 'Copier le numéro'; }, 1800);
  } catch {
    window.prompt('Copiez le numéro WhatsApp', phoneNumber);
  }
});
