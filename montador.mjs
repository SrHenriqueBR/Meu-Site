import { OPTIONS, FIELD_LABELS, PRESETS, EMPTY_BUILD, optionFor, normalizeBuild } from './montador-data.mjs?v=20261113-1';
import { analyzeBuild, buildMessage, whatsappUrl } from './montador-engine.mjs?v=20261113-1';

const STORAGE_KEY = 'orvysion-pc-builder-v1';
const form = document.querySelector('#builder-form');
let state = { ...EMPTY_BUILD };
let previousState = null;
let storageAvailable = true;
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = normalizeBuild(JSON.parse(saved));
} catch { storageAvailable = false; }

for (const [key, options] of Object.entries(OPTIONS)) {
  const select = form.elements.namedItem(key);
  options.forEach(item => select.add(new Option(item.name, item.id)));
}

function writeFields() {
  for (const [key, value] of Object.entries(state)) form.elements.namedItem(key).value = value;
}
function readFields() {
  state = normalizeBuild(Object.fromEntries(new FormData(form)));
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { storageAvailable = false; }
  document.querySelector('#save-status').textContent = storageAvailable ? 'Rascunho salvo somente neste navegador.' : 'O navegador não permitiu salvar. Você ainda pode copiar ou enviar o resumo.';
}
function makeIssue(item, kind) {
  const article = document.createElement('article');
  article.className = 'builder-issue issue-' + kind;
  const title = document.createElement('h4'); title.textContent = item.title;
  const body = document.createElement('p'); body.textContent = item.text;
  article.append(title, body);
  if (item.fields.length) {
    const link = document.createElement('a');
    link.href = '#field-' + item.fields[0];
    link.textContent = 'Rever ' + FIELD_LABELS[item.fields[0]].toLocaleLowerCase('pt-BR');
    link.addEventListener('click', () => form.elements.namedItem(item.fields[0]).focus());
    article.append(link);
  }
  return article;
}
function fillIssues(id, items, kind) {
  document.querySelector(id).replaceChildren(...items.map(item => makeIssue(item, kind)));
}
function render() {
  const result = analyzeBuild(state);
  const badge = document.querySelector('#build-status');
  badge.textContent = result.status;
  badge.className = 'build-status ' + (result.errors.length ? 'status-error' : 'status-review');
  document.querySelector('#build-count').textContent = `${result.completed} de ${result.total} grupos escolhidos`;
  document.querySelector('#build-progress').value = result.completed;
  document.querySelector('#pending-parts').textContent = result.pending.length ? 'Para definir: ' + result.pending.join(', ') + '.' : 'Próxima etapa: conferir os modelos e o projeto com a Orvysion.';
  document.querySelector('#analysis-status').textContent = `${result.errors.length} incompatibilidade(s) e ${result.warnings.length} ponto(s) de atenção na pré-seleção.`;
  document.querySelector('#error-section').hidden = !result.errors.length;
  fillIssues('#error-list', result.errors, 'error');
  fillIssues('#warning-list', result.warnings.slice(0, 2), 'warning');
  fillIssues('#more-warning-list', result.warnings.slice(2), 'warning');
  document.querySelector('#more-warnings').hidden = result.warnings.length <= 2;
  document.querySelector('#more-warnings-label').textContent = `Ver mais ${Math.max(0, result.warnings.length - 2)} ponto(s) de atenção`;
  document.querySelector('#checks-section').hidden = !result.checks.length;
  document.querySelector('#checks-label').textContent = `${result.checks.length} conferência(s) básicas realizadas`;
  fillIssues('#check-list', result.checks, 'check');
  fillIssues('#performance-list', result.insights, 'info');
  for (const [key, options] of Object.entries(OPTIONS)) {
    const select = form.elements.namedItem(key);
    const invalid = result.errors.some(item => item.fields.includes(key));
    select.setAttribute('aria-invalid', String(invalid));
    const field = document.querySelector('#field-' + key);
    field?.classList.toggle('has-error', invalid);
    const hint = document.querySelector('#' + key + '-hint');
    const item = optionFor(key, state[key]);
    if (hint) hint.textContent = item?.unknown ? 'Informe o modelo nas observações. Esta escolha exige avaliação individual.' : item?.note || hint.dataset.default;
    const source = document.querySelector('#' + key + '-source');
    if (source) {
      source.hidden = !item?.source;
      if (item?.source) source.href = item.source;
    }
  }
  const summary = document.querySelector('#build-summary');
  summary.replaceChildren();
  for (const key of ['purpose', 'resolution', 'refresh', 'cpu', 'gpu', 'motherboard', 'ram', 'nvme', 'sata', 'hdd', 'psu', 'case', 'cooler', 'budget', 'budgetScope', 'style', 'priority']) {
    if (!state[key]) continue;
    const row = document.createElement('div');
    const term = document.createElement('dt'); term.textContent = FIELD_LABELS[key];
    const value = document.createElement('dd'); value.textContent = result.selected[key].name;
    row.append(term, value); summary.append(row);
  }
  document.querySelector('#empty-summary').hidden = Boolean(summary.childElementCount);
  document.querySelector('#message-preview').value = buildMessage(state);
  document.querySelector('#send-build').href = whatsappUrl(state);
  document.querySelector('#send-build-label').textContent = result.errors.length ? 'Pedir ajuda para ajustar no WhatsApp' : 'Enviar ideia para a Orvysion';
}

form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', () => { readFields(); render(); persist(); });
// Native selects emit change reliably across desktop and mobile browsers.
form.addEventListener('change', () => { readFields(); render(); persist(); });
function showUndo(message) {
  document.querySelector('#undo-notice').hidden = false;
  document.querySelector('#undo-message').textContent = message;
}
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
  previousState = { ...state };
  state = normalizeBuild({ ...state, ...PRESETS[button.dataset.preset].values });
  writeFields(); render(); persist();
  showUndo('Base “' + PRESETS[button.dataset.preset].label + '” aplicada. Você pode alterar todas as peças.');
}));
document.querySelector('#reset-build').addEventListener('click', () => {
  previousState = { ...state };
  state = { ...EMPTY_BUILD };
  writeFields(); render();
  try { localStorage.removeItem(STORAGE_KEY); } catch { storageAvailable = false; }
  document.querySelector('#save-status').textContent = 'Rascunho limpo. Comece pelas escolhas que já tem em mente.';
  showUndo('Configuração limpa.');
});
document.querySelector('#undo-build').addEventListener('click', () => {
  if (!previousState) return;
  state = previousState; previousState = null;
  writeFields(); render(); persist();
  document.querySelector('#undo-notice').hidden = true;
});
document.querySelector('#copy-build').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(buildMessage(state));
    status.textContent = 'Resumo copiado. Você pode colar onde preferir.';
  } catch {
    document.querySelector('#full-message').open = true;
    const area = document.querySelector('#message-preview'); area.focus(); area.select();
    status.textContent = 'Selecione e copie o texto abaixo. O navegador não liberou a cópia automática.';
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#nav-menu');
function closeMenu(returnFocus = false) {
  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menu');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.nav') && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
writeFields(); render();
document.querySelector('#save-status').textContent = storageAvailable ? 'Suas escolhas ficam salvas somente neste navegador.' : 'Armazenamento local indisponível. Copie o resumo antes de sair.';
document.querySelector('#builder-loading').hidden = true;
document.querySelector('#builder-app').hidden = false;
