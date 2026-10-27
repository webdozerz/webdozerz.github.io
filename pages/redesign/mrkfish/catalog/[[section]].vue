<script lang="ts" setup>
import MfIcon from '~/components/redesign/mrkfish/MfIcon.vue'
import MfCard from '~/components/redesign/mrkfish/MfCard.vue'

const route = useRoute()
const ui = useMrkfishUi()
const req = useMrkfishRequest()
const q = ref('')
const chips = ref<HTMLElement | null>(null)

// На телефоне лента разделов шире экрана: активный чип прокручиваем в видимую часть ленты, страницу не трогаем.
const showActive = () => {
  const el = chips.value
  const on = el?.querySelector<HTMLElement>('.is-on')
  if (el && on) el.scrollLeft = on.offsetLeft - (el.clientWidth - on.offsetWidth) / 2
}
const sectionId = computed(() => (route.params.section as MfSectionId) || null)
const section = computed(() => (sectionId.value ? mfSections.find((s) => s.id === sectionId.value) ?? null : null))
const found = computed(() => mfSearch(q.value))
// Без раздела — весь каталог группами, как на оригинале; с поиском — только совпадения.
const groups = computed(() =>
  mfSections
    .filter((s) => !section.value || s.id === section.value.id)
    .map((s) => ({ section: s, items: found.value.filter((p) => p.section === s.id) }))
    .filter((g) => g.items.length),
)
const total = computed(() => groups.value.reduce((n, g) => n + g.items.length, 0))

onMounted(showActive)
watch(sectionId, () => nextTick(showActive))

useSeoMeta({ title: () => `${section.value?.title ?? 'Каталог'} — Миякинская Рыбная Компания | Концепт редизайна` })
</script>

<template>
  <div class="mf-wrap mf-cat">
    <nav class="mf-crumbs" aria-label="Навигация">
      <NuxtLink :to="mfPath()">Главная</NuxtLink>
      <MfIcon name="arrow" :size="14" />
      <NuxtLink v-if="section" :to="mfSectionPath()">Каталог</NuxtLink>
      <span v-else>Каталог</span>
      <template v-if="section">
        <MfIcon name="arrow" :size="14" />
        <span>{{ section.title }}</span>
      </template>
    </nav>

    <div class="mf-cat__top">
      <div>
        <h1>{{ section?.title ?? 'Каталог продукции' }}</h1>
        <p class="mf-cat__intro">{{ section?.intro ?? 'Все позиции с сайта по разделам. Цены — в оптовом прайсе: отметьте нужное, и заявка соберётся сама.' }}</p>
      </div>
      <label class="mf-search">
        <MfIcon name="search" :size="20" />
        <input v-model="q" type="search" placeholder="Сельдь, скумбрия, 150 г…" aria-label="Поиск по каталогу" />
        <button v-if="q" type="button" aria-label="Очистить" @click="q = ''"><MfIcon name="close" :size="18" /></button>
      </label>
    </div>

    <div ref="chips" class="mf-chips" role="navigation" aria-label="Разделы">
      <NuxtLink :to="mfSectionPath()" class="mf-chips__item" :class="{ 'is-on': !section }">
        Все <small>{{ mfProducts.length }}</small>
      </NuxtLink>
      <NuxtLink v-for="s in mfSections" :key="s.id" :to="mfSectionPath(s.id)" class="mf-chips__item" :class="{ 'is-on': section?.id === s.id }">
        {{ s.short }} <small>{{ mfInSection(s.id).length }}</small>
      </NuxtLink>
    </div>

    <div v-if="req.count.value" class="mf-cat__bar">
      <span><b>В заявке {{ mfPositions(req.count.value) }}</b> — цены пришлём прайсом</span>
      <NuxtLink :to="mfPath('/request')" class="mf-btn">Оформить заявку <MfIcon name="arrow" :size="18" /></NuxtLink>
    </div>

    <p v-if="!total" class="mf-cat__empty">
      По запросу «{{ q }}» ничего нет. Ассортимент больше, чем на сайте, —
      <button type="button" @click="ui.modal.value = 'call'">спросите в отделе продаж</button>.
    </p>

    <section v-for="g in groups" :key="g.section.id" class="mf-cat__group">
      <div v-if="!section" class="mf-cat__ghead">
        <h2>{{ g.section.title }}</h2>
        <span>{{ mfPositions(g.items.length) }} · {{ g.section.unit === 'кг' ? 'на вес' : 'в упаковках' }}</span>
      </div>
      <div class="mf-grid">
        <MfCard v-for="p in g.items" :key="p.id" :product="p" />
      </div>
    </section>

    <div class="mf-cat__more">
      <span class="mf-cat__moreico"><MfIcon name="doc" :size="26" /></span>
      <div>
        <h2>На сайте — {{ mfProducts.length }} позиций из 200+</h2>
        <p>Полный ассортимент с ценами — в прайс-листе. Пришлём на почту, среднее время ответа {{ mfContacts.answer }}</p>
      </div>
      <button type="button" class="mf-btn" @click="ui.modal.value = 'price'">Получить прайс</button>
    </div>
  </div>
</template>

<style lang="scss">

.mf-cat {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
    align-items: end;
    gap: 20px 40px;
    margin-top: 16px;

    h1 {
      font-size: clamp(30px, 3.6vw, 44px);
    }

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__intro {
    max-width: 680px;
    margin-top: 10px !important;
    color: var(--mf-muted);
  }

  &__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 20px;
    margin-top: 16px;
    padding: 12px 12px 12px 20px;
    border-radius: var(--mf-r-lg);
    background: var(--mf-navy-soft);

    b {
      color: var(--mf-ink);
    }

    @media (max-width: 576px) {
      padding: 14px;

      .mf-btn {
        flex: 1 1 100%;
      }
    }
  }

  &__empty {
    margin-top: 32px !important;
    padding: 24px;
    border-radius: var(--mf-r-lg);
    background: var(--mf-surface);

    button {
      color: var(--mf-navy);
      font-weight: 700;
      text-decoration: underline;
    }
  }

  &__group {
    margin-top: 32px;
  }

  &__ghead {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px 16px;
    margin-bottom: 16px;

    h2 {
      font-size: clamp(22px, 2.4vw, 28px);
    }

    span {
      color: var(--mf-muted);
    }
  }

  &__more {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px 24px;
    margin-top: 48px;
    padding: 24px 28px;
    border-radius: var(--mf-r-lg);
    background: var(--mf-surface);

    h2 {
      font-size: 22px;
    }

    p {
      margin-top: 8px !important;
      color: var(--mf-muted);
    }

    @media (max-width: 768px) {
      grid-template-columns: auto minmax(0, 1fr);

      .mf-btn {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 576px) {
      padding: 20px;
    }
  }

  &__moreico {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: #fff;
    color: var(--mf-red);
  }
}

.mf-search {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 8px 0 16px;
  border: 1px solid var(--mf-field);
  border-radius: var(--mf-r);
  background: #fff;
  color: var(--mf-muted);
  transition: border-color 0.2s;

  &:focus-within {
    border-color: var(--mf-navy);
    outline: 3px solid rgba(11, 58, 120, 0.12);
  }

  input {
    flex: 1;
    width: 0;
    min-width: 0;
    height: 50px;
    border: 0;
    background: none;
    color: var(--mf-ink);

    &:focus {
      outline: none;
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;

    &:hover {
      background: var(--mf-surface);
    }
  }
}

.mf-chips {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  overflow-x: auto;
  scrollbar-width: none;

  &__item {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 42px;
    padding: 0 16px;
    border: 1px solid var(--mf-line);
    border-radius: 999px;
    color: var(--mf-ink);
    font-weight: 700;
    white-space: nowrap;
    transition:
      border-color 0.2s,
      background 0.2s;

    small {
      color: var(--mf-muted);
      font-size: 13px;
    }

    &:hover {
      border-color: var(--mf-navy);
    }

    &.is-on {
      border-color: var(--mf-navy);
      background: var(--mf-navy);
      color: #fff;

      small {
        color: rgba(255, 255, 255, 0.75);
      }
    }
  }

  @media (max-width: 989px) {
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px;
  }

  @media (max-width: 375px) {
    margin-left: -14px;
    margin-right: -14px;
    padding: 0 14px;
  }
}
</style>
