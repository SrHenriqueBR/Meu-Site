'use strict';

// Products and WhatsApp links stay available when JavaScript is disabled.
const catalogCards = Array.from(document.querySelectorAll('.product-card'));
const productGrid = document.querySelector('#product-grid');
const categoryButtons = Array.from(document.querySelectorAll('[data-category-filter]'));
const searchInput = document.querySelector('#product-search');
const orderSelect = document.querySelector('#product-sort');
const clearSearch = document.querySelector('#clear-search');
const resultStatus = document.querySelector('#catalog-status');
const emptyState = document.querySelector('#catalog-empty');
const resetControls = document.querySelectorAll('[data-reset-catalog]');
const normalizeSearch = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\bmvme\b/g, 'nvme');
let selectedCategory = 'todos';

categoryButtons.forEach(button => {
  const category = button.dataset.categoryFilter;
  const count = category === 'todos' ? catalogCards.length : catalogCards.filter(card => card.dataset.productCategory === category).length;
  button.querySelector('span').textContent = String(count).padStart(2, '0');
});

function applyCatalogFilters(updateUrl = true) {
  const terms = normalizeSearch(searchInput.value.trim()).split(/\s+/).filter(Boolean);
  const orderedCards = orderSelect.value === 'nome'
    ? [...catalogCards].sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent, 'pt-BR'))
    : catalogCards;
  let visibleCount = 0;
  orderedCards.forEach(card => {
    const searchable = normalizeSearch(card.dataset.search);
    const matches = (selectedCategory === 'todos' || card.dataset.productCategory === selectedCategory) && terms.every(term => searchable.includes(term));
    card.hidden = !matches;
    if (matches) visibleCount += 1;
    productGrid.appendChild(card);
  });
  categoryButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.categoryFilter === selectedCategory)));
  resultStatus.textContent = visibleCount + (visibleCount === 1 ? ' produto encontrado' : ' produtos encontrados');
  emptyState.hidden = visibleCount !== 0;
  productGrid.hidden = visibleCount === 0;
  clearSearch.hidden = searchInput.value.length === 0;
  document.querySelector('#reset-filters').hidden = selectedCategory === 'todos' && !searchInput.value && orderSelect.value === 'catalogo';
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.delete('categoria');
    url.searchParams.delete('busca');
    url.searchParams.delete('ordem');
    if (selectedCategory !== 'todos') url.searchParams.set('categoria', selectedCategory);
    if (searchInput.value.trim()) url.searchParams.set('busca', searchInput.value.trim());
    if (orderSelect.value !== 'catalogo') url.searchParams.set('ordem', orderSelect.value);
    window.history.replaceState(null, '', url);
  }
}

function readCatalogUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('categoria');
  selectedCategory = categoryButtons.some(button => button.dataset.categoryFilter === category) ? category : 'todos';
  searchInput.value = (params.get('busca') || '').slice(0, 100);
  orderSelect.value = params.get('ordem') === 'nome' ? 'nome' : 'catalogo';
  applyCatalogFilters(false);
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  selectedCategory = button.dataset.categoryFilter;
  applyCatalogFilters();
}));
searchInput.addEventListener('input', () => applyCatalogFilters());
orderSelect.addEventListener('change', () => applyCatalogFilters());
clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  applyCatalogFilters();
  searchInput.focus();
});
resetControls.forEach(button => button.addEventListener('click', () => {
  selectedCategory = 'todos';
  searchInput.value = '';
  orderSelect.value = 'catalogo';
  applyCatalogFilters();
  searchInput.focus();
}));
window.addEventListener('popstate', readCatalogUrl);
document.querySelector('#catalog-tools').hidden = false;
readCatalogUrl();

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
window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
document.querySelector('#year').textContent = new Date().getFullYear();
