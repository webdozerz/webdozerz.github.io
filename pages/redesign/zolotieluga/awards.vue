<script lang="ts" setup>
useSeoMeta({ title: 'Награды «Золотых лугов» | Концепт редизайна' })

const years = computed(() => {
  const m = new Map<string, typeof zlAwards>()
  zlAwards.forEach((a) => {
    const y = a.date.slice(-4)
    if (!m.has(y)) m.set(y, [])
    m.get(y)!.push(a)
  })
  return [...m.entries()]
})
const year = ref('all')
const shown = computed(() => (year.value === 'all' ? years.value : years.value.filter(([y]) => y === year.value)))
</script>

<template>
  <div class="zl-wrap zl-page">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="zlPath('/company')">О компании</NuxtLink></span>
      <span>Награды</span>
    </nav>
    <h1>Награды</h1>
    <p class="zl-page__lead">
      {{ zlAwardsTotal }} наград: медали и дипломы конкурсов «100 лучших товаров России», «Лучшие товары и услуги Тюменской области», фестивалей качества и
      выставок.
    </p>

    <div class="zl-tabs zl-awyears" role="tablist" aria-label="Год">
      <button type="button" role="tab" :class="{ 'is-on': year === 'all' }" @click="year = 'all'">Все <small>{{ zlAwards.length }}</small></button>
      <button v-for="[y, list] in years" :key="y" type="button" role="tab" :class="{ 'is-on': year === y }" @click="year = y">
        {{ y }} <small>{{ list.length }}</small>
      </button>
    </div>

    <div v-for="[y, list] in shown" :key="y" class="zl-awyear">
      <h2>{{ y }}</h2>
      <div class="zl-awards zl-awards--page">
        <article v-for="a in list" :key="a.date + a.title + a.items[0]" class="zl-award">
          <small>{{ a.date }}</small>
          <h3>{{ a.title }}</h3>
          <ul>
            <li v-for="t in a.items" :key="t">{{ t }}</li>
          </ul>
        </article>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.zl-awyears {
  margin-top: 28px;
}
.zl-awyear {
  margin-top: 36px;
  h2 {
    font-size: 28px;
    margin-bottom: 16px;
  }
}
.zl-awards--page {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
    font-size: 14px;
  }
}
@media (max-width: 989px) {
  .zl-awards--page {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 576px) {
  .zl-awards--page {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
