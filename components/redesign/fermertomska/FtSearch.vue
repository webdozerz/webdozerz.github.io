<script lang="ts" setup>
import FtIcon from './FtIcon.vue'

// Поиск с подсказками: товары с фото и ценой, частые запросы. Enter — в каталог с ?q=.
const props = defineProps<{ autofocus?: boolean }>()
const query = ref('')
const input = ref<HTMLInputElement | null>(null)

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')

const hits = computed(() => {
  const q = norm(query.value.trim())
  if (q.length < 2) return []
  return ftFamilies
    .filter((f) => norm(`${f.title} ${ftSectionOf(f.section).title}`).includes(q))
    .slice(0, 6)
    .map((f) => ({ family: f, product: ftVariantsOf(f.id)[0] }))
})

const submit = () => {
  const q = query.value.trim()
  navigateTo(ftPath(`/catalog${q ? `?q=${encodeURIComponent(q)}` : ''}`))
}

onMounted(() => {
  if (props.autofocus) input.value?.focus()
})
</script>

<template>
  <div class="ft-search">
    <form class="ft-search__form" role="search" @submit.prevent="submit">
      <FtIcon name="search" />
      <input
        ref="input"
        v-model="query"
        type="search"
        placeholder="Творог, сметана, масло…"
        aria-label="Поиск по каталогу"
        autocomplete="off"
      />
      <button type="submit" class="ft-btn">Найти</button>
    </form>

    <ul v-if="hits.length" class="ft-search__hits">
      <li v-for="h in hits" :key="h.family.id">
        <NuxtLink :to="ftPath(`/product/${h.product.id}`)">
          <img :src="h.product.images[0]" alt="" width="48" height="48" loading="lazy" />
          <span>{{ h.family.title }}</span>
          <strong>от {{ ftPrice(ftMinPrice(h.family.id)) }}</strong>
        </NuxtLink>
      </li>
    </ul>
    <p v-else-if="query.trim().length >= 2" class="ft-search__empty">
      Ничего не нашли. Позвоните — подскажем: <a :href="ftContacts.phoneHref">{{ ftContacts.phone }}</a>
    </p>
    <div v-else class="ft-search__popular">
      <span>Часто ищут:</span>
      <button v-for="q in ftPopularQueries" :key="q" type="button" @click="query = q">{{ q }}</button>
    </div>
  </div>
</template>

<style lang="scss">
.ft .ft-search {
  max-width: 760px;
  margin: 0 auto;

  &__form {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 6px 6px 18px;
    border: 1px solid var(--ft-line);
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 6px 20px rgba(29, 43, 74, 0.06);
    color: var(--ft-muted);

    &:focus-within {
      border-color: var(--ft-accent);
    }

    input {
      flex: 1;
      min-width: 0;
      height: 44px;
      border: 0;
      outline: none;
      background: none;
      font-size: 17px;
      color: var(--ft-ink);
    }

    .ft-btn {
      min-height: 44px;
      padding: 0 18px;
    }
  }

  &__hits {
    display: grid;
    gap: 2px;
    margin-top: 10px;

    a {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) auto;
      align-items: center;
      gap: 14px;
      padding: 6px 12px 6px 6px;
      border-radius: 14px;
      font-weight: 700;

      &:hover {
        background: var(--ft-surface);
      }
    }

    img {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: cover;
    }

    strong {
      font-weight: 800;
      white-space: nowrap;
    }
  }

  &__empty {
    margin-top: 12px;
    color: var(--ft-muted);

    a {
      color: var(--ft-accent);
      font-weight: 800;
    }
  }

  &__popular {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    font-size: 14px;
    color: var(--ft-muted);

    button {
      padding: 6px 12px;
      border-radius: 10px;
      background: var(--ft-surface);
      color: var(--ft-ink);
      font-weight: 700;

      &:hover {
        background: var(--ft-accent-soft);
        color: var(--ft-accent-d);
      }
    }
  }

  @media (max-width: 576px) {
    &__form .ft-btn {
      display: none;
    }
  }
}
</style>
