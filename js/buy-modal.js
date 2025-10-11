// Утилита debounce для оптимизации обработчиков событий
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Категории активов и их содержимое
const ASSET_CATEGORIES = {
    stocks: {
        title: 'Акции',
        items: [
            {
                id: 'myt4u',
                name: 'MYT4U',
                type: 'speculative',
                description: 'Спекулятивные акции без пассивного дохода'
            },
            {
                id: 'on2u',
                name: 'ON2U',
                type: 'speculative',
                description: 'Спекулятивные акции без пассивного дохода'
            },
            {
                id: 'ok4u',
                name: 'OK4U',
                type: 'speculative',
                description: 'Спекулятивные акции без пассивного дохода'
            },
            {
                id: 'gro4us',
                name: 'GRO4US',
                type: 'speculative',
                description: 'Спекулятивные акции без пассивного дохода'
            },
            {
                id: '2bigpower',
                name: '2BIGPOWER',
                type: 'dividend',
                pricePerShare: 1200,
                fixedPrice: true,
                dividendType: 'fixed',
                dividendValue: 10,
                description: 'Стабильные акции с фиксированным доходом $10 в месяц'
            },
            {
                id: 'cd',
                name: 'CD',
                type: 'dividend',
                pricePerShare: 4000,
                alternativePrice: 5000,
                dividendType: 'fixed',
                dividendValue: 20,
                description: 'Акции с фиксированным месячным доходом $20'
            }
        ]
    },
    realestate: {
        title: 'Недвижимость',
        items: [
            {
                id: 'house-2-1',
                name: '2/1',
                type: 'house',
                description: '2 спальни, 1 ванная'
            },
            {
                id: 'house-3-2',
                name: '3/2',
                type: 'house',
                description: '3 спальни, 2 ванные'
            },
            {
                id: 'plex-2',
                name: '2 плекс',
                type: 'multiplex',
                description: 'Дуплекс'
            },
            {
                id: 'plex-4',
                name: '4 плекс',
                type: 'multiplex',
                description: '4 квартиры'
            },
            {
                id: 'plex-8',
                name: '8 плекс',
                type: 'multiplex',
                description: '8 квартир'
            },
            {
                id: 'plex-16',
                name: '16 плекс',
                type: 'multiplex',
                description: '16 квартир'
            },
            {
                id: 'land',
                name: 'Земля',
                type: 'land',
                description: 'Земельный участок'
            },
            {
                id: 'apartment-building',
                name: 'Многоквартирный дом',
                type: 'apartment',
                description: 'Многоквартирный жилой дом'
            }
        ]
    },
    business: {
        title: 'Бизнес',
        items: []
    },
    preciousmetals: {
        title: 'Драгоценные металлы',
        items: [
            {
                id: 'krugerrand',
                name: 'Золотой Крюгерранд',
                type: 'gold',
                description: 'Южноафриканская золотая монета'
            },
            {
                id: 'rare-coin',
                name: 'Редкая золотая монета 16 века',
                type: 'collectible',
                description: 'Историческая золотая монета'
            }
        ]
    },
    misc: {
        title: 'Всякая всячина',
        items: []
    }
};

// Инициализация модального окна покупки
(function() {
    // Используем DOMCache для оптимизации
    const modal = window.$id('buy-modal') || document.getElementById('buy-modal');
    const buyBtn = window.$id('main-buy-btn') || document.getElementById('main-buy-btn');
    const closeBtn = modal.querySelector('.close-btn');
    const categoryCards = modal.querySelectorAll('.category-card');

    // Обработчик выбора категории
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showCategoryItems(category);
        });
    });

    // Создание формы покупки акций с выпадающим списком
    function createStockTypeSelector() {
        return `
            <div class="stock-purchase-form">
                <h3>Покупка акций</h3>
                
                <div class="input-group">
                    <label>Выберите акцию:</label>
                    <select class="stock-selector">
                        <option value="">-- Выберите акцию --</option>
                        <optgroup label="📈 Спекулятивные">
                            <option value="myt4u">MYT4U - Без дохода</option>
                            <option value="on2u">ON2U - Без дохода</option>
                            <option value="ok4u">OK4U - Без дохода</option>
                            <option value="gro4us">GRO4US - Без дохода</option>
                        </optgroup>
                        <optgroup label="💰 Дивидендные">
                            <option value="2bigpower">2BIGPOWER - $10/мес</option>
                            <option value="cd">CD - $20/мес</option>
                        </optgroup>
                    </select>
                    </div>
                
                <div id="stock-details" style="display: none;">
                    <!-- Детали выбранной акции будут загружены здесь -->
                    </div>
                
                <button class="back-button">Назад</button>
            </div>
        `;
    }

    // Создание формы покупки недвижимости с выпадающим списком
    function createRealEstateTypeSelector() {
        return `
            <div class="realestate-purchase-form">
                <h3>Покупка недвижимости</h3>
                
                <div class="input-group">
                    <label>Выберите тип недвижимости:</label>
                    <select class="realestate-selector">
                        <option value="">-- Выберите недвижимость --</option>
                        <optgroup label="🏠 Дома">
                            <option value="house-2-1">2/1 (2 спальни, 1 ванная)</option>
                            <option value="house-3-2">3/2 (3 спальни, 2 ванные)</option>
                        </optgroup>
                        <optgroup label="🏢 Многоквартирные">
                            <option value="plex-2">2 плекс (Дуплекс)</option>
                            <option value="plex-4">4 плекс</option>
                            <option value="plex-8">8 плекс</option>
                            <option value="plex-16">16 плекс</option>
                            <option value="apartment-building">Многоквартирный дом</option>
                        </optgroup>
                        <optgroup label="🌱 Земля">
                            <option value="land">Земельный участок</option>
                        </optgroup>
                    </select>
                    </div>
                
                <div id="realestate-details" style="display: none;">
                    <!-- Детали выбранной недвижимости будут загружены здесь -->
                    </div>
                
                <button class="back-button">Назад</button>
            </div>
        `;
    }

    // Создание списка типов драгоценных металлов
    function createPreciousMetalsTypeSelector() {
        return `
            <div class="precious-metals-type-selector">
                <h3>Выберите тип драгоценного металла:</h3>
                <div class="type-list">
                    <div class="type-group">
                        <h4>Инвестиционные монеты</h4>
                        <button class="type-btn" data-type="krugerrand">Золотой Крюгерранд - Инвестиционная монета</button>
                    </div>
                    <div class="type-group">
                        <h4>Коллекционные монеты</h4>
                        <button class="type-btn" data-type="rare-coin">Редкая золотая монета 16 века</button>
                    </div>
                </div>
                <button class="back-button">Назад</button>
            </div>
        `;
    }

    // Показ формы для конкретного типа акций
    function showStockForm(item) {
        const content = modal.querySelector('.asset-categories');
        content.innerHTML = `
            <div class="assets-list">
                ${createAssetCard(item, 'stocks')}
            </div>
            <div class="buy-controls">
                <div class="wallet-info">В кошельке: <span id="modal-wallet-amount">${window.cash || 0}</span></div>
                <button class="back-button">Назад к типам акций</button>
            </div>
        `;

        // Добавляем обработчик для кнопки "Назад"
        content.querySelector('.back-button').addEventListener('click', () => {
            showCategoryItems('stocks');
        });

        // Инициализируем обработчики для полей акций
        initializeStockInputs();
    }

    // Показ формы для создания бизнеса
    function showBusinessForm() {
        const content = modal.querySelector('.asset-categories');
        content.innerHTML = `
            <div class="assets-list">
                <div class="asset-card">
                    <h3>Новый бизнес</h3>
                    <div class="asset-info">
                        <div class="business-inputs">
                            <div class="input-group">
                                <label>Выберите тип бизнеса:</label>
                                <select class="business-name">
                                    <option value="">-- Выберите бизнес --</option>
                                    <option value="Автодиллер">Автодиллер</option>
                                    <option value="Сеть пиццерий">Сеть пиццерий</option>
                                    <option value="Автомойка">Автомойка</option>
                                    <option value="Автомойка BIG">Автомойка BIG</option>
                                    <option value="Прачечная">Прачечная</option>
                                    <option value="Франшиза пиццерий">Франшиза пиццерий</option>
                                    <option value="Сеть телефонов-автоматов">Сеть телефонов-автоматов</option>
                                    <option value="30 Видеоавтоматов">30 Видеоавтоматов</option>
                                    <option value="Сеть бутербродных">Сеть бутербродных</option>
                                    <option value="Партнер в клинике">Партнер в клинике</option>
                                    <option value="custom">Другой (свободная форма)</option>
                                </select>
                            </div>
                            <div class="input-group custom-business-name" style="display: none;">
                                <label>Название бизнеса:</label>
                                <input type="text" class="custom-business-input" placeholder="Введите название вашего бизнеса">
                            </div>
                            <div class="input-group">
                                <label>Цена ($):</label>
                                <input type="number" class="business-price" min="0" step="1000" placeholder="Полная стоимость">
                            </div>
                            <div class="input-group">
                                <label>Первый взнос ($):</label>
                                <input type="number" class="business-down-payment" min="0" step="1000" placeholder="Сумма первого взноса">
                            </div>
                            <div class="input-group">
                                <label>Пассив ($):</label>
                                <div class="calculated-liability" style="padding: 8px; background: #f5f5f5; border-radius: 4px; font-weight: bold; color: #666;">
                                    Рассчитается автоматически
                                </div>
                            </div>
                            <div class="input-group">
                                <label>Денежный поток ($):</label>
                                <input type="number" class="business-cashflow" step="100" placeholder="Ежемесячный доход">
                            </div>
                            <button class="buy-business-btn">Купить бизнес</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="buy-controls">
                <div class="wallet-info">В кошельке: <span id="modal-wallet-amount">${window.cash || 0}</span></div>
                <button class="back-button">Назад</button>
            </div>
        `;

        // Добавляем обработчики для полей
        const form = content.querySelector('.business-inputs');
        const priceInput = form.querySelector('.business-price');
        const downPaymentInput = form.querySelector('.business-down-payment');
        const cashflowInput = form.querySelector('.business-cashflow');
        const buyButton = form.querySelector('.buy-business-btn');
        const nameInput = form.querySelector('.business-name');
        const customNameInput = form.querySelector('.custom-business-input');
        const customNameGroup = form.querySelector('.custom-business-name');

        // Данные для каждого типа бизнеса (цена и доход)
        const businessData = {
            'Автодиллер': { price: 30000, income: 1000 },
            'Сеть пиццерий': { price: 20000, income: 800 },
            'Автомойка': { price: 125000, income: 1800 },
            'Автомойка BIG': { price: 350000, income: 1500 },
            'Прачечная': { price: 150000, income: 2500 },
            'Франшиза пиццерий': { price: 500000, income: 5000 },
            'Сеть телефонов-автоматов': { price: 200000, income: 2700 },
            '30 Видеоавтоматов': { price: 100000, income: 1600 },
            'Сеть бутербродных': { price: 30000, income: 1500 },
            'Партнер в клинике': { price: 25000, income: 1000 }
        };

        // Функция для автоматического заполнения полей при выборе бизнеса
        function fillBusinessData() {
            const selectedBusiness = nameInput.value;
            if (selectedBusiness && businessData[selectedBusiness]) {
                const data = businessData[selectedBusiness];
                priceInput.value = data.price;
                cashflowInput.value = data.income;
                
                // Обновляем отображение пассива после изменения цены
                updateLiabilityDisplay();
            }
        }

        // Функция для обновления отображения пассива
        function updateLiabilityDisplay() {
            const price = parseFloat(priceInput.value) || 0;
            const downPayment = parseFloat(downPaymentInput.value) || 0;
            const liability = Math.max(0, price - downPayment);
            
            const liabilityDisplay = form.querySelector('.calculated-liability');
            if (liabilityDisplay) {
                liabilityDisplay.textContent = `$${liability.toFixed(0)}`;
                liabilityDisplay.style.color = liability > 0 ? '#d32f2f' : '#666';
            }
        }

        // Создаём debounced версию для оптимизации (200мс)
        const debouncedUpdateLiability = debounce(updateLiabilityDisplay, 200);

        // Добавляем обработчики для автообновления пассива
        priceInput.addEventListener('input', debouncedUpdateLiability);
        downPaymentInput.addEventListener('input', debouncedUpdateLiability);

        // Добавляем обработчик для автоматического заполнения при выборе бизнеса
        nameInput.addEventListener('change', fillBusinessData);
        
        // Добавляем обработчик для показа/скрытия поля ввода собственного названия
        nameInput.addEventListener('change', function() {
            if (this.value === 'custom') {
                customNameGroup.style.display = 'block';
                customNameInput.focus();
            } else {
                customNameGroup.style.display = 'none';
                customNameInput.value = '';
            }
        });

        // Обработчик покупки бизнеса
        buyButton.addEventListener('click', handleBusinessPurchase);
        buyButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.opacity = '0.7';
        });
        buyButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.opacity = '1';
            handleBusinessPurchase();
        });

        function handleBusinessPurchase() {
            let name = nameInput.value;
            const price = parseFloat(priceInput.value) || 0;
            const downPayment = parseFloat(downPaymentInput.value) || 0;
            const liability = Math.max(0, price - downPayment); // Автоматически рассчитываем пассив
            const cashflow = parseFloat(cashflowInput.value) || 0;

            // Если выбрана свободная форма, используем введенное название
            if (name === 'custom') {
                name = customNameInput.value.trim();
                if (!name) {
                    alert('Введите название вашего бизнеса!');
                    return;
                }
            }

            // Валидация
            if (!name) {
                alert('Выберите тип бизнеса!');
                return;
            }
            if (price < 0) {
                alert('Цена не может быть отрицательной!');
                return;
            }
            if (downPayment < 0) {
                alert('Первый взнос не может быть отрицательным!');
                return;
            }
            if (downPayment > price) {
                alert('Первый взнос не может быть больше цены бизнеса!');
                return;
            }
            if (downPayment > window.cash) {
                alert('Недостаточно средств для первого взноса!');
                return;
            }

            // Убираем подтверждение для быстрого UX

            // Списываем деньги
            if (downPayment > 0) {
                window.cash -= downPayment;
            }

            // Добавляем бизнес в активы
            if (!window.data.asset) window.data.asset = [];
            const businessId = `business-${Date.now()}`;
            window.data.asset.push({
                id: businessId,
                name: name,
                type: 'business',
                value: price,
                isTransferred: price === 0
            });

            // Добавляем пассив если есть
            if (liability > 0) {
                if (!window.data.liability) window.data.liability = [];
                window.data.liability.push({
                    id: `business-debt-${Date.now()}`,
                    name: `Пассив: ${name}`,
                    type: 'business',
                    value: liability,
                    source: businessId  // Используем тот же ID актива
                });
            }

            // Добавляем денежный поток
            if (cashflow > 0) {
                if (!window.data.income) window.data.income = [];
                window.data.income.push({
                    id: `business-income-${Date.now()}`,
                    name: `Денежный поток: ${name}`,
                    type: 'passive',
                    value: cashflow,
                    source: name
                });
            }

            // Добавляем запись в историю
            if (!window.data.history) window.data.history = [];
            window.data.history.push({
                type: 'buy',
                assetName: name,
                amount: downPayment,
                date: new Date().toISOString()
            });

            // Обновляем отображение (батчинг для производительности)
            if (window.scheduleFullUpdate) {
                window.scheduleFullUpdate();
            } else {
                // Fallback для старых версий
                window.renderCash();
                window.renderAll();
                window.renderLiability();
                window.renderIncome();
                window.renderSummary();
                window.renderHistory();
            }
            autoSave();

            // Закрываем модальное окно
            modal.classList.remove('active');
        }

        // Добавляем обработчик для кнопки "Назад"
        content.querySelector('.back-button').addEventListener('click', showCategories);
    }

    // Показ формы для конкретного типа драгоценного металла
    function showPreciousMetalForm(item) {
        const content = modal.querySelector('.asset-categories');
        
        // Определяем фиксированную цену в зависимости от типа металла
        let fixedPrice = 0;
        let priceButtons = '';
        
        if (item.id === 'krugerrand') {
            fixedPrice = 3000;
            priceButtons = `
                <button class="quick-price-btn" data-price="3000">$3000</button>
            `;
        } else if (item.id === 'rare-coin') {
            fixedPrice = 500;
            priceButtons = `
                <button class="quick-price-btn" data-price="500">$500</button>
            `;
        }
        
        content.innerHTML = `
            <div class="assets-list">
                <div class="asset-card">
                    <h3>${item.name}</h3>
                    <div class="asset-info">
                        <div class="precious-metal-inputs">
                            <div class="input-group">
                                <label>Цена ($):</label>
                                <div class="quick-price-buttons">
                                    ${priceButtons}
                            </div>
                                <div class="custom-price-input">
                                    <input type="number" class="metal-price" min="0" step="100" value="" inputmode="numeric" pattern="[0-9]*" placeholder="Введите цену (можно $0)">
                                </div>
                            </div>
                            <button class="buy-metal-btn">Купить</button>
                        </div>
                        <div class="asset-description">${item.description}</div>
                    </div>
                </div>
            </div>
            <div class="buy-controls">
                <div class="wallet-info">В кошельке: <span id="modal-wallet-amount">${window.cash || 0}</span></div>
                <button class="back-button">Назад к типам металлов</button>
            </div>
        `;

        // Добавляем обработчики
        const form = content.querySelector('.precious-metal-inputs');
        const priceInput = form.querySelector('.metal-price');
        const buyButton = form.querySelector('.buy-metal-btn');

        // Обработчики для быстрых кнопок цен
        const quickPriceButtons = form.querySelectorAll('.quick-price-btn');
        quickPriceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const price = parseFloat(btn.dataset.price);
                
                // Убираем активный класс у всех кнопок
                quickPriceButtons.forEach(b => b.classList.remove('active'));
                // Добавляем активный класс к нажатой кнопке
                btn.classList.add('active');
                
                // Устанавливаем цену в поле ввода
                priceInput.value = price;
                priceInput.dispatchEvent(new Event('input'));
            });
        });

        // Обработчик покупки
        buyButton.addEventListener('click', () => {
            const price = parseFloat(priceInput.value) || 0;

            // Валидация
            if (price < 0) {
                alert('Цена не может быть отрицательной!');
                return;
            }
            if (price > window.cash) {
                alert('Недостаточно средств для покупки!');
                return;
            }

            // Списываем деньги
            window.cash -= price;

            // Добавляем в активы
            if (!window.data.asset) window.data.asset = [];
            window.data.asset.push({
                id: `${item.name}-${Date.now()}`,
                name: item.name,
                type: 'preciousmetals',
                value: price,
                isTransferred: price === 0
            });

            // Добавляем запись в историю
            if (!window.data.history) window.data.history = [];
            window.data.history.push({
                type: 'buy',
                assetName: item.name,
                amount: price,
                date: new Date().toISOString()
            });

            // Обновляем отображение
            window.renderCash();
            window.renderAll();
            window.renderSummary();
            window.renderHistory();
            autoSave();

            // Закрываем модальное окно
            modal.classList.remove('active');
        });

        // Добавляем обработчик для кнопки "Назад"
        content.querySelector('.back-button').addEventListener('click', () => {
            showCategoryItems('preciousmetals');
        });
    }

    // Показ формы для всякой всячины
    function showMiscForm() {
        const content = modal.querySelector('.asset-categories');
        content.innerHTML = `
            <div class="assets-list">
                <div class="asset-card misc-card">
                    <h3>Новая покупка</h3>
                    <div class="asset-info">
                        <div class="misc-inputs">
                            <div class="input-group">
                                <label>Название:</label>
                                <input type="text" class="misc-name" placeholder="Название покупки">
                            </div>
                            <div class="input-group">
                                <label>Цена ($):</label>
                                <input type="number" class="misc-price" min="0" step="10" inputmode="numeric" pattern="[0-9]*">
                            </div>
                            <div class="input-group">
                                <label>Первый взнос ($):</label>
                                <input type="number" class="misc-down-payment" min="0" step="10" inputmode="numeric" pattern="[0-9]*">
                            </div>
                            <div class="input-group">
                                <label>Ежемесячный расход ($):</label>
                                <input type="number" class="misc-expense" min="0" step="10" inputmode="numeric" pattern="[0-9]*">
                            </div>
                            <button class="buy-misc-btn">Купить</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="buy-controls">
                <div class="wallet-info">В кошельке: <span id="modal-wallet-amount">${window.cash || 0}</span></div>
                <button class="back-button">Назад</button>
            </div>
        `;

        // Добавляем обработчики
        const form = content.querySelector('.misc-inputs');
        const nameInput = form.querySelector('.misc-name');
        const priceInput = form.querySelector('.misc-price');
        const downPaymentInput = form.querySelector('.misc-down-payment');
        const expenseInput = form.querySelector('.misc-expense');
        const buyButton = form.querySelector('.buy-misc-btn');

        // Обработчик покупки
        const handleMiscPurchase = () => {
            const name = nameInput.value.trim();
            const price = parseFloat(priceInput.value) || 0;
            const downPayment = parseFloat(downPaymentInput.value) || 0;
            const expense = parseFloat(expenseInput.value) || 0;

            // Валидация
            if (!name) {
                alert('Введите название!');
                return;
            }
            if (price < 0) {
                alert('Цена не может быть отрицательной!');
                return;
            }
            if (downPayment < 0) {
                alert('Первый взнос не может быть отрицательным!');
                return;
            }
            if (downPayment > price) {
                alert('Первый взнос не может быть больше цены!');
                return;
            }
            if (expense < 0) {
                alert('Расход не может быть отрицательным!');
                return;
            }
            if (downPayment > 0 && downPayment > window.cash) {
                alert('Недостаточно средств для первого взноса!');
                return;
            }

            // Убираем подтверждение для быстрого UX

            // Списываем деньги если есть первый взнос
            if (downPayment > 0) {
                window.cash -= downPayment;
            }

            // НЕ добавляем в активы - только в пассивы и расходы

            // Если есть остаток после первого взноса, добавляем в пассивы
            const remainingDebt = price - downPayment;
            if (remainingDebt > 0) {
                if (!window.data.liability) window.data.liability = [];
                window.data.liability.push({
                    id: `misc-debt-${Date.now()}`,
                    name: `Долг: ${name}`,
                    type: 'misc',
                    value: remainingDebt
                });
            }

            // Если есть ежемесячный расход, добавляем в расходы
            if (expense > 0) {
                if (!window.data.expense) window.data.expense = [];
                window.data.expense.push({
                    id: `misc-expense-${Date.now()}`,
                    name: `Обслуживание: ${name}`,
                    type: 'misc',
                    value: expense
                });
            }

            // Добавляем запись в историю
            if (!window.data.history) window.data.history = [];
            window.data.history.push({
                type: 'buy',
                assetName: name,
                amount: downPayment,
                date: new Date().toISOString()
            });

            // Обновляем отображение (НЕ обновляем активы)
            window.renderCash();
            window.renderLiability();
            window.renderExpense();
            window.renderSummary();
            window.renderHistory();
            autoSave();

            // Закрываем модальное окно
            modal.classList.remove('active');
        };

        // Добавляем обработчики для клика и touch-событий
        buyButton.addEventListener('click', handleMiscPurchase);
        buyButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.opacity = '0.7';
        });
        buyButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.opacity = '1';
            handleMiscPurchase();
        });

        // Добавляем обработчик для кнопки "Назад"
        content.querySelector('.back-button').addEventListener('click', showCategories);
    }

    // Показ категорий активов
    function showCategoryItems(category) {
        const categoryData = ASSET_CATEGORIES[category];
        if (!categoryData) return;

        // Обновляем заголовок
        modal.querySelector('h2').textContent = categoryData.title;

        // Заменяем содержимое модального окна
        const content = modal.querySelector('.asset-categories');

        if (category === 'realestate') {
            // Показываем форму покупки недвижимости с выпадающим списком
            content.innerHTML = createRealEstateTypeSelector();

            // Добавляем обработчик для выпадающего списка недвижимости
            const realestateSelector = content.querySelector('.realestate-selector');
            const realestateDetails = content.querySelector('#realestate-details');
            
            // Добавляем мобильно-оптимизированный обработчик изменений
            realestateSelector.addEventListener('change', () => {
                const selectedRealestateId = realestateSelector.value;
                
                if (selectedRealestateId) {
                    const item = categoryData.items.find(i => i.id === selectedRealestateId);
                    if (item) {
                        // Показываем форму покупки недвижимости прямо в этом же модальном окне
                        showRealEstateForm(item, realestateDetails);
                        realestateDetails.style.display = 'block';
                        
                        // Плавная прокрутка к деталям на мобильных
                        if (window.innerWidth <= 480) {
                            setTimeout(() => {
                                realestateDetails.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start' 
                                });
                            }, 100);
                        }
                    }
                } else {
                    realestateDetails.style.display = 'none';
                }
            });
            
            // Улучшения для мобильных: добавляем активную обратную связь
            realestateSelector.addEventListener('focus', () => {
                if (window.innerWidth <= 480) {
                    realestateSelector.style.borderColor = '#4CAF50';
                    realestateSelector.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.4)';
                }
            });
            
            realestateSelector.addEventListener('blur', () => {
                if (window.innerWidth <= 480) {
                    realestateSelector.style.borderColor = '#ddd';
                    realestateSelector.style.boxShadow = 'none';
                }
            });
        } else if (category === 'stocks') {
            // Показываем форму покупки акций с выпадающим списком
            content.innerHTML = createStockTypeSelector();

            // Добавляем обработчик для выпадающего списка акций
            const stockSelector = content.querySelector('.stock-selector');
            const stockDetails = content.querySelector('#stock-details');
            
            // Добавляем мобильно-оптимизированный обработчик изменений
            stockSelector.addEventListener('change', () => {
                const selectedStockId = stockSelector.value;
                
                if (selectedStockId) {
                    const item = categoryData.items.find(i => i.id === selectedStockId);
                    if (item) {
                        // Показываем детали выбранной акции прямо в этом же модальном окне
                        const assetCard = createAssetCard(item, category);
                        stockDetails.innerHTML = `
                            <div data-item-id="${item.id}">
                                ${assetCard}
                            </div>
                        `;
                        stockDetails.style.display = 'block';
                        
                        // Плавная прокрутка к деталям на мобильных
                        if (window.innerWidth <= 480) {
                            setTimeout(() => {
                                stockDetails.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start' 
                                });
                            }, 100);
                        }
                        
                        // Инициализируем обработчики для кнопок и полей ввода
                        initializeStockInputs();
                    }
                } else {
                    stockDetails.style.display = 'none';
                }
            });
            
            // Улучшения для мобильных: добавляем активную обратную связь
            stockSelector.addEventListener('focus', () => {
                if (window.innerWidth <= 480) {
                    stockSelector.style.borderColor = '#4CAF50';
                    stockSelector.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.4)';
                }
            });
            
            stockSelector.addEventListener('blur', () => {
                if (window.innerWidth <= 480) {
                    stockSelector.style.borderColor = '#ddd';
                    stockSelector.style.boxShadow = 'none';
                }
            });
        } else if (category === 'business') {
            // Показываем форму создания бизнеса
            showBusinessForm();
        } else if (category === 'preciousmetals') {
            // Показываем селектор типов драгоценных металлов
            content.innerHTML = createPreciousMetalsTypeSelector();

            // Добавляем обработчики для кнопок выбора типа
            content.querySelectorAll('.type-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const typeId = btn.dataset.type;
                    const item = categoryData.items.find(i => i.id === typeId);
                    if (item) {
                        showPreciousMetalForm(item);
                    }
                });
            });
        } else if (category === 'misc') {
            showMiscForm();
        } else {
            content.innerHTML = `
                <div class="assets-list">
                    ${categoryData.items.map(item => createAssetCard(item, category)).join('')}
                </div>
                <div class="buy-controls">
                    <div class="wallet-info">В кошельке: <span id="modal-wallet-amount">${window.cash || 0}</span></div>
                    <button class="back-button">Назад</button>
                </div>
            `;
        }

        // Добавляем обработчик для кнопки "Назад"
        content.querySelector('.back-button').addEventListener('click', showCategories);
    }

    // Показ формы для конкретного типа недвижимости
    function showRealEstateForm(item, targetContainer = null) {
        const content = targetContainer || modal.querySelector('.asset-categories');
        
        if (targetContainer) {
            // Если используется контейнер деталей, показываем только форму
            content.innerHTML = `
                <div class="assets-list">
                    ${createAssetCard(item, 'realestate')}
                </div>
                <div class="wallet-info">В кошельке: <span id="modal-wallet-amount">${window.cash || 0}</span></div>
            `;
        } else {
            // Оригинальное поведение для обратной совместимости
        content.innerHTML = `
            <div class="assets-list">
                ${createAssetCard(item, 'realestate')}
            </div>
            <div class="buy-controls">
                <div class="wallet-info">В кошельке: <span id="modal-wallet-amount">${window.cash || 0}</span></div>
                <button class="back-button">Назад к типам недвижимости</button>
            </div>
        `;

        // Добавляем обработчик для кнопки "Назад"
        content.querySelector('.back-button').addEventListener('click', () => {
            showCategoryItems('realestate');
        });
        }

        // Инициализируем обработчики для полей недвижимости
        initializePropertyInputs();
    }

    // Создание карточки актива в зависимости от категории
    function createAssetCard(item, category) {
        let details = '';
        switch(category) {
            case 'stocks':
                if (item.type === 'speculative') {
                    // Определяем цены для разных акций
                    let priceButtons = '';
                    if (item.id === 'gro4us') {
                        // Для GRO4US - без цен $1, $4, $5 и $50
                        priceButtons = `
                            <button class="quick-price-btn" data-price="10">$10</button>
                            <button class="quick-price-btn" data-price="20">$20</button>
                            <button class="quick-price-btn" data-price="30">$30</button>
                            <button class="quick-price-btn" data-price="40">$40</button>
                        `;
                    } else if (item.id === 'on2u') {
                        // Для ON2U - без цен $1, $4 и $50
                        priceButtons = `
                            <button class="quick-price-btn" data-price="5">$5</button>
                            <button class="quick-price-btn" data-price="10">$10</button>
                            <button class="quick-price-btn" data-price="20">$20</button>
                            <button class="quick-price-btn" data-price="30">$30</button>
                            <button class="quick-price-btn" data-price="40">$40</button>
                        `;
                    } else if (item.id === 'myt4u') {
                        // Для MYT4U - без цены $50
                        priceButtons = `
                            <button class="quick-price-btn" data-price="1">$1</button>
                            <button class="quick-price-btn" data-price="4">$4</button>
                            <button class="quick-price-btn" data-price="5">$5</button>
                            <button class="quick-price-btn" data-price="10">$10</button>
                            <button class="quick-price-btn" data-price="20">$20</button>
                            <button class="quick-price-btn" data-price="30">$30</button>
                            <button class="quick-price-btn" data-price="40">$40</button>
                        `;
                    } else {
                        // Для OK4U - все цены (включая $50)
                        priceButtons = `
                            <button class="quick-price-btn" data-price="1">$1</button>
                            <button class="quick-price-btn" data-price="4">$4</button>
                            <button class="quick-price-btn" data-price="5">$5</button>
                            <button class="quick-price-btn" data-price="10">$10</button>
                            <button class="quick-price-btn" data-price="20">$20</button>
                            <button class="quick-price-btn" data-price="30">$30</button>
                            <button class="quick-price-btn" data-price="40">$40</button>
                            <button class="quick-price-btn" data-price="50">$50</button>
                        `;
                    }
                    
                    details = `
                        <div class="asset-info">
                            <div class="stock-inputs">
                                <div class="input-group">
                                    <label>Цена за акцию ($):</label>
                                    <div class="quick-price-buttons">
                                        ${priceButtons}
                                    </div>
                                    <div class="custom-price-input">
                                        <input type="number" class="price-per-share" min="0" step="1" inputmode="numeric" pattern="[0-9]*" placeholder="Или введите свою цену">
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>Количество акций:</label>
                                    <input type="number" class="shares-amount" min="1" step="1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="purchase-result" style="display: none;">
                                    Купить <span class="result-shares">0</span> акций ${item.name} по $<span class="result-price">0</span> за $<span class="result-total">0</span>
                                </div>
                                <button class="buy-stock-btn">КУПИТЬ</button>
                            </div>
                        </div>
                    `;
                } else if (item.type === 'dividend') {
                    // Для 2BIGPOWER и CD разрешаем ручной ввод цены
                    const allowCustomPrice = ['2bigpower', 'cd'].includes(item.id);
                    let priceInputHtml = '';
                    if (allowCustomPrice) {
                        priceInputHtml = `
                            <input type=\"number\" class=\"price-per-share\" min=\"0\" step=\"1\" value=\"${item.pricePerShare}\">\n                        `;
                    } else if (item.alternativePrice) {
                        priceInputHtml = `<select class=\"price-select\">\n                            <option value=\"${item.pricePerShare}\">$${item.pricePerShare}</option>\n                            <option value=\"${item.alternativePrice}\">$${item.alternativePrice}</option>\n                        </select>`;
                    } else {
                        priceInputHtml = `<span>$${item.pricePerShare}</span>`;
                    }

                    const dividendInfo = item.dividendType === 'percent'
                        ? `${item.dividendValue}% годовых`
                        : `$${item.dividendValue} в месяц`;

                    details = `
                        <div class=\"asset-info\">\n                            <div class=\"stock-inputs dividend\">\n                                <div class=\"price-info\">\n                                    <label>Цена за акцию:</label>\n                                    ${priceInputHtml}\n                                </div>\n                                <div class=\"dividend-info\">\n                                    <label>Денежный поток:</label>\n                                    <span>${dividendInfo}</span>\n                                </div>\n                                <div class=\"input-group\">\n                                    <label>Количество акций:</label>\n                                    <input type=\"number\" class=\"shares-amount\" min=\"1\" step=\"1\">\n                                </div>\n                                <div class=\"total-price\">Общая стоимость: $<span>0</span></div>\n                                <div class=\"total-dividend\">Доход: <span>$0</span> в месяц</div>\n                                <button class=\"buy-stock-btn\">Купить</button>\n                            </div>\n                        </div>\n                    `;
                }
                break;
            case 'realestate':
                if (item.type === 'land') {
                    details = `
                        <div class="asset-info">
                            <div class="property-inputs">
                                <div class="input-group">
                                    <label>Количество акров:</label>
                                    <input type="number" class="property-acres" step="0.1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="input-group">
                                    <label>Цена ($):</label>
                                    <input type="number" class="property-price" step="1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="input-group">
                                    <label>Первый взнос ($):</label>
                                    <input type="number" class="property-down-payment" step="1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="input-group">
                                    <label>Ипотека ($):</label>
                                    <div class="calculated-mortgage" style="padding: 8px; background: #f5f5f5; border-radius: 4px; font-weight: bold; color: #666;">
                                        Рассчитается автоматически
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>Денежный поток ($):</label>
                                    <div style="display: flex; gap: 5px; align-items: center;">
                                        <button class="toggle-sign-btn" style="padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 4px;">+/-</button>
                                        <input type="number" class="property-cashflow" step="1" inputmode="numeric">
                                    </div>
                                </div>
                                <button class="buy-property-btn">Купить</button>
                            </div>
                            <div class="asset-description">${item.description}</div>
                        </div>
                    `;
                } else if (item.type === 'apartment') {
                    details = `
                        <div class="asset-info">
                            <div class="property-inputs">
                                <div class="input-group">
                                    <label>Цена ($):</label>
                                    <input type="number" class="property-price" step="1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="input-group">
                                    <label>Первый взнос ($):</label>
                                    <input type="number" class="property-down-payment" step="1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="input-group">
                                    <label>Ипотека ($):</label>
                                    <div class="calculated-mortgage" style="padding: 8px; background: #f5f5f5; border-radius: 4px; font-weight: bold; color: #666;">
                                        Рассчитается автоматически
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>Денежный поток ($):</label>
                                    <div style="display: flex; gap: 5px; align-items: center;">
                                        <button class="toggle-sign-btn" style="padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 4px;">+/-</button>
                                        <input type="number" class="property-cashflow" step="1" inputmode="numeric">
                                    </div>
                                </div>
                                <button class="buy-property-btn">Купить</button>
                            </div>
                            <div class="asset-description">${item.description}</div>
                        </div>
                    `;
                } else {
                    details = `
                        <div class="asset-info">
                            <div class="property-inputs">
                                <div class="input-group">
                                    <label>Цена ($):</label>
                                    <input type="number" class="property-price" step="1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="input-group">
                                    <label>Первый взнос ($):</label>
                                    <input type="number" class="property-down-payment" step="1" inputmode="numeric" pattern="[0-9]*">
                                </div>
                                <div class="input-group">
                                    <label>Ипотека ($):</label>
                                    <div class="calculated-mortgage" style="padding: 8px; background: #f5f5f5; border-radius: 4px; font-weight: bold; color: #666;">
                                        Рассчитается автоматически
                                    </div>
                                </div>
                                <div class="input-group">
                                    <label>Денежный поток ($):</label>
                                    <div style="display: flex; gap: 5px; align-items: center;">
                                        <button class="toggle-sign-btn" style="padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 4px;">+/-</button>
                                        <input type="number" class="property-cashflow" step="1" inputmode="numeric">
                                    </div>
                                </div>
                                <button class="buy-property-btn">Купить</button>
                            </div>
                            <div class="asset-description">${item.description}</div>
                        </div>
                    `;
                }
                break;
            case 'business':
                details = `
                    <div class="asset-price">Стоимость: ${item.price}</div>
                    <div class="asset-income">Доход в месяц: +${item.monthlyIncome}</div>
                `;
                break;
        }

        const cardTypeClass = item.type === 'dividend' ? 'dividend' : 'speculative';
        
        return `
            <div class="asset-card" data-item-id="${item.id}" data-type="${item.type || ''}">
                <h3>${item.name}</h3>
                <div class="asset-info">
                    ${details}
                </div>
            </div>
        `;
    }

    // Добавляем обработчики для ввода цены акций
    function initializeStockInputs() {
        const stockInputs = document.querySelectorAll('.stock-inputs');
        
        stockInputs.forEach(inputGroup => {
            const priceInput = inputGroup.querySelector('.price-per-share');
            const priceSelect = inputGroup.querySelector('.price-select');
            const sharesInput = inputGroup.querySelector('.shares-amount');
            const totalSpan = inputGroup.querySelector('.total-price span');
            const dividendSpan = inputGroup.querySelector('.total-dividend span');
            const buyButton = inputGroup.querySelector('.buy-stock-btn');
            const purchaseResult = inputGroup.querySelector('.purchase-result');
            const resultShares = inputGroup.querySelector('.result-shares');
            const resultPrice = inputGroup.querySelector('.result-price');
            const resultTotal = inputGroup.querySelector('.result-total');
            
            // Быстрые кнопки цен
            const quickPriceButtons = inputGroup.querySelectorAll('.quick-price-btn');
            quickPriceButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const price = parseFloat(btn.dataset.price);
                    
                    // Убираем активный класс у всех кнопок
                    quickPriceButtons.forEach(b => b.classList.remove('active'));
                    // Добавляем активный класс к нажатой кнопке
                    btn.classList.add('active');
                    
                    // Устанавливаем цену в поле ввода
                    if (priceInput) {
                        priceInput.value = price;
                        priceInput.dispatchEvent(new Event('input'));
                    }
                });
            });
            
            function updateTotal() {
                const price = priceSelect 
                    ? parseFloat(priceSelect.value) 
                    : (priceInput ? parseFloat(priceInput.value) : 0);
                const shares = parseInt(sharesInput.value) || 0;
                const total = price * shares;
                
                if (totalSpan) totalSpan.textContent = total.toFixed(0);

                // Обновляем результат покупки для спекулятивных акций
                if (purchaseResult && resultShares && resultPrice && resultTotal) {
                    if (price > 0 && shares > 0) {
                        resultShares.textContent = shares;
                        resultPrice.textContent = price.toFixed(1);
                        resultTotal.textContent = total.toFixed(0);
                        purchaseResult.style.display = 'block';
                    } else {
                        purchaseResult.style.display = 'none';
                    }
                }

                // Расчет дивидендов если это акции с пассивным доходом
                if (dividendSpan) {
                    const card = inputGroup.closest('.asset-card');
                    const itemId = card.dataset.itemId;
                    const item = ASSET_CATEGORIES.stocks.items.find(i => i.id === itemId);
                    
                    if (item && item.type === 'dividend') {
                        let monthlyIncome = 0;
                        if (item.dividendType === 'fixed') {
                            monthlyIncome = shares * item.dividendValue;
                        } else if (item.dividendType === 'percent') {
                            // Конвертируем годовой процент в месячный доход
                            monthlyIncome = (shares * price * (item.dividendValue / 100)) / 12;
                        }
                        dividendSpan.textContent = monthlyIncome.toFixed(0);
                    }
                }
            }

            // Создаём debounced версию для оптимизации (200мс)
            const debouncedUpdateTotal = debounce(updateTotal, 200);

            if (priceInput) priceInput.addEventListener('input', debouncedUpdateTotal);
            if (priceSelect) priceSelect.addEventListener('change', updateTotal); // Select не требует debounce
            sharesInput.addEventListener('input', debouncedUpdateTotal);

            // Добавляем обработчик для кнопки покупки
            if (buyButton) {
                buyButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    const card = inputGroup.closest('.asset-card');
                    const itemId = card.dataset.itemId;
                    const item = ASSET_CATEGORIES.stocks.items.find(i => i.id === itemId);
                    if (item) {
                        showAssetDetails(item, 'stocks');
                    }
                });
            }
        });
    }

    // Инициализация обработчиков для ввода данных недвижимости
    function initializePropertyInputs() {
        const propertyInputs = document.querySelectorAll('.property-inputs');
        
        propertyInputs.forEach(inputGroup => {
            const priceInput = inputGroup.querySelector('.property-price');
            const downPaymentInput = inputGroup.querySelector('.property-down-payment');
            const cashflowInput = inputGroup.querySelector('.property-cashflow');
            const buyButton = inputGroup.querySelector('.buy-property-btn');
            const toggleSignBtn = inputGroup.querySelector('.toggle-sign-btn');
            
            // Добавляем обработчик для кнопки смены знака
            if (toggleSignBtn && cashflowInput) {
                toggleSignBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currentValue = parseFloat(cashflowInput.value) || 0;
                    cashflowInput.value = -currentValue;
                });
            }
            
            // Добавляем обработчик для кнопки покупки
            if (buyButton) {
                buyButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    const card = inputGroup.closest('.asset-card');
                    const itemId = card.dataset.itemId;
                    const item = ASSET_CATEGORIES.realestate.items.find(i => i.id === itemId);
                    if (item) {
                        showAssetDetails(item, 'realestate');
                    }
                });
            }
        });
        
        // Инициализируем обработчики для расчета ипотеки
        updateMortgageDisplay();
    }

    // Показ деталей выбранного актива
    function showAssetDetails(item, category) {
        const content = modal.querySelector('.asset-categories');
        let totalPrice = 0;
        let monthlyIncome = 0;

        // Обработка акций
        if (category === 'stocks') {
            const stockInputs = content.querySelector(`[data-item-id="${item.id}"] .stock-inputs`);
            if (!stockInputs) return;

            const sharesInput = stockInputs.querySelector('.shares-amount');
            const shares = parseInt(sharesInput.value) || 0;
            let pricePerShare = 0;
            
            if (item.type === 'speculative') {
                const priceInput = stockInputs.querySelector('.price-per-share');
                pricePerShare = parseFloat(priceInput.value);
                pricePerShare = isNaN(pricePerShare) ? 0 : pricePerShare;
                totalPrice = shares * pricePerShare;
            } else if (item.type === 'dividend') {
                // Для 2BIGPOWER и CD используем поле price-per-share, если оно есть
                const priceInput = stockInputs.querySelector('.price-per-share');
                const priceSelect = stockInputs.querySelector('.price-select');
                if (priceInput) {
                    pricePerShare = parseFloat(priceInput.value);
                    pricePerShare = isNaN(pricePerShare) ? 0 : pricePerShare;
                } else if (priceSelect) {
                    pricePerShare = parseFloat(priceSelect.value);
                } else {
                    pricePerShare = item.pricePerShare;
                }
                totalPrice = shares * pricePerShare;

                if (item.dividendType === 'fixed') {
                    monthlyIncome = shares * item.dividendValue;
                } else if (item.dividendType === 'percent') {
                    monthlyIncome = (shares * pricePerShare * (item.dividendValue / 100)) / 12;
                }
            }

            if (totalPrice > 0 && totalPrice > window.cash) {
                alert('Недостаточно средств для покупки!');
                return;
            }

            if (shares <= 0) {
                alert('Введите количество акций!');
                return;
            }
            if (pricePerShare < 0) {
                alert('Цена за акцию не может быть отрицательной!');
                return;
            }

            // Убираем подтверждение для быстрого UX

            if (totalPrice > 0) {
                window.cash -= totalPrice;
            }

            if (!window.data.asset) window.data.asset = [];
            
            // Ищем существующие акции с таким же названием
            let existingStock = window.data.asset.find(asset => 
                asset.type === 'stocks' && asset.name === item.name
            );
            
            if (existingStock) {
                // Если акции уже есть, обновляем количество и среднюю цену
                const oldQuantity = existingStock.quantity;
                const oldTotalValue = oldQuantity * existingStock.price;
                const newTotalValue = shares * pricePerShare;
                const totalQuantity = oldQuantity + shares;
                const averagePrice = (oldTotalValue + newTotalValue) / totalQuantity;
                

                
                existingStock.quantity = totalQuantity;
                existingStock.price = Math.round(averagePrice * 10) / 10;
                
                console.log(`📈 Обновлены акции ${item.name}: ${oldQuantity} + ${shares} = ${totalQuantity} шт. (средняя цена: $${(Math.round(averagePrice * 10) / 10).toFixed(1)})`);
            } else {
                // Если акций нет, создаем новую запись
            window.data.asset.push({
                id: `${item.name}-${Date.now()}`,
                name: item.name,
                quantity: shares,
                price: pricePerShare,
                type: 'stocks'
            });
                
                console.log(`🆕 Куплены новые акции ${item.name}: ${shares} шт. по $${pricePerShare}`);
            }

            if (monthlyIncome > 0) {
                if (!window.data.income) window.data.income = [];
                
                // Ищем существующую запись о доходе для этого типа акций
                let incomeSource = window.data.income.find(inc => inc.source === item.name && inc.type === 'passive');

                if (incomeSource) {
                    // Если нашли, обновляем значение
                    incomeSource.value += Math.floor(monthlyIncome);
                } else {
                    // Если не нашли, создаем новую запись
                    window.data.income.push({
                        id: `${item.id}-income-${Date.now()}`,
                        name: `Денежный поток: ${item.name}`,
                        value: Math.floor(monthlyIncome),
                        type: 'passive',
                        source: item.name
                    });
                }
            }

            // Добавляем запись в историю
            if (!window.data.history) window.data.history = [];
            window.data.history.push({
                type: 'buy',
                assetName: item.name,
                amount: totalPrice,
                quantity: shares,
                date: new Date().toISOString()
            });

            window.renderCash();
            window.renderAll();
            window.renderIncome();
            window.renderSummary();
            window.renderHistory();
            autoSave();

            sharesInput.value = '';
            if (item.type === 'speculative') {
                const priceInput = stockInputs.querySelector('.price-per-share');
                priceInput.value = '';
            }

            modal.classList.remove('active');
        }
        // Обработка недвижимости
        else if (category === 'realestate') {
            const propertyInputs = content.querySelector(`[data-item-id="${item.id}"] .property-inputs`);
            if (!propertyInputs) return;

            const price = parseFloat(propertyInputs.querySelector('.property-price').value) || 0;
            const downPayment = parseFloat(propertyInputs.querySelector('.property-down-payment').value) || 0;
            const mortgage = Math.max(0, price - downPayment); // Автоматически рассчитываем ипотеку
            const cashflow = parseFloat(propertyInputs.querySelector('.property-cashflow').value) || 0;

            // Получаем дополнительные значения в зависимости от типа
            let additionalInfo = '';
            if (item.type === 'land') {
                const acres = parseFloat(propertyInputs.querySelector('.property-acres').value) || 0;
                if (acres <= 0) {
                    alert('Укажите количество акров!');
                    return;
                }
                additionalInfo = `${acres} акров`;
            }

            if (price < 0) {
                alert('Цена не может быть отрицательной!');
                return;
            }
            if (downPayment < 0) {
                alert('Первый взнос не может быть отрицательным!');
                return;
            }
            if (downPayment > price) {
                alert('Первый взнос не может быть больше цены недвижимости!');
                return;
            }

            if (downPayment > 0 && downPayment > window.cash) {
                alert('Недостаточно средств для первого взноса!');
                return;
            }

            let confirmText = `Подтвердите ${price === 0 ? 'получение' : 'покупку'}:\n`;
            confirmText += `${item.name}${additionalInfo ? ` (${additionalInfo})` : ''}\n`;
            if (price > 0) {
                confirmText += `Цена: $${price}\n`;
            }
            if (downPayment > 0) {
                confirmText += `Первый взнос: $${downPayment}\n`;
            }
            confirmText += `Денежный поток: $${cashflow}`;

            if (!confirm(confirmText)) {
                return;
            }

            if (downPayment > 0) {
                window.cash -= downPayment;
            }

            // Формируем название с дополнительной информацией
            const fullName = additionalInfo ? `${item.name} (${additionalInfo})` : item.name;

            // Добавляем актив
            if (!window.data.asset) window.data.asset = [];
            window.data.asset.push({
                id: `${item.id}-${Date.now()}`,
                name: fullName,
                type: 'realestate',
                value: price,
                isTransferred: price === 0
            });

            // Добавляем ипотеку в пассивы
            if (mortgage > 0) {
                if (!window.data.liability) window.data.liability = [];
                window.data.liability.push({
                    id: `mortgage-${item.id}-${Date.now()}`,
                    name: `Ипотека: ${fullName}`,
                    type: 'mortgage',
                    value: mortgage
                });
            }

            // Добавляем денежный поток
            if (!window.data.income) window.data.income = [];
            window.data.income.push({
                id: `${item.id}-income-${Date.now()}`,
                name: `Денежный поток: ${fullName}`,
                type: 'passive',
                value: cashflow,
                source: fullName
            });

            // Добавляем запись в историю
            if (!window.data.history) window.data.history = [];
            window.data.history.push({
                type: 'buy',
                assetName: fullName,
                amount: downPayment,
                date: new Date().toISOString()
            });

            // Обновляем отображение
            window.renderCash();
            window.renderAll();
            window.renderLiability();
            window.renderIncome();
            window.renderSummary();
            window.renderHistory();
            autoSave();

            // Очищаем поля ввода
            propertyInputs.querySelector('.property-price').value = '';
            propertyInputs.querySelector('.property-down-payment').value = '';
            propertyInputs.querySelector('.property-cashflow').value = '';
            if (item.type === 'land') {
                propertyInputs.querySelector('.property-acres').value = '';
            }

            modal.classList.remove('active');
        }
    }


    // Возврат к выбору категорий
    function showCategories() {
        modal.querySelector('h2').textContent = 'Выберите тип актива';
        const content = modal.querySelector('.asset-categories');
        content.innerHTML = `
            <div class="category-card" data-category="stocks">
                <i class="fas fa-chart-line"></i>
                <h3>Акции</h3>
                <p>Инвестиции в ценные бумаги</p>
            </div>
            <div class="category-card" data-category="realestate">
                <i class="fas fa-home"></i>
                <h3>Недвижимость</h3>
                <p>Дома, квартиры, офисы</p>
            </div>
            <div class="category-card" data-category="business">
                <i class="fas fa-store"></i>
                <h3>Бизнес</h3>
                <p>Малый и средний бизнес</p>
            </div>
            <div class="category-card" data-category="preciousmetals">
                <i class="fas fa-coins"></i>
                <h3>Драгоценные металлы</h3>
                <p>Золотые монеты и слитки</p>
            </div>
            <div class="category-card" data-category="misc">
                <i class="fas fa-shopping-bag"></i>
                <h3>Всякая всячина</h3>
                <p>Прочие покупки</p>
            </div>
        `;

        // Восстанавливаем обработчики для категорий
        content.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                showCategoryItems(category);
            });
        });
    }

    // Открытие модального окна
    buyBtn.addEventListener('click', () => {
        modal.classList.add('active');
        showCategories();
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Инициализация обработчиков для кнопок покупки
    function initializeBuyButtons() {
        const buyButtons = document.querySelectorAll('.buy-button, .buy-stock-btn, .buy-metal-btn, .buy-misc-btn, .buy-property-btn');
        
        buyButtons.forEach(button => {
            // Добавляем обработчик для touchstart
            button.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.style.opacity = '0.7';
                // Вызываем соответствующую функцию покупки
                const card = this.closest('.asset-card');
                if (card) {
                    const itemId = card.dataset.itemId;
                    const item = findItemById(itemId);
                    if (item) {
                        showAssetDetails(item, getCurrentCategory());
                    }
                }
            });

            // Добавляем обработчик для touchend
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.style.opacity = '1';
            });

            // Улучшаем отзывчивость на мобильных
            button.style.cursor = 'pointer';
            button.style.touchAction = 'manipulation';
        });
    }

    // Вспомогательная функция для поиска элемента по ID
    function findItemById(id) {
        for (const category in ASSET_CATEGORIES) {
            const items = ASSET_CATEGORIES[category].items;
            const item = items.find(i => i.id === id);
            if (item) return item;
        }
        return null;
    }

    // Вспомогательная функция для получения текущей категории
    function getCurrentCategory() {
        const activeCard = document.querySelector('.category-card.active');
        return activeCard ? activeCard.dataset.category : null;
    }

    // Вызываем инициализацию при показе категорий и элементов
    const originalShowCategories = showCategories;
    showCategories = function() {
        originalShowCategories();
        initializeBuyButtons();
    };

    const originalShowCategoryItems = showCategoryItems;
    showCategoryItems = function(category) {
        originalShowCategoryItems(category);
        initializeBuyButtons();
    };


    // Функция для обновления отображения ипотеки
    function updateMortgageDisplay() {
        const propertyInputs = modal.querySelectorAll('.property-inputs');
        propertyInputs.forEach(inputs => {
            const priceInput = inputs.querySelector('.property-price');
            const downPaymentInput = inputs.querySelector('.property-down-payment');
            const mortgageDisplay = inputs.querySelector('.calculated-mortgage');
            
            if (priceInput && downPaymentInput && mortgageDisplay) {
                // Проверяем, были ли уже добавлены обработчики
                if (priceInput.dataset.mortgageListenerAdded === 'true') {
                    return; // Обработчики уже добавлены, выходим
                }
                
                // Функция расчета ипотеки
                const updateMortgage = () => {
                    const price = parseFloat(priceInput.value) || 0;
                    const downPayment = parseFloat(downPaymentInput.value) || 0;
                    const mortgage = Math.max(0, price - downPayment);
                    
                    if (price > 0 || downPayment > 0) {
                        // Оптимизированное форматирование без toLocaleString
                        const formattedMortgage = mortgage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        mortgageDisplay.textContent = `$${formattedMortgage}`;
                        mortgageDisplay.style.color = mortgage > 0 ? '#333' : '#666';
                    } else {
                        mortgageDisplay.textContent = 'Рассчитается автоматически';
                        mortgageDisplay.style.color = '#666';
                    }
                };
                
                // Создаём debounced версию функции (задержка 200мс)
                const debouncedUpdate = debounce(updateMortgage, 200);
                
                // Добавляем обработчики с debounce
                priceInput.addEventListener('input', debouncedUpdate);
                downPaymentInput.addEventListener('input', debouncedUpdate);
                
                // Отмечаем, что обработчики добавлены
                priceInput.dataset.mortgageListenerAdded = 'true';
                downPaymentInput.dataset.mortgageListenerAdded = 'true';
            }
        });
    }

    // Инициализируем обработчики при загрузке
    // setupNumericInput удален - используется общая функция из других модулей
})(); 