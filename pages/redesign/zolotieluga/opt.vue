<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

useSeoMeta({ title: 'Партнёрам и оптовым покупателям — «Золотые луга» | Концепт редизайна' })
const items = zlOpt.items.map((i) => ({ ...i, p: zlProduct(i.product)! }))
</script>

<template>
  <div class="zl-wrap zl-page zl-opt">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span>Партнёрам</span>
    </nav>

    <div class="zl-opt__top">
      <div>
        <h1>Партнёрам и оптовым покупателям</h1>
        <p class="zl-page__lead">{{ zlOpt.lead }} Продукты:</p>
        <ul class="zl-list zl-opt__quality">
          <li v-for="q in zlOpt.quality" :key="q"><ZlIcon name="check" :size="18" /><span>{{ q }}</span></li>
        </ul>
        <div class="zl-opt__actions">
          <a :href="zlContacts.optRequest" target="_blank" rel="noopener" class="zl-btn zl-btn--main">Заявка на договор поставки <ZlIcon name="external" :size="16" /></a>
          <a :href="zlContacts.partners" target="_blank" rel="noopener" class="zl-btn zl-btn--line">Личный кабинет партнёра <ZlIcon name="external" :size="16" /></a>
        </div>
      </div>
      <aside class="zl-panel zl-opt__contact">
        <ZlIcon name="user" :size="30" />
        <small>Отдел оптовых продаж</small>
        <b>{{ zlOpt.contact.name }}</b>
        <a :href="'tel:' + zlOpt.contact.tel + ',' + zlOpt.contact.ext" class="zl-opt__phone">{{ zlOpt.contact.phone }}</a>
        <span>добавочный {{ zlOpt.contact.ext }}</span>
        <p><ZlIcon name="pin" :size="18" />{{ zlContacts.address }}</p>
        <p class="zl-opt__stock">{{ zlOpt.stock }}</p>
      </aside>
    </div>

    <section class="zl-section">
      <div class="zl-head"><h2>Продукция для опта</h2></div>
      <div class="zl-opt__items">
        <article v-for="i in items" :key="i.title" class="zl-opt__item">
          <NuxtLink :to="zlProductPath(i.product)" class="zl-opt__img"><img :src="zlImg(i.p.imgs[0])" :alt="i.title" width="300" height="300" loading="lazy" /></NuxtLink>
          <div>
            <h3>{{ i.title }}</h3>
            <ul class="zl-list">
              <li v-for="f in i.facts" :key="f"><ZlIcon name="check" :size="18" /><span>{{ f }}</span></li>
            </ul>
            <NuxtLink :to="zlProductPath(i.product)" class="zl-link">Подробнее на странице продукта <ZlIcon name="arrow" :size="18" /></NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section class="zl-section">
      <div class="zl-head">
        <div>
          <h2>Для удобства клиентов</h2>
          <p>Центральный офис и склад в Тюмени. Колл-центр принимает заявки: (3452) 58-87-45, 8-922-398-87-45.</p>
        </div>
      </div>
      <ul class="zl-opt__offers">
        <li v-for="(o, i) in zlTyumenOffers" :key="o">
          <ZlIcon :name="['store', 'box', 'clock', 'phone', 'truck', 'user'][i] || 'check'" :size="24" />
          <span>{{ o }}</span>
        </li>
      </ul>
      <NuxtLink :to="zlPath('/contacts?city=Тюмень')" class="zl-link zl-opt__more">Все телефоны отделов в Тюмени <ZlIcon name="arrow" :size="18" /></NuxtLink>
    </section>
  </div>
</template>

<style lang="scss">
.zl-opt {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 48px;
    align-items: start;
  }
  ul.zl-opt__quality {
    margin-top: 16px;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 28px;
  }
  &__contact {
    display: flex;
    flex-direction: column;
    gap: 4px;
    > .zl-icon {
      color: var(--zl-accent);
      margin-bottom: 8px;
    }
    small {
      color: var(--zl-muted);
    }
    b {
      font-family: var(--zl-head);
      font-size: 22px;
      color: var(--zl-ink);
    }
    span {
      color: var(--zl-muted);
      font-size: 14px;
    }
    p {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      font-size: 14px;
      .zl-icon {
        color: var(--zl-accent);
        margin-top: 2px;
      }
    }
  }
  &__phone {
    margin-top: 10px;
    font-size: 24px;
    font-weight: 700;
    color: var(--zl-accent);
  }
  p.zl-opt__stock {
    margin-top: 8px;
    color: var(--zl-muted);
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
  &__item {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 24px;
    padding: 24px;
    border-radius: var(--zl-R);
    border: 1px solid var(--zl-line);
    h3 {
      font-size: 20px;
      margin-bottom: 14px;
    }
    .zl-link {
      margin-top: 16px;
    }
  }
  &__img img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
  }
  ul.zl-opt__offers {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    li {
      display: flex;
      gap: 14px;
      padding: 20px;
      border-radius: var(--zl-R);
      background: var(--zl-surface);
      .zl-icon {
        color: var(--zl-accent);
      }
    }
  }
  &__more {
    margin-top: 20px;
  }
}
@media (max-width: 1199px) {
  .zl-opt__items {
    grid-template-columns: minmax(0, 1fr);
  }
  .zl-opt ul.zl-opt__offers {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 989px) {
  .zl-opt__top {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
}
@media (max-width: 576px) {
  .zl-opt {
    &__item {
      grid-template-columns: minmax(0, 1fr);
      padding: 18px;
    }
    &__img img {
      max-height: 200px;
    }
    ul.zl-opt__offers {
      grid-template-columns: minmax(0, 1fr);
    }
    &__actions .zl-btn {
      flex: 1 1 100%;
      white-space: normal;
      text-align: center;
    }
  }
}
</style>
