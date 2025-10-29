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

// Главная функция - запускается сразу
function init() {
  console.log('🎬 Kinopoisk Extension: Инициализация');
  console.log('🌐 URL:', window.location.href);
  
  // Если мы на странице фильма или сериала - создаем кнопку
  if (isMovieOrSeriesPage()) {
    console.log('📺 Страница фильма/сериала обнаружена');
    createWatchButton();
  } else {
    console.log('🚫 Не страница фильма/сериала');
  }
}

// Запускаем инициализацию
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}