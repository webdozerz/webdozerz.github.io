# Быстрый старт: Nuxt Starter Kit

## Цель

Быстро развернуть современный Nuxt 3 проект с интеграцией всех ключевых технологий, которые были в junior-этапах. Этот этап предназначен для middle-разработчиков, чтобы не тратить время на базовую настройку и сразу приступить к продвинутым задачам.

---

## 1. Инициализация проекта

```bash
npx nuxi init my-nuxt-app
cd my-nuxt-app
pnpm install # или npm install / yarn install
```

---

## 2. Подключение и настройка технологий

### TypeScript

- Nuxt 3 поддерживает TypeScript из коробки.
- Все файлы создавайте с расширением `.ts` и используйте `<script setup lang="ts">` в компонентах.

### SCSS

- Установите SCSS:
  ```bash
  pnpm add -D sass
  ```
- В `nuxt.config.ts` добавьте глобальные стили:
  ```ts
  css: ['~/assets/scss/main.scss'],
  ```

### Pinia

- Установите:
  ```bash
  pnpm add pinia
  ```
- Nuxt автоматически интегрирует Pinia.

### VueUse

- Установите:
  ```bash
  pnpm add @vueuse/core
  ```
- Используйте любые composables из [VueUse](https://vueuse.org/).

### ESLint + Prettier

- Установите:
  ```bash
  pnpm add -D eslint @nuxt/eslint-config typescript-eslint prettier eslint-plugin-vue
  ```
- Добавьте конфиг `.eslintrc` и настройте автоформатирование.

### SSR и роутинг

- Nuxt поддерживает SSR и файловый роутинг из коробки.
- Страницы размещайте в папке `pages/`.

### REST API

- Для работы с API используйте `useFetch` или `useAsyncData`.
- Пример:
  ```ts
  const { data, pending, error } = await useFetch("/api/endpoint");
  ```

### Auth

- Используйте [Nuxt Auth Module](https://auth.nuxt.com/) или собственную реализацию через серверные маршруты.

### Web3

- Установите:
  ```bash
  pnpm add ethers web3
  ```
- Интегрируйте через composables.

### Testing

- Установите:
  ```bash
  pnpm add -D vitest @vue/test-utils
  ```
- Настройте тесты в папке `tests/`.

### SEO

- Используйте `useHead` и `useSeoMeta` для SEO-метаданных.
- Пример:
  ```ts
  useHead({
    title: "Главная страница",
    meta: [{ name: "description", content: "Описание" }],
  });
  ```

---

## Что включено из junior-этапов

### 5. Nuxt.js Роутинг

- **Темы:** SSR, файловый роутинг, динамические маршруты, useAsyncData.
- **Кратко:** Nuxt 3 поддерживает SSR и автоматический роутинг. Для динамических страниц используйте синтаксис `[param].vue` в папке `pages/`.
- **Подробнее:** [stage-5-nuxt-routing.md](../juniour/stage-5-nuxt-routing.md)

### 6. API и HTTP

- **Темы:** REST API, Repository pattern, HTTP-запросы, серверные маршруты.
- **Кратко:** Для работы с API используйте `useFetch`, `useAsyncData` и серверные маршруты из папки `server/api/`. Реализуйте паттерн Repository для изоляции логики работы с API.
- **Подробнее:** [stage-6-api-http.md](../juniour/stage-6-api-http.md)

### 7-10. Продвинутые этапы

- **Темы:** Аутентификация, Web3, тестирование, SEO.
- **Кратко:**
  - **Auth:** Используйте Nuxt Auth или собственную реализацию через серверные маршруты.
  - **Web3:** Интегрируйте библиотеки `ethers` или `web3` для работы с блокчейном.
  - **Testing:** Настройте Vitest и @vue/test-utils для unit- и e2e-тестов.
  - **SEO:** Используйте `useHead` и `useSeoMeta` для управления метаданными.
- **Подробнее:** [stage-7-8-9-10.md](../juniour/stage-7-8-9-10.md)

---

## 3. Пример структуры проекта

```
my-nuxt-app/
├─ assets/
│  └─ scss/
├─ components/
├─ composables/
├─ pages/
├─ plugins/
├─ public/
├─ server/
├─ store/ (если нужно)
├─ types/
├─ nuxt.config.ts
├─ tsconfig.json
├─ package.json
└─ ...
```

---

## 4. Полезные ссылки

- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Pinia Docs](https://pinia.vuejs.org/)
- [VueUse Docs](https://vueuse.org/)
- [Vitest Docs](https://vitest.dev/)
- [Nuxt Auth](https://auth.nuxt.com/)

---

## 5. Рекомендации

- Используйте auto-import Nuxt для composables и компонентов.
- Следуйте best practices из junior-этапов, но не повторяйте их вручную — всё уже интегрировано.
- Сразу работайте с продвинутыми задачами middle-уровня.

---

# Экспресс-опрос: Junior Fast-Track

## 1. HTML/CSS Основы

**Кратко:** HTML5, CSS3, SCSS, БЭМ.

**Вопросы для самопроверки:**

- В чём разница между блочным и строчным элементом?
- Как работает flexbox и grid?
- Как организовать структуру классов по БЭМ?
- Как подключить SCSS в проекте Nuxt?

---

## 2. JavaScript Базовый

**Кратко:** ES6+, DOM API, Fetch.

**Вопросы:**

- Чем отличается let от var?
- Как работает замыкание?
- Как получить элемент по id через DOM API?
- Как отправить GET-запрос с помощью fetch?

---

## 3. TypeScript

**Кратко:** Типизация, ООП.

**Вопросы:**

- Как объявить тип для объекта?
- Как работает интерфейс и тип в TypeScript?
- Как объявить функцию с generic-параметром?

---

## 4. Vue.js Компоненты

**Кратко:** Vue 3, Composition API.

**Вопросы:**

- Как создать компонент с помощью `<script setup>`?
- Как использовать ref и computed?
- Как пробросить пропсы и обработать событие?

---

## 5. Nuxt.js Роутинг

**Кратко:** SSR, роутинг.

**Вопросы:**

- Как работает файловый роутинг в Nuxt?
- Как реализовать динамический маршрут?
- Как использовать useAsyncData?

---

## 6. API и HTTP

**Кратко:** REST API, HTTP.

**Вопросы:**

- Как реализовать запрос к API в Nuxt?
- Как обработать ошибку запроса?
- Как использовать серверные маршруты?

---

## 7-10. Продвинутые этапы

**Кратко:** Auth, Web3, Testing, SEO.

**Вопросы:**

- Как реализовать аутентификацию в Nuxt?
- Как подключить Web3 библиотеку?
- Как написать unit-тест для компонента?
- Как добавить SEO-метаданные через useHead?

---

## Итог

**Проверьте свои ответы. Если есть пробелы — вернитесь к соответствующему junior-этапу для повторения.**
