document.addEventListener('DOMContentLoaded', function() {
    // Проверяем и инициализируем необходимые глобальные переменные
    if (typeof window.cash === 'undefined') {
        window.cash = 0;
    }
    if (typeof window.data === 'undefined') {
        window.data = {};
    }
    if (typeof window.data.history === 'undefined') {
        window.data.history = [];
    }
    if (typeof window.data.children === 'undefined') {
        window.data.children = [];
    }
    if (typeof window.data.job === 'undefined') {
        window.data.job = {
            title: '',
            salary: 0
        };
    }

    // Инициализируем отображение зарплаты
    const salaryValue = document.getElementById('salary-value');
    if (salaryValue) {
        salaryValue.textContent = window.data.job.salary;
    }

    if (typeof window.renderCash !== 'function') {
        window.renderCash = function() {
            const topCashAmount = document.getElementById('top-cash-amount');
            if (topCashAmount) {
                topCashAmount.textContent = window.cash;
            }
        };
    }

    const actionModal = document.getElementById('action-modal');
    if (!actionModal) {
        console.error('Не найден элемент action-modal');
        return;
    }

    const actionCards = actionModal.querySelectorAll('.category-card');
    let activeCard = null;

    // Получаем элементы для работы с детьми
    const childNameInput = actionModal.querySelector('.child-name');
    const childExpenseInput = actionModal.querySelector('.child-expense');
    const addChildBtn = actionModal.querySelector('.add-child-btn');
    const childrenList = actionModal.querySelector('.children-list');

    // Получаем элементы для работы с кредитом
    const loanAmountInput = actionModal.querySelector('.loan-amount');
    const loanDescriptionInput = actionModal.querySelector('.loan-description');
    const takeLoanBtn = actionModal.querySelector('.take-loan-btn');

    // Получаем остальные элементы модального окна
    const closeBtn = actionModal.querySelector('.close-btn');
    const takeMoneyBtn = actionModal.querySelector('.take-money-btn');
    const giveMoneyBtn = actionModal.querySelector('.give-money-btn');
    const takeMoneyAmount = actionModal.querySelector('.take-money-amount');
    const giveMoneyAmount = actionModal.querySelector('.give-money-amount');
    const takeMoneyDescription = actionModal.querySelector('.take-money-description');
    const giveMoneyDescription = actionModal.querySelector('.give-money-description');
    const walletAmount = actionModal.querySelector('#modal-action-wallet-amount');

    // Получаем элементы для работы с работой
    const jobSalaryInput = actionModal.querySelector('.job-salary');
    const jobTitleInput = actionModal.querySelector('.job-title');
    const setJobBtn = actionModal.querySelector('.set-job-btn');

    // Проверяем, что все элементы найдены
    if (!closeBtn || !takeMoneyBtn || !giveMoneyBtn || !takeMoneyAmount || 
        !giveMoneyAmount || !takeMoneyDescription || !giveMoneyDescription || !walletAmount ||
        !childNameInput || !childExpenseInput || !addChildBtn || !childrenList ||
        !loanAmountInput || !loanDescriptionInput || !takeLoanBtn ||
        !jobSalaryInput || !jobTitleInput || !setJobBtn) {
        console.error('Не найдены необходимые элементы в модальном окне');
        return;
    }

    // Функция для обновления списка детей
    function updateChildrenList() {
        childrenList.innerHTML = '';
        window.data.children.forEach((child, index) => {
            const childItem = document.createElement('div');
            childItem.className = 'child-item';
            childItem.innerHTML = `
                <div class="child-info">
                    <div class="child-name">${child.name}</div>
                    <div class="child-expense">Расход: $${child.expense}/мес</div>
                </div>
                <button class="remove-child-btn" data-index="${index}">Удалить</button>
            `;
            childrenList.appendChild(childItem);
        });

        // Добавляем обработчики для кнопок удаления
        const removeButtons = childrenList.querySelectorAll('.remove-child-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeChild(index);
            });
        });
    }

    // Функция добавления ребенка
    function addChild() {
        const name = childNameInput.value.trim();
        const expense = parseFloat(childExpenseInput.value);

        if (!name) {
            alert('Введите имя ребенка!');
            return;
        }

        if (!expense || expense < 0) {
            alert('Введите корректную сумму расхода!');
            return;
        }

        // Убираем подтверждение для быстрого UX

        // Добавляем ребенка
        window.data.children.push({
            name: name,
            expense: expense
        });

        // Добавляем расход в общие расходы
        if (!window.data.expense) {
            window.data.expense = [];
        }
        window.data.expense.push({
            id: `child-expense-${Date.now()}`,
            name: `Расходы на ребенка: ${name}`,
            type: 'child',
            value: expense
        });

        // Добавляем запись в историю
        if (!window.data.history) {
            window.data.history = [];
        }
        window.data.history.push({
            type: 'add_child',
            childName: name,
            expense: expense,
            date: new Date().toISOString()
        });

        // Обновляем отображение
        updateChildrenList();
        window.renderExpense(); // Обновляем отображение расходов
        window.renderSummary(); // Обновляем общую сумму
        window.renderHistory(); // Обновляем историю
        autoSave();

        // Очищаем поля
        childNameInput.value = '';
        childExpenseInput.value = '';

        // Закрываем модальное окно
        closeActionModal();
    }

    // Функция удаления ребенка
    function removeChild(index) {
        const child = window.data.children[index];
        // Убираем подтверждение для быстрого UX

        // Удаляем ребенка из списка
        window.data.children.splice(index, 1);

        // Удаляем расход, связанный с ребенком
        if (window.data.expense) {
            const expenseIndex = window.data.expense.findIndex(exp => 
                exp.type === 'child' && exp.name === `Расходы на ребенка: ${child.name}`
            );
            if (expenseIndex !== -1) {
                window.data.expense.splice(expenseIndex, 1);
            }
        }

        // Добавляем запись в историю об удалении
        if (!window.data.history) {
            window.data.history = [];
        }
        window.data.history.push({
            type: 'remove_child',
            childName: child.name,
            date: new Date().toISOString()
        });

        // Обновляем отображение
        updateChildrenList();
        window.renderExpense(); // Обновляем отображение расходов
        window.renderSummary(); // Обновляем общую сумму
        if (typeof window.renderHistory === 'function') {
            window.renderHistory(); // Обновляем историю
        }
        autoSave();
    }

    // Функция взятия кредита
    function takeLoan() {
        const amount = parseFloat(loanAmountInput.value);
        const description = loanDescriptionInput.value.trim();

        if (!amount || amount <= 0) {
            alert('Введите корректную сумму!');
            return;
        }

        if (amount % 1000 !== 0) {
            alert('Сумма кредита должна быть кратна $1000!');
            return;
        }

        if (!description) {
            alert('Введите описание (цель) кредита!');
            return;
        }

        // Подтверждение
        const monthlyPayment = amount * 0.1;
        // Убираем подтверждение для быстрого UX

        // Добавляем деньги в кошелек
        window.cash += amount;

        // Добавляем в пассивы
        if (!window.data.liability) window.data.liability = [];
        window.data.liability.push({
            id: `loan-${Date.now()}`,
            name: `Кредит: ${description}`,
            value: amount,
            type: 'loan'
        });

        // Добавляем ежемесячный расход
        if (!window.data.expense) window.data.expense = [];
        window.data.expense.push({
            id: `loan-payment-${Date.now()}`,
            name: `Платеж по кредиту: ${description}`,
            value: monthlyPayment,
            type: 'loan'
        });

        // Добавляем в историю
        window.data.history.push({
            type: 'loan',
            description: 'Кредит',
            amount: amount,
            date: new Date().toISOString()
        });

        // Обновляем отображение
        window.renderCash();
        window.renderLiability();
        window.renderExpense();
        window.renderSummary();
        if (typeof window.renderHistory === 'function') {
            window.renderHistory();
        }
        updateModalWalletAmount();
        
        // Сохраняем изменения
        if (typeof window.autoSave === 'function') {
            window.autoSave();
        }

        // Очищаем поля
        loanAmountInput.value = '';
        loanDescriptionInput.value = '';

        // Закрываем модальное окно
        closeActionModal();
    }

    function forceReflow(element) {
        // Принудительное обновление отображения
        element.style.display = 'none';
        element.offsetHeight; // Принудительный reflow
        element.style.display = '';
        
        // Дополнительное обновление через RAF для iOS
        requestAnimationFrame(() => {
            element.style.transform = 'translateZ(0)';
            setTimeout(() => {
                element.style.transform = '';
            }, 0);
        });
    }

    function setupNumericInput(input) {
        if (!input) return;

        // Используем обычное текстовое поле вместо tel
        input.setAttribute('type', 'text');
        input.setAttribute('inputmode', 'numeric');
        
        const updateValue = (e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value !== e.target.value) {
                e.target.value = value;
            }
        };

        // Упрощаем обработчики событий
        input.addEventListener('input', updateValue);
        input.addEventListener('change', updateValue);

        // Обработка фокуса для прокрутки
        input.addEventListener('focus', (e) => {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    // Настраиваем все числовые поля в модальном окне
    function setupAllNumericInputs() {
        // Поля для взятия/отдачи денег
        setupNumericInput(takeMoneyAmount);
        setupNumericInput(giveMoneyAmount);
        
        // Поля для детей
        setupNumericInput(childExpenseInput);
        
        // Поля для кредита
        setupNumericInput(loanAmountInput);
        
        // Поля для работы
        setupNumericInput(jobSalaryInput);
    }

    // Открытие модального окна
    window.openActionModal = function() {
        const actionModal = document.getElementById('action-modal');
        if (actionModal) {
            actionModal.classList.add('active');
            updateModalWalletAmount();
            updateChildrenList();
            clearInputs();
            setupAllNumericInputs();
        }
    };

    // Закрытие модального окна
    window.closeActionModal = function() {
        const actionModal = document.getElementById('action-modal');
        if (actionModal) {
            actionModal.classList.remove('active');
            // Очищаем поля ввода
            const inputs = actionModal.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = '';
            });
            // Деактивируем все карточки
            const cards = actionModal.querySelectorAll('.category-card');
            cards.forEach(card => {
                card.classList.remove('active');
                const form = card.querySelector('.action-form');
                if (form) {
                    form.style.display = 'none';
                }
            });
        }
    };

    // Обновление отображения суммы в кошельке
    function updateModalWalletAmount() {
        walletAmount.textContent = `$${window.cash || 0}`;
    }

    // Очистка полей ввода
    function clearInputs() {
        takeMoneyAmount.value = '';
        giveMoneyAmount.value = '';
        takeMoneyDescription.value = '';
        giveMoneyDescription.value = '';
        childNameInput.value = '';
        childExpenseInput.value = '';
        loanAmountInput.value = '';
        loanDescriptionInput.value = '';
        jobSalaryInput.value = '';
        jobTitleInput.value = '';
    }

    // Взять деньги
    function takeMoney() {
        const amount = parseFloat(takeMoneyAmount.value);
        let description = takeMoneyDescription.value.trim();

        if (!amount || amount <= 0) {
            alert('Введите корректную сумму!');
            return;
        }

        // Если описание не введено, используем значение по умолчанию
        if (!description) {
            description = 'Внешний доход';
        }

        // Убираем подтверждение для быстрого UX

        // Добавляем деньги
        window.cash += amount;

        // Добавляем в историю
        window.data.history.push({
            type: 'take',
            amount: amount,
            description: description,
            date: new Date().toISOString()
        });

        // Обновляем отображение
        window.renderCash();
        if (typeof window.renderHistory === 'function') {
            window.renderHistory();
        }
        autoSave();

        // Очищаем поля
        takeMoneyAmount.value = '';
        takeMoneyDescription.value = '';

        // Закрываем модальное окно
        closeActionModal();
    }

    // Отдать деньги
    function giveMoney() {
        const amount = parseFloat(giveMoneyAmount.value);
        let description = giveMoneyDescription.value.trim();

        if (!amount || amount <= 0) {
            alert('Введите корректную сумму!');
            return;
        }
        
        if (amount > window.cash) {
            alert('Недостаточно средств!');
            return;
        }

        // Если описание не введено, используем значение по умолчанию
        if (!description) {
            description = 'Внешний расход';
        }

        // Убираем подтверждение для быстрого UX

        // Вычитаем деньги
        window.cash -= amount;

        // Добавляем в историю
        window.data.history.push({
            type: 'give',
            amount: amount,
            description: description,
            date: new Date().toISOString()
        });

        // Обновляем отображение
        window.renderCash();
        if (typeof window.renderHistory === 'function') {
            window.renderHistory();
        }
        autoSave();

        // Очищаем поля
        giveMoneyAmount.value = '';
        giveMoneyDescription.value = '';

        // Закрываем модальное окно
        closeActionModal();
    }

    // Функция установки работы
    function setJob() {
        const title = jobTitleInput.value.trim();
        const salary = parseFloat(jobSalaryInput.value);

        if (!title) {
            alert('Введите название работы!');
            return;
        }

        if (!salary || salary <= 0) {
            alert('Введите корректную сумму зарплаты!');
            return;
        }

        // Убираем подтверждение для быстрого UX

        // Обновляем данные о работе
        window.data.job = {
            title: title,
            salary: salary
        };

        // Добавляем зарплату в доходы
        if (!window.data.income) {
            window.data.income = [];
        }
        
        // Удаляем старый доход от работы, если есть
        window.data.income = window.data.income.filter(inc => inc.type !== 'job');
        
        // Добавляем новый доход от работы
        window.data.income.push({
            id: `job-${Date.now()}`,
            name: `Зарплата: ${title}`,
            value: salary,
            type: 'job'
        });

        // Добавляем в историю
        if (!window.data.history) {
            window.data.history = [];
        }
        window.data.history.push({
            type: 'new_job',
            title: title,
            salary: salary,
            date: new Date().toISOString()
        });

        // Обновляем отображение
        window.renderIncome(); // Обновляем список доходов
        window.renderSummary(); // Обновляем финансовую формулу
        window.renderHistory(); // Обновляем историю
        
        // Обновляем отображение зарплаты в основном интерфейсе
        const salaryValue = document.getElementById('salary-value');
        if (salaryValue) {
            salaryValue.textContent = salary;
        }

        // Обновляем состояние кнопки "Уволиться"
        updateQuitJobButton();
        
        autoSave();

        // Очищаем поля
        jobTitleInput.value = '';
        jobSalaryInput.value = '';

        // Закрываем модальное окно
        closeActionModal();

        alert('Вы устроились на новую работу!');
    }

    function quitJob() {
        // Проверяем, есть ли активная работа
        if (!window.data.job || !window.data.job.title || !window.data.job.salary) {
            alert('У вас нет активной работы!');
            return;
        }

        // Убираем подтверждение для быстрого UX

        // Сохраняем информацию о работе для истории
        const oldJob = {
            title: window.data.job.title,
            salary: window.data.job.salary
        };

        // Очищаем данные о работе
        window.data.job = {
            title: '',
            salary: 0
        };

        // Удаляем работу из доходов
        if (window.data.income) {
            window.data.income = window.data.income.filter(inc => inc.type !== 'job');
        }

        // Добавляем запись в историю
        if (!window.data.history) {
            window.data.history = [];
        }
        window.data.history.push({
            type: 'quit_job',
            jobTitle: oldJob.title,
            salary: oldJob.salary,
            date: new Date().toISOString()
        });

        // Обновляем отображение
        window.renderIncome(); // Обновляем список доходов
        window.renderSummary(); // Обновляем финансовую формулу
        window.renderHistory(); // Обновляем историю
        
        // Обновляем отображение зарплаты в основном интерфейсе
        const salaryValue = document.getElementById('salary-value');
        if (salaryValue) {
            salaryValue.textContent = '0';
        }

        // Сохраняем изменения
        autoSave();

        // Обновляем состояние кнопки "Уволиться"
        updateQuitJobButton();

        // Закрываем модальное окно
        closeActionModal();

        alert(`Вы уволились с работы "${oldJob.title}"`);
    }

    function updateQuitJobButton() {
        const quitBtn = document.getElementById('quit-job-btn');
        if (!quitBtn) return;

        // Проверяем наличие активной работы
        const hasActiveJob = window.data.job && 
                           window.data.job.title && 
                           window.data.job.salary > 0;
        
        // Проверяем наличие дохода от работы
        const hasJobIncome = window.data.income && 
                           window.data.income.some(inc => inc.type === 'job' && 
                                                        inc.value === window.data.job.salary);
        
        // Кнопка активна только если есть и работа, и соответствующий доход
        const isActive = hasActiveJob && hasJobIncome;
        
        // Обновляем состояние кнопки
        quitBtn.disabled = !isActive;
        quitBtn.style.display = isActive ? 'block' : 'none';
        
        // Добавляем красный цвет для кнопки
        quitBtn.classList.toggle('btn-danger', isActive);
    }

    // Инициализация кнопки "Уволиться"
    const quitBtn = document.getElementById('quit-job-btn');
    if (quitBtn) {
        quitBtn.onclick = quitJob;
        // Инициализируем состояние кнопки
        updateQuitJobButton();
    }

    // Добавляем обработчики событий
    closeBtn.addEventListener('click', closeActionModal);
    takeMoneyBtn.addEventListener('click', takeMoney);
    giveMoneyBtn.addEventListener('click', giveMoney);
    addChildBtn.addEventListener('click', addChild);
    takeLoanBtn.addEventListener('click', takeLoan);
    setJobBtn.addEventListener('click', setJob);

    // Добавляем обработчики для мобильных устройств
    takeLoanBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        takeLoan();
    });
    setJobBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        setJob();
    });

    // Обработка кликов по карточкам
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Игнорируем клик, если он произошел на форме или её элементах
            if (e.target.closest('.action-form')) {
                return;
            }

            // Находим карточку, на которую кликнули (может быть дочерний элемент)
            const clickedCard = e.target.closest('.category-card');
            
            // Сначала деактивируем все карточки
            actionCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                    const form = c.querySelector('.action-form');
                    if (form) {
                        form.style.display = 'none';
                    }
                }
            });

            // Переключаем состояние текущей карточки
            const form = card.querySelector('.action-form');
            if (form) {
                const isActive = card.classList.toggle('active');
                form.style.display = isActive ? 'block' : 'none';
                
                if (isActive) {
                    // Принудительный reflow для корректного отображения формы
                    form.offsetHeight;
                    
                    // Инициализируем все поля ввода в форме
                    const inputs = form.querySelectorAll('input');
                    inputs.forEach(input => {
                        // Убеждаемся, что поля ввода видны
                        input.style.display = '';
                        input.style.visibility = 'visible';
                        input.style.opacity = '1';
                        
                        // Устанавливаем обработчики для обновления отображения
                        input.addEventListener('input', () => {
                            // Просто обновляем отображение без скрытия
                            input.style.display = '';
                            input.style.visibility = 'visible';
                            input.style.opacity = '1';
                        });
                    });
                }
            }
        });
    });

    // Предотвращаем закрытие модального окна при клике на его содержимое
    actionModal.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Закрываем модальное окно при клике вне его содержимого
    actionModal.addEventListener('click', function(e) {
        if (e.target === actionModal) {
            closeActionModal();
        }
    });

    // Добавляем обработчик для кнопки действия в основном интерфейсе
    const mainActionBtn = document.getElementById('main-action-btn');
    if (mainActionBtn) {
        mainActionBtn.addEventListener('click', openActionModal);
    } else {
        console.error('Не найдена кнопка main-action-btn');
    }

    // Автоматическая прокрутка при открытии клавиатуры
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    // Обработчик ввода суммы кредита
    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', function(e) {
            // Удаляем все нецифровые символы
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            // Ограничиваем длину до 10 цифр
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            // Обновляем значение поля
            e.target.value = value;
        });
    }

    // Добавляем обработку для всех полей ввода в модальном окне
    const modal = document.getElementById('action-modal');
    
    // Функция для принудительного обновления всех полей в модальном окне
    function forceUpdateInputs() {
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            // Принудительно обновляем отображение каждого поля
            input.style.display = 'none';
            input.offsetHeight; // Принудительный reflow
            input.style.display = '';
        });
    }

    // Добавляем обработчик на открытие модального окна
    const actionBtn = document.getElementById('main-action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', function() {
            modal.classList.add('active');
            // Обновляем отображение полей после открытия окна
            setTimeout(forceUpdateInputs, 100);
        });
    } else {
        console.error('Не найдена кнопка main-action-btn');
    }

    // Обработчик закрытия модального окна
    closeBtn.addEventListener('click', function() {
        closeActionModal();
    });

    // Закрытие по клику вне модального окна
    actionModal.addEventListener('click', function(e) {
        if (e.target === actionModal) {
            closeActionModal();
        }
    });
}); 