<script lang="ts" setup>
import AkIcon from './AkIcon.vue'
import AkBuy from './AkBuy.vue'

// «Лист бренда»: как у оригинала — одна фотография на таблицу марки, но строки можно сразу класть в список упаковками.
const props = defineProps<{ brand: AkBrand; items: AkItem[] }>()
const ui = useAks124Ui()
const list = useAks124List()

// Строки с подзаголовками групп («Приправы», «Желатин») — как в таблицах оригинала
const rows = computed(() => {
  const out: ({ kind: 'group'; title: string } | { kind: 'item'; item: AkItem })[] = []
  let g: string | undefined
  for (const it of props.items) {
    if (it.group && it.group !== g) out.push({ kind: 'group', title: it.group })
    g = it.group
    out.push({ kind: 'item', item: it })
  }
  return out
})
const section = computed(() => akSection(props.brand.section))
// Фото с их сервера иногда не доходит — тогда заглушка, а не пустая рамка
const broken = ref(false)
</script>

<template>
  <div class="ak-sheet-box">
  <article :id="`b-${props.brand.id}`" class="ak-sheet">
    <div class="ak-sheet__side">
      <button
        v-if="props.brand.img && !broken"
        type="button"
        class="ak-sheet__photo"
        :aria-label="`Фото: ${props.brand.title}`"
        @click="ui.photo.value = { img: props.brand.img, title: props.brand.title }"
      >
        <img :src="props.brand.img" :alt="props.brand.title" width="220" height="220" loading="lazy" @error="broken = true" />
      </button>
      <div v-else class="ak-sheet__photo ak-sheet__photo--none" aria-hidden="true">
        <AkIcon name="box" :size="40" />
        <span>{{ props.brand.title }}</span>
      </div>
      <div class="ak-sheet__head">
        <h3>{{ props.brand.title }}</h3>
        <p>
          {{ section?.title }} · {{ akPositions(props.brand.count) }}
        </p>
        <span v-if="props.brand.out" class="ak-flag ak-flag--out">Нет в наличии</span>
        <a v-if="props.brand.pdf" :href="props.brand.pdf" target="_blank" rel="noopener" class="ak-sheet__pdf">
          <AkIcon name="doc" :size="18" />Презентация PDF
        </a>
      </div>
    </div>

    <div class="ak-sheet__table" role="table" :aria-label="`Цены: ${props.brand.title}`">
      <div class="ak-sheet__cols" role="row">
        <span role="columnheader">Наименование</span>
        <span role="columnheader">В упаковке</span>
        <span role="columnheader">Цена</span>
        <span role="columnheader">Упаковка</span>
        <span role="columnheader"><span class="ak-sr">Заказ</span></span>
      </div>
      <template v-for="(r, i) in rows" :key="i">
        <p v-if="r.kind === 'group'" class="ak-sheet__group">{{ r.title }}</p>
        <div v-else class="ak-row" :class="{ 'is-in': list.qtyOf(r.item.id) }" role="row">
          <span class="ak-row__name" role="cell">{{ r.item.name }}</span>
          <span class="ak-row__pack" role="cell">{{ r.item.pack ? `${r.item.pack} ${r.item.per}` : r.item.per === 'бл' ? 'блок' : '—' }}</span>
          <span class="ak-row__price" role="cell">
            <template v-if="r.item.price">
              <b>{{ akMoney(r.item.price) }}</b><small>/{{ r.item.per }}</small>
            </template>
            <em v-else>по запросу</em>
            <span v-if="r.item.pack" class="ak-row__m">
              {{ r.item.pack }} {{ r.item.per }} в уп.<template v-if="r.item.price"> · {{ akMoney(r.item.price * r.item.pack) }}</template>
            </span>
          </span>
          <span class="ak-row__box" role="cell">{{ r.item.price && r.item.pack ? akMoney(r.item.price * r.item.pack) : '' }}</span>
          <span class="ak-row__buy" role="cell"><AkBuy :item="r.item" small /></span>
        </div>
      </template>
    </div>
  </article>
  </div>
</template>
