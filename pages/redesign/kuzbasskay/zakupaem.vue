<script lang="ts" setup>
import { kzFeedPlant, kzImg, kzWeBuy } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Закупаем — Кузбасская птицефабрика | Концепт редизайна' })
const mail = `mailto:${kzFeedPlant.email}?subject=${encodeURIComponent('Предложение сырья для завода комбикормов')}`
</script>

<template>
  <div>
    <KzHead title="Закупаем" lead="Завод по производству комбикормов и премиксов АО «Кузбасская птицефабрика» закупает сырьё." />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-intro">
        <div>
          <ul class="kz-buylist">
            <li v-for="i in kzWeBuy.items" :key="i"><KzIcon name="check" :size="18" />{{ i }}</li>
          </ul>
          <img class="kz-buyimg" :src="kzImg('prod-feed-1')" alt="Завод комбикормов в п. Чистогорский" width="640" height="450" loading="lazy" />
        </div>
        <aside class="kz-panel kz-panel--yellow kz-buy">
          <h3>Предложить сырьё</h3>
          <p>{{ kzFeedPlant.address }}</p>
          <a v-for="p in kzWeBuy.phones" :key="p.label" :href="`tel:${p.tel}`" class="kz-buy__tel"><b>{{ p.phone }}</b><small>{{ p.label.toLowerCase() }}</small></a>
          <a :href="mail" class="kz-buy__tel"><b>{{ kzFeedPlant.email }}</b><small>почта завода</small></a>
        </aside>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
ul.kz-buylist {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 16px;
    background: var(--kz-surface);
    color: var(--kz-ink);
    font-weight: 700;

    .kz-icon {
      flex: none;
      color: var(--kz-green);
    }
  }
}
.kz-buyimg {
  width: 100%;
  height: auto;
  margin-top: 20px;
  border-radius: var(--kz-R);
}
</style>
