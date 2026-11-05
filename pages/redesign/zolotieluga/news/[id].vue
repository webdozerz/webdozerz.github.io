<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

const route = useRoute()
const item = computed(() => zlNews.find((n) => n.id === String(route.params.id)))
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Новость не найдена', fatal: true })
const n = computed(() => item.value!)
const others = computed(() => zlNews.filter((x) => x.id !== n.value.id))
useSeoMeta({ title: () => n.value.title + ' | Концепт редизайна' })
</script>

<template>
  <div class="zl-wrap zl-page zl-article">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="zlPath('/news')">Новости</NuxtLink></span>
      <span>{{ n.date }}</span>
    </nav>
    <div class="zl-article__grid">
      <article>
        <small class="zl-article__date"><ZlIcon name="calendar" :size="16" /> {{ n.date }}</small>
        <h1>{{ n.title }}</h1>
        <div class="zl-article__img"><img :src="zlImg(n.img)" alt="" width="300" height="180" /></div>
        <div class="zl-article__body">
          <p v-for="(t, i) in n.body" :key="i">{{ t }}</p>
        </div>
        <div class="zl-article__foot">
          <NuxtLink :to="zlPath('/news')" class="zl-link"><ZlIcon name="back" :size="18" /> Все новости</NuxtLink>
        </div>
      </article>
      <aside class="zl-article__side">
        <h2>Ещё новости</h2>
        <NuxtLink v-for="o in others" :key="o.id" :to="zlPath('/news/' + o.id)" class="zl-article__other">
          <img :src="zlImg(o.img)" alt="" width="96" height="64" loading="lazy" />
          <span
            ><small>{{ o.date }}</small>{{ o.title }}</span
          >
        </NuxtLink>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.zl-article {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 56px;
    align-items: start;
  }
  &__date {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--zl-muted);
    margin-bottom: 10px;
  }
  h1 {
    font-size: clamp(28px, 3vw, 40px);
    max-width: 820px;
  }
  &__img {
    margin-top: 24px;
    max-width: 560px;
    border-radius: var(--zl-R);
    overflow: hidden;
    background: var(--zl-surface);
    img {
      width: 100%;
    }
  }
  &__body {
    margin-top: 24px;
    max-width: 720px;
    font-size: 17px;
    line-height: 1.65;
    p + p {
      margin-top: 14px;
    }
  }
  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    max-width: 720px;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid var(--zl-line);
  }
  &__side {
    position: sticky;
    top: 110px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    border-radius: var(--zl-R);
    background: var(--zl-surface);
    h2 {
      font-size: 20px;
    }
  }
  &__other {
    display: flex;
    gap: 12px;
    font-size: 14px;
    line-height: 1.35;
    color: var(--zl-ink);
    img {
      width: 96px;
      height: 64px;
      object-fit: cover;
      border-radius: 10px;
      flex: none;
    }
    small {
      display: block;
      color: var(--zl-muted);
      font-size: 12px;
      margin-bottom: 2px;
    }
    &:hover {
      color: var(--zl-accent);
    }
  }
}
@media (max-width: 989px) {
  .zl-article__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }
  .zl-article__side {
    position: static;
  }
}
@media (max-width: 576px) {
  .zl-article__body {
    font-size: 16px;
  }
}
</style>
