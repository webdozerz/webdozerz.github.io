<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'

useSeoMeta({ title: 'Новости — Рыбокомбинат Донской | Концепт редизайна' })

// У оригинала 5 страниц новостей; в концепте перенесена первая (11 новостей), остальные ведут на оригинал.
const pages = [2, 3, 4, 5]
const [lead, ...rest] = rkNews
</script>

<template>
  <div class="rk-news">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink><span>Новости</span>
      </nav>
      <h1>Новости</h1>
    </div>
    <div class="rk-wrap">
      <NuxtLink :to="rkNewsPath(lead.id)" class="rk-newslead">
        <span class="rk-newslead__icon"><RkIcon name="award" :size="40" /></span>
        <span class="rk-newslead__text">
          <time>{{ lead.date }}</time>
          <b>{{ lead.title }}</b>
          <span>{{ lead.text[0] }}</span>
        </span>
      </NuxtLink>
      <div class="rk-newsgrid">
        <NuxtLink v-for="n in rest" :key="n.id" :to="rkNewsPath(n.id)" class="rk-newsitem">
          <time>{{ n.date }}</time>
          <b>{{ n.title }}</b>
          <span>{{ n.text[0] }}</span>
        </NuxtLink>
      </div>
      <nav class="rk-pager" aria-label="Страницы новостей">
        <b>1</b>
        <a v-for="n in pages" :key="n" :href="'https://rkdon.ru/news/?PAGEN_1=' + n" target="_blank" rel="noopener">{{ n }}</a>
        <small>Страницы 2–5 открываются на текущем сайте</small>
      </nav>
    </div>
  </div>
</template>

<style lang="scss">
.rk-newslead {
  display: flex;
  gap: 28px;
  align-items: center;
  padding: 32px 36px;
  border-radius: var(--rk-R);
  background: var(--rk-soft);
  &__icon {
    display: grid;
    place-items: center;
    width: 88px;
    height: 88px;
    border-radius: 22px;
    background: #fff;
    color: var(--rk-accent);
    flex: none;
  }
  &__text {
    display: grid;
    gap: 8px;
    time {
      font-weight: 700;
      color: var(--rk-accent);
    }
    b {
      font-family: var(--rk-head);
      font-weight: 600;
      font-size: clamp(24px, 2.8vw, 34px);
      line-height: 1.15;
      color: var(--rk-ink);
    }
    span {
      max-width: 820px;
      font-size: 16px;
    }
  }
  &:hover b {
    color: var(--rk-accent);
  }
}
.rk-newsgrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.rk-newsitem {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px 24px;
  border-radius: var(--rk-R);
  border: 1px solid var(--rk-line);
  transition: border-color 0.2s;
  time {
    font-size: 14px;
    font-weight: 700;
    color: var(--rk-accent);
  }
  b {
    font-size: 18px;
    line-height: 1.3;
    color: var(--rk-ink);
  }
  span {
    font-size: 14px;
    color: var(--rk-muted);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &:hover {
    border-color: #d9c4cc;
    b {
      color: var(--rk-accent);
    }
  }
}
.rk-pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  b,
  a {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-weight: 700;
  }
  b {
    background: var(--rk-accent);
    color: #fff;
  }
  a {
    border: 1px solid var(--rk-line);
    color: var(--rk-ink);
    &:hover {
      border-color: var(--rk-accent);
      color: var(--rk-accent);
    }
  }
  small {
    margin-left: 8px;
    color: var(--rk-muted);
  }
}
@media (max-width: 1199px) {
  .rk-newsgrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .rk-newslead {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 22px 20px;
    &__icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
    }
  }
  .rk-newsgrid {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .rk-pager small {
    width: 100%;
    margin-left: 0;
  }
}
</style>
