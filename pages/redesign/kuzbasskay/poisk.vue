<script lang="ts" setup>
import { kzSearchIndex } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

// Поиск по концепту — у оригинала полнотекстовый поиск по страницам и рецептам (/search/?search_query=)
useSeoMeta({ title: 'Поиск — Кузбасская птицефабрика | Концепт редизайна' })
const route = useRoute()
const router = useRouter()
const q = ref(String(route.query.q || ''))
watch(
  () => route.query.q,
  (v) => (q.value = String(v || '')),
)
const index = kzSearchIndex()
const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
const hits = computed(() => {
  const words = norm(q.value).split(/\s+/).filter((w) => w.length > 1)
  if (!words.length) return []
  return index
    .map((h) => {
      const t = norm(h.title)
      const x = norm(h.text)
      let score = 0
      for (const w of words) {
        if (t.includes(w)) score += 3
        else if (x.includes(w)) score += 1
        else return null
      }
      return { h, score }
    })
    .filter((r): r is { h: (typeof index)[number]; score: number } => !!r)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.h)
})
const submit = () => router.replace({ query: q.value.trim() ? { q: q.value.trim() } : {} })
const popular = ['яйцо', 'фарш', 'комбикорм для кур', 'премикс свиней', 'вакансии', 'реквизиты']
const set = (p: string) => {
  q.value = p
  submit()
}
</script>

<template>
  <div>
    <KzHead title="Поиск по сайту" />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <form class="kz-bigsearch" role="search" @submit.prevent="submit">
          <KzIcon name="search" />
          <input v-model="q" type="search" placeholder="Например: яйцо С0, ПК1, бройлер" aria-label="Что найти" />
          <button type="submit" class="kz-btn">Найти</button>
        </form>
        <div class="kz-chips kz-bigsearch__pop">
          <button v-for="p in popular" :key="p" type="button" class="kz-chip" @click="set(p)">{{ p }}</button>
        </div>
        <p v-if="q.trim() && route.query.q" class="kz-found">Найдено: {{ hits.length }}</p>
        <ul v-if="hits.length" class="kz-hits">
          <li v-for="h in hits" :key="h.to + h.title">
            <a v-if="h.ext" :href="h.to" target="_blank" rel="noopener"><small>{{ h.kind }} · на оригинале</small><b>{{ h.title }}</b><span>{{ h.text.slice(0, 160) }}</span></a>
            <NuxtLink v-else :to="h.to"><small>{{ h.kind }}</small><b>{{ h.title }}</b><span>{{ h.text.slice(0, 160) }}{{ h.text.length > 160 ? '…' : '' }}</span></NuxtLink>
          </li>
        </ul>
        <p v-else-if="q.trim() && route.query.q" class="kz-empty">Ничего не нашли. Попробуйте другое слово или позвоните в отдел продаж.</p>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
.kz-bigsearch {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 760px;
  padding: 6px 6px 6px 18px;
  border: 1px solid #e0d6c4;
  border-radius: 18px;
  background: #fff;
  color: var(--kz-muted);
  box-shadow: 0 6px 22px rgba(61, 42, 18, 0.07);

  input {
    flex: 1;
    width: 0;
    min-width: 0;
    min-height: 44px;
    border: 0;
    background: none;
    color: var(--kz-ink);
    font-size: 17px;
    outline: none;
  }
  &:focus-within {
    border-color: var(--kz-accent);
  }
  &__pop {
    margin-top: 14px;
  }
}
.kz-found {
  margin: 26px 0 12px;
  color: var(--kz-muted);
  font-weight: 700;
}
ul.kz-hits {
  display: grid;
  gap: 10px;
  max-width: 860px;

  a {
    display: grid;
    gap: 2px;
    padding: 14px 18px;
    border: 1px solid var(--kz-line);
    border-radius: 18px;

    &:hover {
      border-color: var(--kz-accent);
    }
  }
  small {
    color: var(--kz-accent-ink);
    font-size: 13px;
    font-weight: 800;
  }
  b {
    color: var(--kz-ink);
    font-size: 17px;
    font-weight: 800;
    line-height: 1.35;
  }
  span {
    color: var(--kz-muted);
    font-size: 14px;
    line-height: 1.45;
  }
}
</style>
