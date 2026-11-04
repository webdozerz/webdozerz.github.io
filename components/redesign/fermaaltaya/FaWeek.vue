<script lang="ts" setup>
// Неделя фермы: приём до 12:00 вс и ср → ночью собираем → курьеры везут пн–вт и чт–пт. Время — новосибирское.
import FaIcon from './FaIcon.vue'

const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const now = useFaNow()
const cart = useFermaAltaya()
const week = computed(() => faWeek(new Date(now.value)))
const wave = computed(() => faWaves(new Date(now.value), 1)[0])
const wd = computed(() => faWaveDays(wave.value))
const left = computed(() => faLeft(wave.value.deadline.getTime() - faNowLocal(new Date(now.value)).getTime()))
const inWave = (d: Date) => wave.value.days.some((x) => x.getTime() === d.getTime())
// дни прошлой волны: её приём уже закрыт, курьеры везут собранные заказы
const isClosed = (d: { date: Date; role: string }) =>
  d.role !== 'rest' && d.date.getTime() < wave.value.deadline.getTime() - (d.role === 'deadline' ? 12 * 3600e3 : 0)
const isDeadline = (d: Date) => d.getTime() + 12 * 3600e3 === wave.value.deadline.getTime()
</script>

<template>
  <div class="fa-week" :class="{ 'is-compact': props.compact }">
    <ol class="fa-week__days">
      <li
        v-for="d in week"
        :key="d.num"
        class="fa-week__day"
        :class="[`is-${d.role}`, { 'is-today': d.today, 'is-past': isClosed(d), 'is-wave': inWave(d.date), 'is-dl': isDeadline(d.date) }]"
      >
        <span class="fa-week__dn">{{ d.short }}</span>
        <b class="fa-week__num">{{ d.num }}</b>
        <span class="fa-week__ic">
          <FaIcon v-if="d.role === 'deliver'" name="truck" :size="17" />
          <FaIcon v-else-if="d.role === 'deadline'" name="moonsmall" :size="16" />
        </span>
        <span class="fa-week__what">{{ d.role === 'deliver' ? 'привоз' : d.role === 'deadline' ? 'до 12:00' : '' }}</span>
      </li>
    </ol>
    <p class="fa-week__now">
      <FaIcon name="timer" :size="18" />
      <span>
        Заказ до 12:00 {{ faDayGen(wave.deadline) }} привезём в {{ faDayAcc(wave.days[0]) }} или {{ faDayAcc(wave.days[1]) }}, <b>{{ wd.dates }}</b>
        <template v-if="!props.compact"> — {{ faCities[cart.city.value].area }}</template>.
        До конца приёма <b class="fa-week__left">{{ left }}</b>
      </span>
    </p>
    <p v-if="!props.compact" class="fa-week__legend">
      <span><i class="is-deliver" />курьеры с 10 до 20</span>
      <span><i class="is-deadline" />приём до 12:00, ночью собираем</span>
    </p>
  </div>
</template>
