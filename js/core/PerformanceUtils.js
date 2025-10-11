/**
 * PerformanceUtils - утилиты для оптимизации производительности
 * Дебаунсинг, throttling, batch операции и другие оптимизации
 */
class PerformanceUtils {
    constructor() {
        this._debounceTimers = new Map();
        this._throttleTimers = new Map();
        this._batchOperations = new Map();
        this._renderQueue = [];
        this._isRendering = false;
    }

    // === PASSIVE EVENT LISTENERS ===

    /**
     * Добавить passive event listener для улучшения производительности скролла
     * @param {Element} element - DOM элемент
     * @param {string} eventType - Тип события ('scroll', 'touchstart', 'touchmove', 'wheel')
     * @param {Function} handler - Обработчик события
     * @returns {Function} - Функция для удаления обработчика
     */
    addPassiveListener(element, eventType, handler) {
        const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel', 'mousewheel'];
        const options = passiveEvents.includes(eventType) ? { passive: true } : false;
        element.addEventListener(eventType, handler, options);
        return () => element.removeEventListener(eventType, handler, options);
    }

    // === ДЕБАУНСИНГ ===

    /**
     * Дебаунсинг функции - выполнение только после паузы
     * @param {Function} func - функция для выполнения
     * @param {number} delay - задержка в миллисекундах
     * @param {string} key - уникальный ключ для функции
     * @returns {Function} - обернутая функция
     */
    debounce(func, delay, key = 'default') {
        return (...args) => {
            // Очищаем предыдущий таймер
            if (this._debounceTimers.has(key)) {
                clearTimeout(this._debounceTimers.get(key));
            }
            
            // Устанавливаем новый таймер
            const timer = setTimeout(() => {
                func.apply(this, args);
                this._debounceTimers.delete(key);
            }, delay);
            
            this._debounceTimers.set(key, timer);
        };
    }

    /**
     * Очистить все дебаунс таймеры
     */
    clearDebounceTimers() {
        this._debounceTimers.forEach(timer => clearTimeout(timer));
        this._debounceTimers.clear();
    }

    // === THROTTLING ===

    /**
     * Throttling функции - выполнение не чаще указанного интервала
     * @param {Function} func - функция для выполнения
     * @param {number} limit - минимальный интервал между вызовами
     * @param {string} key - уникальный ключ для функции
     * @returns {Function} - обернутая функция
     */
    throttle(func, limit, key = 'default') {
        return (...args) => {
            if (!this._throttleTimers.has(key)) {
                func.apply(this, args);
                this._throttleTimers.set(key, setTimeout(() => {
                    this._throttleTimers.delete(key);
                }, limit));
            }
        };
    }

    /**
     * Очистить все throttle таймеры
     */
    clearThrottleTimers() {
        this._throttleTimers.forEach(timer => clearTimeout(timer));
        this._throttleTimers.clear();
    }

    // === BATCH ОПЕРАЦИИ ===

    /**
     * Добавить операцию в batch
     * @param {string} batchKey - ключ batch
     * @param {Function} operation - операция для выполнения
     * @param {number} delay - задержка выполнения batch
     */
    addToBatch(batchKey, operation, delay = 16) {
        if (!this._batchOperations.has(batchKey)) {
            this._batchOperations.set(batchKey, []);
            
            // Запускаем выполнение batch через указанную задержку
            setTimeout(() => {
                this._executeBatch(batchKey);
            }, delay);
        }
        
        this._batchOperations.get(batchKey).push(operation);
    }

    /**
     * Выполнить batch операций
     * @param {string} batchKey - ключ batch
     */
    _executeBatch(batchKey) {
        const operations = this._batchOperations.get(batchKey);
        if (!operations) return;
        
        // Выполняем все операции в batch
        operations.forEach(operation => {
            try {
                operation();
            } catch (error) {
                console.error('Ошибка в batch операции:', error);
            }
        });
        
        // Очищаем batch
        this._batchOperations.delete(batchKey);
    }

    // === ОЧЕРЕДЬ РЕНДЕРИНГА ===

    /**
     * Добавить операцию рендеринга в очередь
     * @param {Function} renderOperation - операция рендеринга
     * @param {number} priority - приоритет (0 - высокий, 1 - средний, 2 - низкий)
     */
    addToRenderQueue(renderOperation, priority = 1) {
        this._renderQueue.push({ operation: renderOperation, priority });
        this._scheduleRender();
    }

    /**
     * Запланировать рендеринг
     */
    _scheduleRender() {
        if (this._isRendering) return;
        
        this._isRendering = true;
        requestAnimationFrame(() => {
            this._processRenderQueue();
        });
    }

    /**
     * Обработать очередь рендеринга
     */
    _processRenderQueue() {
        if (window.performanceMonitor) {
            window.performanceMonitor.startRenderTimer();
        }
        
        // Сортируем по приоритету
        this._renderQueue.sort((a, b) => a.priority - b.priority);
        
        // Выполняем операции рендеринга
        while (this._renderQueue.length > 0) {
            const { operation } = this._renderQueue.shift();
            try {
                operation();
            } catch (error) {
                console.error('Ошибка в операции рендеринга:', error);
            }
        }
        
        if (window.performanceMonitor) {
            window.performanceMonitor.endRenderTimer();
        }
        
        this._isRendering = false;
    }

    // === ОПТИМИЗАЦИЯ DOM ===

    /**
     * Batch обновление DOM элементов
     * @param {Array} updates - массив обновлений {id, type, value}
     */
    batchDOMUpdates(updates) {
        if (!window.DOM) return;
        
        // Группируем обновления по типам
        const textUpdates = updates.filter(u => u.type === 'text');
        const htmlUpdates = updates.filter(u => u.type === 'html');
        const styleUpdates = updates.filter(u => u.type === 'style');
        
        // Выполняем обновления пакетами
        this.addToRenderQueue(() => {
            textUpdates.forEach(update => {
                window.DOM.setText(update.id, update.value);
            });
        }, 0);
        
        this.addToRenderQueue(() => {
            htmlUpdates.forEach(update => {
                window.DOM.setHTML(update.id, update.value);
            });
        }, 1);
        
        this.addToRenderQueue(() => {
            styleUpdates.forEach(update => {
                const element = window.DOM.get(update.id);
                if (element) {
                    Object.assign(element.style, update.value);
                }
            });
        }, 2);
    }

    /**
     * Виртуализация списка для больших данных
     * @param {Array} data - данные для отображения
     * @param {Function} renderItem - функция рендеринга элемента
     * @param {number} itemHeight - высота элемента
     * @param {number} visibleCount - количество видимых элементов
     */
    createVirtualList(data, renderItem, itemHeight, visibleCount = 10) {
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.height = `${data.length * itemHeight}px`;
        container.style.overflow = 'hidden';
        
        const viewport = document.createElement('div');
        viewport.style.position = 'absolute';
        viewport.style.top = '0';
        viewport.style.left = '0';
        viewport.style.right = '0';
        viewport.style.height = `${visibleCount * itemHeight}px`;
        viewport.style.overflow = 'auto';
        
        let startIndex = 0;
        let endIndex = visibleCount;
        
        const renderVisibleItems = () => {
            viewport.innerHTML = '';
            const visibleData = data.slice(startIndex, endIndex);
            
            visibleData.forEach((item, index) => {
                const element = renderItem(item, startIndex + index);
                element.style.position = 'absolute';
                element.style.top = `${(startIndex + index) * itemHeight}px`;
                element.style.width = '100%';
                element.style.height = `${itemHeight}px`;
                viewport.appendChild(element);
            });
        };
        
        viewport.addEventListener('scroll', this.throttle(() => {
            const scrollTop = viewport.scrollTop;
            startIndex = Math.floor(scrollTop / itemHeight);
            endIndex = Math.min(startIndex + visibleCount, data.length);
            renderVisibleItems();
        }, 16, 'virtual-list-scroll'), { passive: true });
        
        container.appendChild(viewport);
        renderVisibleItems();
        
        return container;
    }

    // === ОПТИМИЗАЦИЯ ПАМЯТИ ===

    /**
     * Очистка неиспользуемых данных
     */
    cleanupMemory() {
        // Очищаем таймеры
        this.clearDebounceTimers();
        this.clearThrottleTimers();
        
        // Очищаем очереди
        this._renderQueue.length = 0;
        this._batchOperations.clear();
        
        // Принудительная сборка мусора (если доступно)
        if (window.gc) {
            window.gc();
        }
        
        console.log('🧹 Очистка памяти выполнена');
    }

    /**
     * Мониторинг утечек памяти
     */
    startMemoryLeakDetection() {
        if (!performance.memory) return;
        
        const initialMemory = performance.memory.usedJSHeapSize;
        let lastMemory = initialMemory;
        let increasingCount = 0;
        
        setInterval(() => {
            const currentMemory = performance.memory.usedJSHeapSize;
            
            if (currentMemory > lastMemory) {
                increasingCount++;
                
                if (increasingCount > 10) {
                    console.warn('⚠️ Возможная утечка памяти:', {
                        initial: Math.round(initialMemory / 1024 / 1024) + 'MB',
                        current: Math.round(currentMemory / 1024 / 1024) + 'MB',
                        increase: Math.round((currentMemory - initialMemory) / 1024 / 1024) + 'MB'
                    });
                }
            } else {
                increasingCount = 0;
            }
            
            lastMemory = currentMemory;
        }, 5000);
    }

    // === УТИЛИТЫ ДЛЯ ИЗМЕРЕНИЯ ===

    /**
     * Измерить время выполнения функции
     * @param {Function} func - функция для измерения
     * @param {string} name - название для логирования
     * @returns {*} - результат выполнения функции
     */
    measureExecutionTime(func, name = 'Function') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        
        console.log(`⏱️ ${name} выполнилась за ${(end - start).toFixed(2)}ms`);
        
        return result;
    }

    /**
     * Асинхронное измерение времени выполнения
     * @param {Function} asyncFunc - асинхронная функция
     * @param {string} name - название для логирования
     * @returns {Promise} - результат выполнения функции
     */
    async measureAsyncExecutionTime(asyncFunc, name = 'Async Function') {
        const start = performance.now();
        const result = await asyncFunc();
        const end = performance.now();
        
        console.log(`⏱️ ${name} выполнилась за ${(end - start).toFixed(2)}ms`);
        
        return result;
    }
}

// Создаем глобальный экземпляр PerformanceUtils
window.performanceUtils = new PerformanceUtils();
