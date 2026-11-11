'use strict';

const WHATSAPP_NUMBER = '5534992413197';
const whatsappUrl = (message) => 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#nav-menu');
function closeMenu(returnFocus = false) {
  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav') && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
});
window.matchMedia('(min-width: 681px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('[data-service]').forEach(link => {
  link.href = whatsappUrl('Olá, Orvysion! Vim pelo site e gostaria de um orçamento para: ' + link.dataset.service + '.');
});

const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  cards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count += 1;
  });
  document.querySelector('#filter-status').textContent = count + ' projetos exibidos';
}));

const form = document.querySelector('#quote-form');
const nameInput = document.querySelector('#name');
nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.setCustomValidity('Digite seu nome para preparar a mensagem.');
    nameInput.reportValidity();
    return;
  }
  if (!form.reportValidity()) return;
  const service = document.querySelector('#service').value;
  const details = document.querySelector('#message').value.trim();
  const message = 'Olá, Orvysion! Meu nome é ' + name + '.\nVim pelo site e gostaria de um orçamento.\n\nSolução: ' + service + (details ? '\n\nMinha ideia: ' + details : '');
  // Navigation works without pop-up permissions and does not send a message automatically.
  window.location.assign(whatsappUrl(message));
});

const privacyDialog = document.querySelector('#privacy-dialog');
document.querySelector('[data-open-privacy]').addEventListener('click', () => privacyDialog.showModal());
document.querySelector('[data-close-privacy]').addEventListener('click', () => privacyDialog.close());
privacyDialog.addEventListener('click', event => {
  if (event.target !== privacyDialog) return;
  const rect = privacyDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) privacyDialog.close();
});
document.querySelector('#year').textContent = new Date().getFullYear();

