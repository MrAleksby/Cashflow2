// Модуль активов и пассивов
(function(){
  // === ИНИЦИАЛИЗАЦИЯ ОБРАБОТЧИКОВ КНОПОК ===
  document.addEventListener('DOMContentLoaded', function() {
    // Показываем экран cashflow по умолчанию
    var screens = document.querySelectorAll('.screen');
    var cashflowScreen = document.getElementById('screen-cashflow');
    if (cashflowScreen) {
      screens.forEach(function(s) { s.classList.remove('active'); });
      cashflowScreen.classList.add('active');
    }

    // === ИНИЦИАЛИЗАЦИЯ КОШЕЛЬКА ===
    if (typeof window.cash !== 'number' || isNaN(window.cash)) window.cash = 0;
  });

  // Функция-обертка для автоматического сохранения после рендеринга
  function wrapWithAutoSave(renderFunction) {
    return function(...args) {
      renderFunction.apply(this, args);
      if (typeof window.autoSave === 'function') {
        window.autoSave();
      }
    };
  }

  // Вспомогательная функция для проверки данных
  function checkDataArray(dataArray, listElement, totalElement, emptyMessage) {
    if (!listElement) return false;
    if (!window.data || !Array.isArray(dataArray) || dataArray.length === 0) {
      listElement.innerHTML = `<li style="color:#888;">${emptyMessage}</li>`;
      if (totalElement) totalElement.textContent = '0';
      return false;
    }
    return true;
  }

  // === ОТРИСОВКА АКТИВОВ ===
  const originalRenderAll = function() {
    var assetList = document.getElementById('asset-list');
    var assetTotal = document.getElementById('asset-total');
    
    if (!checkDataArray(window.data.asset, assetList, assetTotal, 'Нет активов')) return;
    
    var total = 0;
    assetList.innerHTML = window.data.asset.map(function(a) {
      let value = 0;
      let displayText = '';
      
      if (a.type === 'stocks') {
        value = a.quantity * a.price;
        displayText = `${a.name} (${a.quantity} шт. × $${a.price.toFixed(1)} = $${value})`;
      } else {
        value = Number(a.value) || 0;
        displayText = a.name;
      }
      
      total += value;
      return `<li>${displayText} <span style='float:right;'>$${value}</span></li>`;
    }).join('');
    if (assetTotal) assetTotal.textContent = total;
  };

  // === ОТРИСОВКА ДОХОДОВ ===
  const originalRenderIncome = function() {
    var incomeList = document.getElementById('income-list');
    var incomeTotal = document.getElementById('income-total');
    
    if (!checkDataArray(window.data.income, incomeList, incomeTotal, 'Нет доходов')) return;
    
    var total = 0;
    incomeList.innerHTML = window.data.income.map(function(a) {
      total += Number(a.value) || 0;
      return `<li>${a.name} <span style='float:right;'>${a.value}</span></li>`;
    }).join('');
    if (incomeTotal) incomeTotal.textContent = total;
  };

  // === ОТРИСОВКА РАСХОДОВ ===
  const originalRenderExpense = function() {
    var expenseList = document.getElementById('expense-list');
    var expenseTotal = document.getElementById('expense-total');
    
    if (!checkDataArray(window.data.expense, expenseList, expenseTotal, 'Нет расходов')) return;
    
    var total = 0;
    expenseList.innerHTML = window.data.expense.map(function(a) {
      total += Number(a.value) || 0;
      return `<li>${a.name} <span style='float:right;'>${a.value}</span></li>`;
    }).join('');
    if (expenseTotal) expenseTotal.textContent = total;
  };

  // === ОТРИСОВКА ПАССИВОВ ===
  const originalRenderLiability = function() {
    var liabilityList = document.getElementById('liability-list');
    var liabilityTotal = document.getElementById('liability-total');
    
    if (!checkDataArray(window.data.liability, liabilityList, liabilityTotal, 'Нет пассивов')) return;
    
    var total = 0;
    liabilityList.innerHTML = window.data.liability.map(function(a) {
      total += Number(a.value) || 0;
      return `<li>${a.name} <span style='float:right;'>${a.value}</span></li>`;
    }).join('');
    if (liabilityTotal) liabilityTotal.textContent = total;
  };

  // === ОТРИСОВКА КОШЕЛЬКА ===
  const originalRenderCash = function() {
    var cashElem = document.getElementById('top-cash-amount');
    var modalWalletElem = document.getElementById('modal-action-wallet-amount');
    var cash = Number(window.cash);
    
    // Синхронизируем с gameState если он доступен
    if (window.gameState && window.gameState.cash !== cash) {
      window.gameState.cash = cash;
    }
    
    if (cashElem) cashElem.textContent = cash;
    if (modalWalletElem) modalWalletElem.textContent = `$${cash}`;
  };

  // Оборачиваем все функции рендеринга в автосохранение
  window.renderAll = wrapWithAutoSave(originalRenderAll);
  window.renderIncome = wrapWithAutoSave(originalRenderIncome);
  window.renderExpense = wrapWithAutoSave(originalRenderExpense);
  window.renderLiability = wrapWithAutoSave(originalRenderLiability);
  window.renderCash = wrapWithAutoSave(originalRenderCash);

  // Инициализация данных при загрузке
  if (typeof window.data !== 'object' || !window.data) window.data = {};
  if (!Array.isArray(window.data.asset)) window.data.asset = [];
  if (!Array.isArray(window.data.income)) window.data.income = [];
  if (!Array.isArray(window.data.expense)) window.data.expense = [];
  if (!Array.isArray(window.data.liability)) window.data.liability = [];

})(); 