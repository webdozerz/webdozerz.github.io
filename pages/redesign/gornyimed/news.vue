<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'

useSeoMeta({ title: 'Новости и статьи | Пасеки Соловьёвых, концепт редизайна' })

const route = useRoute()
const router = useRouter()
const PER = 8
const tab = computed(() => (route.query.tab === 'stati' ? 'stati' : 'news'))
const pages = Math.ceil(gmNews.length / PER)
const page = computed(() => Math.min(pages, Math.max(1, Number(route.query.page) || 1)))
const list = computed(() => gmNews.slice((page.value - 1) * PER, page.value * PER))
const open = ref<number | null>(null)
const go = (n: number) => {
  router.push({ query: { ...route.query, page: n > 1 ? String(n) : undefined } })
  open.value = null
}
// Номера страниц с многоточием, как в пейджере оригинала
const nums = computed(() => {
  const out: (number | '…')[] = []
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page.value) <= 1) out.push(i)
    else if (out[out.length - 1] !== '…') out.push('…')
  }
  return out
})

// Ссылка с главной вида #n5 — открываем нужную новость на её странице
onMounted(() => {
  const m = /^#n(\d+)$/.exec(route.hash)
  if (!m) return
  const idx = Number(m[1])
  const p = Math.floor(idx / PER) + 1
  if (p !== page.value) router.replace({ query: { ...route.query, page: p > 1 ? String(p) : undefined }, hash: route.hash })
  open.value = idx
  nextTick(() => document.getElementById(`n${idx}`)?.scrollIntoView({ block: 'start' }))
})
const toggle = (i: number) => {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <div class="gm-wrap gm-newsp">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span>{{ tab === 'stati' ? 'Статьи' : 'Новости' }}</span>
    </nav>
    <h1 class="gm-title">{{ tab === 'stati' ? 'Статьи' : 'Новости' }}</h1>
    <div class="gm-tabs" role="tablist">
      <NuxtLink :to="{ query: {} }" role="tab" :aria-selected="tab === 'news'" :class="{ 'is-on': tab === 'news' }">Новости <small>{{ gmNews.length }}</small></NuxtLink>
      <NuxtLink :to="{ query: { tab: 'stati' } }" role="tab" :aria-selected="tab === 'stati'" :class="{ 'is-on': tab === 'stati' }">Статьи <small>1</small></NuxtLink>
    </div>

    <article v-if="tab === 'stati'" class="gm-article">
      <h2>{{ gmArticle.title }}</h2>
      <p v-for="t in gmArticle.text" :key="t">{{ t }}</p>
      <NuxtLink :to="gmPath('/product/razno-1')" class="gm-btn gm-btn--main">Мёд разнотравье 2026 — от 450 ₽</NuxtLink>
    </article>

    <template v-else>
      <ul class="gm-nlist">
        <li v-for="(n, k) in list" :id="`n${(page - 1) * PER + k}`" :key="n.u" class="gm-nitem" :class="{ 'is-open': open === (page - 1) * PER + k }">
          <button type="button" class="gm-nitem__head" :aria-expanded="open === (page - 1) * PER + k" @click="toggle((page - 1) * PER + k)">
            <span class="gm-nitem__img"><img v-if="n.img" :src="gmNewsImg(n.img)" alt="" loading="lazy" /><GmIcon v-else name="bee" :size="30" /></span>
            <span class="gm-nitem__txt">
              <time :datetime="n.d">{{ gmDate(n.d) }}</time>
              <b>{{ n.t }}</b>
              <span>{{ n.i }}</span>
            </span>
            <GmIcon name="right" :size="20" class="gm-nitem__chev" />
          </button>
          <div v-if="open === (page - 1) * PER + k" class="gm-nitem__more">
            <template v-if="gmNewsFull[n.u]">
              <p v-for="t in gmNewsFull[n.u]" :key="t">{{ t }}</p>
            </template>
            <p v-else>{{ n.i }}</p>
            <NuxtLink :to="gmPath('/shop')" class="gm-link">Мёд в магазине <GmIcon name="arrow" :size="16" /></NuxtLink>
          </div>
        </li>
      </ul>

      <nav class="gm-pager" aria-label="Страницы">
        <button type="button" :disabled="page === 1" aria-label="Назад" @click="go(page - 1)"><GmIcon name="left" :size="18" /></button>
        <template v-for="(x, i) in nums" :key="i">
          <span v-if="x === '…'">…</span>
          <button v-else type="button" :class="{ 'is-on': x === page }" @click="go(x)">{{ x }}</button>
        </template>
        <button type="button" :disabled="page === pages" aria-label="Вперёд" @click="go(page + 1)"><GmIcon name="right" :size="18" /></button>
      </nav>
    </template>
  </div>
</template>

<style lang="scss">
.gm-tabs {
  display: flex;
  gap: 6px;
  margin: 20px 0 24px;

  a {
    padding: 9px 16px;
    border-radius: var(--gm-r);
    background: var(--gm-surface);
    font-weight: 600;
    color: var(--gm-ink);

    small {
      margin-left: 4px;
      font-weight: 500;
      color: var(--gm-muted);
    }
    &.is-on {
      background: var(--gm-soft);
      color: var(--gm-accent);
    }
  }
}
ul.gm-nlist {
  display: grid;
  gap: 10px;
  max-width: 900px;
}
.gm-nitem {
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-R);

  &__head {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr) 24px;
    gap: 16px;
    align-items: center;
    width: 100%;
    padding: 12px 16px 12px 12px;
    text-align: left;
  }
  &__img {
    display: grid;
    place-items: center;
    width: 88px;
    height: 88px;
    border-radius: var(--gm-r);
    overflow: hidden;
    background: var(--gm-surface);
    color: var(--gm-accent);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__txt {
    display: grid;
    gap: 3px;

    time {
      font-size: 13px;
      color: var(--gm-muted);
    }
    b {
      color: var(--gm-ink);
      line-height: 1.3;
    }
    span {
      font-size: 14px;
      color: var(--gm-muted);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  &__chev {
    color: var(--gm-muted);
    transition: transform 0.2s;
  }
  &.is-open &__chev {
    transform: rotate(90deg);
    color: var(--gm-accent);
  }
  &.is-open &__txt span {
    display: none;
  }
  &__head:hover b {
    color: var(--gm-accent);
  }
  &__more {
    display: grid;
    justify-items: start;
    gap: 10px;
    padding: 4px 20px 18px 116px;

    @media (max-width: 576px) {
      padding: 0 14px 16px;
    }
  }
  @media (max-width: 576px) {
    &__head {
      grid-template-columns: 64px minmax(0, 1fr) 20px;
      gap: 12px;
    }
    &__img {
      width: 64px;
      height: 64px;
    }
  }
}
.gm-pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 24px;

  button {
    display: grid;
    place-items: center;
    min-width: 42px;
    height: 42px;
    padding: 0 8px;
    border-radius: var(--gm-r);
    background: var(--gm-surface);
    font-weight: 600;
    color: var(--gm-ink);

    &.is-on {
      background: var(--gm-accent);
      color: #fff;
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
  span {
    padding: 0 4px;
    color: var(--gm-muted);
  }
}
.gm-article {
  display: grid;
  justify-items: start;
  gap: 14px;
  max-width: 760px;
  font-size: 16.5px;

  h2 {
    font-size: clamp(26px, 3vw, 34px);
  }
}
</style>
