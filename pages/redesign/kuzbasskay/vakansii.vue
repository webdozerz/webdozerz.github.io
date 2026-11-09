<script lang="ts" setup>
import { kzContacts, kzPerks, kzVacancies } from '~/utils/kuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Вакансии — Кузбасская птицефабрика | Концепт редизайна' })
const hr = kzContacts.hr
// У оригинала: список профессий, анкета anketa.xls и почта отдела кадров — так и оставляем, письмо с темой по профессии
const mail = (v: string) =>
  `mailto:${hr.email}?subject=${encodeURIComponent(`Резюме: ${v}`)}&body=${encodeURIComponent('Здравствуйте! Хочу работать у вас. Анкета во вложении.\nИмя: \nТелефон: \n')}`
</script>

<template>
  <div>
    <KzHead title="Вакансии" lead="Набираем в кадровый резерв. Заполните анкету и отправьте её в отдел кадров — мы свяжемся, когда появится место." />
    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-intro">
        <div>
          <ul class="kz-perks">
            <li v-for="p in kzPerks" :key="p"><KzIcon name="check" :size="16" />{{ p }}</li>
          </ul>
          <ul class="kz-vac">
            <li v-for="v in kzVacancies" :key="v">
              <span class="kz-vac__ic"><KzIcon name="briefcase" :size="20" /></span>
              <b>{{ v }}</b>
              <a :href="mail(v)" class="kz-btn kz-btn--line kz-btn--sm">Отправить резюме</a>
            </li>
          </ul>
        </div>
        <aside class="kz-panel kz-panel--yellow kz-buy">
          <h3>Отдел кадров</h3>
          <p>{{ hr.name }}, инспектор отдела кадров</p>
          <a :href="kzContacts.anketa" class="kz-btn" download><KzIcon name="down2" :size="18" />Скачать анкету (XLS)</a>
          <a :href="`tel:${hr.tel}`" class="kz-buy__tel"><b>{{ hr.phone }}</b><small>отдел кадров</small></a>
          <a href="tel:+73843557281" class="kz-buy__tel"><b>557-281</b><small>приёмная</small></a>
          <a :href="`mailto:${hr.email}`" class="kz-buy__tel"><b>{{ hr.email }}</b><small>почта для анкет</small></a>
        </aside>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
ul.kz-perks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 10px;
    background: var(--kz-green-soft);
    color: var(--kz-ink);
    font-size: 14px;
    font-weight: 700;

    .kz-icon {
      color: var(--kz-green);
    }
  }
}
ul.kz-vac {
  display: grid;
  border: 1px solid var(--kz-line);
  border-radius: var(--kz-R);

  li {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--kz-line);

    &:last-child {
      border-bottom: 0;
    }
    @media (max-width: 576px) {
      grid-template-columns: 40px minmax(0, 1fr);

      .kz-btn {
        grid-column: 2;
        justify-self: start;
      }
    }
  }
  b {
    color: var(--kz-ink);
    font-weight: 800;
    line-height: 1.35;
  }
}
.kz-vac__ic {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--kz-strip);
  color: var(--kz-ink);
}
</style>
