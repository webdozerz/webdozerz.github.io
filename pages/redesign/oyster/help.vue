<script lang="ts" setup>
import { oyContacts, oyDelivery, oyDeliveryRules, oyMoney, oyPath, oyPayment, oyStorage } from '~/utils/oyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'

useSeoMeta({ title: 'Как купить — Oyster Market | Концепт редизайна' })
const route = useRoute()
const router = useRouter()
const tabs = [
  { id: 'buy', title: 'Как купить' },
  { id: 'delivery', title: 'Доставка' },
  { id: 'payment', title: 'Оплата' },
  { id: 'storage', title: 'Хранение' },
]
const tab = computed(() => (tabs.some((t) => t.id === route.query.tab) ? (route.query.tab as string) : 'buy'))
const go = (id: string) => router.replace({ query: id === 'buy' ? {} : { tab: id } })
const steps = [
  ['Корзина', 'Добавьте товары, выберите размер и отметьте, открыть ли устрицы, ежей или гребешок. Проверьте позиции в корзине.'],
  ['Быстрый заказ', 'Не хотите заполнять форму — оставьте телефон. Менеджер перезвонит с 10:00 до 20:00, уточнит заказ, оплату и доставку.'],
  ['Адрес и доставка', 'Укажите адрес по Москве или области, выберите машину, Яндекс Доставку или самовывоз. Оператор проверит адрес при звонке.'],
  ['Покупатель и оплата', 'ФИО, телефон и комментарий для курьера — например, про подъезд или удобное время. Оплата наличными или по ссылке.'],
  ['Подтверждение', 'Получите подтверждение на почту или телефон. В следующий раз сайт предложит данные прошлого заказа.'],
]
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Помощь</span>
    </nav>
    <h1 class="oy-title">{{ tabs.find((t) => t.id === tab)!.title }}</h1>
    <div class="oy-seg oy-help__tabs" role="tablist">
      <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" :class="{ 'is-on': tab === t.id }" @click="go(t.id)">{{ t.title }}</button>
    </div>

    <div v-if="tab === 'buy'" class="oy-help">
      <ul class="oy-help__steps">
        <li v-for="s in steps" :key="s[0]">
          <b>{{ s[0] }}</b>
          <p>{{ s[1] }}</p>
        </li>
      </ul>
      <div class="oy-panel oy-help__side">
        <b>Удобнее в мессенджере?</b>
        <p>Мы также принимаем заказы в Telegram и MAX — пришлите список, подтвердим наличие и время.</p>
        <div class="oy-hero__btns">
          <a :href="oyContacts.telegram" target="_blank" rel="noopener" class="oy-btn oy-btn--accent">Telegram</a>
          <a :href="oyContacts.max" target="_blank" rel="noopener" class="oy-btn oy-btn--line">MAX</a>
        </div>
      </div>
    </div>

    <div v-else-if="tab === 'delivery'" class="oy-help oy-help--wide">
      <div class="oy-ways2">
        <div v-for="d in oyDelivery" :key="d.id" class="oy-way is-static">
          <span class="oy-way__top"><b>{{ d.title }}</b><em>{{ d.price === null ? 'тариф Яндекса' : d.price === 0 ? 'бесплатно' : oyMoney(d.price) }}</em></span>
          <small>{{ d.note }}</small>
        </div>
      </div>
      <ul class="oy-check">
        <li v-for="r in oyDeliveryRules" :key="r"><OyIcon name="check" :size="20" /><span>{{ r }}</span></li>
      </ul>
      <p class="oy-help__opt">Ресторанам и магазинам — бесплатная доставка по Москве от 5 000 ₽ и по всей России: <NuxtLink :to="oyPath('/opt/')">оптовым клиентам</NuxtLink>.</p>
    </div>

    <div v-else-if="tab === 'payment'" class="oy-help oy-help--wide">
      <div class="oy-ptabs__grid">
        <div v-for="pm in oyPayment" :key="pm.title" class="oy-panel">
          <OyIcon name="card" :size="26" />
          <b>{{ pm.title }}</b>
          <p>{{ pm.text }}</p>
        </div>
      </div>
    </div>

    <div v-else class="oy-help oy-help--wide">
      <ul class="oy-check">
        <li v-for="r in oyStorage" :key="r"><OyIcon name="snow" :size="20" /><span>{{ r }}</span></li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.oy-help__tabs { margin: 8px 0 24px; @media (max-width: 576px) { flex-wrap: nowrap; overflow-x: auto; max-width: 100%; scrollbar-width: none; &::-webkit-scrollbar { display: none; } } }
.oy-help {
  display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 32px; align-items: start;
  &--wide { grid-template-columns: minmax(0, 1fr); max-width: 980px; gap: 24px; }
  &__steps {
    display: grid; gap: 12px;
    li { display: grid; gap: 4px; padding: 18px 20px; border-radius: 14px; background: var(--oy-surface2); border-left: 3px solid var(--oy-accent); }
    b { color: var(--oy-ink); }
    p { color: var(--oy-muted); font-size: 14px; }
  }
  &__side { display: grid; gap: 10px; b { font-size: 18px; color: var(--oy-ink); } p { color: var(--oy-muted); font-size: 14px; } }
  &__opt { color: var(--oy-muted); a { color: var(--oy-accent); text-decoration: underline; } }
  .oy-panel { color: var(--oy-accent); }
  @media (max-width: 989px) { grid-template-columns: minmax(0, 1fr); }
}
.oy-way.is-static { cursor: default; }
</style>
