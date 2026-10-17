# Интеграция в репозиторий webdozerz.github.io

Сайт — Nuxt 3, деплоится GitHub Actions (`.github/workflows/nuxtjs.yml`) при пуше
в `master`, домен `andryushov.me` (webdozerz.github.io редиректит туда). Каталог
концептов — `pages/redesign/index.vue`, адрес `https://andryushov.me/redesign/`.

`slug` — короткое латинское имя по домену клиента (`sttorg70`, `foodgood`).

## 1. Регистрация в каталоге (оба стека)

В `pages/redesign/index.vue` добавь объект в массив `projects`:

```ts
{
  to: '/redesign/<slug>/',
  title: 'Название бизнеса',
  text: 'Чем занимается, одна фраза. Что в концепте: главная, каталог, карточка, корзина…',
  source: 'https://оригинал.ru',
  tags: ['HTML/CSS', 'WooCommerce', 'только визуал'],   // или ['Nuxt 3', 'Vue', 'e-commerce']
  plain: true,   // только для статичного HTML: ссылка <a>, а не NuxtLink, и ClientOnly
},
```

`plain: true` нужен потому, что у статичного концепта нет Nuxt-маршрута: NuxtLink
и краулер prerender пытались бы его отрендерить.

## 2а. Статичный HTML (только по просьбе пользователя)

```
public/redesign/<slug>/
  index.html  catalog.html  product.html  cart.html  delivery.html (по набору страниц)
  assets/styles.css
  assets/app.js
```

В `nuxt.config.ts` добавь путь в `nitro.prerender.ignore`:

```ts
nitro: { prerender: { ignore: ['/redesign/sttorg70', '/redesign/<slug>'] } },
```

Каркас каждой страницы:

```html
<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Страница | Бизнес, концепт редизайна</title>
<meta name="robots" content="noindex,nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css"></head><body>
<div class="concept">Концепт редизайна. Это не официальный сайт магазина, заказы здесь никуда не отправляются.<a href="https://оригинал.ru" target="_blank" rel="noopener">Оригинал</a></div>
… шапка, main, подвал, таббар, модалка входа …
<script src="assets/app.js"></script></body></html>
```

Картинки — по URL оригинала (не копировать в репо: это контент владельца, и так
концепт сразу показывает его реальный каталог). Внутренние ссылки — относительные
(`catalog.html`), чтобы работали и локально, и на сайте.

Общие блоки на всех страницах правь одним скриптом с проверкой, что замена нашлась:

```python
import glob
for f in glob.glob('public/redesign/<slug>/*.html'):
    s = open(f, encoding='utf-8').read()
    assert OLD in s, f
    open(f, 'w', encoding='utf-8').write(s.replace(OLD, NEW))
```

Локальный просмотр: `.claude/launch.json` с конфигом `redesign-static`
(`python3 -m http.server 4173 --directory public/redesign`), открывать
`http://localhost:4173/<slug>/index.html`.

## 2б. Vue/Nuxt

```
pages/redesign/<slug>.vue                 оболочка: баннер концепта, шапка, <NuxtPage />, подвал
pages/redesign/<slug>/index.vue           главная
pages/redesign/<slug>/catalog/[[collection]].vue
pages/redesign/<slug>/product/[id].vue
pages/redesign/<slug>/cart.vue …
components/redesign/<slug>/*.vue          ProductCard, AddToCart, SectionHead…
utils/<slug>.ts                           типы, массив товаров, картинки, helper <prefix>Path()
composables/use<Slug>Cart.ts              useState + localStorage, persist() в оболочке
```

Образцы — `sanych` (оболочка, компоненты `SnBuy`/`SnQty`, корзина с разделкой и весом) и `foodgood`: `pages/redesign/foodgood.vue`, `utils/foodgood.ts`
(`fgProducts`, `fgPath()`, `fgImages`), `composables/useFoodgoodCart.ts`.

- Все классы с префиксом проекта (`fg-…`), глобальные стили оболочки в `<style lang="scss">`
  без scoped, но под корневым классом — иначе стили концепта протекут на остальной сайт.
- Сброс элементов концепта (`p`, `h1–h3`, `a`, `img`, `button`) пиши через
  `:where(.<prefix>) p {…}`, а не `.<prefix> p {…}`: у второго специфичность (0,1,1)
  выше, чем у класса блока, и он обнулит все `margin-top` у абзацев (на tomich так
  слиплась линия под кнопками первого экрана). По той же причине глобальный
  `ul[class] { margin: 0 }` портфолио перебивает `.block__list { margin }` — пиши
  `& &__list` или `ul.block__list`.
- `<img width height>` с CSS `aspect-ratio` обязательно с `height: auto`: атрибут `height`
  работает как CSS-высота, и картинка вырастает до натуральной (фото фасада на tomich
  вышло на полэкрана).
- `useSeoMeta({ robots: 'noindex, nofollow' })`, шрифты концепта через `useHead`.
- Данные в комментарии шапки `utils/<slug>.ts`: источник и месяц съёмки.
- **CSS дочерней страницы грузится только вместе с ней.** Стиль, который нужен двум
  страницам, клади в оболочку или в компонент, иначе на второй странице он пропадёт
  (sanych: отступы секций «Опта» и «Контактов» жили в `delivery.vue`). Мобильные правила
  компонента — в самом компоненте, не в странице, где он впервые встретился.
- **Картинки оригинала по http** (у конструкторов вроде setup.ru поддомен `i.<домен>`
  без https) на https-странице концепта не загрузятся. Тогда копируй их в
  `public/redesign/<slug>/img/` с латинскими именами и ужимай:
  `sips -Z 720 -s format jpeg -s formatOptions normal in --out out.jpg` (~50 КБ на фото).
  В шапке `utils/<slug>.ts` укажи, почему картинки лежат в репозитории.
- Генерацию товаров из снятого каталога делай скриптом (Python → TS-массив), а описания
  чисти руками: SEO-вода оригинала («Ищете идеальное мясо?») в концепт не идёт.
- Перестраивая сетку во flex-колонку на телефоне (`display: flex; flex-direction:
  column`, `display: contents` у обёртки, чтобы поменять порядок), сбрасывай
  `align-items: start` от десктопной сетки на `stretch`. Иначе строки корзины сжимаются
  до содержимого и не доходят до правого края (sanych, 390 px). Ловит `spacing-check.js`
  (`narrow-block`).
- Колонка grid с `auto` растягивается до min-content содержимого: у блока с
  сегментными кнопками в узкой карточке ставь `grid-template-columns: minmax(0, 1fr)`.
- Проверка: `npm run dev` (или preview_start), затем `npm run generate` — той же командой
  собирает GitHub Actions; она не должна падать на новых маршрутах.

## 3. Коммит и деплой

Только по просьбе пользователя. В коммит — файлы концепта, строка каталога, правка
`nuxt.config.ts`. Не включай чужие изменения (`.gitignore`, `.ignore`, pnpm-файлы,
`.claude/launch.json`), если пользователь не просил.

Стиль сообщений — conventional commits, как в истории репо:
`feat(redesign): add <slug> redesign concept`, `fix(redesign): <slug> …`.

После пуша:

```bash
gh run list --limit 1                         # найти запуск по коммиту
gh run watch <id> --exit-status
curl -sL https://andryushov.me/redesign/<slug>/ | grep -c '<уникальная строка нового кода>'
```

Ссылку для письма отдавай только после того, как живая страница отдаёт новую версию.
