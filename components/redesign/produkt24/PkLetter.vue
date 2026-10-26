<script lang="ts" setup>
import PkIcon from './PkIcon.vue'

// Фирменная деталь: список превращается в готовую заявку — скопировать, отправить на почту или продиктовать.
const props = withDefaults(defineProps<{ actions?: boolean; sample?: boolean }>(), { actions: false, sample: false })
const list = useProdukt24List()
const ui = useProdukt24Ui()

// Пока список пуст, на главной показываем пример из трёх ходовых позиций.
const sampleLines = computed(() =>
  (
    [
      ['печень говяж', 20],
      ['минтай', 26],
      ['гречневая 50кг', 2],
    ] as [string, number][]
  ).flatMap(([q, qty]) => {
    const product = pkSearch(q)[0]
    if (!product) return []
    const price = product.prices[list.tier.value]
    return [{ product, qty, price, sum: Math.round(price * qty * 100) / 100, weight: pkWeightPer(product) * qty }]
  }),
)
const isSample = computed(() => props.sample && !list.count.value)
const text = computed(() => {
  if (!isSample.value) return list.text.value
  const lines = sampleLines.value
  return pkLetter(lines, list.tier.value, { ...list.form.value, way: 'delivery', address: 'Красноярск, ул. Партизана Железняка, 18' }, lines.reduce((n, l) => n + l.weight, 0))
})

const copy = async (to?: 'mail' | 'phone') => {
  try {
    await navigator.clipboard.writeText(text.value)
  } catch {
    /* буфер обмена может быть недоступен */
  }
  ui.say(
    to === 'mail'
      ? `Демо: на сайте откроется письмо на ${pkContacts.email} с этим текстом. Здесь заявка никуда не отправляется.`
      : 'Заявка скопирована — её можно вставить в письмо или мессенджер',
  )
}
</script>

<template>
  <div class="pk-letter">
    <div class="pk-letter__head">
      <span class="pk-letter__ico"><PkIcon name="mail" :size="20" /></span>
      <span>
        <b>Заявка менеджеру</b>
        <small>кому: {{ pkContacts.email }}</small>
      </span>
      <em v-if="isSample">пример</em>
    </div>
    <p v-if="!list.count.value && !isSample" class="pk-letter__empty">Добавьте позиции — здесь появится готовый текст заявки.</p>
    <pre v-else class="pk-letter__text">{{ text }}</pre>
    <div v-if="props.actions" class="pk-letter__actions">
      <button type="button" class="pk-btn" :disabled="!list.count.value" @click="copy('mail')">
        <PkIcon name="mail" :size="20" /> Отправить на почту
      </button>
      <button type="button" class="pk-btn pk-btn--line" :disabled="!list.count.value" @click="copy()">
        <PkIcon name="copy" :size="20" /> Скопировать
      </button>
      <a :href="pkContacts.phones[0].href" class="pk-btn pk-btn--line"><PkIcon name="phone" :size="20" /> Продиктовать</a>
    </div>
  </div>
</template>
