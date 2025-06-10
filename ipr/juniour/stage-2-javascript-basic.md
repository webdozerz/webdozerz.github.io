# Этап 2: JavaScript Базовый - Технические задания

## Задание 2.1: Калькулятор криптовалют

### 🎯 Цель

Создать интерактивный калькулятор для конвертации криптовалют

### 📋 Требования

#### Функциональные требования:

- [ ] Конвертация между USD, BTC, ETH, ADA, DOT
- [ ] Поле ввода суммы с валидацией
- [ ] Выпадающие списки выбора валют
- [ ] Автоматический расчет при изменении значений
- [ ] Отображение текущих курсов

#### Технические требования:

- [ ] Vanilla JavaScript (ES6+)
- [ ] Работа с DOM API
- [ ] Event listeners для интерактивности
- [ ] Валидация пользовательского ввода
- [ ] Обработка ошибок

### 💡 Подсказки

**HTML структура:**

```html
<section class="calculator">
  <div class="calculator__input-group">
    <input
      type="number"
      class="calculator__amount"
      id="fromAmount"
      min="0"
      step="0.01"
    />
    <select class="calculator__currency" id="fromCurrency">
      <option value="usd">USD</option>
      <option value="btc">BTC</option>
    </select>
  </div>

  <button class="calculator__swap" id="swapCurrencies">⇄</button>

  <div class="calculator__input-group">
    <input type="number" class="calculator__amount" id="toAmount" readonly />
    <select class="calculator__currency" id="toCurrency">
      <option value="btc">BTC</option>
      <option value="usd">USD</option>
    </select>
  </div>
</section>
```

**JavaScript основы:**

```javascript
class CryptoCalculator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.rates = {};
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadRates();
  }

  bindEvents() {
    const fromAmount = this.container.querySelector("#fromAmount");
    const fromCurrency = this.container.querySelector("#fromCurrency");

    fromAmount.addEventListener("input", (e) => this.calculate());
    fromCurrency.addEventListener("change", (e) => this.calculate());
  }

  calculate() {
    // Логика расчета
  }
}
```

### ❓ Вопросы для изучения

1. **Event Handling**: Какие события можно слушать у input элементов?
2. **DOM Manipulation**: Как правильно получать и устанавливать значения элементов?
3. **Data Validation**: Как валидировать числовой ввод в JavaScript?
4. **Error Handling**: Как обрабатывать ошибки при работе с пользовательским вводом?

### 🔍 Критерии оценки

- [ ] **Функциональность** (30): Все расчеты работают корректно
- [ ] **UX** (20): Удобный и интуитивный интерфейс
- [ ] **Валидация** (20): Правильная обработка некорректного ввода
- [ ] **Код** (30): Чистый, читаемый JavaScript

---

## Задание 2.2: Фильтрация и поиск криптовалют

### 🎯 Цель

Добавить поиск и фильтрацию в список криптовалют

### 📋 Требования

#### Функциональные требования:

- [ ] Поиск по названию криптовалюты
- [ ] Фильтр по изменению цены (рост/падение)
- [ ] Сортировка по цене, названию, изменению
- [ ] Сброс всех фильтров
- [ ] Подсветка найденного текста

#### Технические требования:

- [ ] Реал-тайм поиск при наборе
- [ ] Debounce для оптимизации
- [ ] Работа с массивами (filter, sort, map)
- [ ] Манипуляция DOM для отображения результатов

### 💡 Подсказки

**Debounce функция:**

```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Использование
const debouncedSearch = debounce(performSearch, 300);
searchInput.addEventListener("input", debouncedSearch);
```

**Фильтрация данных:**

```javascript
class CryptoFilter {
  constructor(data) {
    this.originalData = data;
    this.filteredData = [...data];
  }

  search(query) {
    this.filteredData = this.originalData.filter((crypto) =>
      crypto.name.toLowerCase().includes(query.toLowerCase())
    );
    return this;
  }

  filterByTrend(trend) {
    if (trend === "up") {
      this.filteredData = this.filteredData.filter(
        (crypto) => crypto.change > 0
      );
    } else if (trend === "down") {
      this.filteredData = this.filteredData.filter(
        (crypto) => crypto.change < 0
      );
    }
    return this;
  }

  sortBy(field, direction = "asc") {
    this.filteredData.sort((a, b) => {
      if (direction === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    return this;
  }

  getResults() {
    return this.filteredData;
  }
}
```

### ❓ Вопросы для изучения

1. **Array Methods**: Чем отличаются filter, map, reduce? Когда использовать каждый?
2. **Performance**: Почему нужен debounce и как он работает?
3. **String Methods**: Какие методы строк полезны для поиска?
4. **Sorting**: Как работает функция сравнения в Array.sort()?

---

## Задание 2.3: API интеграция с CoinGecko

### 🎯 Цель

Интегрировать реальное API для получения данных о криптовалютах

### 📋 Требования

#### Функциональные требования:

- [ ] Загрузка данных с CoinGecko API
- [ ] Отображение состояния загрузки
- [ ] Обработка ошибок сети
- [ ] Кэширование данных на стороне клиента
- [ ] Автообновление данных каждые 30 секунд

#### Технические требования:

- [ ] Использование Fetch API
- [ ] Async/await для асинхронных операций
- [ ] Try/catch для обработки ошибок
- [ ] LocalStorage для кэширования
- [ ] SetInterval для автообновления

### 💡 Подсказки

**API Service класс:**

```javascript
class CoinGeckoAPI {
  constructor() {
    this.baseURL = "https://api.coingecko.com/api/v3";
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 минут
  }

  async fetchCryptoData() {
    const cacheKey = "crypto-data";
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.baseURL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      throw error;
    }
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}
```

**Loading состояния:**

```javascript
class LoadingManager {
  constructor() {
    this.isLoading = false;
    this.loadingElement = document.querySelector(".loading");
  }

  show() {
    this.isLoading = true;
    this.loadingElement.classList.add("loading--visible");
  }

  hide() {
    this.isLoading = false;
    this.loadingElement.classList.remove("loading--visible");
  }

  async withLoading(asyncFunction) {
    try {
      this.show();
      const result = await asyncFunction();
      return result;
    } finally {
      this.hide();
    }
  }
}
```

### ❓ Вопросы для изучения

1. **Async Programming**: В чем разница между Promise и async/await?
2. **HTTP**: Какие HTTP статусы существуют и что они означают?
3. **Error Handling**: Как правильно обрабатывать ошибки в async функциях?
4. **Caching**: Зачем нужно кэширование и какие стратегии существуют?

---

## Задание 2.4: Модальные окна

### 🎯 Цель

Создать систему модальных окон для детальной информации

### 📋 Требования

#### Функциональные требования:

- [ ] Модальное окно с детальной информацией о криптовалюте
- [ ] Закрытие по клику вне модального окна
- [ ] Закрытие по клавише Escape
- [ ] Блокировка скролла страницы при открытом модальном окне
- [ ] Анимации открытия/закрытия

#### Технические требования:

- [ ] Event delegation для открытия модальных окон
- [ ] Управление focus для accessibility
- [ ] Шаблонизация контента модального окна
- [ ] Очистка event listeners при закрытии

### 💡 Подсказки

**Modal класс:**

```javascript
class Modal {
  constructor() {
    this.modal = null;
    this.isOpen = false;
    this.focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.className = "modal";
    this.modal.innerHTML = `
      <div class="modal__backdrop"></div>
      <div class="modal__content">
        <button class="modal__close" aria-label="Закрыть">✕</button>
        <div class="modal__body"></div>
      </div>
    `;
    document.body.appendChild(this.modal);
  }

  bindEvents() {
    // Закрытие по клику на backdrop
    this.modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal__backdrop")) {
        this.close();
      }
    });

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  open(content) {
    this.modal.querySelector(".modal__body").innerHTML = content;
    this.modal.classList.add("modal--open");
    document.body.classList.add("modal-open");
    this.isOpen = true;
    this.trapFocus();
  }

  close() {
    this.modal.classList.remove("modal--open");
    document.body.classList.remove("modal-open");
    this.isOpen = false;
  }

  trapFocus() {
    const focusableContent = this.modal.querySelectorAll(
      this.focusableElements
    );
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    firstFocusableElement.focus();

    this.modal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}
```

### ❓ Вопросы для изучения

1. **Event Bubbling**: Как работает всплытие событий и event delegation?
2. **Accessibility**: Что такое focus trap и зачем он нужен?
3. **DOM Manipulation**: Как создавать элементы программно?
4. **CSS Classes**: Как управлять классами через JavaScript?

---

## Задание 2.5: Переключение темы

### 🎯 Цель

Реализовать переключение между светлой и темной темами

### 📋 Требования

#### Функциональные требования:

- [ ] Переключатель темы в header
- [ ] Сохранение выбранной темы в localStorage
- [ ] Применение темы при загрузке страницы
- [ ] Учет системных предпочтений пользователя
- [ ] Плавная анимация перехода между темами

#### Технические требования:

- [ ] CSS custom properties для цветовой схемы
- [ ] localStorage API для сохранения
- [ ] matchMedia API для определения системной темы
- [ ] Event listeners для переключателя

### 💡 Подсказки

**CSS Variables:**

```css
:root {
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-primary: #007bff;
  --color-card-bg: #f8f9fa;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
  --color-primary: #4dabf7;
  --color-card-bg: #2d2d2d;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
```

**Theme Manager:**

```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.init();
  }

  init() {
    this.currentTheme = this.getInitialTheme();
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  getInitialTheme() {
    // Проверяем localStorage
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    // Проверяем системные предпочтения
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
    this.updateToggleButton();
  }

  toggle() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }

  bindEvents() {
    const toggle = document.querySelector(".theme-toggle");
    toggle.addEventListener("click", () => this.toggle());

    // Слушаем изменения системной темы
    window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
      if (!localStorage.getItem("theme")) {
        this.applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  updateToggleButton() {
    const toggle = document.querySelector(".theme-toggle");
    toggle.setAttribute(
      "aria-label",
      `Переключить на ${this.currentTheme === "light" ? "темную" : "светлую"} тему`
    );
    toggle.textContent = this.currentTheme === "light" ? "🌙" : "☀️";
  }
}
```

### ❓ Вопросы для изучения

1. **CSS Variables**: Как работают CSS custom properties и какие у них преимущества?
2. **LocalStorage**: Что можно хранить в localStorage и какие есть ограничения?
3. **Media Queries**: Как определить системные предпочтения пользователя?
4. **Accessibility**: Как сделать переключатель темы доступным?

---

## 📊 Общая оценка этапа 2

| Критерий           | Баллы   | Описание                          |
| ------------------ | ------- | --------------------------------- |
| JavaScript основы  | 30      | Работа с DOM, события, функции    |
| Асинхронность      | 25      | Fetch API, Promise, async/await   |
| Архитектура кода   | 25      | Классы, модули, чистый код        |
| UX/Интерактивность | 20      | Удобство использования            |
| **Итого**          | **100** | Минимум 70 для перехода к этапу 3 |

### 🎯 Следующий этап

После завершения этапа 2 переходим к **Этапу 3: TypeScript + Улучшенная архитектура**.
