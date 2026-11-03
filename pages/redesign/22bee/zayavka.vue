<script lang="ts" setup>
import BzIcon from '~/components/redesign/22bee/BzIcon.vue'
import BzQty from '~/components/redesign/22bee/BzQty.vue'
import BzPhone from '~/components/redesign/22bee/BzPhone.vue'

// Заявка вместо корзины: у оригинала корзины нет, оптовики оставляют телефон.
// Здесь закупщик сам считает вес и сумму, а заявка уходит письмом на их почту — готовым текстом.
const order = useBee22Order()
const ui = useBee22Ui()
const sent = ref(false)
const error = ref('')

const mailto = computed(
  () => `mailto:${bzContacts.email}?subject=${encodeURIComponent('Заявка на мёд оптом')}&body=${encodeURIComponent(order.text.value)}`,
)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(order.text.value)
    ui.say('Текст заявки скопирован')
  } catch {
    ui.say('Не удалось скопировать — выделите текст вручную')
  }
}
const send = () => {
  if (order.form.value.phone.replace(/\D/g, '').length < 11) {
    error.value = 'Укажите телефон полностью — по нему уточним доставку'
    return
  }
  error.value = ''
  sent.value = true
}
const restart = () => {
  order.clear()
  sent.value = false
}
const fresh = computed(() => bzSorts.filter((s) => s.stock && !order.qtyOf(s.id)))

useSeoMeta({ title: 'Заявка на мёд оптом — Мёд и Соты | Концепт редизайна' })
</script>

<template>
  <div class="bz-wrap bz-order">
    <nav class="bz-crumbs" aria-label="Навигация">
      <NuxtLink :to="bzPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Заявка</span>
    </nav>
    <h1 class="bz-order__title">Заявка на мёд</h1>

    <div v-if="sent" class="bz-order__done" role="status">
      <span class="bz-pform__ok"><BzIcon name="check" :size="26" /></span>
      <h2>Заявка принята</h2>
      <p>
        Свяжемся с вами в {{ order.form.value.messenger === 'Звонок' ? 'звонке' : order.form.value.messenger }} по номеру
        {{ order.form.value.phone }}, подберём транспортную компанию и пришлём счёт. Мы на Алтае, {{ bzContacts.tz }}.
      </p>
      <small>Демо: в концепте заявка никуда не отправляется. На их сайте она придёт на почту {{ bzContacts.email }}.</small>
      <div class="bz-order__doneact">
        <button type="button" class="bz-btn bz-btn--line" @click="sent = false">Вернуться к заявке</button>
        <button type="button" class="bz-btn bz-btn--line" @click="restart">Начать новую</button>
      </div>
    </div>

    <div v-else-if="!order.count.value" class="bz-order__empty">
      <p>В заявке пока пусто. Выберите сорта — вес, цену от 200 кг и сумму посчитаем сразу.</p>
      <div class="bz-order__quick">
        <div v-for="s in fresh" :key="s.id" class="bz-order__qitem">
          <img :src="s.img" :alt="s.title" width="550" height="311" loading="lazy" />
          <span><b>{{ s.short }}</b><small>от {{ bzMoney(s.tiers[1].price) }}/кг</small></span>
          <BzQty :sort="s" />
        </div>
      </div>
    </div>

    <div v-else class="bz-order__grid">
      <div class="bz-order__lines">
        <article v-for="l in order.lines.value" :key="l.sort.id" class="bz-line">
          <NuxtLink :to="bzSortPath(l.sort.id)" class="bz-line__photo"><img :src="l.sort.img" :alt="l.sort.title" width="550" height="311" /></NuxtLink>
          <div class="bz-line__name">
            <NuxtLink :to="bzSortPath(l.sort.id)">{{ l.sort.title }}</NuxtLink>
            <p v-if="l.sort.frames">{{ bzMoney(l.price) }}/кг · от 200 кг — {{ bzMoney(l.sort.tiers[1].price) }}/кг</p>
            <p v-else>
              {{ bzMoney(l.price) }}/кг<template v-if="l.bulk"> · <span class="is-ok">цена от 200 кг</span></template>
            </p>
            <small v-if="!l.sort.frames && l.toBulk">ещё {{ bzCubes(l.toBulk) }}&nbsp;— и&nbsp;{{ bzMoney(l.sort.tiers[1].price) }}/кг</small>
          </div>
          <div class="bz-line__qty"><BzQty :sort="l.sort" /></div>
          <div class="bz-line__sum">
            <template v-if="l.sort.frames"><span>{{ bzFramesLabel(l.qty) }}</span><b>по весу</b></template>
            <template v-else><span>{{ bzKg(l.kg) }}</span><b>{{ bzMoney(l.sum) }}</b></template>
          </div>
          <button type="button" class="bz-iconbtn bz-line__del" :aria-label="`Убрать ${l.sort.short}`" @click="order.remove(l.sort)"><BzIcon name="close" :size="20" /></button>
        </article>

        <div class="bz-order__more">
          <NuxtLink :to="{ path: bzPath(), hash: '#sorta' }" class="bz-link"><BzIcon name="plus" :size="18" />Добавить сорт</NuxtLink>
          <button type="button" class="bz-order__clear" @click="order.clear()">Очистить заявку</button>
        </div>
      </div>

      <aside class="bz-order__side">
        <div class="bz-sum">
          <p class="bz-sum__row">
            <span>Вес</span><b>{{ bzKg(order.kg.value) }}<template v-if="order.hasFrames.value"> + соты</template></b>
          </p>
          <p class="bz-sum__row bz-sum__row--total">
            <span>Итого</span><b>{{ bzMoney(order.total.value) }}</b>
          </p>
          <p class="bz-sum__note">
            Без доставки: её оплачиваете транспортной компании при получении.<template v-if="order.hasFrames.value"> Соты считаем по весу рамок.</template>
          </p>
        </div>

        <form class="bz-sum bz-order__form" novalidate @submit.prevent="send">
          <label class="bz-field">
            <span>Имя или организация</span>
            <input v-model="order.form.value.name" type="text" autocomplete="organization" placeholder="ИП Иванов, магазин «Пасека»" />
          </label>
          <label class="bz-field">
            <span>Телефон</span>
            <BzPhone v-model="order.form.value.phone" />
          </label>
          <div class="bz-field">
            <span>Как с вами связаться</span>
            <div class="bz-seg" role="radiogroup" aria-label="Как связаться">
              <button
                v-for="m in ['MAX', 'WhatsApp', 'Звонок'] as const"
                :key="m"
                type="button"
                role="radio"
                :aria-checked="order.form.value.messenger === m"
                :class="{ 'is-on': order.form.value.messenger === m }"
                @click="order.form.value.messenger = m"
              >
                {{ m }}
              </button>
            </div>
          </div>
          <label class="bz-field">
            <span>Город доставки</span>
            <input v-model="order.form.value.city" type="text" autocomplete="address-level2" placeholder="Например, Екатеринбург" />
          </label>
          <label class="bz-field">
            <span>Комментарий</span>
            <textarea v-model="order.form.value.comment" placeholder="Удобная транспортная компания, реквизиты для счёта" />
          </label>
          <p v-if="error" class="bz-pform__error" role="alert">{{ error }}</p>
          <button type="submit" class="bz-btn bz-btn--main is-big">Отправить заявку</button>
          <div class="bz-order__alt">
            <a :href="mailto" class="bz-btn bz-btn--line"><BzIcon name="mail" :size="18" />Письмом</a>
            <button type="button" class="bz-btn bz-btn--line" @click="copy"><BzIcon name="copy" :size="18" />Скопировать</button>
          </div>
        </form>

        <details class="bz-order__preview">
          <summary>Текст заявки</summary>
          <pre>{{ order.text.value }}</pre>
        </details>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.bz-order {
  &__title {
    margin-bottom: 24px !important;
    font-size: clamp(30px, 3.2vw, 44px);
    line-height: 1.1;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 24px 32px;
    align-items: start;
  }

  &__lines {
    display: grid;
    gap: 10px;
  }

  &__more {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 8px;
  }

  &__clear {
    color: var(--bz-muted);
    font-size: 14px;
    text-decoration: underline;

    &:hover {
      color: var(--bz-red);
    }
  }

  &__side {
    position: sticky;
    top: 92px;
    display: grid;
    gap: 12px;
  }

  &__form {
    display: grid;
    gap: 14px;
  }

  &__alt {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    .bz-btn {
      padding: 0 10px;
    }
  }

  &__preview {
    padding: 14px 18px;
    border-radius: var(--bz-R);
    border: 1px solid var(--bz-line);

    summary {
      color: var(--bz-ink);
      font-weight: 600;
      cursor: pointer;
    }

    pre {
      margin: 12px 0 0;
      white-space: pre-wrap;
      font: 13.5px/1.5 'Onest', system-ui, sans-serif;
      color: var(--bz-text);
    }
  }

  &__empty {
    display: grid;
    gap: 20px;

    > p {
      max-width: 560px;
      font-size: 17px;
    }
  }

  &__quick {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
  }

  &__qitem {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    padding: 12px;
    border-radius: var(--bz-R);
    border: 1px solid var(--bz-line);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 550 / 311;
      object-fit: cover;
      border-radius: 10px;
    }

    > span {
      display: grid;

      b {
        color: var(--bz-ink);
      }

      small {
        color: var(--bz-copper);
        font-size: 14px;
      }
    }

    > .bz-btn,
    > .bz-qty {
      grid-column: 1 / -1;
    }
  }

  &__done {
    display: grid;
    gap: 14px;
    justify-items: start;
    max-width: 640px;
    padding: 32px;
    border-radius: 24px;
    background: var(--bz-surface);

    small {
      color: var(--bz-muted);
    }
  }

  &__doneact {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 1199px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr) 360px;
    }
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__side {
      position: static;
    }
  }
  @media (max-width: 576px) {
    &__done {
      padding: 22px 16px;
    }
  }
  @media (max-width: 375px) {
    &__alt {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.bz-line {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) 190px 130px 44px;
  gap: 10px 20px;
  align-items: start;
  padding: 14px;
  border-radius: var(--bz-R);
  border: 1px solid var(--bz-line);

  &__photo img {
    width: 100%;
    height: auto;
    aspect-ratio: 550 / 311;
    object-fit: cover;
    border-radius: 10px;
  }

  &__name {
    display: grid;
    gap: 2px;
    min-width: 0;

    > a {
      color: var(--bz-ink);
      font-size: 17px;
      font-weight: 700;
      line-height: 1.25;
    }

    p {
      color: var(--bz-muted);
      font-size: 14px;
    }

    .is-ok {
      color: var(--bz-green);
    }

    small {
      color: var(--bz-copper);
      font-size: 13px;
    }
  }

  &__qty,
  &__sum,
  &__del {
    min-height: 46px;
    align-content: center;
  }

  &__sum {
    display: grid;
    text-align: right;

    span {
      color: var(--bz-muted);
      font-size: 14px;
    }

    b {
      color: var(--bz-ink);
      font-size: 18px;
      white-space: nowrap;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 96px minmax(0, 1fr) 124px 44px;
    grid-template-areas:
      'photo name name del'
      'qty qty sum sum';

    &__photo {
      grid-area: photo;
    }
    &__name {
      grid-area: name;
    }
    &__del {
      grid-area: del;
    }
    &__qty {
      grid-area: qty;
      width: 100%;
      max-width: 220px;
    }
    &__sum {
      grid-area: sum;
    }
  }
  @media (max-width: 375px) {
    grid-template-columns: 76px minmax(0, 1fr) 104px 40px;
    padding: 10px;
    gap: 10px;
  }
}

.bz-sum {
  padding: 20px;
  border-radius: var(--bz-R);
  background: var(--bz-surface);

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 4px 0;

    b {
      color: var(--bz-ink);
      white-space: nowrap;
    }

    &--total b {
      font-size: 24px;
    }
  }

  &__note {
    margin-top: 6px !important;
    color: var(--bz-muted);
    font-size: 13.5px;
  }

  // поля на цветной панели — белые с рамкой
  .bz-seg {
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--bz-line);

    button.is-on {
      background: var(--bz-soft);
      box-shadow: inset 0 0 0 1.5px var(--bz-accent-line);
    }
  }
}
</style>
