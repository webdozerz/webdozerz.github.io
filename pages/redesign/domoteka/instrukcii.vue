<script lang="ts" setup>
import { dmInstructions, dmOfferImg, dmPath } from '~/utils/domoteka'
import { dmProducts } from '~/utils/domoteka.data'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'

useSeoMeta({ title: 'Инструкции по сборке столов «Домотека» | Концепт редизайна' })
const q = ref('')
const list = computed(() => {
  const s = q.value.trim().toLowerCase()
  return dmInstructions.filter((i) => !s || i.n.toLowerCase().includes(s))
})
const imgFor = (series: string) => {
  const p = dmProducts.find((x) => x.series === series)
  return p ? dmOfferImg(p.offers[0]) : ''
}
</script>

<template>
  <div class="dm-wrap dm-instrs">
    <div class="dm-page-head">
      <nav class="dm-crumbs" aria-label="Навигация"><NuxtLink :to="dmPath('/')">Главная</NuxtLink><span>Инструкции</span></nav>
      <h1 class="dm-h1">Инструкции по сборке</h1>
      <p class="dm-lead">{{ dmInstructions.length }} инструкций в PDF. Найдите свою серию — название указано на упаковке и в документах.</p>
      <label class="dm-search dm-instrs__search">
        <DmIcon name="search" />
        <input v-model="q" type="search" placeholder="Например, Вита или Танго" aria-label="Поиск инструкции" />
      </label>
    </div>
    <ul v-if="list.length" class="dm-instrs__list">
      <li v-for="i in list" :key="i.url">
        <a :href="i.url" target="_blank" rel="noopener" class="dm-instrs__item">
          <span class="dm-instrs__img"><img v-if="imgFor(i.series)" :src="imgFor(i.series)" alt="" width="64" height="64" loading="lazy" /><DmIcon v-else name="doc" /></span>
          <span class="dm-instrs__name"><b>{{ i.n }}</b><small>PDF</small></span>
          <DmIcon name="download" />
        </a>
      </li>
    </ul>
    <div v-else class="dm-empty">
      <DmIcon name="doc" /><b>Не нашли инструкцию</b>
      <p>Напишите нам — пришлём инструкцию к вашему столу на почту.</p>
      <NuxtLink :to="dmPath('/kontakty/')" class="dm-btn">Контакты</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.dm .dm-instrs {
  .dm-instrs__search {
    flex: none;
    max-width: 440px;
    margin-top: 20px;
  }
  ul.dm-instrs__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 28px;
  }
  .dm-instrs__item {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 100%;
    padding: 12px 16px 12px 12px;
    border: 1px solid var(--dm-line);
    border-radius: var(--dm-r2);
    text-decoration: none;
    > .dm-icon {
      color: var(--dm-muted);
    }
    &:hover {
      border-color: var(--dm-acc);
      > .dm-icon {
        color: var(--dm-acc);
      }
    }
  }
  .dm-instrs__img {
    flex: none;
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 10px;
    background: var(--dm-surf);
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #fff;
      border-radius: 10px;
    }
    .dm-icon {
      color: var(--dm-acc);
    }
  }
  .dm-instrs__name {
    flex: 1;
    display: grid;
    min-width: 0;
    b {
      font-weight: 600;
      line-height: 1.3;
    }
    small {
      color: var(--dm-muted);
    }
  }
}
@media (max-width: 1199px) {
  .dm .dm-instrs ul.dm-instrs__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .dm .dm-instrs ul.dm-instrs__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
