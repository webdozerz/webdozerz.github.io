<script lang="ts" setup>
import FmIcon from './FmIcon.vue'

// Фирменная деталь: заказ собирается в живое сообщение ферме — пузырь чата, как в Telegram.
const props = withDefaults(defineProps<{ actions?: boolean; sample?: boolean }>(), { actions: false, sample: false })
const order = useFermatomskOrder()
const ui = useFermatomskUi()

const day = computed(() => ui.days.value.find((d) => d.key === order.form.value.day))

// Пока заказ пуст, на главной показываем пример из двух продуктов фермы.
const sampleLines = computed(() =>
  ['milk-goat', 'cheese-hard'].map((id, i) => {
    const product = fmFindProduct(id)!
    const qty = i === 0 ? 2 : 3
    return { product, qty, sum: product.price * qty }
  }),
)
const isSample = computed(() => props.sample && !order.count.value)
const text = computed(() =>
  fmOrderText(isSample.value ? sampleLines.value : order.lines.value, order.form.value, day.value ?? ui.days.value[0]),
)

const copy = async (to?: string) => {
  try {
    await navigator.clipboard.writeText(text.value)
  } catch {
    /* буфер обмена может быть недоступен */
  }
  ui.say(
    to
      ? `Демо: на сайте фермы текст скопируется и откроется чат ${to} с FermaTomsk. Здесь заказ никуда не отправляется.`
      : 'Текст заказа скопирован',
  )
}
</script>

<template>
  <div class="fm-msg">
    <div class="fm-msg__head">
      <span class="fm-msg__ava"><i class="fm-logo" /></span>
      <span>
        <b>FermaTomsk</b>
        <small>ответим и подтвердим заказ</small>
      </span>
    </div>
    <div class="fm-msg__chat">
      <p v-if="!order.count.value && !isSample" class="fm-msg__empty">
        Добавьте продукты — здесь появится готовое сообщение для фермы.
      </p>
      <div v-else class="fm-msg__bubble">
        <pre>{{ text }}</pre>
        <span class="fm-msg__time">{{ isSample ? 'пример' : 'черновик' }} <FmIcon name="check" :size="14" /></span>
      </div>
    </div>
    <div v-if="props.actions" class="fm-msg__actions">
      <button type="button" class="fm-btn" :disabled="!order.count.value" @click="copy('Telegram')">
        <FmIcon name="telegram" :size="20" /> Отправить в Telegram
      </button>
      <button type="button" class="fm-btn fm-btn--ghost" :disabled="!order.count.value" @click="copy('MAX')">
        <FmIcon name="max" :size="20" /> Отправить в MAX
      </button>
      <button type="button" class="fm-btn fm-btn--ghost" :disabled="!order.count.value" @click="copy()">
        <FmIcon name="copy" :size="20" /> Скопировать текст
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.fm-msg {
  overflow: hidden;
  border: 1px solid #e3dccf;
  border-radius: var(--fm-r-lg);
  background: var(--fm-chat);

  &__head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: #f7f4ef;
    border-bottom: 1px solid #e3dccf;

    b {
      display: block;
      font-weight: 700;
      line-height: 1.2;
    }

    small {
      color: var(--fm-muted);
      font-size: 13px;
    }
  }

  &__ava {
    display: grid;
    place-items: center;
    flex: none;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--fm-green);
    color: #fff;

    .fm-logo {
      width: 30px;
      height: 23px;
    }
  }

  &__chat {
    display: flex;
    justify-content: flex-end;
    padding: 20px 16px;
    min-height: 140px;
  }

  &__empty {
    align-self: center;
    margin: 0 auto;
    padding: 8px 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7);
    color: var(--fm-muted);
    font-size: 14px;
    text-align: center;
  }

  &__bubble {
    position: relative;
    max-width: min(100%, 420px);
    padding: 12px 14px 8px;
    border-radius: 16px 16px 4px 16px;
    background: var(--fm-bubble);
    box-shadow: 0 1px 1px rgba(47, 36, 25, 0.08);

    pre {
      margin: 0;
      font: inherit;
      font-size: 15px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  }

  &__time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 2px;
    color: var(--fm-green-d);
    font-size: 12px;
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 8px;
    padding: 0 16px 16px;

    // На бежевом фоне чата вторичные кнопки белые с рамкой, иначе сливаются.
    .fm-btn--ghost {
      box-shadow: inset 0 0 0 1px #d9d1c5;
    }
  }
}
</style>
