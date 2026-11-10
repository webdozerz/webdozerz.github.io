<script lang="ts" setup>
import { apPath, apRub, apSlotText, apWhen, apZoneList } from '~/utils/apeti'
import { apSlots } from '~/utils/apetiData'
import { useApShop } from '~/composables/useApeti'
import ApIcon from '~/components/redesign/apeti/ApIcon.vue'

const shop = useApShop()
useSeoMeta({ title: 'Доставка и оплата — Apeti, концепт редизайна' })
const now = ref<Date | null>(null)
const when = computed(() => (now.value ? apWhen(now.value) : null))
onMounted(() => (now.value = new Date()))
const open = (s: string) => !when.value || !when.value.today || when.value.todaySlots.includes(s)
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки"><NuxtLink :to="apPath('/')">Главная</NuxtLink><span>Доставка и оплата</span></nav>
    <div class="ap-head ap-del__head">
      <div>
        <h1>Доставка и оплата</h1>
        <p>Доставим заказ на дом или в офис в Москве и в пределах 30 км от МКАД. Минимальная сумма заказа — от 2 000 руб.</p>
      </div>
    </div>

    <ul class="ap-del__facts">
      <li><ApIcon name="clock" /><div><b>С 9:00 до 22:00 ежедневно</b><p>Окна по три часа — выберите удобное при оформлении.</p></div></li>
      <li><ApIcon name="truck" /><div><b>До 19:00 — в тот же день</b><p>Заказы, оформленные после 19:00, приезжают на следующий день.</p></div></li>
      <li><ApIcon name="phone" /><div><b>Курьер позвонит за час</b><p>За час до прибытия вам позвонит курьер.</p></div></li>
      <li><ApIcon name="pin" /><div><b>Самовывоз — на любую сумму</b><p>Заказ будет ждать на Преображенском рынке: ул. Преображенский Вал, 17/11.</p></div></li>
    </ul>

    <section class="ap-del__grid">
      <div>
        <h2>Сколько стоит доставка в ваш район</h2>
        <p class="ap-del__hint">Нажмите на свой район — минимальная сумма и доставка подставятся в шапку и корзину.</p>
        <div class="ap-ztable" role="table">
          <div class="ap-ztable__head" role="row"><span>Район</span><span>Заказ</span><span>Доставка</span></div>
          <button v-for="z in apZoneList" :key="z.i" type="button" role="row" :class="{ 'is-on': z.i === shop.zone.value }" @click="shop.setZone(z.i)">
            <span>{{ z.name }}</span><em>от {{ apRub(z.min) }}</em><b>{{ apRub(z.fee) }}</b>
          </button>
        </div>
      </div>
      <div class="ap-del__side">
        <div class="ap-panel">
          <h2>Окна доставки</h2>
          <p v-if="when">{{ when.today ? `Сегодня ещё доступны окна с ${when.slot.split('–')[0]}.` : 'На сегодня приём заказов закончен — привезём завтра.' }}</p>
          <div class="ap-del__slots">
            <span v-for="s in apSlots" :key="s" :class="{ 'is-off': !open(s) }">{{ apSlotText(s) }}</span>
          </div>
        </div>
        <div class="ap-panel ap-prose">
          <h2>Оплата</h2>
          <p><b>Наличными.</b> Заказ оплачивается наличными при получении в пункте выдачи или курьеру. Вместе с заказом выдаётся кассовый или товарный чек.</p>
          <p><b>Банковской картой.</b> Картой можно оплатить курьеру при доставке: Mastercard, Visa, SberPay.</p>
          <p><b>Баллами.</b> 1 балл = 1 рубль, списать можно в корзине.</p>
        </div>
      </div>
    </section>

    <section id="return" class="ap-del__return ap-prose">
      <h2>Возврат и обмен</h2>
      <p>Мы выбираем для вас свежие продукты высокого качества и гарантируем возврат или обмен товаров, если они не соответствуют заявленному качеству.</p>
      <p>Отказаться от товара, если не устраивает его внешний вид, можно только до момента его оплаты: оплаченные продукты питания надлежащего качества, в неповреждённой упаковке и с действующим сроком годности возврату и обмену не подлежат.</p>
      <h3>Продукты ненадлежащего качества</h3>
      <ul class="ap-list">
        <li>полностью вернём внесённую за товар оплату;</li>
        <li>заменим товар на аналогичный надлежащего качества;</li>
        <li>заменим некачественный продукт на идентичный с перерасчётом стоимости;</li>
        <li>снизим стоимость, если вы готовы пользоваться товаром.</li>
      </ul>
      <h3>Непродовольственные товары</h3>
      <p>Товар надлежащего качества можно вернуть в течение 7 дней с момента покупки без объяснения причин, если он не был в употреблении, сохранены первоначальный вид, бирки, пломбы, комплектация, упаковка и чек. Исключения: предметы личной гигиены и парфюмерно-косметические товары, швейные и трикотажные изделия, бытовая химия, пестициды и агрохимикаты, растения.</p>
      <h3>За качество отвечаем</h3>
      <p>Если вы обнаружили просроченную или некачественную продукцию, сообщите нам в этот или на следующий день после покупки: <a href="mailto:kachestvo@apeti.ru">kachestvo@apeti.ru</a> или <a href="tel:+74958220707">8 (495) 822-07-07</a>. Мы рассмотрим любые претензии.</p>
    </section>
  </div>
</template>

<style lang="scss">
.ap .ap-del__head { margin-top: 12px; }
.ap ul.ap-del__facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin: 0 0 40px; padding: 0;
  li { display: flex; gap: 14px; align-items: flex-start; padding: 20px; border-radius: var(--ap-R); background: var(--ap-sur); }
  .ap-icon { width: 26px; height: 26px; color: var(--ap-acc); }
  b { display: block; margin-bottom: 4px; font-family: var(--ap-head); font-size: 18px; font-weight: 600; line-height: 1.2; }
  p { font-size: 14px; color: var(--ap-mute); line-height: 1.45; }
}
.ap .ap-del__grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 32px; align-items: start;
  h2 { font-size: 26px; margin-bottom: 8px; }
}
.ap .ap-del__hint { margin-bottom: 16px; color: var(--ap-mute); }
.ap .ap-del__side { display: grid; gap: 16px; .ap-panel { display: grid; gap: 10px; h2 { margin: 0; font-size: 22px; } } }
.ap .ap-del__slots { display: flex; flex-wrap: wrap; gap: 8px;
  span { padding: 6px 12px; border-radius: 10px; background: #fff; font-size: 14px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  span.is-off { color: var(--ap-mute); text-decoration: line-through; opacity: .6; }
}
.ap .ap-ztable { display: grid; border: 1px solid var(--ap-line); border-radius: var(--ap-R); overflow: hidden;
  &__head, button, button:focus { display: grid; grid-template-columns: minmax(0, 1fr) 110px 90px; gap: 12px; align-items: center; min-height: 44px; padding: 6px 16px; text-align: left; }
  &__head { background: var(--ap-sur); font-size: 13px; color: var(--ap-mute); span:last-child { text-align: right; } }
  button, button:focus { border: 0; border-top: 1px solid var(--ap-line); background: #fff; font-size: 14.5px;
    em { font-style: normal; color: var(--ap-mute); white-space: nowrap; }
    b { text-align: right; font-weight: 600; white-space: nowrap; }
  }
  button:hover { background: var(--ap-sur); }
  button.is-on, button.is-on:focus { background: var(--ap-soft); font-weight: 600; }
}
.ap .ap-del__return { margin-top: 48px; scroll-margin-top: 110px; }
@media (max-width: 1199px) { .ap ul.ap-del__facts { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 989px) { .ap .ap-del__grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 576px) {
  .ap ul.ap-del__facts { grid-template-columns: minmax(0, 1fr); margin-bottom: 28px; }
  .ap .ap-ztable__head, .ap .ap-ztable button, .ap .ap-ztable button:focus { grid-template-columns: minmax(0, 1fr) 86px 64px; gap: 8px; padding: 6px 12px; font-size: 13.5px; }
}
</style>
