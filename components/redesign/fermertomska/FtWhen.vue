<script lang="ts" setup>
import FtIcon from './FtIcon.vue'

// «Когда привезут»: ближайшие дни доставки по расписанию завода (заказ до 15:00 по Томску,
// Октябрьский район — вт, чт, сб). В корзине выбранный день — v-model.
const props = defineProps<{ selectable?: boolean }>()
const model = defineModel<string | null>({ default: null })
const october = defineModel<boolean>('october', { default: false })

const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  now.value = ftTomskNow()
  timer = setInterval(() => (now.value = ftTomskNow()), 30_000)
})
onBeforeUnmount(() => clearInterval(timer))

const slots = computed(() => (now.value ? ftDeliverySlots(now.value, october.value, 4) : []))
const first = computed(() => slots.value[0])
const left = computed(() => (first.value && now.value ? ftLeftToday(first.value.deadline, now.value) : null))

watch(
  slots,
  (list) => {
    if (props.selectable && list.length && !list.some((s) => s.key === model.value)) model.value = list[0].key
  },
  { immediate: true },
)
</script>

<template>
  <div class="ft-when">
    <div class="ft-when__tabs" role="radiogroup" aria-label="Район доставки">
      <button type="button" role="radio" :aria-checked="!october" :class="{ 'is-on': !october }" @click="october = false">
        Томск
      </button>
      <button type="button" role="radio" :aria-checked="october" :class="{ 'is-on': october }" @click="october = true">
        Октябрьский район
      </button>
    </div>

    <div v-if="first && now" class="ft-when__main">
      <FtIcon name="truck" :size="28" />
      <div>
        <p class="ft-when__day">Привезём {{ ftDayLabel(first.date) }}, утром</p>
        <p class="ft-when__deadline">
          если закажете {{ ftDeadlineLabel(first.deadline, now) }}<template v-if="left"> · осталось {{ left }}</template>
        </p>
      </div>
    </div>
    <div v-else class="ft-when__main is-loading" aria-hidden="true" />

    <div v-if="slots.length > 1 || selectable" class="ft-when__slots">
      <span v-if="!selectable" class="ft-when__label">Следующие дни:</span>
      <template v-if="selectable">
        <button
          v-for="s in slots"
          :key="s.key"
          type="button"
          :class="{ 'is-on': model === s.key }"
          :aria-pressed="model === s.key"
          @click="model = s.key"
        >
          <strong>{{ ftDayShort(s.date) }}</strong>
          <small>{{ ftDeadlineLabel(s.deadline, now!) }}</small>
        </button>
      </template>
      <template v-else>
        <span v-for="s in slots.slice(1)" :key="s.key" class="ft-when__chip">{{ ftDayShort(s.date) }}</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.ft .ft-when {
  display: grid;
  gap: 14px;

  &__tabs {
    display: inline-flex;
    justify-self: start;
    max-width: 100%;
    padding: 4px;
    border-radius: 14px;
    background: var(--ft-surface);

    button {
      min-height: 36px;
      padding: 0 14px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 800;
      color: var(--ft-muted);
      white-space: nowrap;

      &.is-on {
        background: #fff;
        color: var(--ft-ink);
        box-shadow: 0 1px 4px rgba(29, 43, 74, 0.12);
      }
    }
  }

  &__main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    min-height: 56px;
    color: var(--ft-accent);

    &.is-loading {
      border-radius: 14px;
      background: var(--ft-surface-2);
    }
  }

  &__day {
    color: var(--ft-ink);
    font-size: 20px;
    font-weight: 900;
    line-height: 1.2;

  }

  &__deadline {
    margin-top: 2px;
    color: var(--ft-muted);
    font-size: 15px;
    font-weight: 600;
  }

  &__slots {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;

    button {
      display: grid;
      min-width: 0;
      padding: 8px 12px;
      border-radius: 14px;
      background: #fff;
      box-shadow: inset 0 0 0 1px var(--ft-line);
      text-align: left;
      transition: box-shadow 0.15s;

      strong {
        font-weight: 900;
      }

      small {
        color: var(--ft-muted);
        font-size: 12px;
        font-weight: 700;
      }

      &.is-on {
        background: var(--ft-accent-soft);
        box-shadow: inset 0 0 0 2px var(--ft-accent);
      }
    }
  }

  &__label {
    color: var(--ft-muted);
    font-size: 14px;
    font-weight: 700;
  }

  &__chip {
    padding: 4px 10px;
    border-radius: 10px;
    background: var(--ft-surface);
    font-size: 14px;
    font-weight: 800;
  }

  @media (max-width: 375px) {
    &__tabs button {
      padding: 0 10px;
      font-size: 13px;
    }
  }
}
</style>
