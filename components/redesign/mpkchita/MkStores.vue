<script lang="ts" setup>
import MkIcon from './MkIcon.vue'

// Магазины «Маккавеевский» по районам: у оригинала — список текстом; здесь фильтр по району, поиск по улице
// и статус «открыто / закрыто» по времени Читы (UTC+9) с учётом понедельников с 11:00.
const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const ui = useMpkchitaUi()
const area = ref('')
const q = ref('')
const onlyOpen = ref(false)

const list = computed(() => {
  const s = q.value.trim().toLowerCase()
  return mkStores.filter(
    (x) => (!area.value || x.area === area.value) && (!s || x.address.toLowerCase().includes(s)) && (!onlyOpen.value || mkStatus(x, ui.now.value).open),
  )
})
const shown = computed(() => (props.compact ? list.value.slice(0, 6) : list.value))
const countIn = (a: string) => mkStores.filter((x) => x.area === a).length
const time = computed(() => {
  const d = ui.now.value.date
  return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0')
})
const openNow = computed(() => mkStores.filter((s) => mkStatus(s, ui.now.value).open).length)
</script>

<template>
  <div class="mk-stores" :class="{ 'is-compact': compact }">
    <div class="mk-stores__bar">
      <p class="mk-stores__now">
        <i class="mk-dot" :class="{ 'is-off': !openNow }" />
        <span
          >В Чите {{ time }} — <b>{{ openNow ? 'открыто ' + openNow + ' из ' + mkStores.length : 'магазины откроются утром' }}</b></span
        >
      </p>
      <div v-if="!compact" class="mk-stores__tools">
        <label class="mk-stores__search">
          <MkIcon name="search" :size="18" />
          <input v-model="q" type="search" placeholder="Улица или посёлок" aria-label="Поиск магазина по адресу" />
        </label>
        <button type="button" class="mk-chip" :class="{ 'is-on': onlyOpen }" @click="onlyOpen = !onlyOpen">
          <MkIcon :name="onlyOpen ? 'check' : 'clock'" :size="16" /> Открыто сейчас
        </button>
      </div>
    </div>
    <div class="mk-stores__areas" role="tablist" aria-label="Район">
      <button type="button" class="mk-chip" :class="{ 'is-on': !area }" @click="area = ''">
        Все <small>{{ mkStores.length }}</small>
      </button>
      <button v-for="a in mkAreas" :key="a" type="button" class="mk-chip" :class="{ 'is-on': area === a }" @click="area = a">
        {{ mkAreaShort[a] }} <small>{{ countIn(a) }}</small>
      </button>
    </div>
    <ul class="mk-stores__list">
      <li v-for="s in shown" :key="s.id" class="mk-store">
        <div class="mk-store__main">
          <b>{{ s.address.replace(/^г\. Чита, /, '') }}</b>
          <small>{{ s.address.startsWith('г. Чита') ? 'Чита · ' + mkAreaShort[s.area] : s.area }}</small>
        </div>
        <div class="mk-store__time">
          <span class="mk-store__status" :class="{ 'is-open': mkStatus(s, ui.now.value).open }">{{ mkStatus(s, ui.now.value).text }}</span>
          <small>{{ mkHours(s) }}</small>
        </div>
        <a :href="mkMapUrl(s.address)" target="_blank" rel="noopener" class="mk-store__map" :aria-label="'Маршрут: ' + s.address">
          <MkIcon name="pin" :size="18" /><span>Маршрут</span>
        </a>
      </li>
    </ul>
    <p v-if="!list.length" class="mk-stores__empty">
      Не нашли магазин по этим условиям.
      <button type="button" @click="(q = ''), (area = ''), (onlyOpen = false)">Показать все</button>
    </p>
    <NuxtLink v-if="compact" :to="mkPath('/gde-kupit')" class="mk-btn mk-btn--line mk-stores__all">
      Все магазины и опт <MkIcon name="arrow" :size="18" />
    </NuxtLink>
  </div>
</template>

<style lang="scss">
.mk-stores {
  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px 20px;
    margin-bottom: 14px;
  }
  &__now {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--mk-text);
    b {
      color: var(--mk-ink);
    }
  }
  &__tools {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    width: 260px;
    padding: 0 12px;
    border: 1px solid var(--mk-line);
    border-radius: 10px;
    background: #fff;
    color: var(--mk-muted);
    &:focus-within {
      border-color: var(--mk-red);
    }
    input {
      flex: 1;
      width: 0;
      min-width: 0;
      border: 0;
      outline: 0;
      background: none;
      color: var(--mk-ink);
      font-size: 14px;
    }
  }
  &__areas {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 6px;
    margin-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: var(--mk-line) transparent;
    .mk-chip {
      flex: none;
    }
  }
  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 32px;
  }
  &.is-compact &__list {
    grid-template-columns: minmax(0, 1fr);
  }
  &__empty {
    padding: 20px 0;
    color: var(--mk-muted);
    button {
      color: var(--mk-red);
      font-weight: 600;
    }
  }
  &__all {
    margin-top: 18px;
  }
}
.mk-store {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--mk-line);
  &__main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    b {
      color: var(--mk-ink);
      font-weight: 600;
    }
    small {
      color: var(--mk-muted);
      font-size: 13px;
    }
  }
  &__time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    small {
      color: var(--mk-muted);
      font-size: 12.5px;
    }
  }
  &__status {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--mk-muted);
    &.is-open {
      color: var(--mk-green);
    }
  }
  &__map {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 10px;
    border-radius: 9px;
    background: var(--mk-surface);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--mk-ink);
    &:hover {
      color: var(--mk-red);
    }
  }
}
@media (max-width: 1400px) {
  .mk-stores__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 576px) {
  .mk-stores__search {
    width: 100%;
  }
  .mk-stores__tools {
    width: 100%;
  }
  .mk-store {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: 'main map' 'time time';
    gap: 6px 12px;
    &__main {
      grid-area: main;
    }
    &__map {
      grid-area: map;
      span {
        display: none;
      }
      width: 40px;
      padding: 0;
      justify-content: center;
    }
    &__time {
      grid-area: time;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0 10px;
      align-items: baseline;
      text-align: left;
    }
  }
}
</style>
