/**
 * DOMCache - централизованный кэш для DOM-элементов
 * Улучшает производительность за счёт кэширования querySelector/getElementById
 */
class DOMCache {
    constructor() {
        this._cache = new Map();
        this._selectorCache = new Map();
        
        // Автоматически очищаем кэш при изменении DOM в модальных окнах
        this._setupAutoClearing();
    }

    /**
     * Получить элемент по ID (с кэшированием)
     */
    get(id) {
        if (!this._cache.has(id)) {
            const element = document.getElementById(id);
            if (element) {
                this._cache.set(id, element);
            }
            return element;
        }
        return this._cache.get(id);
    }

    /**
     * Получить элемент по селектору (с кэшированием)
     */
    query(selector, context = document) {
        const cacheKey = `${selector}:${context.id || 'document'}`;
        
        if (!this._selectorCache.has(cacheKey)) {
            const element = context.querySelector(selector);
            if (element) {
                this._selectorCache.set(cacheKey, element);
            }
            return element;
        }
        return this._selectorCache.get(cacheKey);
    }

    /**
     * Получить все элементы по селектору (с кэшированием)
     */
    queryAll(selector, context = document) {
        const cacheKey = `all:${selector}:${context.id || 'document'}`;
        
        if (!this._selectorCache.has(cacheKey)) {
            const elements = Array.from(context.querySelectorAll(selector));
            if (elements.length > 0) {
                this._selectorCache.set(cacheKey, elements);
            }
            return elements;
        }
        return this._selectorCache.get(cacheKey);
    }

    /**
     * Очистить весь кэш
     */
    clear() {
        this._cache.clear();
        this._selectorCache.clear();
    }

    /**
     * Очистить кэш для конкретного контекста
     */
    clearContext(contextId) {
        // Очищаем все записи, связанные с этим контекстом
        for (const [key] of this._selectorCache.entries()) {
            if (key.includes(`:${contextId}`)) {
                this._selectorCache.delete(key);
            }
        }
    }

    /**
     * Инвалидировать кэш для конкретного ID
     */
    invalidate(id) {
        this._cache.delete(id);
        
        // Также удаляем из кэша селекторов
        for (const [key] of this._selectorCache.entries()) {
            if (key.includes(`#${id}`)) {
                this._selectorCache.delete(key);
            }
        }
    }

    /**
     * Настройка автоматической очистки кэша
     */
    _setupAutoClearing() {
        // Очищаем кэш при закрытии модальных окон
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') || 
                (e.target.classList.contains('modal') && e.target.classList.contains('active'))) {
                // Небольшая задержка, чтобы анимация закрытия завершилась
                setTimeout(() => this.clear(), 300);
            }
        });
    }

    /**
     * Получить статистику кэша (для отладки)
     */
    getStats() {
        return {
            cacheSize: this._cache.size,
            selectorCacheSize: this._selectorCache.size,
            totalSize: this._cache.size + this._selectorCache.size
        };
    }
}

// Создаём глобальный экземпляр
if (!window.domCache) {
    window.domCache = new DOMCache();
}

// Для обратной совместимости и удобства
window.$ = (selector) => window.domCache.query(selector);
window.$$ = (selector) => window.domCache.queryAll(selector);
window.$id = (id) => window.domCache.get(id);

console.log('✅ DOMCache инициализирован');

