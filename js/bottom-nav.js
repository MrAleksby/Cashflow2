document.addEventListener('DOMContentLoaded', function() {
  var navBtns = document.querySelectorAll('.nav-btn');
  var screens = document.querySelectorAll('.screen');
  
  navBtns.forEach(function(btn) {
    btn.onclick = function() {
      var screen = btn.getAttribute('data-screen');
      
      // Переключаем экраны
      screens.forEach(function(s) { s.classList.remove('active'); });
      var targetScreen = document.getElementById('screen-' + screen);
      if (targetScreen) targetScreen.classList.add('active');
      
      // Переключаем кнопки навигации
      navBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Если это кнопка 'Поток', закрываем все выпадающие меню и модалки
      if (screen === 'cashflow') {
        var dropdowns = document.querySelectorAll('.dropdown, .modal');
        dropdowns.forEach(function(d) { d.style.display = 'none'; });
      }
    };
  });
}); 