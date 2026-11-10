'use strict';

const demo = document.body.dataset.demo;
const money = value => new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
const normalize = value => value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

if (demo === 'aurea') {
  const products = {
    vaso: {name: 'Vaso Terra', price: 129},
    luminaria: {name: 'Luminária Serena', price: 249},
    bowl: {name: 'Bowl Oliva', price: 89}
  };
  const cart = new Map();
  const dialog = document.querySelector('#cart-dialog');
  const list = document.querySelector('#cart-items');
  const feedback = document.querySelector('#cart-feedback');
  let toastTimer;

  function renderCart() {
    list.replaceChildren();
    let count = 0;
    let total = 0;
    cart.forEach((quantity, id) => {
      const product = products[id];
      count += quantity;
      total += product.price * quantity;
      const row = element('div', undefined, 'cart-row');
      const details = element('div');
      details.append(element('strong', product.name), element('small', money(product.price) + ' / unidade'));
      const controls = element('div', undefined, 'cart-controls');
      const less = element('button', '−');
      less.type = 'button';
      less.dataset.cartAction = 'less';
      less.dataset.id = id;
      less.setAttribute('aria-label', 'Diminuir quantidade de ' + product.name);
      const quantityLabel = element('span', String(quantity));
      quantityLabel.setAttribute('aria-label', 'Quantidade: ' + quantity);
      const more = element('button', '+');
      more.type = 'button';
      more.dataset.cartAction = 'more';
      more.dataset.id = id;
      more.setAttribute('aria-label', 'Aumentar quantidade de ' + product.name);
      controls.append(less, quantityLabel, more);
      row.append(details, controls);
      list.append(row);
    });
    if (!count) list.append(element('p', 'Sua sacola está vazia. Explore a coleção para começar.', 'cart-empty'));
    document.querySelector('#cart-count').textContent = String(count);
    document.querySelector('#cart-total').textContent = money(total);
    document.querySelector('#simulate-order').disabled = count === 0;
    return {count, total};
  }
  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.add;
    cart.set(id, (cart.get(id) || 0) + 1);
    feedback.hidden = true;
    renderCart();
    const toast = document.querySelector('#shop-toast');
    toast.textContent = products[id].name + ' adicionado à sacola demonstrativa.';
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }));
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;
    const id = button.dataset.id;
    const action = button.dataset.cartAction;
    const quantity = (cart.get(id) || 0) + (action === 'more' ? 1 : -1);
    if (quantity > 0) cart.set(id, quantity); else cart.delete(id);
    feedback.hidden = true;
    renderCart();
    const nextControl = list.querySelector('[data-cart-action="' + action + '"][data-id="' + id + '"]');
    (nextControl || document.querySelector('#close-cart')).focus();
  });
  document.querySelector('#open-cart').addEventListener('click', () => { renderCart(); dialog.showModal(); });
  document.querySelector('#close-cart').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.querySelector('#simulate-order').addEventListener('click', () => {
    const {count, total} = renderCart();
    if (!count) return;
    cart.clear();
    renderCart();
    feedback.textContent = 'Simulação concluída: ' + count + ' item(ns), total ilustrativo de ' + money(total) + '. Nenhuma compra ou pagamento foi realizado.';
    feedback.hidden = false;
    document.querySelector('#close-cart').focus();
  });
  document.querySelectorAll('[data-shop-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-shop-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelectorAll('[data-shop-category]').forEach(card => {
      card.hidden = button.dataset.shopFilter !== 'all' && button.dataset.shopFilter !== card.dataset.shopCategory;
    });
  }));
  renderCart();
}

if (demo === 'nexo') {
  // Fictional sample records, used only by this demonstration.
  const orders = [
    {id: '#1048', client: 'Cliente Exemplo 01', service: 'Site institucional', status: 'Em andamento', value: 2400},
    {id: '#1047', client: 'Cliente Exemplo 02', service: 'Manutenção de PC', status: 'Concluído', value: 180},
    {id: '#1046', client: 'Cliente Exemplo 03', service: 'Automação de relatório', status: 'Aguardando', value: 850},
    {id: '#1045', client: 'Cliente Exemplo 04', service: 'Painel de gestão', status: 'Concluído', value: 3200},
    {id: '#1044', client: 'Cliente Exemplo 05', service: 'Upgrade de computador', status: 'Em andamento', value: 480},
    {id: '#1043', client: 'Cliente Exemplo 06', service: 'Catálogo digital', status: 'Concluído', value: 1900}
  ];
  const search = document.querySelector('#order-search');
  const status = document.querySelector('#order-status');
  const statuses = ['Concluído', 'Em andamento', 'Aguardando'];
  const statusClass = {'Concluído': 'done', 'Em andamento': 'progress', 'Aguardando': 'waiting'};
  let visibleOrders = [];

  function renderOrders() {
    const query = normalize(search.value.trim());
    visibleOrders = orders.filter(order =>
      (status.value === 'all' || order.status === status.value) &&
      normalize([order.id, order.client, order.service, order.status].join(' ')).includes(query)
    );
    const tbody = document.querySelector('#order-rows');
    tbody.replaceChildren();
    visibleOrders.forEach(order => {
      const row = element('tr');
      row.append(element('td', order.id), element('td', order.client), element('td', order.service));
      const statusCell = element('td');
      statusCell.append(element('span', order.status, 'status ' + statusClass[order.status]));
      row.append(statusCell, element('td', money(order.value)));
      tbody.append(row);
    });
    if (!visibleOrders.length) {
      const row = element('tr');
      const cell = element('td', 'Nenhum pedido encontrado. Tente outro termo ou situação.', 'empty-cell');
      cell.colSpan = 5;
      row.append(cell);
      tbody.append(row);
    }
    document.querySelector('#metric-count').textContent = String(visibleOrders.length);
    document.querySelector('#metric-value').textContent = money(visibleOrders.reduce((sum, order) => sum + order.value, 0));
    document.querySelector('#metric-done').textContent = String(visibleOrders.filter(order => order.status === 'Concluído').length);
    document.querySelector('#order-count').textContent = visibleOrders.length + ' de ' + orders.length + ' pedidos fictícios exibidos.';
    document.querySelector('#export-orders').disabled = visibleOrders.length === 0;
    const chart = document.querySelector('#order-chart');
    chart.replaceChildren();
    const counts = statuses.map(label => visibleOrders.filter(order => order.status === label).length);
    const max = Math.max(...counts, 1);
    statuses.forEach((label, index) => {
      const column = element('div', undefined, 'bar-col');
      const bar = element('div');
      bar.style.height = String(counts[index] / max * 130) + 'px';
      column.append(element('strong', String(counts[index])), bar, element('span', label));
      chart.append(column);
    });
    chart.setAttribute('aria-label', statuses.map((label, index) => label + ': ' + counts[index]).join('. '));
  }
  search.addEventListener('input', renderOrders);
  status.addEventListener('change', renderOrders);
  document.querySelector('#export-orders').addEventListener('click', () => {
    if (!visibleOrders.length) return;
    const rows = [['Pedido', 'Cliente fictício', 'Serviço', 'Situação', 'Valor ilustrativo (R$)'],
      ...visibleOrders.map(order => [order.id, order.client, order.service, order.status, order.value.toFixed(2).replace('.', ',')])];
    const csv = '\uFEFF' + rows.map(row => row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8;'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nexo-pedidos-demonstrativos.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  renderOrders();
}

if (demo === 'flow') {
  const scenarios = {
    site: 'Olá! Preciso de um site para apresentar meus serviços e receber pedidos de orçamento pelo WhatsApp.',
    suporte: 'Meu computador está lento e quero avaliar a troca do SSD e da memória.',
    relatorio: 'Todo dia copio dados de uma planilha para criar um relatório. Quero automatizar essa tarefa.'
  };
  const select = document.querySelector('#flow-scenario');
  const messageInput = document.querySelector('#flow-message');
  const runButton = document.querySelector('#run-flow');
  const steps = Array.from(document.querySelectorAll('[data-step]'));
  const status = document.querySelector('#flow-status');
  let timers = [];

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    steps.forEach(step => { step.classList.remove('active', 'complete'); });
    document.querySelector('#flow-result').hidden = true;
    document.querySelector('#flow-idle').hidden = false;
    status.textContent = 'Tudo pronto para começar.';
    runButton.disabled = false;
    runButton.textContent = 'Experimentar a simulação →';
    messageInput.disabled = false;
    select.disabled = false;
    messageInput.setCustomValidity('');
  }
  select.addEventListener('change', () => { reset(); messageInput.value = scenarios[select.value]; });
  messageInput.addEventListener('input', reset);
  document.querySelector('#reset-flow').addEventListener('click', () => {
    reset();
    select.value = 'site';
    messageInput.value = scenarios.site;
  });
  document.querySelector('#flow-form').addEventListener('submit', event => {
    event.preventDefault();
    const message = messageInput.value.trim();
    reset();
    if (!message) {
      messageInput.setCustomValidity('Escreva uma mensagem fictícia para testar.');
      messageInput.reportValidity();
      return;
    }
    runButton.disabled = true;
    runButton.textContent = 'Simulação em andamento…';
    messageInput.disabled = true;
    select.disabled = true;
    steps[0].classList.add('active');
    status.textContent = 'Recebendo a mensagem de exemplo…';
    timers.push(setTimeout(() => {
      steps[0].classList.remove('active');
      steps[0].classList.add('complete');
      steps[1].classList.add('active');
      status.textContent = 'Organizando a solicitação…';
    }, 600));
    timers.push(setTimeout(() => {
      steps[1].classList.remove('active');
      steps[1].classList.add('complete');
      steps[2].classList.add('active');
      status.textContent = 'Preparando o próximo passo…';
    }, 1200));
    timers.push(setTimeout(() => {
      steps[2].classList.remove('active');
      steps[2].classList.add('complete');
      const normalized = normalize(message);
      let category = 'Atendimento geral';
      let next = 'Revisar a solicitação e conversar com a pessoa para entender a necessidade.';
      if (/computador|notebook|memoria|ssd|manutencao/.test(normalized)) {
        category = 'Suporte e hardware';
        next = 'Revisar os sintomas, confirmar o modelo do equipamento e combinar uma avaliação.';
      } else if (/planilha|relatorio|automatizar|automacao/.test(normalized)) {
        category = 'Automação de processos';
        next = 'Mapear a tarefa, confirmar as ferramentas usadas e definir um primeiro protótipo.';
      } else if (/site|loja|catalogo|landing/.test(normalized)) {
        category = 'Desenvolvimento web';
        next = 'Conversar sobre as páginas, o público e o conteúdo para preparar um orçamento.';
      }
      document.querySelector('#flow-category').textContent = category;
      document.querySelector('#flow-summary').textContent = message;
      document.querySelector('#flow-next').textContent = next;
      document.querySelector('#flow-result').hidden = false;
      document.querySelector('#flow-idle').hidden = true;
      status.textContent = 'Simulação concluída. Pronto para revisão humana. Nenhuma mensagem foi enviada.';
      runButton.disabled = false;
      runButton.textContent = 'Simular novamente →';
      messageInput.disabled = false;
      select.disabled = false;
      timers = [];
    }, 1800));
  });
}

