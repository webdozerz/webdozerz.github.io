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

## 2а. Статичный HTML

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

Образец — `foodgood`: `pages/redesign/foodgood.vue`, `utils/foodgood.ts`
(`fgProducts`, `fgPath()`, `fgImages`), `composables/useFoodgoodCart.ts`.

- Все классы с префиксом проекта (`fg-…`), глобальные стили оболочки в `<style lang="scss">`
  без scoped, но под корневым классом — иначе стили концепта протекут на остальной сайт.
- `useSeoMeta({ robots: 'noindex, nofollow' })`, шрифты концепта через `useHead`.
- Данные в комментарии шапки `utils/<slug>.ts`: источник и месяц съёмки.
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
