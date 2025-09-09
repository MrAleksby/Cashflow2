/**
 * AnimationManager - управление анимациями и переходами
 * Обеспечивает плавные переходы и интерактивные эффекты
 */
class AnimationManager {
    constructor() {
        this._initialized = false;
        this._animations = new Map();
        this._isAnimating = false;
        
        // CSS классы для анимаций
        this.animationClasses = {
            fadeIn: 'animate-fade-in',
            fadeOut: 'animate-fade-out',
            slideIn: 'animate-slide-in',
            slideOut: 'animate-slide-out',
            scaleIn: 'animate-scale-in',
            scaleOut: 'animate-scale-out',
            bounce: 'animate-bounce',
            shake: 'animate-shake',
            pulse: 'animate-pulse'
        };
    }

    /**
     * Инициализация AnimationManager
     */
    init() {
        if (this._initialized) return;
        
        // Добавляем CSS стили для анимаций
        this._injectAnimationStyles();
        
        // Инициализируем обработчики событий
        this._initEventHandlers();
        
        this._initialized = true;
        console.log('✅ AnimationManager инициализирован');
    }

    /**
     * Внедрение CSS стилей для анимаций
     */
    _injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Базовые анимации */
            .animate-fade-in {
                animation: fadeIn 0.3s ease-in-out;
            }
            
            .animate-fade-out {
                animation: fadeOut 0.3s ease-in-out;
            }
            
            .animate-slide-in {
                animation: slideIn 0.3s ease-out;
            }
            
            .animate-slide-out {
                animation: slideOut 0.3s ease-in;
            }
            
            .animate-scale-in {
                animation: scaleIn 0.2s ease-out;
            }
            
            .animate-scale-out {
                animation: scaleOut 0.2s ease-in;
            }
            
            .animate-bounce {
                animation: bounce 0.6s ease-in-out;
            }
            
            .animate-shake {
                animation: shake 0.5s ease-in-out;
            }
            
            .animate-pulse {
                animation: pulse 1s ease-in-out infinite;
            }
            
            /* Keyframes */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes slideIn {
                from { 
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to { 
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from { 
                    transform: translateX(0);
                    opacity: 1;
                }
                to { 
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes scaleIn {
                from { 
                    transform: scale(0.8);
                    opacity: 0;
                }
                to { 
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes scaleOut {
                from { 
                    transform: scale(1);
                    opacity: 1;
                }
                to { 
                    transform: scale(0.8);
                    opacity: 0;
                }
            }
            
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% {
                    transform: translate3d(0,0,0);
                }
                40%, 43% {
                    transform: translate3d(0, -8px, 0);
                }
                70% {
                    transform: translate3d(0, -4px, 0);
                }
                90% {
                    transform: translate3d(0, -2px, 0);
                }
            }
            
            @keyframes shake {
                0%, 100% {
                    transform: translateX(0);
                }
                10%, 30%, 50%, 70%, 90% {
                    transform: translateX(-2px);
                }
                20%, 40%, 60%, 80% {
                    transform: translateX(2px);
                }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
            
            
            
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Инициализация обработчиков событий
     */
    _initEventHandlers() {
        // Обработчики событий инициализированы
    }


    // === МЕТОДЫ ДЛЯ АНИМАЦИЙ ===

    /**
     * Плавное переключение экранов
     */
    animateScreenTransition(fromScreen, toScreen, direction = 'right') {
        if (!fromScreen || !toScreen) return;
        
        this._isAnimating = true;
        
        // Показываем целевой экран
        toScreen.style.display = 'block';
        toScreen.classList.add('animate-slide-in');
        
        // Скрываем исходный экран
        fromScreen.classList.add('animate-slide-out');
        
        // Убираем анимации после завершения
        setTimeout(() => {
            fromScreen.style.display = 'none';
            fromScreen.classList.remove('animate-slide-out');
            toScreen.classList.remove('animate-slide-in');
            this._isAnimating = false;
        }, 300);
    }

    /**
     * Анимация появления элемента
     */
    fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Анимация исчезновения элемента
     */
    fadeOut(element, duration = 300) {
        if (!element) return;
        
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Анимация масштабирования
     */
    scaleIn(element, duration = 200) {
        if (!element) return;
        
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms ease-out`;
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Анимация масштабирования (исчезновение)
     */
    scaleOut(element, duration = 200) {
        if (!element) return;
        
        element.style.transition = `all ${duration}ms ease-in`;
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    /**
     * Анимация тряски (для ошибок)
     */
    shake(element) {
        if (!element) return;
        
        element.classList.add('animate-shake');
        
        setTimeout(() => {
            element.classList.remove('animate-shake');
        }, 500);
    }

    /**
     * Анимация подпрыгивания (для успеха)
     */
    bounce(element) {
        if (!element) return;
        
        element.classList.add('animate-bounce');
        
        setTimeout(() => {
            element.classList.remove('animate-bounce');
        }, 600);
    }

    /**
     * Анимация пульсации
     */
    pulse(element, duration = 1000) {
        if (!element) return;
        
        element.classList.add('animate-pulse');
        
        setTimeout(() => {
            element.classList.remove('animate-pulse');
        }, duration);
    }


    // === ПУБЛИЧНЫЕ МЕТОДЫ ===

    /**
     * Проверить, идет ли анимация
     */
    isAnimating() {
        return this._isAnimating;
    }

    /**
     * Остановить все анимации
     */
    stopAllAnimations() {
        this._isAnimating = false;
        
        // Удаляем все классы анимаций
        Object.values(this.animationClasses).forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(el => el.classList.remove(className));
        });
    }
}

// Создаем глобальный экземпляр AnimationManager
window.animationManager = new AnimationManager();
