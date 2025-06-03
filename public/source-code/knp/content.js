// Функция для проверки, находимся ли мы на странице фильма или сериала
const isMovieOrSeriesPage = () => {
  const url = window.location.href;
  const pathname = window.location.pathname;
  
  // Проверяем URL на соответствие паттернам страниц фильмов и сериалов
  const isFilmPage = /^\/film\/\d+/.test(pathname);
  const isSeriesPage = /^\/series\/\d+/.test(pathname);
  
  return isFilmPage || isSeriesPage;
};

// Глобальная переменная для отслеживания состояния
let extensionState = {
  buttonsAdded: false,
  searchAttempts: 0,
  maxSearchAttempts: 8,
  searchInterval: null,
  observer: null
};

// Функция для определения типа кнопки
const getButtonType = (button) => {
  const text = button.textContent?.toLowerCase().trim();
  const title = button.getAttribute('title')?.toLowerCase().trim();
  
  if ((text && text.includes('буду смотреть')) || (title && title.includes('буду смотреть'))) {
    return 'will-watch';
  }
  if ((text && (text.includes('смотреть сериал') || text.includes('смотреть фильм') || text.includes('смотреть'))) ||
      (title && title.includes('смотреть'))) {
    return 'watch';
  }
  
  return null;
};

// Функция для создания дополнительной кнопки
const createFreeButton = (originalButton, buttonType) => {
  const newButton = originalButton.cloneNode(true);
  
  // Получаем размеры оригинальной кнопки
  const originalRect = originalButton.getBoundingClientRect();
  const originalStyles = window.getComputedStyle(originalButton);
  
  // Полностью очищаем весь текстовый контент
  const allTextElements = newButton.querySelectorAll('*');
  allTextElements.forEach(element => {
    // Удаляем текстовое содержимое из всех элементов
    if (element.childNodes.length > 0) {
      element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = '';
        }
      });
    }
  });
  
  // Очищаем прямой текстовый контент кнопки
  newButton.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = '';
    }
  });
  
  // Определяем текст для новой кнопки
  const buttonText =  'Смотреть бесплатно';
  
  // Находим основной текстовый контейнер и заменяем его содержимое
  let textContainer = newButton.querySelector('span[class*="defaultText"], span[data-tid], .styles_defaultText__PgVb9');
  
  if (!textContainer) {
    // Если не нашли основной контейнер, ищем любой span или div с текстом
    const spans = newButton.querySelectorAll('span, div');
    for (const span of spans) {
      if (span.textContent.trim() || span.innerHTML.trim()) {
        textContainer = span;
        break;
      }
    }
  }
  
  if (textContainer) {
    // Полностью заменяем содержимое контейнера
    textContainer.innerHTML = '';
    textContainer.textContent = buttonText;
    
    // Применяем стабильные стили к текстовому контейнеру
    textContainer.style.cssText = `
      color: white !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      line-height: 1 !important;
      text-align: center !important;
      display: inline !important;
      vertical-align: baseline !important;
      position: static !important;
      transform: none !important;
      width: auto !important;
      height: auto !important;
      min-width: auto !important;
      min-height: auto !important;
      max-width: none !important;
      max-height: none !important;
      flex: none !important;
      margin: 0 !important;
      padding: 0 !important;
    `;
  } else {
    // Если не нашли контейнер, создаем новый
    newButton.innerHTML = `<span style="color: white !important; font-weight: 600 !important; font-size: 14px !important; line-height: 1 !important; text-align: center !important; display: inline !important; vertical-align: baseline !important; position: static !important; transform: none !important; width: auto !important; height: auto !important; min-width: auto !important; min-height: auto !important; max-width: none !important; max-height: none !important; flex: none !important; margin: 0 !important; padding: 0 !important;">${buttonText}</span>`;
  }
  
  // Добавляем отличительные классы
  newButton.classList.add('knp-ext-free-button');
  if (buttonType === 'will-watch') {
    newButton.classList.add('knp-ext-free-will-watch-button');
  } else {
    newButton.classList.add('knp-ext-free-watch-button');
  }
  
  // Устанавливаем размеры относительно оригинальной кнопки, но компактнее
  const targetHeight = Math.max(Math.min(originalRect.height, 50), 44);
  const targetWidth = Math.max(Math.min(originalRect.width * 0.9, 200), 160);
  
  // Принудительно устанавливаем размеры и стили для горизонтального расположения
  newButton.style.cssText += `
    min-height: ${targetHeight}px !important;
    max-height: ${targetHeight}px !important;
    height: ${targetHeight}px !important;
    min-width: ${targetWidth}px !important;
    width: auto !important;
    padding: 12px 24px !important;
    font-size: 14px !important;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: top !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    flex-shrink: 0 !important;
  `;
  
  // Удаляем старый href если есть
  if (newButton.href) {
    newButton.removeAttribute('href');
  }
  
  // Убираем все data-атрибуты чтобы избежать конфликтов
  const dataAttributes = [...newButton.attributes].filter(attr => attr.name.startsWith('data-'));
  dataAttributes.forEach(attr => newButton.removeAttribute(attr.name));
  
  // Обновляем title
  newButton.setAttribute('title', buttonText);
  
  // Добавляем обработчик клика
  newButton.addEventListener('click', (e) => {
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
  
  return newButton;
};

// Функция для поиска кнопок "Смотреть" и "Буду смотреть"
const findButtons = () => {
  const foundButtons = [];
  
  // Проверяем, не добавили ли мы уже кнопки
  if (document.querySelector('.knp-ext-free-button')) {
    console.log('Дополнительные кнопки уже добавлены');
    return [];
  }

  // Специфичные селекторы для Kinopoisk (в порядке приоритета)
  const kinopoiskSelectors = [
    // Высокий приоритет - основные кнопки
    '[data-test-id="Watch"]',
    '[data-testid="Watch"]',
    
    // По классам из HTML
    '.kinopoisk-watch-online-button',
    '[class*="kinopoisk-watch-online-button"]',
    
    // По структуре watchOnlineBlock
    '[class*="watchOnlineBlock"] button',
    '[class*="watchOnlineBlock"] a',
    
    // По классам кнопок
    '[class*="styles_watchOnlineButton"]',
    '[class*="styles_button"][class*="Q82i0"]',
    '[class*="style_button"][class*="PNtXT"]',
    
    // По data-tid кнопки
    '[data-tid*="watch"]',
    
    // Общие селекторы для кнопок "Смотреть"
    'a[href*="hd.kinopoisk.ru"]',
    'a[href*="watch"]',
    
    // По title атрибуту
    'button[title*="смотреть"]',
    'button[title*="Смотреть"]',
    'button[title*="Буду смотреть"]'
  ];

  console.log('🔍 Поиск кнопок по специфичным селекторам...');

  let watchButton = null;
  let willWatchButton = null;

  // Сначала ищем кнопку "Смотреть" (приоритетная)
  for (const selector of kinopoiskSelectors) {
    if (watchButton) break; // Если нашли кнопку "Смотреть", прекращаем поиск
    
    try {
      const elements = document.querySelectorAll(selector);
      
      for (const element of elements) {
        const buttonType = getButtonType(element);
        
        if (buttonType === 'watch') {
          const text = element.textContent?.toLowerCase().trim() || element.getAttribute('title') || '';
          console.log(`✅ Найдена кнопка "Смотреть": "${text}" по селектору: ${selector}`);
          watchButton = element;
          break;
        }
      }
    } catch (e) {
      console.warn(`Ошибка селектора ${selector}:`, e);
    }
  }

  // Если не нашли кнопку "Смотреть", ищем "Буду смотреть"
  if (!watchButton) {
    console.log('🔍 Кнопка "Смотреть" не найдена, ищем "Буду смотреть"...');
    
    for (const selector of kinopoiskSelectors) {
      if (willWatchButton) break;
      
      try {
        const elements = document.querySelectorAll(selector);
        
        for (const element of elements) {
          const buttonType = getButtonType(element);
          
          if (buttonType === 'will-watch') {
            const text = element.textContent?.toLowerCase().trim() || element.getAttribute('title') || '';
            console.log(`✅ Найдена кнопка "Буду смотреть": "${text}" по селектору: ${selector}`);
            willWatchButton = element;
            break;
          }
        }
      } catch (e) {
        console.warn(`Ошибка селектора ${selector}:`, e);
      }
    }
  }

  // Если не нашли ни одной кнопки по селекторам, ищем по тексту
  if (!watchButton && !willWatchButton) {
    console.log('🔍 Дополнительный поиск по тексту...');
    
    const allClickableElements = document.querySelectorAll('button, a, [role="button"], [class*="button"]');
    
    // Сначала ищем "Смотреть"
    for (const element of allClickableElements) {
      if (watchButton) break;
      
      const buttonType = getButtonType(element);
      
      if (buttonType === 'watch') {
        // Проверяем, что элемент видим
        const rect = element.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        
        // Проверяем, что кнопка не в блоке рекламы или похожих фильмов
        const isInMainContent = !element.closest('[class*="similar"]') && 
                               !element.closest('[class*="recommend"]') &&
                               !element.closest('[class*="ads"]') &&
                               !element.closest('[class*="banner"]');
        
        if (isVisible && isInMainContent) {
          const text = element.textContent?.toLowerCase().trim() || element.getAttribute('title') || '';
          console.log(`✅ Найдена кнопка "Смотреть" по тексту: "${text}"`);
          watchButton = element;
        }
      }
    }
    
    // Если не нашли "Смотреть", ищем "Буду смотреть"
    if (!watchButton) {
      for (const element of allClickableElements) {
        if (willWatchButton) break;
        
        const buttonType = getButtonType(element);
        
        if (buttonType === 'will-watch') {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          
          const isInMainContent = !element.closest('[class*="similar"]') && 
                                 !element.closest('[class*="recommend"]') &&
                                 !element.closest('[class*="ads"]') &&
                                 !element.closest('[class*="banner"]');
          
          if (isVisible && isInMainContent) {
            const text = element.textContent?.toLowerCase().trim() || element.getAttribute('title') || '';
            console.log(`✅ Найдена кнопка "Буду смотреть" по тексту: "${text}"`);
            willWatchButton = element;
          }
        }
      }
    }
  }

  // Добавляем найденную кнопку (приоритет у "Смотреть")
  if (watchButton) {
    foundButtons.push({ button: watchButton, type: 'watch' });
    console.log('🎯 Используем кнопку "Смотреть" (приоритетная)');
  } else if (willWatchButton) {
    foundButtons.push({ button: willWatchButton, type: 'will-watch' });
    console.log('🎯 Используем кнопку "Буду смотреть" (кнопка "Смотреть" не найдена)');
  }

  console.log(`📊 Найдено кнопок для обработки: ${foundButtons.length}`);
  
  return foundButtons;
};

// Функция для добавления дополнительных кнопок
const addFreeButtons = () => {
  // Проверяем, находимся ли мы на нужной странице
  if (!isMovieOrSeriesPage()) {
    console.log('Kinopoisk Extension: Не на странице фильма/сериала, пропускаем');
    return;
  }

  // Если кнопки уже добавлены, не ищем повторно
  if (extensionState.buttonsAdded) {
    return;
  }

  // Проверяем лимит попыток
  extensionState.searchAttempts++;
  if (extensionState.searchAttempts > extensionState.maxSearchAttempts) {
    console.log(`❌ Достигнут лимит попыток поиска кнопок (${extensionState.maxSearchAttempts}), остановка поиска`);
    clearSearchInterval();
    return;
  }

  console.log(`🔍 Попытка поиска кнопок: ${extensionState.searchAttempts}/${extensionState.maxSearchAttempts}`);

  // Находим кнопки
  const buttons = findButtons();
  
  if (buttons.length === 0) {
    console.log('Кнопки не найдены');
    return;
  }

  buttons.forEach(({ button, type }) => {
    // Проверяем, не добавили ли мы уже кнопку рядом с этой
    if (button.nextElementSibling?.classList.contains('knp-ext-free-button')) {
      console.log(`Дополнительная кнопка уже добавлена рядом с кнопкой типа: ${type}`);
      extensionState.buttonsAdded = true;
      clearSearchInterval();
      return;
    }

    try {
      const newButton = createFreeButton(button, type);
      
      // Находим родительский контейнер и применяем к нему flex стили
      const parentContainer = button.parentNode;
      if (parentContainer) {
        // Применяем flex стили к родительскому контейнеру
        parentContainer.style.cssText += `
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          flex-wrap: wrap !important;
        `;
        
        // Также применяем стили к оригинальной кнопке для лучшего выравнивания
        button.style.cssText += `
          flex-shrink: 0 !important;
          margin-right: 0 !important;
        `;
        
        // Вставляем новую кнопку после оригинальной
        parentContainer.insertBefore(newButton, button.nextSibling);
        const buttonText = 'Смотреть бесплатно';
        console.log(`🎉 Добавлена кнопка "${buttonText}" в одну линию`);
        
        // Отмечаем, что кнопки добавлены и останавливаем поиск
        extensionState.buttonsAdded = true;
        clearSearchInterval();
      }
    } catch (error) {
      console.error('❌ Ошибка при создании кнопки:', error);
    }
  });
};

// Функция для очистки интервала поиска
const clearSearchInterval = () => {
  if (extensionState.searchInterval) {
    clearInterval(extensionState.searchInterval);
    extensionState.searchInterval = null;
    console.log('🛑 Поиск кнопок остановлен');
  }
  
  if (extensionState.observer) {
    extensionState.observer.disconnect();
    extensionState.observer = null;
    console.log('🛑 Observer отключен');
  }
};

// Функция для сброса состояния при изменении URL
const resetExtensionState = () => {
  console.log('🔄 Сброс состояния расширения');
  extensionState.buttonsAdded = false;
  extensionState.searchAttempts = 0;
  clearSearchInterval();
};

// Функция для наблюдения за изменениями DOM (более оптимизированная)
const observeDOM = () => {
  // Отключаем предыдущий observer если есть
  if (extensionState.observer) {
    extensionState.observer.disconnect();
  }

  extensionState.observer = new MutationObserver((mutations) => {
    // Если кнопки уже добавлены, не реагируем на изменения
    if (extensionState.buttonsAdded) {
      return;
    }

    let shouldAddButton = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Проверяем, что добавлены значимые элементы (не просто текстовые узлы)
        const hasSignificantNodes = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node.tagName === 'BUTTON' || node.tagName === 'A' || node.querySelector('button, a'))
        );
        
        if (hasSignificantNodes) {
          shouldAddButton = true;
        }
      }
    });
    
    if (shouldAddButton) {
      // Добавляем задержку для завершения рендеринга
      setTimeout(addFreeButtons, 500);
    }
  });
  
  extensionState.observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return extensionState.observer;
};

// Функция для наблюдения за изменениями URL
const observeUrlChange = () => {
  let currentUrl = window.location.href;
  
  // Наблюдаем за изменениями в истории браузера
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    checkUrlChange();
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    checkUrlChange();
  };
  
  window.addEventListener('popstate', checkUrlChange);
  
  function checkUrlChange() {
    if (window.location.href !== currentUrl) {
      console.log(`🌐 URL изменился: ${currentUrl} -> ${window.location.href}`);
      currentUrl = window.location.href;
      resetExtensionState();
      
      // Запускаем поиск кнопок на новой странице с задержкой
      setTimeout(() => {
        if (isMovieOrSeriesPage()) {
          startButtonSearch();
        }
      }, 1000);
    }
  }
};

// Функция для запуска поиска кнопок с ограниченными попытками
const startButtonSearch = () => {
  console.log('🔍 Запуск поиска кнопок...');
  
  // Первая попытка сразу
  setTimeout(addFreeButtons, 500);
  
  // Настраиваем интервал с ограниченным количеством попыток
  extensionState.searchInterval = setInterval(() => {
    if (extensionState.buttonsAdded || extensionState.searchAttempts >= extensionState.maxSearchAttempts) {
      clearSearchInterval();
      return;
    }
    addFreeButtons();
  }, 2000); // Увеличиваем интервал до 2 секунд
  
  // Настраиваем наблюдение за DOM
  observeDOM();
  
  // Остановка поиска через максимальное время (20 секунд)
  setTimeout(() => {
    if (!extensionState.buttonsAdded) {
      console.log('⏰ Время поиска истекло, остановка');
      clearSearchInterval();
    }
  }, 20000);
};

// Инициализация расширения
const init = () => {
  console.log('🎬 Kinopoisk Free Watch Extension: Инициализация...');
  console.log('🌐 Текущий URL:', window.location.href);
  console.log('📄 Страница фильма/сериала:', isMovieOrSeriesPage());
  
  // Настраиваем отслеживание изменений URL
  observeUrlChange();
  
  // Запускаем поиск кнопок, если находимся на нужной странице
  if (isMovieOrSeriesPage()) {
    startButtonSearch();
  }
};

// Запускаем инициализацию
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 