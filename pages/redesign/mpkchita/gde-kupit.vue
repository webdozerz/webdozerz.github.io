<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'
import MkStores from '~/components/redesign/mpkchita/MkStores.vue'

useSeoMeta({ title: 'Где купить — магазины «Маккавеевский» | Концепт редизайна' })
</script>

<template>
  <div class="mk-wrap mk-where-page">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
    </nav>
    <h1 class="mk-page-title">Где купить</h1>
    <p class="mk-where-page__lead">
      Продукцию МПК продают фирменные магазины «Маккавеевский» — {{ mkStores.length }} адресов в Чите, Читинском районе и по краю. Режим работы — без
      перерыва и выходных, часть магазинов по понедельникам открывается в 11:00.
    </p>

    <div class="mk-where-page__grid">
      <section class="mk-where-page__list" aria-label="Розничные магазины">
        <MkStores />
      </section>
      <aside class="mk-where-page__side">
        <div class="mk-where-page__opt">
          <h2>Оптовым покупателям</h2>
          <p>Оптовые точки комбината — звоните, чтобы узнать ассортимент и условия.</p>
          <ul>
            <li v-for="o in mkOpt" :key="o.address">
              <b>{{ o.address }}</b>
              <span>
                <a v-for="ph in o.phone.split(', ')" :key="ph" :href="'tel:' + ph.replace(/[^\d+]/g, '')"><MkIcon name="phone" :size="15" />{{ ph }}</a>
              </span>
            </li>
          </ul>
        </div>
        <div class="mk-where-page__ask">
          <h3>Не нашли магазин рядом?</h3>
          <p>Позвоните в офис — подскажем, где ближайший «Маккавеевский».</p>
          <a :href="'tel:' + mkContacts.phoneTel" class="mk-btn mk-btn--main mk-btn--sm"><MkIcon name="phone" :size="16" /> {{ mkContacts.phone }}</a>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.mk-where-page {
  padding-bottom: 72px;
  &__lead {
    max-width: 760px;
    margin-top: 12px;
    color: var(--mk-muted);
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    margin-top: 28px;
  }
  &__list {
    min-width: 0;
  }
  &__side {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }
  &__opt,
  &__ask {
    padding: 20px;
    border-radius: var(--mk-R);
    background: var(--mk-surface);
    h2 {
      font-size: 24px;
    }
    h3 {
      font-size: 20px;
    }
    > p {
      margin: 6px 0 14px;
      font-size: 14px;
      color: var(--mk-muted);
    }
  }
  &__opt ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px 20px;
  }
  &__opt li {
    display: grid;
    gap: 4px;
    padding-top: 12px;
    border-top: 1px solid var(--mk-line);
    b {
      font-weight: 600;
      color: var(--mk-ink);
      font-size: 14.5px;
    }
    span {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-weight: 600;
      font-size: 14px;
      color: var(--mk-red);
      white-space: nowrap;
    }
  }
}
@media (max-width: 1199px) {
  .mk-where-page__side {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 768px) {
  .mk-where-page__opt ul {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
