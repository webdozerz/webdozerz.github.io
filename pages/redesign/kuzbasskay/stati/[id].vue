<script lang="ts" setup>
import { kzArticle127, kzArticles, kzOrig, kzPath } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

// В концепте полностью — одна статья (id 127), остальные ведут на оригинал
const route = useRoute()
if (String(route.params.id) !== '127') throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
const a = kzArticle127
useSeoMeta({ title: `${a.title} — Кузбасская птицефабрика | Концепт редизайна` })
const more = kzArticles.filter((x) => !x.local)
</script>

<template>
  <div>
    <KzHead :title="a.title" :crumbs="[{ label: 'Статьи', to: kzPath('/stati') }]" />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-intro">
        <article class="kz-prose">
          <p class="kz-artlead">{{ a.lead }}</p>
          <p v-for="t in a.text" :key="t">{{ t }}</p>
          <div class="kz-panel kz-panel--white kz-tablewrap kz-arttable">
            <table class="kz-table">
              <thead><tr><th>Категория</th><th>Вес, г (мин — макс)</th><th>Средняя масса, г</th></tr></thead>
              <tbody>
                <tr v-for="r in a.table" :key="r[0]"><td>{{ r[0] }}</td><td>{{ r[1] }}</td><td>{{ r[2] }}</td></tr>
              </tbody>
            </table>
          </div>
          <h2 class="kz-arth2">Какие яйца вкуснее — белые или тёмные?</h2>
          <p>{{ a.colour }}</p>
          <p><NuxtLink :to="kzPath('/stati')" class="kz-link"><KzIcon name="left" :size="18" />Все статьи</NuxtLink></p>
        </article>
        <aside class="kz-panel kz-panel--yellow kz-buy">
          <h3>Яйцо фабрики</h3>
          <p>С0, С1 и С2 в упаковке по 10 штук и лоток на 30 — посмотрите, как отличаются категории.</p>
          <NuxtLink :to="kzPath('/produkciya/yajco')" class="kz-btn">Калибровка яйца</NuxtLink>
          <h3 class="kz-artmore">Ещё статьи</h3>
          <a v-for="m in more" :key="m.id" :href="kzOrig(`/article/?id=${m.id}`)" target="_blank" rel="noopener" class="kz-buy__tel"><b>{{ m.title }}</b></a>
        </aside>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-artlead {
  color: var(--kz-ink);
  font-size: 19px;
  font-weight: 700;
}
.kz-arttable {
  margin: 20px 0;
}
.kz-arth2 {
  margin: 28px 0 10px;
  font-size: 24px;
  font-weight: 900;
}
.kz-artmore {
  margin-top: 10px;
}
</style>
