<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

useSeoMeta({ title: 'Новости «Золотых лугов» | Концепт редизайна' })
const perPage = 9
const pages = Math.ceil(zlNewsTotal / perPage)
const page = ref(1)
const pager = computed(() => {
  const p = page.value
  const set = new Set([1, 2, 3, p - 1, p, p + 1, pages])
  const arr = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  arr.forEach((n, i) => {
    if (i && n - arr[i - 1] > 1) out.push('…')
    out.push(n)
  })
  return out
})
const go = (n: number) => {
  page.value = n
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="zl-wrap zl-page">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span>Новости</span>
    </nav>
    <h1>Новости</h1>
    <p class="zl-page__lead">Выставки, дегустации, новая продукция и жизнь компании — всего {{ zlNewsTotal }} новостей.</p>

    <div v-if="page === 1" class="zl-newsgrid zl-newslist">
      <NuxtLink v-for="(n, i) in zlNews" :key="n.id" :to="zlPath('/news/' + n.id)" class="zl-newscard" :class="{ 'is-big': i === 0 }">
        <div class="zl-newscard__img"><img :src="zlImg(n.img)" alt="" width="300" height="180" loading="lazy" /></div>
        <div class="zl-newscard__text">
          <small>{{ n.date }}</small>
          <h3>{{ n.title }}</h3>
          <p v-if="i === 0">{{ n.body[0] }}</p>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="zl-panel zl-newsempty">
      <span class="zl-demo"><ZlIcon name="doc" :size="16" /> Демо</span>
      <p>
        В концепте перенесены 5 последних новостей. Страница {{ page }} из {{ pages }} на сайте подтянется из той же ленты 1С-Битрикс — все
        {{ zlNewsTotal }} новостей сохранятся.
      </p>
      <button type="button" class="zl-btn zl-btn--line" @click="go(1)">К свежим новостям</button>
    </div>

    <nav class="zl-pager" aria-label="Страницы новостей">
      <button type="button" class="zl-pager__arrow" :disabled="page === 1" aria-label="Предыдущая" @click="go(page - 1)"><ZlIcon name="left" :size="18" /></button>
      <template v-for="(n, i) in pager" :key="i">
        <span v-if="n === '…'">…</span>
        <button v-else type="button" :class="{ 'is-on': n === page }" @click="go(n)">{{ n }}</button>
      </template>
      <button type="button" class="zl-pager__arrow" :disabled="page === pages" aria-label="Следующая" @click="go(page + 1)">
        <ZlIcon name="right" :size="18" />
      </button>
    </nav>
  </div>
</template>

<style lang="scss">
.zl-newslist {
  margin-top: 32px;
  .zl-newscard.is-big {
    grid-column: span 2;
    flex-direction: row;
    gap: 24px;
    align-items: stretch;
    .zl-newscard__img {
      flex: 1.1;
      aspect-ratio: auto;
      min-height: 280px;
      margin: 0;
    }
    .zl-newscard__text {
      flex: 1;
      padding: 8px 0;
    }
    h3 {
      font-size: 24px;
      margin-top: 6px;
    }
    p {
      margin-top: 12px;
      color: var(--zl-muted);
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
.zl-newscard__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.zl-newsempty {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  p {
    max-width: 640px;
  }
}
.zl-pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 40px;
  button,
  span {
    min-width: 42px;
    height: 42px;
    padding: 0 8px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }
  button {
    background: var(--zl-surface);
    color: var(--zl-ink);
    &:hover {
      color: var(--zl-accent);
    }
    &.is-on {
      background: var(--zl-accent);
      color: #fff;
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
  span {
    color: var(--zl-muted);
  }
}
@media (max-width: 989px) {
  .zl-newslist .zl-newscard.is-big {
    grid-column: 1 / -1;
  }
  .zl-newslist .zl-newscard:nth-child(3) {
    display: flex;
  }
}
@media (max-width: 768px) {
  .zl-newslist .zl-newscard.is-big {
    flex-direction: column;
    gap: 8px;
    .zl-newscard__img {
      flex: none;
      min-height: 0;
      aspect-ratio: 16 / 10;
    }
    h3 {
      font-size: 20px;
    }
  }
}
@media (max-width: 375px) {
  .zl-pager {
    gap: 4px;
    button,
    span {
      min-width: 36px;
      height: 38px;
      padding: 0 4px;
    }
  }
}
</style>
