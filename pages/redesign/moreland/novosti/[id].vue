<script lang="ts" setup>
// Запись новости: дата, заголовок, фото, текст, вложенный xlsx-прайс, «Предыдущая / Следующая», «Все новости».
// Если в новости цена товара из каталога — карточка товара с «В заявку».
import { mlBatches, mlDate, mlNewsItem, mlPath, mlProduct } from '~/utils/moreland'
import { mlNews, mlProducts } from '~/utils/moreland.data'
import MlCard from '~/components/redesign/moreland/MlCard.vue'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

const route = useRoute()
const n = computed(() => mlNewsItem(String(route.params.id)))
if (!n.value) throw createError({ statusCode: 404, statusMessage: 'Новость не найдена', fatal: false })
useSeoMeta({ title: () => `${n.value?.t ?? 'Новость'} — Морелэнд | Концепт редизайна` })

const idx = computed(() => mlNews.findIndex((x) => x.id === n.value!.id))
const newer = computed(() => mlNews[idx.value - 1])
const older = computed(() => mlNews[idx.value + 1])
// товары, цена которых взята из этой новости (кроме прайс-листов — там весь каталог)
const products = computed(() => {
  if (n.value!.file) return []
  const b = mlBatches.find((x) => x.news === n.value!.id && x.product)
  const fromSrc = mlProducts.filter((p) => p.srcUrl === n.value!.url)
  const extra = b ? [mlProduct(b.product)!] : []
  return [...new Map([...extra, ...fromSrc].map((p) => [p.id, p])).values()]
})
</script>

<template>
  <div v-if="n" class="ml-wrap ml-post">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="mlPath('/novosti/')">Новости</NuxtLink></span>
      <span>{{ n.t }}</span>
    </nav>
    <div class="ml-post__grid">
      <article class="ml-post__main">
        <span class="ml-ncard__date">{{ mlDate(n.date) }}</span>
        <h1>{{ n.t }}</h1>
        <p class="ml-post__text">{{ n.text }}</p>
        <p class="ml-post__sign">Команда Морелэнд</p>
        <a v-if="n.file" :href="n.file" class="ml-file ml-post__file" download>
          <MlIcon name="download" /><span><b>Прайс-лист, .xlsx</b><small>Скачать файл с сайта moreland.ru</small></span>
        </a>
        <img v-if="n.img" :src="n.img" :alt="n.t" class="ml-post__img" width="600" height="800" />
      </article>
      <aside class="ml-post__side">
        <div v-for="p in products" :key="p.id" class="ml-post__card"><MlCard :p="p" /></div>
        <div v-if="!products.length" class="ml-panel ml-post__ask">
          <h2>Заявка на отгрузку</h2>
          <p>Соберите заявку коробками по каталогу или скачайте прайс.</p>
          <NuxtLink :to="mlPath('/produkcija/')" class="ml-btn">Продукция и цены</NuxtLink>
        </div>
      </aside>
    </div>
    <nav class="ml-post__pager" aria-label="Другие новости">
      <NuxtLink v-if="older" :to="mlPath(`/novosti/${older.id}/`)" class="ml-post__pg"><MlIcon name="left" /><span><small>Предыдущая</small>{{ older.t }}</span></NuxtLink>
      <span v-else />
      <NuxtLink :to="mlPath('/novosti/')" class="ml-btn ml-btn--line">Все новости</NuxtLink>
      <NuxtLink v-if="newer" :to="mlPath(`/novosti/${newer.id}/`)" class="ml-post__pg ml-post__pg--r"><span><small>Следующая</small>{{ newer.t }}</span><MlIcon name="right" /></NuxtLink>
      <span v-else />
    </nav>
  </div>
</template>

<style lang="scss">
.ml-post {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 40px;
    align-items: start;
    padding-top: 20px;
  }
  &__main {
    max-width: 760px;
    h1 {
      margin-top: 6px;
      font-size: clamp(28px, 3.2vw, 42px);
      font-weight: 800;
    }
  }
  &__text {
    margin-top: 18px !important;
    font-size: 18px;
    line-height: 1.6;
    color: var(--ml-ink);
  }
  &__sign {
    margin-top: 12px !important;
    color: var(--ml-mute);
    font-style: italic;
  }
  &__file {
    margin-top: 20px;
    max-width: 420px;
  }
  &__img {
    margin-top: 24px;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--ml-R);
  }
  &__side {
    position: sticky;
    top: calc(var(--ml-head) + 16px);
    display: grid;
    gap: 16px;
  }
  &__ask {
    display: grid;
    gap: 10px;
    justify-items: start;
    h2 {
      font-size: 20px;
    }
    p {
      font-size: 14px;
      color: var(--ml-mute);
    }
  }
  &__pager {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 16px;
    align-items: center;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--ml-line);
  }
  &__pg {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    font-weight: 800;
    color: var(--ml-ink);
    span {
      display: grid;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    small {
      font-size: 12.5px;
      color: var(--ml-mute);
      font-weight: 600;
    }
    .ml-icon {
      color: var(--ml-acc);
    }
    &--r {
      justify-content: flex-end;
      text-align: right;
    }
    &:hover {
      color: var(--ml-acc);
    }
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__side {
      position: static;
      max-width: 360px;
    }
  }
  @media (max-width: 576px) {
    &__text {
      font-size: 16.5px;
    }
    &__pager {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      .ml-btn {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }
  }
}
</style>
