const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el) => observer.observe(el));

const modal = document.querySelector('#whatsapp-modal');
const whatsappButton = document.querySelector('[data-whatsapp]');
const closeButton = document.querySelector('[data-close]');
const copyButton = document.querySelector('[data-copy]');
const phoneNumber = '+33601190900';

function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

whatsappButton?.addEventListener('click', openModal);
closeButton?.addEventListener('click', closeModal);

modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(phoneNumber);
    copyButton.textContent = 'Numéro copié';
    setTimeout(() => { copyButton.textContent = 'Copier le numéro'; }, 1800);
  } catch {
    alert('WhatsApp : +33 6 01 19 09 00');
  }
});
