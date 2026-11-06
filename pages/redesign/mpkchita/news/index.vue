<script lang="ts" setup>
useSeoMeta({ title: 'Акции и новинки — Маккавеевский пищекомбинат | Концепт редизайна' })
const ui = useMpkchitaUi()
const kinds = ['Все', 'Акция', 'Новинка', 'Производство'] as const
const kind = ref<(typeof kinds)[number]>('Все')
const list = computed(() => mkNews.filter((n) => kind.value === 'Все' || n.kind === kind.value))
const left = (n: MkNews) => mkPromoDaysLeft(n, ui.now.value)
</script>

<template>
  <div class="mk-wrap mk-news">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
    </nav>
    <h1 class="mk-page-title">Акции и новинки</h1>
    <div class="mk-news__kinds">
      <button v-for="k in kinds" :key="k" type="button" class="mk-chip" :class="{ 'is-on': kind === k }" @click="kind = k">
        {{ k === 'Все' ? 'Все' : k === 'Акция' ? 'Акции' : k === 'Новинка' ? 'Новинки' : 'Производство' }}
        <small>{{ k === 'Все' ? mkNews.length : mkNews.filter((n) => n.kind === k).length }}</small>
      </button>
    </div>
    <div class="mk-news__grid">
      <NuxtLink v-for="n in list" :key="n.id" :to="mkPath('/news/' + n.id)" class="mk-post">
        <span class="mk-post__pic">
          <img :src="mkImg(n.img)" :alt="n.title" width="900" height="1273" loading="lazy" />
        </span>
        <span class="mk-flag" :class="{ 'mk-flag--red': n.kind === 'Акция', 'mk-flag--grey': n.kind === 'Производство' }">{{ n.kind }}</span>
        <b>{{ n.title }}</b>
        <small v-if="left(n)">Ещё {{ mkPlural(left(n)!, 'день', 'дня', 'дней') }}</small>
      </NuxtLink>
    </div>
  </div>
</template>
