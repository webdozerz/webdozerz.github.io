// Константы конфигурации
const CONFIG = {
  BUTTON_TEXT: 'Смотреть бесплатно',
  HEADER_HEIGHT: 72, // Высота хедера
  BUTTON_TOP_OFFSET: 80, // Отступ от верха (высота хедера + отступ)
  INITIAL_DELAY: 500,
  NAVIGATION_DELAY: 800
};

// Функция для проверки, находимся ли мы на странице фильма или сериала
const isMovieOrSeriesPage = () => {
  const pathname = window.location.pathname;
  
  // Проверяем URL на соответствие паттернам страниц фильмов и сериалов
  const isFilmPage = /^\/film\/\d+/.test(pathname);
  const isSeriesPage = /^\/series\/\d+/.test(pathname);
  
  return isFilmPage || isSeriesPage;
};

// Глобальная переменная для отслеживания состояния
let extensionState = {
  floatingButtonAdded: false,
  observer: null
};

// Функция для создания CSS стилей плавающей кнопки
const createFloatingButtonStyles = () => `
  position: fixed !important;
  top: ${CONFIG.BUTTON_TOP_OFFSET}px !important;
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

// Функция для создания hover эффектов
const addHoverEffects = (button) => {
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px) !important';
    button.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4) !important';
    button.style.background = 'linear-gradient(135deg, #45a049, #4CAF50) !important';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0) !important';
    button.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3) !important';
    button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049) !important';
  });
  
  button.addEventListener('mousedown', () => {
    button.style.transform = 'translateY(0) scale(0.98) !important';
  });
  
  button.addEventListener('mouseup', () => {
    button.style.transform = 'translateY(-2px) !important';
  });
};

// Функция для создания плавающей кнопки
const createFloatingButton = () => {
  // Проверяем, не создана ли кнопка уже
  if (document.querySelector('.knp-ext-floating-button')) {
    console.log('Плавающая кнопка уже существует');
    return;
  }

  const button = document.createElement('button');
  button.className = 'knp-ext-floating-button';
  button.textContent = CONFIG.BUTTON_TEXT;
  button.setAttribute('title', CONFIG.BUTTON_TEXT);
  
  // Применяем стили
  button.style.cssText = createFloatingButtonStyles();
  
  // Добавляем hover эффекты
  addHoverEffects(button);
  
  // Обработчик клика
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Получаем текущий URL
    const currentUrl = window.location.href;
    
    // Заменяем kinopoisk на sspoisk в доменном имени
    const newUrl = currentUrl.replace(/kinopoisk/g, 'sspoisk');
    
    console.log(`Перенаправление с ${currentUrl} на ${newUrl}`);
    
    // Перенаправляем на новый URL
    window.location.href = newUrl;
  });
  
  // Добавляем кнопку в DOM
  document.body.appendChild(button);
  
  console.log('✅ Плавающая кнопка "Смотреть бесплатно" добавлена');
  return button;
};

// Функция для добавления плавающей кнопки
const addFloatingButton = () => {
  // Проверяем, находимся ли мы на нужной странице
  if (!isMovieOrSeriesPage()) {
    console.log('Kinopoisk Extension: Не на странице фильма/сериала, пропускаем');
    return;
  }

  // Если кнопка уже добавлена, не создаем повторно
  if (extensionState.floatingButtonAdded) {
    return;
  }

  console.log('🔍 Добавление плавающей кнопки...');

  // Создаем плавающую кнопку
  const button = createFloatingButton();
  
  if (button) {
    extensionState.floatingButtonAdded = true;
    console.log('🎉 Плавающая кнопка успешно добавлена');
  }
};

// Функция для очистки наблюдателя
const clearObserver = () => {
  if (extensionState.observer) {
    extensionState.observer.disconnect();
    extensionState.observer = null;
    console.log('🛑 Observer отключен');
  }
};

// Функция для сброса состояния при изменении URL
const resetExtensionState = () => {
  console.log('🔄 Сброс состояния расширения');
  console.log(`   Плавающая кнопка была добавлена: ${extensionState.floatingButtonAdded}`);
  
  // Удаляем старую кнопку, если она есть
  const oldButton = document.querySelector('.knp-ext-floating-button');
  if (oldButton) {
    oldButton.remove();
    console.log('🗑️ Старая плавающая кнопка удалена');
  }
  
  extensionState.floatingButtonAdded = false;
  clearObserver();
  
  console.log('✅ Состояние сброшено, готов к новому поиску');
};

// Функция для наблюдения за изменениями DOM
const observeDOM = () => {
  // Отключаем предыдущий observer если есть
  if (extensionState.observer) {
    extensionState.observer.disconnect();
    console.log('🔄 Предыдущий DOM Observer отключен');
  }

  console.log('👁️ Запуск нового DOM Observer...');

  extensionState.observer = new MutationObserver((mutations) => {
    // Если кнопка уже добавлена, не реагируем на изменения
    if (extensionState.floatingButtonAdded) {
      return;
    }

    let hasPageStructureChange = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Проверяем изменения структуры страницы (возможная SPA навигация)
        const hasStructuralChanges = Array.from(mutation.addedNodes).some(node =>
          node.nodeType === Node.ELEMENT_NODE &&
          (node.classList?.contains('styles_root') || 
           node.querySelector('[class*="styles_root"]') ||
           node.querySelector('main, [role="main"]'))
        );
        
        if (hasStructuralChanges) {
          hasPageStructureChange = true;
          console.log('🏗️ DOM Observer: Обнаружены структурные изменения страницы');
        }
      }
    });
    
    if (hasPageStructureChange) {
      // Добавляем задержку для завершения рендеринга
      console.log('🎯 DOM Observer запускает добавление плавающей кнопки');
      setTimeout(addFloatingButton, 500);
    }
  });
  
  extensionState.observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('✅ DOM Observer активирован');
  return extensionState.observer;
};

// Функция для наблюдения за изменениями URL
const observeUrlChange = () => {
  let currentUrl = window.location.href;
  console.log('🚀 Настройка отслеживания URL изменений...');
  console.log(`   Начальный URL: ${currentUrl}`);
  
  // Наблюдаем за изменениями в истории браузера
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    console.log('📌 history.pushState перехвачен:', args);
    originalPushState.apply(history, args);
    setTimeout(checkUrlChange, 100); // Задержка для обновления URL
  };
  
  history.replaceState = function(...args) {
    console.log('📌 history.replaceState перехвачен:', args);
    originalReplaceState.apply(history, args);
    setTimeout(checkUrlChange, 100); // Задержка для обновления URL
  };
  
  // Множественные способы отслеживания навигации
  window.addEventListener('popstate', (e) => {
    console.log('📌 popstate событие:', e);
    setTimeout(checkUrlChange, 100);
  });
  
  // Дополнительное периодическое сравнение URL
  setInterval(() => {
    if (window.location.href !== currentUrl) {
      console.log('📌 URL изменение обнаружено через polling');
      checkUrlChange();
    }
  }, 1000);
  
  function checkUrlChange() {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      const oldUrl = currentUrl;
      currentUrl = newUrl;
      console.log(`🌐 URL изменился:`);
      console.log(`   Старый: ${oldUrl}`);
      console.log(`   Новый: ${currentUrl}`);
      
      resetExtensionState();
      
      // Запускаем добавление плавающей кнопки на новой странице с задержкой для SPA
      setTimeout(() => {
        console.log(`🔍 Проверка новой страницы: ${window.location.pathname}`);
        if (isMovieOrSeriesPage()) {
          console.log('🎯 Начинаем добавление плавающей кнопки на новой странице...');
          startFloatingButton();
        } else {
          console.log('🚫 Новая страница не является страницей фильма/сериала');
        }
      }, CONFIG.NAVIGATION_DELAY);
    }
  }
};

// Функция для запуска добавления плавающей кнопки
const startFloatingButton = () => {
  console.log('🔍 Запуск добавления плавающей кнопки...');
  console.log(`   URL: ${window.location.href}`);
  console.log(`   Состояние: floatingButtonAdded=${extensionState.floatingButtonAdded}`);
  
  // Добавляем плавающую кнопку сразу
  setTimeout(addFloatingButton, CONFIG.INITIAL_DELAY);
  
  // Настраиваем наблюдение за DOM для SPA навигации
  observeDOM();
};

// Инициализация расширения
const init = () => {
  console.log('🎬 Kinopoisk Free Watch Extension: Инициализация...');
  console.log('🌐 Текущий URL:', window.location.href);
  console.log('📄 Страница фильма/сериала:', isMovieOrSeriesPage());
  
  // Настраиваем отслеживание изменений URL
  observeUrlChange();
  
  // Запускаем добавление плавающей кнопки, если находимся на нужной странице
  if (isMovieOrSeriesPage()) {
    startFloatingButton();
  }
};

// Запускаем инициализацию
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 