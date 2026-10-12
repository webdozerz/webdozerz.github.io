<script setup lang="ts">
import { contacts, profile, stats } from '~/data/profile'

const { copyEmail } = useHomeUi()

// Время в Томске и «чем я сейчас занят». Считаем только в браузере, чтобы не ломать гидратацию.
const clock = ref('')
const status = ref('')
let timer: ReturnType<typeof setInterval> | undefined

function tick() {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Tomsk',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  const hour = Number(get('hour'))
  const weekend = ['сб', 'вс'].includes(get('weekday').toLowerCase())

  clock.value = `${get('hour')}:${get('minute')}`
  if (hour >= 23 || hour < 8)
    status.value = 'скорее всего сплю'
  else if (weekend)
    status.value = 'выходной, отвечаю не сразу'
  else if (hour >= 9 && hour < 19)
    status.value = 'скорее всего пишу код'
  else
    status.value = 'вечер, отвечаю не сразу'
}

const hero = ref<HTMLElement>()

function onPointerMove(event: PointerEvent) {
  const el = hero.value
  if (!el)
    return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 15_000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <section id="top" ref="hero" class="hero" @pointermove="onPointerMove">
    <div class="hero__grid" aria-hidden="true" />

    <div class="shell hero__inner">
      <p class="hero__meta mono">
        <span class="dot" aria-hidden="true" />
        <span>{{ profile.city }}</span>
        <ClientOnly>
          <span class="hero__clock">· {{ clock }} · {{ status }}</span>
        </ClientOnly>
      </p>

      <h1 class="hero__title">
        {{ profile.firstName }} {{ profile.lastName }}
      </h1>

      <p class="hero__role">
        {{ profile.role }} <span class="hero__grade mono">{{ profile.grade }}</span>
        <span class="hero__stack">{{ profile.stackLine }}</span>
      </p>

      <p class="hero__lead">
        {{ profile.lead }}
      </p>

      <div class="hero__actions">
        <a :href="contacts.telegram" target="_blank" rel="noopener" class="h-btn h-btn--telegram">
          <svg class="h-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21.6 3.6 2.9 10.8c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8l3.2-15.2c.3-1.3-.5-1.9-1.4-1.5ZM9.4 14.4l-.4 4.1-1.5-4.8 11-6.9c.5-.3.9-.1.5.2l-9.6 7.4Z" />
          </svg>
          Написать в Telegram
        </a>
        <button type="button" class="h-btn" @click="copyEmail">
          Скопировать email
        </button>
        <a :href="contacts.github" target="_blank" rel="noopener" class="h-btn h-btn--ghost">
          GitHub ↗
        </a>
      </div>

      <dl class="stats">
        <div v-for="item in stats" :key="item.label" class="stats__item">
          <dt class="stats__value">
            {{ item.value }}
          </dt>
          <dd class="stats__label">
            {{ item.label }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  --mx: 50%;
  --my: 30%;

  position: relative;
  padding: 48px 0 72px;
  overflow: hidden;

  &__grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(var(--h-dot) 1px, transparent 1px);
    background-size: 22px 22px;
    mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, #000 35%, transparent 80%);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(360px circle at var(--mx) var(--my), var(--h-accent-glow), transparent 70%);
    }
  }

  &__inner {
    position: relative;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 0 0 24px;
    color: var(--h-muted);
    font-size: 13px;
  }

  &__title {
    margin: 0;
    font-size: clamp(44px, 8.5vw, 104px);
    font-weight: 600;
    line-height: 0.98;
    letter-spacing: -0.04em;
  }

  &__role {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px 14px;
    margin: 28px 0 0;
    font-size: clamp(18px, 2.2vw, 22px);
    font-weight: 500;
  }

  &__grade {
    padding: 3px 8px;
    border: 1px solid var(--h-line-strong);
    border-radius: 6px;
    color: var(--h-accent);
    font-size: 12px;
    font-weight: 500;
    vertical-align: middle;
  }

  &__stack {
    color: var(--h-muted);
    font-weight: 400;
  }

  &__lead {
    max-width: 640px;
    margin: 16px 0 0;
    color: var(--h-muted);
    font-size: 17px;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 36px;
  }
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--h-up);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--h-up) 18%, transparent);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 72px 0 0;
  border-top: 1px solid var(--h-line);

  &__item {
    padding: 22px 20px 0 0;

    & + & {
      padding-left: 20px;
      border-left: 1px solid var(--h-line);
    }
  }

  &__value {
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: 600;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    margin: 6px 0 0;
    color: var(--h-muted);
    font-size: 14px;
    line-height: 1.4;
  }
}

@media (max-width: 760px) {
  .hero {
    padding: 32px 0 48px;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
    margin-top: 48px;

    &__item {
      padding: 18px 12px 18px 0;
      border-bottom: 1px solid var(--h-line);

      & + & {
        padding-left: 0;
        border-left: 0;
      }

      &:nth-child(even) {
        padding-left: 16px;
        border-left: 1px solid var(--h-line);
      }
    }
  }
}
</style>
