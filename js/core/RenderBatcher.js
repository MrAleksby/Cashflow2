/**
 * RenderBatcher - батчинг обновлений рендеринга
 * Группирует множественные вызовы render функций в один кадр анимации
 */
class RenderBatcher {
    constructor() {
        this._scheduledUpdates = new Set();
        this._rafId = null;
        this._isProcessing = false;
    }

    /**
     * Запланировать обновление
     * @param {string} updateName - Название обновления (например, 'cash', 'summary')
     * @param {Function} callback - Функция обновления
     */
    schedule(updateName, callback) {
        // Добавляем в очередь
        this._scheduledUpdates.add({
            name: updateName,
            callback: callback
        });

        // Запланировать обработку, если ещё не запланирована
        if (!this._rafId && !this._isProcessing) {
            this._rafId = requestAnimationFrame(() => this._processUpdates());
        }
    }

    /**
     * Обработать все запланированные обновления
     */
    _processUpdates() {
        this._isProcessing = true;
        this._rafId = null;

        // Выполняем все обновления
        const startTime = performance.now();
        
        for (const update of this._scheduledUpdates) {
            try {
                update.callback();
            } catch (error) {
                console.error(`❌ Ошибка при обновлении "${update.name}":`, error);
            }
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        if (duration > 16) { // Больше одного кадра (60fps)
            console.warn(`⚠️ Batch update took ${duration.toFixed(2)}ms (${this._scheduledUpdates.size} updates)`);
        }

        // Очищаем очередь
        this._scheduledUpdates.clear();
        this._isProcessing = false;
    }

    /**
     * Принудительно выполнить все обновления сейчас
     */
    flush() {
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        if (this._scheduledUpdates.size > 0) {
            this._processUpdates();
        }
    }

    /**
     * Получить количество ожидающих обновлений
     */
    getPendingCount() {
        return this._scheduledUpdates.size;
    }
}

// Создаём глобальный экземпляр
if (!window.renderBatcher) {
    window.renderBatcher = new RenderBatcher();
}

// Обёртки для часто используемых функций рендеринга
window.scheduleRenderCash = function() {
    if (typeof window.renderCash === 'function') {
        window.renderBatcher.schedule('cash', window.renderCash);
    }
};

window.scheduleRenderAll = function() {
    if (typeof window.renderAll === 'function') {
        window.renderBatcher.schedule('all', window.renderAll);
    }
};

window.scheduleRenderSummary = function() {
    if (typeof window.renderSummary === 'function') {
        window.renderBatcher.schedule('summary', window.renderSummary);
    }
};

window.scheduleRenderIncome = function() {
    if (typeof window.renderIncome === 'function') {
        window.renderBatcher.schedule('income', window.renderIncome);
    }
};

window.scheduleRenderLiability = function() {
    if (typeof window.renderLiability === 'function') {
        window.renderBatcher.schedule('liability', window.renderLiability);
    }
};

window.scheduleRenderExpense = function() {
    if (typeof window.renderExpense === 'function') {
        window.renderBatcher.schedule('expense', window.renderExpense);
    }
};

window.scheduleRenderHistory = function() {
    if (typeof window.renderHistory === 'function') {
        window.renderBatcher.schedule('history', window.renderHistory);
    }
};

// Удобная функция для планирования всех обновлений
window.scheduleFullUpdate = function() {
    scheduleRenderCash();
    scheduleRenderAll();
    scheduleRenderSummary();
    scheduleRenderIncome();
    scheduleRenderLiability();
    scheduleRenderExpense();
    scheduleRenderHistory();
};

console.log('✅ RenderBatcher инициализирован');

