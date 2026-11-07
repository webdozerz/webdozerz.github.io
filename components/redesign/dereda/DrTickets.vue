<script lang="ts" setup>
// «Билеты» доставки: ближайшие вторник и пятница с концом приёма заказов и живым отсчётом по времени Новосибирска.
// На главной — информация, в корзине — выбор дня (v-model).
const props = withDefaults(defineProps<{ n?: number; pick?: boolean }>(), { n: 2, pick: false })
const model = defineModel<string>({ default: '' })
const now = useDrNow()
const list = computed(() => drDeliveries(now.value, props.n))
const wdName = ['', '', 'Вторник', '', '', 'Пятница', '']
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
watch(
  list,
  (l) => {
    if (props.pick && !l.some((d) => d.key === model.value)) model.value = l[0]?.key ?? ''
  },
  { immediate: true },
)
</script>

<template>
  <div class="dr-tickets" :class="{ 'dr-tickets--pick': props.pick }" :role="props.pick ? 'radiogroup' : undefined">
    <component
      :is="props.pick ? 'button' : 'div'"
      v-for="(d, i) in list"
      :key="d.key"
      :type="props.pick ? 'button' : undefined"
      class="dr-ticket"
      :class="{ 'is-on': props.pick ? model === d.key : i === 0 }"
      :role="props.pick ? 'radio' : undefined"
      :aria-checked="props.pick ? model === d.key : undefined"
      @click="props.pick && (model = d.key)"
    >
      <span class="dr-ticket__day">
        <em v-if="props.pick ? model === d.key : i === 0" class="dr-ticket__tag">{{ props.pick ? 'Выбрано' : 'Ближайшая' }}</em>
        <b>{{ wdName[d.wd] }}</b>
        <span>{{ d.day }} {{ months[d.month] }}, 10:00–20:00</span>
      </span>
      <span class="dr-ticket__cut">
        <span>Приём {{ d.untilLabel }}</span>
        <b>осталось {{ drLeft(d.until - now) }}</b>
      </span>
    </component>
  </div>
</template>

<style lang="scss">
.dr-tickets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 12px;
}

.dr-ticket {
  position: relative;
  display: grid;
  gap: 10px;
  padding: 14px 18px;
  border: 1px solid var(--dr-line);
  border-radius: var(--dr-r);
  background: #fff;
  color: var(--dr-text);
  font: inherit;
  text-align: left;
  // вырезы «билета» по бокам
  -webkit-mask: radial-gradient(circle 9px at 0 58%, #0000 98%, #000) left / 51% 100% no-repeat,
    radial-gradient(circle 9px at 100% 58%, #0000 98%, #000) right / 51% 100% no-repeat;
  mask: radial-gradient(circle 9px at 0 58%, #0000 98%, #000) left / 51% 100% no-repeat,
    radial-gradient(circle 9px at 100% 58%, #0000 98%, #000) right / 51% 100% no-repeat;

  &__day {
    display: grid;
    gap: 2px;

    b {
      color: var(--dr-brown);
      font-family: var(--dr-head);
      font-size: 22px;
      font-weight: 400;
      line-height: 1.1;
      font-variant-numeric: normal;
    }

    span {
      color: var(--dr-muted);
      font-size: 14px;
    }
  }

  &__cut {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2px 10px;
    padding-top: 10px;
    border-top: 1px dashed var(--dr-line);
    font-size: 14px;

    b {
      color: var(--dr-accent);
      font-weight: 700;
      white-space: nowrap;
    }
  }

  &__tag {
    position: absolute;
    top: 14px;
    right: 16px;
    padding: 3px 9px;
    border-radius: 8px;
    background: var(--dr-accent-soft);
    color: var(--dr-accent-hover);
    font-size: 13px;
    font-style: normal;
    font-weight: 700;
    line-height: 1.3;
  }

  .dr-tickets--pick & {
    cursor: pointer;

    &:not(.is-on) .dr-ticket__cut b {
      color: var(--dr-muted);
    }

    &:not(.is-on):hover {
      border-color: var(--dr-brown);
    }
  }
}
</style>
