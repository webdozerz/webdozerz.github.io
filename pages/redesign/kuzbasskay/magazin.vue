<script lang="ts" setup>
import { kzContacts, kzImg, kzPath, kzReception, kzShopAssortment } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'
import KzMark from '~/components/redesign/kuzbasskay/KzMark.vue'

useSeoMeta({ title: 'Магазин «Фирменный» — Кузбасская птицефабрика | Концепт редизайна' })
</script>

<template>
  <div>
    <KzHead
      title="Магазин «Фирменный»"
      lead="Уважаемые жители Новокузнецка и гости города! Приглашаем за покупками в магазин «Фирменный» — продукция местного производства по привлекательным ценам."
    />

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-shop">
        <div>
          <h2 class="kz-shop__h">Что купить в магазине</h2>
          <ul class="kz-shop__list">
            <li v-for="a in kzShopAssortment" :key="a.t">
              <span class="kz-shop__ic"><KzMark :name="a.icon" :size="24" /></span>
              <span>{{ a.t }}</span>
            </li>
          </ul>
          <p class="kz-shop__note">Качественно замороженное мясо сохраняет первоначальные свойства и долго хранится. Копчёные изделия выдерживают в специальном рассоле и коптят на натуральной буковой щепе — без красителей.</p>
        </div>
        <aside class="kz-panel kz-panel--yellow kz-shop__card">
          <img :src="kzImg('egg-30')" alt="Лоток яиц" width="600" height="400" loading="lazy" />
          <div class="kz-shop__row"><KzIcon name="pin" /><span><b>Новокузнецкий район, п. Степной</b><small>на территории птицефабрики</small></span></div>
          <div class="kz-shop__row"><KzIcon name="clock" /><span><b>Часы работы уточняйте по телефону</b><small>на сайте оригинала не указаны</small></span></div>
          <a :href="`tel:${kzReception[1].tel}`" class="kz-shop__row"><KzIcon name="phone" /><span><b>{{ kzReception[1].phone }}</b><small>приёмная</small></span></a>
          <a :href="kzContacts.map" target="_blank" rel="noopener" class="kz-btn">Маршрут в Яндекс Картах<KzIcon name="ext" :size="18" /></a>
        </aside>
      </div>
    </section>

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-panel kz-shop__opt">
          <p><b>Покупаете для магазина или кафе?</b> Оптом — через отдел продаж, с ценами под объём.</p>
          <NuxtLink :to="kzPath('/produkciya')" class="kz-btn kz-btn--line">Продукция и отдел продаж</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-shop {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 400px);
  align-items: start;
  gap: 40px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  &__h {
    margin-bottom: 18px;
    font-size: 26px;
    font-weight: 900;
  }
  ul.kz-shop__list {
    display: grid;
    gap: 10px;

    li {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr);
      align-items: center;
      gap: 14px;
      padding: 10px 14px 10px 10px;
      border-radius: 18px;
      background: var(--kz-surface);
      color: var(--kz-ink);
      font-weight: 700;
      line-height: 1.4;
    }
  }
  &__ic {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--kz-accent);
    color: #fff;
  }
  &__note {
    margin-top: 18px;
    color: var(--kz-muted);
    font-size: 15px;
  }
  &__card {
    display: grid;
    gap: 12px;

    img {
      width: 100%;
      height: auto;
      border-radius: 16px;
      background: #fff;
    }
    .kz-btn {
      margin-top: 4px;
    }
  }
  &__row {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    gap: 12px;
    color: var(--kz-accent-ink);

    span {
      display: grid;
      line-height: 1.3;
    }
    b {
      color: var(--kz-ink);
      font-weight: 800;
    }
    small {
      color: var(--kz-muted);
      font-size: 13px;
    }
  }
  &__opt {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px 24px;
    margin-bottom: 40px;
  }
}
</style>
