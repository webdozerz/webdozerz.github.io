<script lang="ts" setup>
// Форма «Запросить прайс» — как у оригинала: ИНН, имя, почта, телефон, комментарий.
// Оранжевая панель с крутящейся печатью «PRICE LIST» — их же приём, только аккуратнее.
// Это демо: заявка никуда не отправляется.
import SbIcon from './SbIcon.vue'

const props = withDefaults(defineProps<{ topic?: string; modal?: boolean; tone?: 'orange' | 'lime' }>(), {
  topic: '',
  modal: false,
  tone: 'orange',
})
const emit = defineEmits<{ done: [] }>()

const uid = useId()
const inn = ref('')
const name = ref('')
const email = ref('')
const phone = ref('')
const comment = ref(props.topic ? `Прайс по разделу «${props.topic}»` : '')
const sent = ref(false)
const tried = ref(false)

watch(
  () => props.topic,
  (t) => {
    comment.value = t ? `Прайс по разделу «${t}»` : ''
    sent.value = false
    tried.value = false
  },
)

const innOk = computed(() => !inn.value || /^\d{10}(\d{2})?$/.test(inn.value.replace(/\s/g, '')))
const phoneOk = computed(() => phone.value.replace(/\D/g, '').length >= 10)
const ok = computed(() => innOk.value && phoneOk.value && name.value.trim().length > 1)

const onPhone = (e: Event) => {
  let d = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)
  const p = d.slice(1)
  let out = '+7'
  if (p.length) out += ` (${p.slice(0, 3)}`
  if (p.length >= 3) out += ')'
  if (p.length > 3) out += ` ${p.slice(3, 6)}`
  if (p.length > 6) out += `-${p.slice(6, 8)}`
  if (p.length > 8) out += `-${p.slice(8, 10)}`
  phone.value = out
}

const submit = () => {
  tried.value = true
  if (!ok.value) return
  sent.value = true
}
const again = () => {
  sent.value = false
  tried.value = false
  emit('done')
}
</script>

<template>
  <section class="sb-pform" :class="[`sb-pform--${tone}`, { 'sb-pform--modal': modal }]">
    <svg class="sb-pform__stamp" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path :id="`${uid}-c`" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <text>
        <textPath :href="`#${uid}-c`" textLength="272">PRICE LIST · ПРАЙС-ЛИСТ · PRICE LIST ·</textPath>
      </text>
      <path class="sb-pform__stamp-leaf" d="M60 70V56m0 4c-4 0-9-2-10-8 5 0 9 3 10 8zm0-3c.5-6 4.5-10 10-11 .5 6-3.5 10.5-10 11z" />
    </svg>
    <span class="sb-pform__blob sb-pform__blob--a" aria-hidden="true" />
    <span class="sb-pform__blob sb-pform__blob--b" aria-hidden="true" />

    <div v-if="!sent" class="sb-pform__inner">
      <h2 class="sb-pform__title">
        Заполните заявку и получите <span class="sb-pill">прайс</span> прямо сейчас
      </h2>
      <p class="sb-pform__lead">
        Оставьте контакты — менеджер перезвонит в течение 5 минут в рабочее время:
        пн–пт с 9 до 17 по Новосибирску.
      </p>
      <form class="sb-pform__grid" novalidate @submit.prevent="submit">
        <label class="sb-field">
          <span>ИНН компании</span>
          <input v-model="inn" inputmode="numeric" placeholder="10 или 12 цифр" maxlength="14" :aria-invalid="tried && !innOk" />
          <small v-if="tried && !innOk">ИНН — 10 цифр у организации или 12 у ИП</small>
        </label>
        <label class="sb-field">
          <span>Ваше имя</span>
          <input v-model="name" autocomplete="name" placeholder="Как к вам обращаться" :aria-invalid="tried && name.trim().length < 2" />
        </label>
        <label class="sb-field">
          <span>Почта</span>
          <input v-model="email" type="email" autocomplete="email" placeholder="для прайса в Excel" />
        </label>
        <label class="sb-field">
          <span>Телефон</span>
          <input :value="phone" type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" :aria-invalid="tried && !phoneOk" @input="onPhone" />
          <small v-if="tried && !phoneOk">Нужен телефон, чтобы перезвонить</small>
        </label>
        <label class="sb-field sb-field--wide">
          <span>Комментарий</span>
          <textarea v-model="comment" rows="3" placeholder="Какие разделы интересуют, город доставки, объём закупки" />
        </label>
        <div class="sb-pform__foot">
          <button type="submit" class="sb-btn sb-btn--dark sb-btn--lg">
            Запросить прайс
            <SbIcon name="arrow" :size="18" />
          </button>
          <p>Нажимая на кнопку, вы соглашаетесь с условиями обработки персональных данных.</p>
        </div>
      </form>
    </div>

    <div v-else class="sb-pform__inner sb-pform__done" role="status">
      <h2 class="sb-pform__title">Спасибо, {{ name.trim() }}! <span class="sb-pill">Прайс</span> уже в пути</h2>
      <p class="sb-pform__lead">
        Это демо: заявка никуда не отправлена. На рабочем сайте она придёт менеджеру
        и в CRM, а прайс в Excel — на {{ email || 'почту' }}.
      </p>
      <button type="button" class="sb-btn sb-btn--dark" @click="again">{{ modal ? 'Закрыть' : 'Заполнить ещё раз' }}</button>
    </div>
  </section>
</template>

<style lang="scss">
.sb .sb-pform {
  --pf-bg: var(--sb-orange);
  --pf-ink: #fff;
  --pf-blob-a: var(--sb-lime);
  --pf-blob-b: var(--sb-green);

  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 32px;
  background: var(--pf-bg);
  color: var(--pf-ink);
  padding: clamp(28px, 5vw, 56px);

  &--lime {
    --pf-bg: var(--sb-lime);
    --pf-ink: var(--sb-ink);
    --pf-blob-a: #fff;
    --pf-blob-b: var(--sb-orange);
  }

  &__inner {
    position: relative;
    z-index: 2;
    max-width: 880px;
  }

  &__title {
    max-width: 640px;
    font-family: var(--sb-display);
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.025em;
    color: inherit;
    padding-right: 120px;
  }

  .sb-pill {
    display: inline-block;
    padding: 0 0.32em 0.06em;
    border-radius: 999px;
    background: var(--sb-lime);
    color: var(--sb-ink);
  }

  &--lime .sb-pill {
    background: #fff;
  }

  &__lead {
    max-width: 560px;
    margin-top: 14px;
    font-size: 16px;
    opacity: 0.92;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 28px;
  }

  .sb-field {
    color: inherit;

    > span {
      color: inherit;
      opacity: 0.9;
    }

    input,
    textarea {
      background: #fff;
      box-shadow: none;
    }

    small {
      color: #fff;
      background: rgba(16, 36, 30, 0.35);
      border-radius: 8px;
      padding: 2px 8px;
      justify-self: start;
    }
  }

  &--lime .sb-field small {
    color: var(--sb-ink);
    background: rgba(255, 255, 255, 0.7);
  }

  .sb-field--wide {
    grid-column: 1 / -1;
  }

  &__foot {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px 20px;

    p {
      max-width: 360px;
      font-size: 13px;
      opacity: 0.85;
    }
  }

  &__done {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;

    .sb-btn {
      margin-top: 18px;
    }
  }

  &__stamp {
    position: absolute;
    z-index: 3;
    top: clamp(16px, 3vw, 32px);
    right: clamp(16px, 3vw, 36px);
    width: clamp(92px, 11vw, 132px);
    height: auto;
    animation: sb-spin 18s linear infinite;

    text {
      fill: var(--sb-lime);
      stroke: none;
      font-family: var(--sb-display);
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    &-leaf {
      fill: none;
      stroke: var(--sb-lime);
      stroke-width: 2;
    }
  }

  &--lime .sb-pform__stamp text {
    fill: var(--sb-green);
  }

  &--lime .sb-pform__stamp-leaf {
    stroke: var(--sb-green);
  }

  &__blob {
    position: absolute;
    z-index: 1;
    border-radius: 50%;
    pointer-events: none;

    &--a {
      width: 420px;
      height: 420px;
      right: -140px;
      bottom: -230px;
      background: var(--pf-blob-a);
      opacity: 0.9;
    }

    &--b {
      width: 260px;
      height: 260px;
      right: 150px;
      bottom: -190px;
      background: var(--pf-blob-b);
    }
  }

  // модалка: шапка цветная, поля на белом
  &--modal {
    padding: 28px;
    border-radius: 28px;

    .sb-pform__title {
      font-size: clamp(24px, 3.4vw, 32px);
    }

    .sb-pform__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .sb-pform__blob--a {
      width: 300px;
      height: 300px;
      right: -120px;
      bottom: -170px;
    }

    .sb-pform__blob--b {
      display: none;
    }
  }

  @media (max-width: 900px) {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 560px) {
    &__title {
      padding-right: 84px;
    }

    &__grid,
    &--modal .sb-pform__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__foot .sb-btn {
      width: 100%;
    }

    &__blob--b {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__stamp {
      animation: none;
    }
  }
}

@keyframes sb-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
