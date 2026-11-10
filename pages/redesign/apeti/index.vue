<script lang="ts" setup>
import { AP_ORIG, apAsset, apCountText, apFarmers, apIcon, apNumbers, apPath, apShelves, apWhen } from '~/utils/apeti'
import { apBlog, apSections } from '~/utils/apetiData'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'
import ApScale from '~/components/redesign/apeti/ApScale.vue'
import ApShelf from '~/components/redesign/apeti/ApShelf.vue'

const tabs = [
  { id: 'hits', name: 'Хиты продаж' },
  { id: 'fresh', name: 'Новинки' },
  { id: 'best', name: 'Мы рекомендуем' },
  { id: 'sale', name: 'Скидки' },
] as const
const tab = ref<(typeof tabs)[number]['id']>('hits')
const shelf = computed(() => apShelves[tab.value]())

const now = ref<Date | null>(null)
const when = computed(() => (now.value ? apWhen(now.value) : null))
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => (now.value = new Date()), 30000)
})
onBeforeUnmount(() => clearInterval(timer))

const why = [
  { icon: 'truck', title: 'Быстрая доставка', text: 'Заказ, оформленный до 19:00, приедет в тот же день. Окна по три часа с 9:00 до 22:00, за час курьер позвонит.' },
  { icon: 'card', title: 'Удобная оплата', text: 'Наличными или банковской картой курьеру при получении. Вместе с заказом — кассовый чек.' },
  { icon: 'gift', title: 'Программа лояльности', text: 'Копите баллы и оплачивайте ими покупки: 1 балл = 1 рубль.' },
  { icon: 'back', title: 'Возврат', text: 'Если продукт не устроил по качеству — вернём деньги или заменим.' },
]
const services = [
  { img: 'svc-farsh.jpg', title: 'Превратим любое мясо в фарш', text: 'Выбирайте в карточке товара или сообщите оператору.', to: '/catalog/myaso_ptitsa' },
  { img: 'svc-fish.jpg', title: 'Рыбу почистим бесплатно', text: 'Почистим, выпотрошим и нарежем охлаждённую рыбу на стейки.', to: '/catalog/okhlazhdennaya_ryba' },
  { img: 'svc-box.jpg', title: 'Упаковкой дешевле', text: 'Овощи, фрукты и рыба ящиками и коробками — по цене ниже.', to: '/catalog/upakovkoy_deshevle_1' },
]
</script>

<template>
  <div>
    <section class="ap-wrap ap-hero">
      <div class="ap-hero__stage">
        <ApScale>
          <div class="ap-hero__top">
            <h1>Фермерские продукты с доставкой на дом</h1>
            <p>Собираем заказ на Преображенском рынке и привозим по Москве и до 30 км от МКАД. Положите товар на весы — сумма посчитается сразу.</p>
            <div class="ap-hero__when">
              <template v-if="when && when.today">
                <span>Закажите до 19:00 — привезём сегодня</span>
                <b>осталось {{ when.leftH }} ч {{ when.leftM }} мин</b>
              </template>
              <template v-else-if="when">
                <span>Ближайшая доставка</span>
                <b>завтра, {{ when.date }}, с 9:00</b>
              </template>
              <template v-else>
                <span>Заказ до 19:00 —</span>
                <b>привезём в тот же день</b>
              </template>
            </div>
          </div>
        </ApScale>
      </div>
    </section>

    <section class="ap-wrap ap-sec">
      <div class="ap-head ap-tabshead">
        <div class="ap-tabs" role="tablist">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" :class="{ 'is-on': tab === t.id, 'is-hot': t.id === 'sale' }" @click="tab = t.id">{{ t.name }}</button>
        </div>
        <NuxtLink :to="apPath(tab === 'sale' ? '/catalog/skidki' : '/catalog')" class="ap-link">{{ tab === 'sale' ? 'Все скидки' : 'Весь каталог' }} <ApIcon name="right" /></NuxtLink>
      </div>
      <ApShelf :items="shelf" />
    </section>

    <section class="ap-wrap ap-sec">
      <ul class="ap-svc">
        <li v-for="s in services" :key="s.title">
          <NuxtLink :to="apPath(s.to)">
            <img :src="apAsset(s.img)" alt="" loading="lazy" width="300" height="300" />
            <span>
              <b>{{ s.title }}</b>
              <small>{{ s.text }}</small>
              <i class="ap-link">Выбрать <ApIcon name="right" /></i>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="ap-wrap ap-sec">
      <div class="ap-head">
        <h2>Популярные категории</h2>
        <NuxtLink :to="apPath('/catalog')" class="ap-link">Все разделы <ApIcon name="right" /></NuxtLink>
      </div>
      <ul class="ap-cats">
        <li v-for="s in apSections" :key="s.slug">
          <NuxtLink :to="apPath(`/catalog/${s.slug}`)">
            <img :src="apIcon(s.slug)" alt="" width="50" height="50" loading="lazy" />
            <b>{{ s.name }}</b>
            <small v-if="s.count">{{ apCountText(s) }}</small>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="ap-wrap ap-sec">
      <div class="ap-farm">
        <div class="ap-farm__text">
          <h2>Наши фермеры</h2>
          <p>Работаем только с фермами, которые с заботой выращивают и производят продукты в экологически чистых условиях. Каждую партию овощей и фруктов проверяем дважды: при закупке и у себя на складе — нитратомером.</p>
          <div class="ap-farm__sticker">
            <img :src="apAsset('label.svg')" alt="" width="64" height="64" />
            <p><b>Зелёный стикер</b>Продукты, которые соответствуют нашим стандартам качества, мы отмечаем зелёным стикером.</p>
          </div>
          <ul class="ap-farm__nums">
            <li v-for="x in apNumbers" :key="x.t"><b>{{ x.n }}</b><span>{{ x.t }}</span></li>
          </ul>
          <NuxtLink :to="apPath('/about')" class="ap-btn ap-btn--line">О компании</NuxtLink>
        </div>
        <ul class="ap-farm__people">
          <li v-for="f in apFarmers" :key="f.name">
            <img :src="apAsset(f.img)" :alt="f.name" loading="lazy" width="448" height="640" />
            <b>{{ f.name }}</b>
          </li>
        </ul>
      </div>
    </section>

    <section class="ap-wrap ap-sec">
      <div class="ap-head"><h2>Почему именно мы?</h2></div>
      <ul class="ap-why">
        <li v-for="w in why" :key="w.title">
          <ApIcon :name="w.icon" />
          <div><b>{{ w.title }}</b><p>{{ w.text }}</p></div>
        </li>
      </ul>
    </section>

    <section class="ap-wrap ap-sec">
      <div class="ap-head">
        <h2>Блог</h2>
        <NuxtLink :to="apPath('/blog')" class="ap-link">Все статьи <ApIcon name="right" /></NuxtLink>
      </div>
      <ul class="ap-blogrow">
        <li v-for="b in apBlog.slice(0, 3)" :key="b.url">
          <a :href="AP_ORIG + b.url" target="_blank" rel="noopener">
            <img :src="AP_ORIG + b.img" alt="" loading="lazy" width="300" height="300" />
            <span><small>{{ b.date }}</small><b>{{ b.title }}</b></span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.ap .ap-hero { padding-top: 20px;
  &__stage { padding: 36px 40px; border-radius: 28px; background: var(--ap-sur); }
  &__top { display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; justify-items: start;
    h1 { font-size: clamp(30px, 3.1vw, 46px); letter-spacing: -.02em; }
    p { font-size: 16px; color: var(--ap-mute); }
  }
  &__when { display: grid; gap: 2px; padding: 14px 20px; border-radius: var(--ap-R); background: #fff; border: 1px solid var(--ap-line); white-space: nowrap;
    span { font-size: 14px; color: var(--ap-mute); }
    b { font-family: var(--ap-head); font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; }
  }
}
.ap .ap-tabshead { align-items: center; }
.ap .ap-tabs { display: flex; gap: 6px 26px; flex-wrap: wrap;
  button, button:focus { padding: 4px 0 8px; border: 0; border-bottom: 3px solid transparent; background: none; font-family: var(--ap-head); font-size: clamp(20px, 2.2vw, 30px); font-weight: 600; line-height: 1.1; color: var(--ap-mute); white-space: nowrap; }
  button:hover { color: var(--ap-ink); }
  button.is-on, button.is-on:focus { color: var(--ap-ink); border-bottom-color: var(--ap-acc); }
  button.is-hot.is-on, button.is-hot.is-on:focus { border-bottom-color: var(--ap-or); }
}
.ap ul.ap-svc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 0;
  a { display: grid; grid-template-columns: 148px minmax(0, 1fr); height: 100%; border-radius: var(--ap-R); background: var(--ap-sur); overflow: hidden; }
  img { width: 100%; height: 100%; min-height: 164px; object-fit: cover; transition: transform .3s; }
  a:hover img { transform: scale(1.05); }
  span { display: grid; gap: 6px; align-content: center; padding: 18px 20px; }
  b { font-family: var(--ap-head); font-size: 21px; font-weight: 600; line-height: 1.15; }
  small { font-size: 14px; color: var(--ap-mute); line-height: 1.4; }
  i { font-style: normal; margin-top: 4px; }
}
.ap ul.ap-cats { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin: 0; padding: 0;
  a { display: grid; gap: 6px; justify-items: start; align-content: start; height: 100%; padding: 16px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); box-sizing: border-box; transition: border-color .15s, background-color .15s;
    &:hover { border-color: var(--ap-acc); background: var(--ap-sur); }
  }
  img { width: 50px; height: 50px; }
  b { font-weight: 600; font-size: 15px; line-height: 1.25; }
  small { color: var(--ap-mute); font-size: 13px; }
}
.ap .ap-farm { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 40px; align-items: center;
  &__text { display: grid; gap: 18px; justify-items: start;
    h2 { font-size: clamp(26px, 2.6vw, 36px); }
    > p { color: var(--ap-mute); font-size: 16px; }
  }
  &__sticker { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: var(--ap-R); background: var(--ap-sur);
    img { width: 64px; height: 64px; flex: none; }
    p { font-size: 14px; line-height: 1.45; color: var(--ap-mute); }
    b { display: block; color: var(--ap-ink); font-size: 16px; }
  }
}
.ap ul.ap-farm__nums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 0; width: 100%;
  li { display: grid; gap: 4px; align-content: start; }
  b { font-family: var(--ap-head); font-size: clamp(26px, 2.6vw, 38px); font-weight: 600; line-height: 1; color: var(--ap-acc); white-space: nowrap; }
  span { font-size: 13px; line-height: 1.35; color: var(--ap-mute); }
}
.ap ul.ap-farm__people { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 0; padding: 0;
  li { position: relative; border-radius: var(--ap-R); overflow: hidden; aspect-ratio: 448 / 640; }
  li:nth-child(even) { transform: translateY(18px); }
  img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  b { position: absolute; left: 8px; right: 8px; bottom: 8px; padding: 8px 10px; border-radius: 10px; background: rgba(255, 255, 255, .94); font-size: 14px; line-height: 1.2; font-weight: 600; text-align: center; }
}
.ap ul.ap-why { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 0;
  li { display: flex; gap: 14px; align-items: flex-start; padding: 20px; border-radius: var(--ap-R); background: var(--ap-sur); }
  .ap-icon { width: 28px; height: 28px; color: var(--ap-acc); }
  b { display: block; margin-bottom: 4px; font-family: var(--ap-head); font-size: 19px; font-weight: 600; }
  p { font-size: 14px; color: var(--ap-mute); line-height: 1.45; }
}
.ap ul.ap-blogrow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 0;
  a { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 16px; align-items: center; height: 100%; padding: 12px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); box-sizing: border-box; &:hover { border-color: var(--ap-acc); } }
  img { width: 120px; height: 120px; border-radius: 12px; object-fit: cover; }
  span { display: grid; gap: 6px; }
  small { color: var(--ap-mute); font-size: 13px; }
  b { font-weight: 600; line-height: 1.3; }
}
@media (max-width: 1199px) {
  .ap ul.ap-svc a { grid-template-columns: 110px minmax(0, 1fr); }
  .ap ul.ap-svc b { font-size: 18px; }
  .ap ul.ap-why { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ap .ap-farm { grid-template-columns: minmax(0, 1fr); }
  .ap ul.ap-blogrow a { grid-template-columns: 88px minmax(0, 1fr); }
  .ap ul.ap-blogrow img { width: 88px; height: 88px; }
}
@media (max-width: 989px) {
  .ap ul.ap-svc, .ap ul.ap-blogrow { grid-template-columns: minmax(0, 1fr); }
  .ap ul.ap-svc a { grid-template-columns: 148px minmax(0, 1fr); }
}
@media (max-width: 768px) {
  .ap .ap-hero { padding-top: 12px; padding-left: 8px; padding-right: 8px; }
  .ap .ap-hero__stage { padding: 20px 14px 18px; border-radius: 22px; }
  .ap .ap-hero__top p { display: none; }
  .ap .ap-hero__top { gap: 10px; }
  .ap .ap-hero__when { width: 100%; box-sizing: border-box; padding: 10px 14px; b { font-size: 20px; } }
  .ap .ap-tabs { gap: 4px 18px; }
  .ap ul.ap-cats { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; a { padding: 12px 10px; } b { font-size: 13.5px; } }
  .ap ul.ap-farm__people { grid-template-columns: repeat(2, minmax(0, 1fr)); li:nth-child(even) { transform: none; } }
  .ap ul.ap-why { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 576px) {
  .ap ul.ap-svc a { grid-template-columns: 104px minmax(0, 1fr); span { padding: 14px; } }
  .ap ul.ap-cats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ap ul.ap-farm__nums { gap: 10px; }
}
@media (max-width: 375px) {
  .ap .ap-hero__top h1 { font-size: 29px; }
  .ap .ap-hero__when { white-space: normal; }
  .ap ul.ap-farm__nums { grid-template-columns: minmax(0, 1fr); li { grid-template-columns: 110px minmax(0, 1fr); align-items: center; gap: 10px; } }
}
</style>
