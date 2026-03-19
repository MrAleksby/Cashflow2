// ── Управление модалками ─────────────────────────────────────────────────

function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
}

// Закрыть по клику на оверлей или кнопку [data-close]
document.addEventListener('click', e => {
  // Кнопки data-close
  if (e.target.dataset.close) {
    closeModal(e.target.dataset.close);
    return;
  }
  // Клик на оверлей (не на само модальное окно)
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ── PayDay ────────────────────────────────────────────────────────────────

function doPayDay() {
  const cashflow = calcCashFlow();
  const newMonth = (state.monthsCount || 0) + 1;
  const newCash = (state.cash || 0) + cashflow;

  const entry = {
    id: nextId(),
    month: newMonth,
    description: `PayDay — Cash Flow ${cashflow >= 0 ? '+' : ''}${fmtNum(cashflow)} ₽`,
    amount: cashflow,
    date: new Date().toLocaleDateString('ru-RU'),
  };

  setState({
    cash: newCash,
    monthsCount: newMonth,
    history: [...state.history, entry],
  });
}

// ── Новая игра ────────────────────────────────────────────────────────────

let selectedTaxRate = 0.25;

function initNewGameModal() {
  const taxOptions = document.querySelectorAll('.tax-option');
  taxOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      taxOptions.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTaxRate = parseFloat(btn.dataset.rate);
    });
  });

  document.getElementById('btn-start-game').addEventListener('click', () => {
    setState({ taxRate: selectedTaxRate });
    closeModal('overlay-newgame');
  });
}

// ── Действие ─────────────────────────────────────────────────────────────

function initActionModal() {
  document.getElementById('action-job').addEventListener('click', () => {
    closeModal('overlay-action');
    // Заполнить текущими данными
    document.getElementById('job-title').value = state.job.title || '';
    document.getElementById('job-salary').value = state.job.salary || '';
    openModal('overlay-job');
  });

  document.getElementById('action-add-money').addEventListener('click', () => {
    closeModal('overlay-action');
    document.getElementById('add-money-amount').value = '';
    document.getElementById('add-money-desc').value = '';
    openModal('overlay-add-money');
  });

  document.getElementById('action-loan').addEventListener('click', () => {
    closeModal('overlay-action');
    document.getElementById('loan-name').value = '';
    document.getElementById('loan-amount').value = '';
    document.getElementById('loan-payment').value = '';
    openModal('overlay-loan');
  });

  document.getElementById('action-child').addEventListener('click', () => {
    closeModal('overlay-action');
    document.getElementById('child-expense').value = '';
    openModal('overlay-child');
  });

  document.getElementById('action-expense').addEventListener('click', () => {
    closeModal('overlay-action');
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    openModal('overlay-expense');
  });

  document.getElementById('action-pay-loan').addEventListener('click', () => {
    closeModal('overlay-action');
    renderPayLoanList();
    openModal('overlay-pay-loan');
  });
}

// ── Работа ────────────────────────────────────────────────────────────────

function initJobModal() {
  document.getElementById('btn-save-job').addEventListener('click', () => {
    const title = document.getElementById('job-title').value.trim();
    const salary = parseInt(document.getElementById('job-salary').value) || 0;
    setState({ job: { title, salary } });
    closeModal('overlay-job');
  });
}

// ── Добавить / снять деньги ───────────────────────────────────────────────

function initAddMoneyModal() {
  document.getElementById('btn-add-money').addEventListener('click', () => {
    const amount = parseInt(document.getElementById('add-money-amount').value) || 0;
    const desc = document.getElementById('add-money-desc').value.trim() || 'Пополнение';
    if (amount <= 0) return;
    const entry = { id: nextId(), month: state.monthsCount, description: desc, amount, date: new Date().toLocaleDateString('ru-RU') };
    setState({ cash: state.cash + amount, history: [...state.history, entry] });
    closeModal('overlay-add-money');
  });

  document.getElementById('btn-remove-money').addEventListener('click', () => {
    const amount = parseInt(document.getElementById('add-money-amount').value) || 0;
    const desc = document.getElementById('add-money-desc').value.trim() || 'Снятие';
    if (amount <= 0) return;
    const entry = { id: nextId(), month: state.monthsCount, description: desc, amount: -amount, date: new Date().toLocaleDateString('ru-RU') };
    setState({ cash: state.cash - amount, history: [...state.history, entry] });
    closeModal('overlay-add-money');
  });
}

// ── Займ ──────────────────────────────────────────────────────────────────

function initLoanModal() {
  document.getElementById('btn-save-loan').addEventListener('click', () => {
    const name = document.getElementById('loan-name').value.trim();
    const amount = parseInt(document.getElementById('loan-amount').value) || 0;
    const payment = parseInt(document.getElementById('loan-payment').value) || 0;
    if (!name || amount <= 0) return;

    const newLiability = { id: nextId(), name, amount, payment };
    const entry = { id: nextId(), month: state.monthsCount, description: `Займ: ${name}`, amount, date: new Date().toLocaleDateString('ru-RU') };
    setState({
      cash: state.cash + amount,
      liabilities: [...state.liabilities, newLiability],
      history: [...state.history, entry],
    });
    closeModal('overlay-loan');
  });
}

// ── Ребёнок ───────────────────────────────────────────────────────────────

function initChildModal() {
  document.getElementById('btn-save-child').addEventListener('click', () => {
    const amount = parseInt(document.getElementById('child-expense').value) || 0;
    if (amount <= 0) return;
    const childNum = state.expenses.filter(e => e.type === 'child').length + 1;
    const newExpense = { id: nextId(), name: `Ребёнок ${childNum}`, amount, type: 'child' };
    setState({ expenses: [...state.expenses, newExpense] });
    closeModal('overlay-child');
  });
}

// ── Расход ────────────────────────────────────────────────────────────────

function initExpenseModal() {
  document.getElementById('btn-save-expense').addEventListener('click', () => {
    const name = document.getElementById('expense-name').value.trim();
    const amount = parseInt(document.getElementById('expense-amount').value) || 0;
    if (!name || amount <= 0) return;
    const newExpense = { id: nextId(), name, amount, type: 'fixed' };
    setState({ expenses: [...state.expenses, newExpense] });
    closeModal('overlay-expense');
  });
}

// ── Погасить долг ─────────────────────────────────────────────────────────

function renderPayLoanList() {
  const el = document.getElementById('pay-loan-list');
  if (!el) return;

  if (state.liabilities.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>Нет долгов</p></div>';
    return;
  }

  el.innerHTML = state.liabilities.map(l => `
    <div class="sell-item">
      <div class="sell-item-info">
        <div class="sell-item-name">${l.name}</div>
        <div class="sell-item-detail">Долг: ${fmt(l.amount)} · Платёж: ${fmt(l.payment)}/мес</div>
      </div>
      <button class="sell-item-btn" onclick="payOffLoan('${l.id}')">Погасить</button>
    </div>`).join('');
}

function payOffLoan(id) {
  const loan = state.liabilities.find(l => l.id === id);
  if (!loan) return;
  if (state.cash < loan.amount) {
    alert(`Недостаточно средств. Нужно ${fmt(loan.amount)}, на счёте ${fmt(state.cash)}`);
    return;
  }
  const entry = { id: nextId(), month: state.monthsCount, description: `Погашен долг: ${loan.name}`, amount: -loan.amount, date: new Date().toLocaleDateString('ru-RU') };
  setState({
    cash: state.cash - loan.amount,
    liabilities: state.liabilities.filter(l => l.id !== id),
    history: [...state.history, entry],
  });
  renderPayLoanList();
}

// ── Купить актив ─────────────────────────────────────────────────────────

let buyCategory = null;
let buySelectedAsset = null;

function initBuyModal() {
  // Шаг 1: выбор категории
  document.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      buyCategory = btn.dataset.category;
      showBuyStep('asset');
      renderBuyAssetList();
    });
  });

  // Назад: asset → category
  document.getElementById('buy-back-to-category').addEventListener('click', () => {
    showBuyStep('category');
  });

  // Назад: form → asset
  document.getElementById('buy-back-to-asset').addEventListener('click', () => {
    if (buyCategory === 'custom') {
      showBuyStep('category');
    } else {
      showBuyStep('asset');
    }
  });

  // Подтвердить покупку
  document.getElementById('btn-confirm-buy').addEventListener('click', confirmBuy);
}

function showBuyStep(step) {
  document.getElementById('buy-step-category').style.display = step === 'category' ? '' : 'none';
  document.getElementById('buy-step-asset').style.display = step === 'asset' ? '' : 'none';
  document.getElementById('buy-step-form').style.display = step === 'form' ? '' : 'none';
  document.getElementById('buy-modal-footer').style.display = step === 'form' ? '' : 'none';

  const titles = { category: 'Купить актив', asset: 'Выбрать актив', form: 'Детали покупки' };
  document.getElementById('buy-modal-title').textContent = titles[step] || 'Купить актив';
}

function renderBuyAssetList() {
  const el = document.getElementById('buy-asset-list');
  if (!el) return;

  if (buyCategory === 'custom') {
    // Сразу показать форму для ручного ввода
    buySelectedAsset = { custom: true };
    showBuyStep('form');
    renderBuyForm();
    return;
  }

  const list = ASSET_CATALOG[buyCategory] || [];
  el.innerHTML = list.map(a => {
    const priceText = a.pricePerShare !== undefined
      ? `${fmt(a.pricePerShare)}/шт`
      : a.pricePerUnit !== undefined
        ? `${fmt(a.pricePerUnit)}/шт`
        : fmt(a.price);
    const incomeText = a.monthlyIncome ? ` · ${fmt(a.monthlyIncome)}/мес` : '';
    return `
      <div class="asset-option" onclick="selectBuyAsset('${a.key}')">
        <div class="asset-option-left">
          <div class="asset-option-name">${a.icon} ${a.name}</div>
          <div class="asset-option-detail">${a.desc}${incomeText}</div>
        </div>
        <div class="asset-option-price">${priceText}</div>
      </div>`;
  }).join('');
}

function selectBuyAsset(key) {
  const list = ASSET_CATALOG[buyCategory] || [];
  buySelectedAsset = list.find(a => a.key === key);
  if (!buySelectedAsset) return;
  showBuyStep('form');
  renderBuyForm();
}

function renderBuyForm() {
  const el = document.getElementById('buy-form-content');
  if (!el) return;

  if (buySelectedAsset && buySelectedAsset.custom) {
    el.innerHTML = `
      <div class="form-group">
        <label class="form-label">Название актива</label>
        <input class="form-input" id="buy-custom-name" type="text" placeholder="Бизнес, инвестиция..." />
      </div>
      <div class="form-group">
        <label class="form-label">Стоимость</label>
        <input class="form-input" id="buy-custom-price" type="number" inputmode="numeric" placeholder="100 000" />
      </div>
      <div class="form-group">
        <label class="form-label">Ежемесячный доход (необязательно)</label>
        <input class="form-input" id="buy-custom-income" type="number" inputmode="numeric" placeholder="5 000" />
      </div>`;
    return;
  }

  const a = buySelectedAsset;
  const isQty = a.pricePerShare !== undefined || a.pricePerUnit !== undefined;
  const unitPrice = a.pricePerShare || a.pricePerUnit || a.price || 0;

  if (isQty) {
    el.innerHTML = `
      <div style="padding:12px 0 16px;border-bottom:1px solid var(--border);margin-bottom:16px">
        <div style="font-size:16px;font-weight:700">${a.icon} ${a.name}</div>
        <div style="font-size:13px;color:var(--text-2);margin-top:4px">${a.desc}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Цена за штуку</label>
        <input class="form-input" id="buy-unit-price" type="number" inputmode="numeric" placeholder="${unitPrice}" value="${unitPrice !== 1 ? unitPrice : ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">Количество</label>
        <input class="form-input" id="buy-quantity" type="number" inputmode="numeric" placeholder="100" />
      </div>
      ${a.monthlyIncome ? `<div class="form-group">
        <label class="form-label">Доход в месяц (за 1 шт)</label>
        <input class="form-input" id="buy-income-per" type="number" inputmode="numeric" value="${a.monthlyIncome}" />
      </div>` : ''}`;
  } else {
    el.innerHTML = `
      <div style="padding:12px 0 16px;border-bottom:1px solid var(--border);margin-bottom:16px">
        <div style="font-size:16px;font-weight:700">${a.icon} ${a.name}</div>
        <div style="font-size:13px;color:var(--text-2);margin-top:4px">${a.desc}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Стоимость покупки</label>
        <input class="form-input" id="buy-price" type="number" inputmode="numeric" placeholder="${a.price}" value="${a.price || ''}" />
      </div>
      ${a.monthlyIncome ? `<div class="form-group">
        <label class="form-label">Доход в месяц</label>
        <input class="form-input" id="buy-income" type="number" inputmode="numeric" value="${a.monthlyIncome}" />
      </div>` : `<div class="form-group">
        <label class="form-label">Доход в месяц (необязательно)</label>
        <input class="form-input" id="buy-income" type="number" inputmode="numeric" placeholder="0" />
      </div>`}`;
  }
}

function confirmBuy() {
  if (!buySelectedAsset) return;

  let newAsset;

  if (buySelectedAsset.custom) {
    const name = document.getElementById('buy-custom-name').value.trim();
    const price = parseInt(document.getElementById('buy-custom-price').value) || 0;
    const income = parseInt(document.getElementById('buy-custom-income').value) || 0;
    if (!name || price <= 0) return;
    newAsset = { id: nextId(), name, category: 'custom', type: 'custom', quantity: 1, price, monthlyIncome: income };
  } else {
    const a = buySelectedAsset;
    const isQty = a.pricePerShare !== undefined || a.pricePerUnit !== undefined;

    if (isQty) {
      const unitPrice = parseInt(document.getElementById('buy-unit-price').value) || a.pricePerShare || a.pricePerUnit || 0;
      const qty = parseInt(document.getElementById('buy-quantity').value) || 0;
      const incomePerEl = document.getElementById('buy-income-per');
      const incomePer = incomePerEl ? (parseInt(incomePerEl.value) || 0) : 0;
      if (qty <= 0) return;

      // Проверить, есть ли уже такой актив
      const existing = state.assets.find(x => x.key === a.key);
      if (existing) {
        const updated = state.assets.map(x => x.key === a.key
          ? { ...x, quantity: x.quantity + qty, monthlyIncome: (x.monthlyIncome || 0) + incomePer * qty }
          : x);
        const cost = unitPrice * qty;
        const entry = { id: nextId(), month: state.monthsCount, description: `Куплено ${a.name} × ${qty}`, amount: -cost, date: new Date().toLocaleDateString('ru-RU') };
        setState({ assets: updated, cash: state.cash - cost, history: [...state.history, entry] });
        closeModal('overlay-buy');
        return;
      }

      newAsset = { id: nextId(), key: a.key, name: a.name, category: buyCategory, type: a.type, quantity: qty, price: unitPrice, monthlyIncome: incomePer * qty };
    } else {
      const price = parseInt(document.getElementById('buy-price').value) || a.price || 0;
      const incomeEl = document.getElementById('buy-income');
      const income = incomeEl ? (parseInt(incomeEl.value) || 0) : 0;
      if (price <= 0) return;
      newAsset = { id: nextId(), key: a.key, name: a.name, category: buyCategory, type: a.type, quantity: 1, price, monthlyIncome: income };
    }
  }

  const cost = (newAsset.price || 0) * (newAsset.quantity || 1);
  const entry = { id: nextId(), month: state.monthsCount, description: `Куплено: ${newAsset.name}`, amount: -cost, date: new Date().toLocaleDateString('ru-RU') };
  setState({
    assets: [...state.assets, newAsset],
    cash: state.cash - cost,
    history: [...state.history, entry],
  });
  closeModal('overlay-buy');
}

// ── Продать актив ─────────────────────────────────────────────────────────

function initSellModal() {
  // рендер происходит при открытии
}

let sellExpandedId = null;

function renderSellList() {
  const el = document.getElementById('sell-asset-list');
  if (!el) return;

  if (state.assets.length === 0) {
    el.innerHTML = '<div class="empty-state"><p>Нет активов для продажи</p></div>';
    return;
  }

  el.innerHTML = state.assets.map(a => {
    const isQty = (a.quantity || 1) > 1;
    const totalValue = (a.price || 0) * (a.quantity || 1);
    const detail = isQty ? `${fmtNum(a.quantity)} шт · ${fmt(a.price)}/шт` : fmt(totalValue);
    const incomeText = a.monthlyIncome ? ` · доход ${fmt(a.monthlyIncome)}/мес` : '';
    const isExpanded = sellExpandedId === a.id;

    const formHtml = isExpanded ? `
      <div class="sell-form" id="sell-form-${a.id}">
        ${isQty ? `
          <div class="sell-form-row">
            <label class="sell-form-label">Цена продажи за шт</label>
            <input class="form-input" id="sell-price-${a.id}" type="number" inputmode="numeric" placeholder="${a.price}" value="${a.price}" />
          </div>
          <div class="sell-form-row">
            <label class="sell-form-label">Количество (макс. ${fmtNum(a.quantity)})</label>
            <input class="form-input" id="sell-qty-${a.id}" type="number" inputmode="numeric" placeholder="${a.quantity}" value="${a.quantity}" min="1" max="${a.quantity}" />
          </div>` : `
          <div class="sell-form-row">
            <label class="sell-form-label">Цена продажи</label>
            <input class="form-input" id="sell-price-${a.id}" type="number" inputmode="numeric" placeholder="${totalValue}" value="${totalValue}" />
          </div>`}
        <div class="sell-form-actions">
          <button class="btn-secondary" onclick="cancelSell()">Отмена</button>
          <button class="btn-primary" onclick="confirmSell('${a.id}')">Подтвердить</button>
        </div>
      </div>` : '';

    return `
      <div class="sell-item ${isExpanded ? 'sell-item--expanded' : ''}">
        <div class="sell-item-top">
          <div class="sell-item-info">
            <div class="sell-item-name">${CATEGORY_ICONS[a.category] || '📦'} ${a.name}</div>
            <div class="sell-item-detail">${detail}${incomeText}</div>
          </div>
          ${!isExpanded ? `<button class="sell-item-btn" onclick="openSellForm('${a.id}')">Продать</button>` : ''}
        </div>
        ${formHtml}
      </div>`;
  }).join('');
}

function openSellForm(id) {
  sellExpandedId = id;
  renderSellList();
  // Фокус на первое поле
  setTimeout(() => {
    const input = document.getElementById(`sell-price-${id}`);
    if (input) input.focus();
  }, 50);
}

function cancelSell() {
  sellExpandedId = null;
  renderSellList();
}

function confirmSell(id) {
  const asset = state.assets.find(a => a.id === id);
  if (!asset) return;

  const isQty = (asset.quantity || 1) > 1;
  const priceInput = document.getElementById(`sell-price-${id}`);
  const qtyInput = document.getElementById(`sell-qty-${id}`);

  if (isQty) {
    const sellPrice = parseInt(priceInput?.value) || asset.price || 0;
    const sellQty = Math.min(parseInt(qtyInput?.value) || asset.quantity, asset.quantity);
    if (sellQty <= 0) return;

    const proceeds = sellPrice * sellQty;
    const entry = { id: nextId(), month: state.monthsCount, description: `Продано: ${asset.name} × ${sellQty} по ${fmt(sellPrice)}`, amount: proceeds, date: new Date().toLocaleDateString('ru-RU') };

    const remaining = asset.quantity - sellQty;
    const incomeRatio = remaining / asset.quantity;
    const updatedAssets = remaining > 0
      ? state.assets.map(a => a.id === id ? { ...a, quantity: remaining, monthlyIncome: Math.round((a.monthlyIncome || 0) * incomeRatio) } : a)
      : state.assets.filter(a => a.id !== id);

    setState({ assets: updatedAssets, cash: state.cash + proceeds, history: [...state.history, entry] });
  } else {
    const sellPrice = parseInt(priceInput?.value) || (asset.price || 0) * (asset.quantity || 1);
    if (sellPrice < 0) return;
    const entry = { id: nextId(), month: state.monthsCount, description: `Продано: ${asset.name} за ${fmt(sellPrice)}`, amount: sellPrice, date: new Date().toLocaleDateString('ru-RU') };
    setState({ assets: state.assets.filter(a => a.id !== id), cash: state.cash + sellPrice, history: [...state.history, entry] });
  }

  sellExpandedId = null;
  renderSellList();
}

// ── Инициализация всех модалок ────────────────────────────────────────────

function initModals() {
  initNewGameModal();
  initActionModal();
  initJobModal();
  initAddMoneyModal();
  initLoanModal();
  initChildModal();
  initExpenseModal();
  initBuyModal();
  initSellModal();

  // Открытие sell — рендерим список
  document.getElementById('btn-sell').addEventListener('click', () => {
    renderSellList();
    openModal('overlay-sell');
  });
}
