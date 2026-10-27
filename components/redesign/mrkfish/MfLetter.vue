<script lang="ts" setup>
import MfIcon from './MfIcon.vue'

// Фирменная деталь: отмеченные позиции превращаются в готовый запрос прайса — скопировать, на почту или в WhatsApp.
const props = withDefaults(defineProps<{ actions?: boolean; sample?: boolean }>(), { actions: false, sample: false })
const req = useMrkfishRequest()
const ui = useMrkfishUi()

// Пока заявка пуста, на главной показываем пример из трёх ходовых позиций.
const sampleText = computed(() => {
  const pick: [string, number][] = [
    ['forel-file-slabosolenaya', 10],
    ['seld-s-ukropom-150-g', 40],
    ['skumbriya-malosolenaya-5-kg', 6],
  ]
  const lines = pick.flatMap(([id, qty]) => {
    const product = mfFind(id)
    return product ? [{ product, qty, pack: product.packs[0] ?? '', unit: mfUnit(product) }] : []
  })
  const groups = mfSections.map((s) => ({ section: s, lines: lines.filter((l) => l.product.section === s.id) })).filter((g) => g.lines.length)
  return mfLetter(groups, { ...req.form.value, company: 'Магазин «Рыбный»', city: 'Октябрьский', region: mfRegions[0], fullPrice: true })
})
const isSample = computed(() => props.sample && !req.count.value)
const text = computed(() => (isSample.value ? sampleText.value : req.text.value))

const send = async (to: 'mail' | 'whatsapp' | 'copy') => {
  try {
    await navigator.clipboard.writeText(text.value)
  } catch {
    /* буфер обмена может быть недоступен */
  }
  ui.say(
    to === 'mail'
      ? `Демо: на сайте заявка уйдёт на ${mfContacts.email}. Здесь она никуда не отправляется.`
      : to === 'whatsapp'
        ? 'Демо: заявка скопирована, на сайте откроется WhatsApp отдела продаж — останется вставить и отправить.'
        : 'Заявка скопирована — её можно вставить в письмо или мессенджер',
  )
}
</script>

<template>
  <div class="mf-letter" :class="{ 'mf-letter--full': props.actions }">
    <div class="mf-letter__head">
      <span class="mf-letter__ico"><MfIcon name="mail" :size="20" /></span>
      <span>
        <b>Запрос прайса</b>
        <small>в отдел продаж · {{ mfContacts.email }}</small>
      </span>
      <em v-if="isSample">пример</em>
    </div>
    <p v-if="!req.count.value && !isSample" class="mf-letter__empty">Отметьте позиции в каталоге — здесь появится готовый текст заявки.</p>
    <pre v-else class="mf-letter__text">{{ text }}</pre>
    <div v-if="props.actions" class="mf-letter__actions">
      <button type="button" class="mf-btn" :disabled="!req.count.value" @click="send('mail')"><MfIcon name="mail" :size="20" /> Отправить</button>
      <button type="button" class="mf-btn mf-btn--line" :disabled="!req.count.value" @click="send('whatsapp')">
        <MfIcon name="whatsapp" :size="20" /> В WhatsApp
      </button>
      <button type="button" class="mf-btn mf-btn--line" :disabled="!req.count.value" @click="send('copy')">
        <MfIcon name="copy" :size="20" /> Скопировать
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.mf-letter {
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--mf-line);
  border-radius: var(--mf-r-lg);
  background: #fff;

  &__head {
    display: flex;
    align-items: center;
    gap: 12px;

    > span:nth-child(2) {
      display: grid;
      flex: 1;
      min-width: 0;
    }

    b {
      color: var(--mf-ink);
      font-size: 16px;
    }

    small {
      overflow: hidden;
      color: var(--mf-muted);
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    em {
      padding: 3px 9px;
      border-radius: 6px;
      background: var(--mf-sun-soft);
      color: #7a5a00;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
    }
  }

  &__ico {
    display: grid;
    flex: none;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--mf-navy-soft);
    color: var(--mf-navy);
  }

  &__text {
    max-height: 340px;
    overflow: auto;
    padding: 16px;
    border-radius: var(--mf-r);
    background: var(--mf-surface);
    color: var(--mf-text);
    font-family: inherit;
    font-size: 14px;
    line-height: 1.55;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  &--full &__text {
    max-height: none;
  }

  &__empty {
    padding: 16px;
    border-radius: var(--mf-r);
    background: var(--mf-surface);
    color: var(--mf-muted);
  }

  // Колонка заявки узкая — «Отправить» на всю ширину, две другие кнопки под ней.
  &__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 8px;

    .mf-btn:first-child {
      grid-column: 1 / -1;
    }

    @media (max-width: 375px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

}
</style>
