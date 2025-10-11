// Функции для работы с модальными окнами
(function() {
  // Отслеживание инициализированных модальных окон
  const initializedModals = new Set();

  // Функция ленивой инициализации модального окна
  function initializeModal(modalId, modal) {
    if (initializedModals.has(modalId)) {
      return; // Уже инициализировано
    }

    // Добавляем обработчики для кнопок закрытия внутри этого модального окна
    const closeButtons = modal.querySelectorAll('.close-btn');
    closeButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        modal.classList.remove('active');
        // Очищаем кэш DOM для этого модального окна
        if (window.domCache) {
          window.domCache.clearContext(modalId);
        }
      });
    });

    // Отмечаем как инициализированное
    initializedModals.set(modalId);
    console.log(`✅ Модальное окно "${modalId}" инициализировано`);
  }

  // Общая функция для открытия любого модального окна с ленивой инициализацией
  window.openModal = function(modalId) {
    const modal = window.$id ? window.$id(modalId) : document.getElementById(modalId);
    if (modal) {
      // Ленивая инициализация при первом открытии
      if (!initializedModals.has(modalId)) {
        initializeModal(modalId, modal);
      }
      
      modal.classList.add('active');
    }
  };

  // Инициализация базовых обработчиков
  document.addEventListener('DOMContentLoaded', function() {
    // Закрытие модального окна при клике вне его области (делегирование на document)
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('modal') && event.target.classList.contains('active')) {
        event.target.classList.remove('active');
        
        // Очищаем кэш DOM при закрытии
        if (window.domCache) {
          const modalId = event.target.id;
          if (modalId) {
            window.domCache.clearContext(modalId);
          }
        }
      }
    });

    // Модальное окно истории изменений (ленивая инициализация)
    const historyBtn = window.$id ? window.$id('history-btn') : document.getElementById('history-btn');
    if (historyBtn) {
      historyBtn.addEventListener('click', function() {
        openModal('edit-history-modal');
      });
    }

    // Модальное окно калькулятора (ленивая инициализация)
    const calculatorBtn = window.$id ? window.$id('calculator-btn') : document.getElementById('calculator-btn');
    if (calculatorBtn) {
      calculatorBtn.addEventListener('click', function() {
        openModal('calculator-modal');
      });
    }

    // Модальное окно имени игрока (ленивая инициализация)
    const playerNameBtn = window.$id ? window.$id('player-name-btn') : document.getElementById('player-name-btn');
    if (playerNameBtn) {
      playerNameBtn.addEventListener('click', function() {
        openModal('player-name-modal');
      });
    }

    console.log('✅ Система модальных окон с ленивой инициализацией готова');
  });
})(); 