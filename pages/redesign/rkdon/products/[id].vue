<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'
import RkCard from '~/components/redesign/rkdon/RkCard.vue'
import RkSales from '~/components/redesign/rkdon/RkSales.vue'

const route = useRoute()
const p = computed(() => rkProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Позиция не найдена', fatal: true })

useSeoMeta({ title: () => `${p.value?.name} оптом — Рыбокомбинат Донской | Концепт редизайна` })

const shot = ref(0)
watch(
  () => route.params.id,
  () => (shot.value = 0),
)
const kind = computed(() => rkKinds.find((k) => k.id === p.value!.kind)!)
const tabTitle = computed(() => rkTabs.find((t) => t.id === p.value!.tab)!.title)
const facts = computed(() =>
  [
    { k: 'Фасовка', v: p.value!.pack },
    { k: 'Отгрузка', v: p.value!.tab === 'weight' ? 'коробами по 10 кг' : 'коробами, количество уточнит отдел продаж' },
    { k: 'Срок годности', v: p.value!.shelf ? rkMonths(p.value!.shelf) + ' с даты изготовления' : null },
    { k: 'Получение', v: 'самовывоз из Новошахтинска или доставка' },
  ].filter((f) => f.v),
)
const related = computed(() => rkProducts.filter((x) => x.kind === p.value!.kind && x.id !== p.value!.id).slice(0, 4))
const mailBody = computed(() => `Здравствуйте! Интересует «${p.value!.name}»${p.value!.pack ? ' (' + p.value!.pack + ')' : ''}.\nОбъём: \nГород доставки или самовывоз: \n`)
</script>

<template>
  <div v-if="p" class="rk-product">
    <div class="rk-wrap rk-pagehead rk-product__head">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink>
        <span><NuxtLink :to="rkPath('/products')">Рыбные снеки</NuxtLink></span>
        <span><NuxtLink :to="rkPath('/products') + '#' + p.tab">{{ tabTitle }}</NuxtLink></span>
      </nav>
    </div>
    <div class="rk-wrap rk-product__grid">
      <div class="rk-gallery">
        <div class="rk-gallery__main">
          <img :src="rkImg(p.imgs[shot] || p.imgs[0])" :alt="p.name" width="560" height="560" />
        </div>
        <div v-if="p.imgs.length > 1" class="rk-gallery__thumbs">
          <button
            v-for="(im, i) in p.imgs"
            :key="im"
            type="button"
            :class="{ 'is-active': shot === i }"
            :aria-label="'Фото ' + (i + 1)"
            @click="shot = i"
          >
            <img :src="rkImg(im)" alt="" width="96" height="96" />
          </button>
        </div>
      </div>
      <div class="rk-product__info">
        <span class="rk-kind" :class="'rk-kind--' + p.kind"
          ><img :src="rkImg(kind.icon)" alt="" width="26" height="20" />{{ kind.title }} · {{ tabTitle.toLowerCase() }}</span
        >
        <h1>{{ p.name }}</h1>
        <dl class="rk-product__facts">
          <div v-for="f in facts" :key="f.k">
            <dt>{{ f.k }}</dt>
            <dd>{{ f.v }}</dd>
          </div>
        </dl>
        <div class="rk-product__price">
          <span><b>Цена — по запросу</b><small>зависит от объёма и региона, пришлём прайс</small></span>
          <div class="rk-product__acts">
            <a :href="'tel:' + rkContacts.salesTel" class="rk-btn rk-btn--main"><RkIcon name="phone" :size="18" /> Позвонить</a>
            <a :href="rkMail('Цена: ' + p.name, mailBody)" class="rk-btn rk-btn--line"><RkIcon name="mail" :size="18" /> Запросить цену</a>
          </div>
        </div>
        <div v-if="p.text" class="rk-product__text">
          <h2>О продукте</h2>
          <p>{{ p.text }}</p>
        </div>
        <div v-if="p.comp" class="rk-product__text">
          <h2>Состав</h2>
          <p>{{ p.comp.charAt(0).toUpperCase() + p.comp.slice(1) }}</p>
        </div>
        <NuxtLink :to="rkPath('/products') + '#' + p.tab" class="rk-link"><RkIcon name="back" :size="18" /> Возврат к списку</NuxtLink>
      </div>
    </div>
    <section class="rk-section rk-section--tight">
      <div class="rk-wrap">
        <div class="rk-head">
          <h2>{{ p.kind === 'squid' ? 'Ещё из кальмара' : 'Ещё из рыбы' }}</h2>
        </div>
        <div class="rk-grid">
          <RkCard v-for="r in related" :key="r.id" :p="r" />
        </div>
        <RkSales class="rk-sales--gap" :subject="'Цена: ' + p.name" :body="mailBody" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.rk-product {
  &__head {
    padding-bottom: 8px;
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 56px;
    align-items: start;
  }
  &__info {
    display: grid;
    gap: 20px;
    justify-items: start;
    h1 {
      font-size: clamp(32px, 3.6vw, 46px);
    }
  }
  &__facts {
    width: 100%;
    margin: 0;
    display: grid;
    border-top: 1px solid var(--rk-line);
    div {
      display: grid;
      grid-template-columns: 160px minmax(0, 1fr);
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--rk-line);
    }
    dt {
      color: var(--rk-muted);
    }
    dd {
      margin: 0;
      font-weight: 700;
      color: var(--rk-ink);
    }
  }
  &__price {
    width: 100%;
    display: grid;
    gap: 14px;
    padding: 20px;
    border-radius: 18px;
    background: var(--rk-soft);
    > span {
      display: grid;
      line-height: 1.3;
    }
    b {
      font-size: 20px;
      color: var(--rk-ink);
    }
    small {
      color: var(--rk-muted);
      font-size: 14px;
    }
    .rk-btn--line {
      border-color: #ead3db;
    }
  }
  &__acts {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  &__text {
    display: grid;
    gap: 12px;
    h2 {
      font-size: 22px;
    }
    p {
      font-size: 15px;
    }
  }
}
.rk-gallery {
  position: sticky;
  top: 100px;
  display: grid;
  gap: 12px;
  &__main {
    border: 1px solid var(--rk-line);
    border-radius: var(--rk-R);
    overflow: hidden;
    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
  }
  &__thumbs {
    display: flex;
    gap: 10px;
    button {
      width: 84px;
      height: 84px;
      border-radius: 14px;
      border: 1px solid var(--rk-line);
      overflow: hidden;
      &.is-active {
        border: 2px solid var(--rk-accent);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
@media (max-width: 989px) {
  .rk-product__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  .rk-gallery {
    position: static;
    max-width: 560px;
  }
}
@media (max-width: 576px) {
  .rk-product__facts div {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
  .rk-product__acts {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }
  .rk-gallery__thumbs button {
    width: 72px;
    height: 72px;
  }
}
</style>
