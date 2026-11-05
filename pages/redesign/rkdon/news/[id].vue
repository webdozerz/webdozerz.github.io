<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'

const route = useRoute()
const idx = computed(() => rkNews.findIndex((n) => n.id === String(route.params.id)))
const n = computed(() => rkNews[idx.value])
if (!n.value) throw createError({ statusCode: 404, statusMessage: 'Новость не найдена', fatal: true })

useSeoMeta({ title: () => `${n.value?.title} — Рыбокомбинат Донской | Концепт редизайна` })

const prev = computed(() => rkNews[idx.value + 1])
const next = computed(() => rkNews[idx.value - 1])
</script>

<template>
  <div v-if="n" class="rk-newspage">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink>
        <span><NuxtLink :to="rkPath('/news')">Новости</NuxtLink></span>
      </nav>
      <time class="rk-newspage__date"><RkIcon name="calendar" :size="18" /> {{ n.date }}</time>
      <h1>{{ n.title }}</h1>
    </div>
    <div class="rk-wrap">
      <div class="rk-prose">
        <p v-for="(t, i) in n.text" :key="i">{{ t }}</p>
      </div>
      <nav class="rk-newspage__nav">
        <NuxtLink v-if="prev" :to="rkNewsPath(prev.id)" class="rk-newspage__step">
          <small><RkIcon name="back" :size="16" /> Раньше</small><b>{{ prev.title }}</b>
        </NuxtLink>
        <NuxtLink v-if="next" :to="rkNewsPath(next.id)" class="rk-newspage__step rk-newspage__step--next">
          <small>Позже <RkIcon name="arrow" :size="16" /></small><b>{{ next.title }}</b>
        </NuxtLink>
      </nav>
      <NuxtLink :to="rkPath('/news')" class="rk-link"><RkIcon name="back" :size="18" /> Возврат к списку</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.rk-newspage {
  .rk-pagehead h1 {
    max-width: 900px;
    font-size: clamp(30px, 3.8vw, 46px);
  }
  &__date {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-weight: 700;
    color: var(--rk-accent);
  }
  &__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 48px 0 24px;
    max-width: 900px;
  }
  &__step {
    display: grid;
    gap: 6px;
    padding: 18px 20px;
    border-radius: 18px;
    background: var(--rk-surface);
    small {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--rk-muted);
      font-weight: 700;
    }
    b {
      color: var(--rk-ink);
      line-height: 1.3;
    }
    &--next {
      grid-column: 2;
      text-align: right;
      small {
        justify-content: flex-end;
      }
    }
    &:hover b {
      color: var(--rk-accent);
    }
  }
}
@media (max-width: 576px) {
  .rk-newspage__nav {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-newspage__step--next {
    grid-column: auto;
  }
}
</style>
