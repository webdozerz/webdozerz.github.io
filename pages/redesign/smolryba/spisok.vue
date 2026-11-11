<script lang="ts" setup>
// Список заказа: у оригинала заказ звонком по прайсу и спрятанная форма «Оформить заявку» (имя, телефон, e-mail, комментарий).
// Здесь — список с суммой и та же форма; готовое сообщение для MAX / Telegram / почты. Демо: ничего не отправляется.
import { SR_DATE, srContacts, srLine, srPath, srQtyUnit, srPos, srRub, srRub0, srTara, srPer } from '~/utils/smolryba'
import { useSrList } from '~/composables/useSmolryba'
import SrIcon from '~/components/redesign/smolryba/SrIcon.vue'
import SrPhone from '~/components/redesign/smolryba/SrPhone.vue'

useSeoMeta({ title: 'Список заказа — Рыбная база, Смоленск | Концепт редизайна' })

const list = useSrList()
const ships = ['По Смоленску — бесплатно', 'Другой город или Беларусь — рассчитает менеджер']
const f = reactive({ name: '', phone: '', mail: '', ship: ships[0], comment: '', ok: true })
const text = computed(() => list.message(f))
const phoneOk = computed(() => f.phone.replace(/\D/g, '').length === 11)
const sent = ref('')

const copy = async () => {
  try {
    await navigator.clipboard.writeText(text.value)
    list.say('Текст заявки скопирован')
  } catch {
    list.say('Не удалось скопировать — выделите текст вручную')
  }
}
const send = (via: string) => {
  if (!phoneOk.value || !f.ok) return
  sent.value = via
}
const onQty = (id: number, e: Event) => {
  const v = parseInt((e.target as HTMLInputElement).value.replace(/\D/g, ''), 10)
  list.set(id, Number.isFinite(v) ? v : 0)
}
</script>

<template>
  <div class="sr-wrap sr-cart">
    <nav class="sr-crumbs" aria-label="Навигация"><NuxtLink :to="srPath('/')">Главная</NuxtLink><span>/</span>Список заказа</nav>
    <h1>Список заказа</h1>

    <div v-if="!list.count.value && !sent" class="sr-cart__empty">
      <b>Список пока пуст</b>
      <p>Отметьте позиции в каталоге цен — здесь появится заявка с суммой, которую можно отправить менеджеру в MAX, Telegram или на почту.</p>
      <NuxtLink :to="srPath('/price/')" class="sr-btn">Открыть каталог цен</NuxtLink>
    </div>

    <div v-else-if="sent" class="sr-cart__sent">
      <span class="sr-done__ico"><SrIcon name="check" /></span>
      <h2>Заявка готова к отправке</h2>
      <p>Это демо: в концепте заявка никуда не уходит. На настоящем сайте откроется {{ sent }} с этим текстом, менеджер ответит в рабочее время — пн–пт 8–17, сб 9–13.</p>
      <pre class="sr-cart__pre">{{ text }}</pre>
      <div class="sr-cart__sentbtns">
        <button type="button" class="sr-btn sr-btn--line" @click="copy"><SrIcon name="copy" />Скопировать текст</button>
        <button type="button" class="sr-btn sr-btn--soft" @click="sent = ''">Вернуться к списку</button>
      </div>
    </div>

    <div v-else class="sr-cart__grid">
      <div class="sr-cart__items">
        <div class="sr-cart__bar">
          <span>{{ srPos(list.count.value) }} · цены на {{ SR_DATE }}</span>
          <button type="button" class="sr-cart__clear" @click="list.clear()"><SrIcon name="trash" />Очистить</button>
        </div>
        <div v-for="r in list.rows.value" :key="r.it.id" class="sr-line">
          <div class="sr-line__name">
            <b>{{ r.it.n }}</b>
            <span>{{ srTara(r.it) }} · {{ srRub(r.it.p) }} {{ srPer(r.it) }}</span>
            <button v-if="r.it.per" type="button" class="sr-line__box" @click="list.set(r.it.id, r.q + r.it.per!)">+ {{ r.it.perU === 'кор.' ? 'коробка' : 'упаковка' }} ({{ r.it.per }} шт)</button>
          </div>
          <div class="sr-qty">
            <button type="button" aria-label="Меньше" @click="list.set(r.it.id, r.q - 1)"><SrIcon name="minus" /></button>
            <label><input :value="r.q" inputmode="numeric" :style="{ width: String(r.q).length + 0.6 + 'ch' }" @change="onQty(r.it.id, $event)" /><span>{{ srQtyUnit(r.it) }}</span></label>
            <button type="button" aria-label="Больше" @click="list.set(r.it.id, r.q + 1)"><SrIcon name="plus" /></button>
          </div>
          <div class="sr-line__sum">
            <b>{{ srLine(r.it, r.q).approx ? '≈ ' : '' }}{{ srRub0(srLine(r.it, r.q).sum) }}</b>
            <span v-if="srLine(r.it, r.q).approx">{{ r.it.place ? 'по весу места' : 'после взвешивания' }}</span>
          </div>
          <button type="button" class="sr-line__del" aria-label="Убрать из списка" @click="list.set(r.it.id, 0)"><SrIcon name="close" /></button>
        </div>
        <p class="sr-cart__note">Весовой товар считаем по примерному весу места, точную сумму назовём после взвешивания. Скидки от объёма и отсрочку для постоянных клиентов менеджер учтёт в счёте.</p>
        <NuxtLink :to="srPath('/price/')" class="sr-link"><SrIcon name="sheet" />Добавить из каталога цен</NuxtLink>
      </div>

      <aside class="sr-order">
        <div class="sr-order__sum">
          <span>Итого</span>
          <b>{{ list.total.value.approx ? '≈ ' : '' }}{{ srRub0(list.total.value.sum) }}</b>
        </div>
        <h2>Оформить заявку</h2>
        <form class="sr-form" @submit.prevent="send('MAX')">
          <label class="sr-field"><span>Имя или организация</span><input v-model="f.name" autocomplete="organization" placeholder="ООО «Ромашка» или Иван" /></label>
          <label class="sr-field"><span>Телефон</span><SrPhone v-model="f.phone" /></label>
          <label class="sr-field"><span>E-mail</span><input v-model="f.mail" type="email" autocomplete="email" placeholder="для счёта и документов" /></label>
          <fieldset class="sr-seg">
            <legend>Доставка</legend>
            <label v-for="s in ships" :key="s" :class="{ 'is-on': f.ship === s }"><input v-model="f.ship" type="radio" :value="s" />{{ s }}</label>
          </fieldset>
          <label class="sr-field"><span>Комментарий</span><textarea v-model="f.comment" placeholder="Удобное время доставки, нужен ли счёт, реквизиты" /></label>
          <label class="sr-check"><input v-model="f.ok" type="checkbox" /><span>Я соглашаюсь с политикой обработки персональных данных</span></label>
          <div class="sr-order__btns">
            <button type="submit" class="sr-btn" :disabled="!phoneOk || !f.ok"><span class="sr-mask" :style="{ '--m': 'url(/redesign/smolryba/icons/max.svg)' }" />Отправить в MAX</button>
            <button type="button" class="sr-btn sr-btn--line" :disabled="!phoneOk || !f.ok" @click="send('Telegram')"><span class="sr-mask" :style="{ '--m': 'url(/redesign/smolryba/icons/tg.svg)' }" />Telegram</button>
            <button type="button" class="sr-btn sr-btn--line" :disabled="!phoneOk || !f.ok" @click="send(`письмо на ${srContacts.email}`)"><SrIcon name="mail" />На почту</button>
          </div>
          <p v-if="!phoneOk" class="sr-order__hint">Укажите телефон — менеджер перезвонит, чтобы подтвердить заказ.</p>
        </form>
        <details class="sr-order__preview">
          <summary>Текст сообщения</summary>
          <pre class="sr-cart__pre">{{ text }}</pre>
          <button type="button" class="sr-btn sr-btn--line sr-btn--wide" @click="copy"><SrIcon name="copy" />Скопировать</button>
        </details>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.sr-cart { padding-top: 24px;
  > h1 { margin: 12px 0 24px; font-size: clamp(30px, 3.4vw, 46px); }
}
.sr-cart__empty, .sr-cart__sent { display: grid; gap: 12px; justify-items: start; max-width: 640px; padding: 32px; border-radius: var(--sr-R); background: var(--sr-surf);
  b { color: var(--sr-ink); font: 700 24px/1.2 var(--sr-head); } p { color: var(--sr-mute); } h2 { font-size: 28px; }
}
.sr-cart__sentbtns { display: flex; flex-wrap: wrap; gap: 8px; }
.sr-cart__pre { width: 100%; margin: 0; padding: 14px 16px; border-radius: 12px; background: #fff; border: 1px solid var(--sr-line); color: var(--sr-text); font: 13px/1.55 var(--sr-font); white-space: pre-wrap; overflow-wrap: anywhere; box-sizing: border-box; }
.sr-cart__grid { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 40px; align-items: start; }
.sr-cart__items { display: grid; gap: 0; justify-items: stretch; .sr-link { justify-self: start; margin-top: 12px; } }
.sr-cart__bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-bottom: 12px; color: var(--sr-mute); font-size: 14px; }
.sr .sr-cart__clear, .sr .sr-cart__clear:focus { display: inline-flex; align-items: center; gap: 6px; padding: 0; border: 0; background: none; color: var(--sr-mute); font-size: 14px; .sr-icon { width: 18px; height: 18px; } &:hover { color: #b03a2e; } }
.sr-line { display: grid; grid-template-columns: minmax(0, 1fr) auto 130px 36px; gap: 12px 20px; align-items: start; padding: 16px 0; border-top: 1px solid var(--sr-line);
  > .sr-qty, .sr-line__sum, .sr-line__del { min-height: 44px; align-content: center; }
}
.sr-line__name { display: grid; gap: 3px; justify-items: start;
  b { color: var(--sr-ink); font-weight: 600; line-height: 1.35; }
  span { color: var(--sr-mute); font-size: 13px; }
}
.sr .sr-line__box, .sr .sr-line__box:focus { margin-top: 4px; padding: 4px 10px; border: 0; border-radius: 8px; background: var(--sr-surf); color: var(--sr-acc-d); font-size: 13px; font-weight: 500; &:hover { background: var(--sr-soft); } }
.sr-line__sum { display: grid; justify-items: end; text-align: right; b { color: var(--sr-ink); font-size: 17px; font-variant-numeric: tabular-nums; white-space: nowrap; } span { color: var(--sr-mute); font-size: 12px; } }
.sr .sr-line__del, .sr .sr-line__del:focus { display: grid; place-items: center; width: 36px; height: 44px; padding: 0; border: 0; background: none; color: var(--sr-mute); &:hover { color: #b03a2e; } }
.sr-cart__note { margin-top: 8px; padding: 14px 16px; border-radius: 12px; background: var(--sr-surf); color: var(--sr-mute); font-size: 14px; }
.sr-order { display: grid; gap: 16px; padding: 24px; border-radius: var(--sr-R); border: 1px solid var(--sr-line); background: #fff;
  > h2 { font-size: 24px; }
}
.sr-order__sum { display: flex; justify-content: space-between; align-items: baseline; padding: 16px 18px; border-radius: 14px; background: var(--sr-surf);
  span { color: var(--sr-mute); } b { color: var(--sr-ink); font: 700 28px/1 var(--sr-head); font-variant-numeric: tabular-nums; }
}
.sr-seg { display: grid; gap: 8px; margin: 0; padding: 0; border: 0;
  legend { margin-bottom: 6px; color: var(--sr-mute); font-size: 13px; font-weight: 500; }
  label { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border: 1px solid #cfdfe5; border-radius: var(--sr-r); color: var(--sr-ink); font-size: 14px; cursor: pointer;
    input { width: 16px; height: 16px; margin: 0; accent-color: var(--sr-acc); flex: none; }
    &.is-on { border-color: var(--sr-acc); background: var(--sr-surf); }
  }
}
.sr-order__btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
  .sr-btn:first-child { grid-column: 1 / -1; }
  .sr-mask { width: 20px; height: 20px; }
}
.sr-order__hint { color: var(--sr-mute); font-size: 13px; }
.sr-order__preview { summary { color: var(--sr-acc); font-weight: 600; cursor: pointer; } .sr-cart__pre { margin: 10px 0; background: var(--sr-surf); } }

@media (max-width: 1199px) {
  .sr-cart__grid { grid-template-columns: minmax(0, 1fr) 360px; gap: 28px; }
  .sr-line { grid-template-columns: minmax(0, 1fr) 118px 36px; grid-template-areas: 'n n d' 'q s s'; .sr-line__name { grid-area: n; } > .sr-qty { grid-area: q; } .sr-line__sum { grid-area: s; } .sr-line__del { grid-area: d; } }
}
@media (max-width: 989px) {
  .sr-cart__grid { grid-template-columns: minmax(0, 1fr); }
  .sr-order { position: static; }
}
@media (max-width: 576px) {
  .sr-cart__empty, .sr-cart__sent { padding: 22px 18px; }
  .sr-order { padding: 18px 16px; }
  .sr-order__btns { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 375px) {
  .sr-line { grid-template-columns: minmax(0, 1fr) auto 36px; gap: 10px 12px; }
  .sr .sr-line .sr-qty label { min-width: 40px; }
}
</style>
