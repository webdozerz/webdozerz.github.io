// Простая логика для отображения кнопки "Смотреть бесплатно" на Кинопоиске

// Проверяем, находимся ли мы на странице фильма или сериала
function isMovieOrSeriesPage() {
  const pathname = window.location.pathname;
  return /^\/film\/\d+/.test(pathname) || /^\/series\/\d+/.test(pathname);
}

// Создаем кнопку "Смотреть бесплатно"
function createWatchButton() {
  // Проверяем, не создана ли кнопка уже
  if (document.querySelector('.knp-ext-watch-button')) {
    return;
  }

  const button = document.createElement('button');
  button.className = 'knp-ext-watch-button';
  button.textContent = 'Смотреть бесплатно';
  
  // Применяем стили
  button.style.cssText = `
    position: fixed !important;
    top: 80px !important;
    right: 20px !important;
    z-index: 10000 !important;
    background: linear-gradient(135deg, #4CAF50, #45a049) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 12px 20px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
    transition: all 0.3s ease !important;
    min-width: 160px !important;
    text-align: center !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    text-decoration: none !important;
    display: inline-block !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
    user-select: none !important;
    outline: none !important;
  `;
  
  // Добавляем hover эффекты
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
    button.style.background = 'linear-gradient(135deg, #45a049, #4CAF50)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
    button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
  });
  
  button.addEventListener('mousedown', () => {
    button.style.transform = 'translateY(0) scale(0.98)';
  });
  
  button.addEventListener('mouseup', () => {
    button.style.transform = 'translateY(-2px)';
  });
  
  // Обработчик клика - перенаправляем на sspoisk
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentUrl = window.location.href;
    const newUrl = currentUrl.replace(/kinopoisk/g, 'sspoisk');
    window.location.href = newUrl;
  });
  
  // Добавляем кнопку в DOM
  document.body.appendChild(button);
  
  console.log('✅ Кнопка "Смотреть бесплатно" добавлена');
}

// Отслеживание смены URL для SPA навигации
function watchUrlChanges() {
  let currentUrl = window.location.href;
  console.log('🔍 Начинаем отслеживание URL. Текущий:', currentUrl);
  
  // Перехватываем изменения истории браузера
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    console.log('📌 history.pushState вызван:', args);
    originalPushState.apply(history, args);
    setTimeout(checkUrlChange, 100); // Небольшая задержка для обновления URL
  };
  
  history.replaceState = function(...args) {
    console.log('📌 history.replaceState вызван:', args);
    originalReplaceState.apply(history, args);
    setTimeout(checkUrlChange, 100);
  };
  
  // Слушаем событие popstate (кнопки назад/вперед)
  window.addEventListener('popstate', (e) => {
    console.log('📌 popstate событие:', e);
    setTimeout(checkUrlChange, 100);
  });
  
  // Дополнительное отслеживание через MutationObserver для надежности
  const observer = new MutationObserver(() => {
    checkUrlChange();
  });
  
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  
  // Периодическая проверка URL (на случай если что-то пропустили)
  setInterval(() => {
    if (window.location.href !== currentUrl) {
      console.log('⏰ URL изменение обнаружено через polling');
      checkUrlChange();
    }
  }, 1000);
  
  function checkUrlChange() {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      console.log('🌐 URL изменился:');
      console.log('   Старый:', currentUrl);
      console.log('   Новый:', newUrl);
      currentUrl = newUrl;
      
      // Удаляем старую кнопку если есть
      const oldButton = document.querySelector('.knp-ext-watch-button');
      if (oldButton) {
        oldButton.remove();
        console.log('🗑️ Старая кнопка удалена');
      }
      
      // Проверяем новую страницу
      checkAndCreateButton();
    }
  }
}

// Проверяем страницу и создаем кнопку если нужно
function checkAndCreateButton() {
  const pathname = window.location.pathname;
  const fullUrl = window.location.href;
  
  console.log('🔍 Проверка страницы:');
  console.log('   Pathname:', pathname);
  console.log('   Full URL:', fullUrl);
  
  if (isMovieOrSeriesPage()) {
    console.log('📺 Страница фильма/сериала обнаружена');
    createWatchButton();
  } else {
    console.log('🚫 Не страница фильма/сериала');
    console.log('   Ожидаем паттерн: /film/[число] или /series/[число]');
  }
}

// Главная функция - запускается сразу
function init() {
  console.log('🎬 Kinopoisk Extension: Инициализация');
  console.log('🌐 URL:', window.location.href);
  
  // Настраиваем отслеживание URL
  watchUrlChanges();
  
  // Проверяем текущую страницу
  checkAndCreateButton();
}

// Запускаем инициализацию
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}