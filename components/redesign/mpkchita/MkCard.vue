<script lang="ts" setup>
import MkIcon from './MkIcon.vue'

// Карточка продукта: цен у оригинала нет — вместо цены состав, фасовка и срок годности; вся карточка ведёт на страницу продукта.
const props = defineProps<{ p: MkProduct }>()
const ui = useMpkchitaUi()
const sub = computed(() => mkSub(props.p.sub))
const shelfShort = computed(() => props.p.shelf.split(',')[0])
const to = computed(() => mkPath('/product/' + props.p.id))
// Состав обрезаем по словам: у пельменей он на пять строк, а в карточке — две
const comp = computed(() => (props.p.comp.length > 66 ? props.p.comp.slice(0, 66).replace(/[\s,;:]+\S*$/, '') + '…' : props.p.comp))
</script>

<template>
  <article class="mk-card">
    <NuxtLink :to="to" class="mk-card__pic" :aria-label="p.name">
      <img :src="mkProductImg(p.id)" :alt="p.name" width="480" height="480" loading="lazy" />
    </NuxtLink>
    <div v-if="p.isNew" class="mk-card__flags"><span class="mk-flag">Новинка</span></div>
    <button
      type="button"
      class="mk-card__cmp"
      :class="{ 'is-on': ui.inCompare(p.id) }"
      :aria-label="ui.inCompare(p.id) ? 'Убрать из сравнения' : 'Сравнить'"
      :title="ui.inCompare(p.id) ? 'Убрать из сравнения' : 'Сравнить состав'"
      @click="ui.toggleCompare(p.id)"
    >
      <MkIcon name="compare" :size="18" />
    </button>
    <div class="mk-card__body">
      <span class="mk-card__sub">{{ sub?.short }}</span>
      <NuxtLink :to="to" class="mk-card__name">{{ p.name }}</NuxtLink>
      <p v-if="p.comp" class="mk-card__comp">{{ comp }}</p>
      <div v-if="p.pack || p.shelf" class="mk-card__facts">
        <span v-if="p.pack">{{ p.pack.startsWith('Весовой') ? 'на вес' : p.pack.split('/')[0].trim() }}</span>
        <span v-if="p.shelf"><MkIcon name="clock" :size="14" />{{ shelfShort }}</span>
      </div>
    </div>
  </article>
</template>
