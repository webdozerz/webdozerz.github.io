<script lang="ts" setup>
// Поиск с подсказками: фото, название, цена. Enter ведёт в каталог с запросом.
const props = defineProps<{ big?: boolean }>()
const route = useRoute()
const router = useRouter()

const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const open = ref(false)
const root = ref<HTMLElement>()

const results = computed(() => fgSearch(query.value))
const shown = computed(() => results.value.slice(0, 6))

const submit = () => {
  open.value = false
  router.push({ path: fgPath('/catalog'), query: query.value.trim() ? { q: query.value.trim() } : {} })
}

const pick = (q: string) => {
  query.value = q
  submit()
}

watch(
  () => route.fullPath,
  () => {
    open.value = false
    if (route.path.startsWith(fgPath('/catalog')) && typeof route.query.q === 'string') query.value = route.query.q
  },
)

const onDoc = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

<template>
  <div ref="root" class="fg-search" :class="{ 'fg-search--big': props.big }">
    <form role="search" class="fg-search__form" @submit.prevent="submit">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
      </svg>
      <input
        v-model="query"
        type="search"
        :placeholder="`Найти среди ${fgProducts.length} товаров`"
        aria-label="Поиск по каталогу"
        autocomplete="off"
        @focus="open = true"
        @input="open = true"
        @keydown.esc="open = false"
      />
      <button v-if="props.big" type="submit" class="fg-btn fg-btn--primary">Найти</button>
    </form>

    <div v-if="open" class="fg-search__drop">
      <template v-if="query.trim()">
        <NuxtLink
          v-for="p in shown"
          :key="p.id"
          :to="fgPath(`/product/${p.id}`)"
          class="fg-search__item"
        >
          <img :src="p.image" alt="" />
          <span class="fg-search__name">
            {{ p.name }}
            <small>{{ p.pack }}</small>
          </span>
          <strong class="fg-price">{{ fgFormatPrice(p.price) }}</strong>
        </NuxtLink>
        <p v-if="!results.length" class="fg-search__empty">
          Ничего не нашли. Напишите нам — подскажем, будет ли в следующей поставке.
        </p>
        <button v-else type="button" class="fg-search__all" @click="submit">
          Все результаты · {{ results.length }}
        </button>
      </template>
      <div v-else class="fg-search__popular">
        <span>Часто ищут</span>
        <button v-for="q in fgPopularQueries" :key="q" type="button" @click="pick(q)">{{ q }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.fg .fg-search {
  position: relative;

  &__form {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 6px 0 14px;
    border-radius: var(--fg-r);
    background: var(--fg-sage);
    box-shadow: inset 0 0 0 1px transparent;
    transition: box-shadow 0.15s;

    &:focus-within {
      box-shadow: inset 0 0 0 1.5px var(--fg-leaf);
      background: #fff;
    }

    svg {
      color: var(--fg-muted);
    }

    input {
      flex: 1;
      min-width: 0;
      height: 46px;
      border: 0;
      background: none;
      outline: none;

      &::placeholder {
        color: #7f8d83;
      }

      &::-webkit-search-cancel-button {
        cursor: pointer;
      }
    }
  }

  &--big .fg-search__form {
    min-height: 60px;
    padding-left: 18px;
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--fg-line);
    font-size: 17px;

    input {
      height: 58px;
    }

    .fg-btn {
      min-height: 48px;
    }
  }

  &__drop {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 50;
    padding: 8px;
    border-radius: 16px;
    background: #fff;
    box-shadow:
      0 0 0 1px var(--fg-line),
      0 16px 40px rgba(18, 38, 26, 0.14);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px;
    border-radius: 10px;

    &:hover {
      background: var(--fg-sage);
    }

    img {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }

    strong {
      margin-left: auto;
      font-weight: 600;
    }
  }

  &__name {
    display: grid;
    min-width: 0;
    line-height: 1.25;

    small {
      color: var(--fg-muted);
      font-size: 13px;
    }
  }

  &__all {
    width: 100%;
    margin-top: 4px;
    padding: 10px;
    border-radius: 10px;
    color: var(--fg-leaf);
    font-weight: 600;

    &:hover {
      background: var(--fg-sage);
    }
  }

  &__empty {
    padding: 10px;
    color: var(--fg-muted);
  }

  &__popular {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 6px;

    span {
      width: 100%;
      color: var(--fg-muted);
      font-size: 14px;
    }

    button {
      padding: 6px 12px;
      border-radius: 10px;
      background: var(--fg-sage);

      &:hover {
        background: var(--fg-leaf-soft);
      }
    }
  }
}
</style>
