<script lang="ts" setup>
import PageHead from '~/components/redesign/foodgood/PageHead.vue'

useSeoMeta({ title: 'График работы | FoodGood Tomsk' })

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const { from, to } = fgContacts.hours

// Считаем «открыто сейчас» по времени Томска только в браузере, чтобы не ломать статическую сборку.
const now = ref<{ day: number; open: boolean } | null>(null)

onMounted(() => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tomsk',
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const weekday = parts.find((p) => p.type === 'weekday')!.value
  const hour = Number(parts.find((p) => p.type === 'hour')!.value) % 24
  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(weekday)
  now.value = { day, open: hour >= from && hour < to }
})
</script>

<template>
  <div>
    <PageHead
      title="График работы"
      lead="Магазин открыт каждый день без выходных. Время указано томское (UTC+7)."
    />

    <div class="fg-container layout">
      <section class="panel">
        <div v-if="now" class="status" :class="now.open ? 'status--open' : 'status--closed'">
          <span class="status__dot" />
          {{ now.open ? `Сейчас открыто, до ${to}:00` : `Сейчас закрыто, откроемся в ${from}:00` }}
        </div>

        <ul class="days">
          <li v-for="(d, i) in days" :key="d" :class="{ 'is-today': now?.day === i }">
            <span>{{ d }}</span>
            <strong>{{ from }}:00 – {{ to }}:00</strong>
          </li>
        </ul>
      </section>

      <aside class="side">
        <div class="side__card">
          <h2>Самовывоз</h2>
          <p>{{ fgContacts.address }}</p>
          <small>{{ fgContacts.addressNote }}</small>
          <a :href="fgContacts.mapHref" target="_blank" rel="noopener" class="side__link">
            Построить маршрут →
          </a>
        </div>
        <div class="side__card side__card--leaf">
          <h2>Доставка</h2>
          <p>Заказы на доставку на текущий день принимаются до 18:00.</p>
          <small>Окна доставки: 12:00–18:00 и 19:00–22:30</small>
          <NuxtLink :to="fgPath('/catalog')" class="side__link">Перейти в каталог →</NuxtLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 24px;
  align-items: start;
}

.panel {
  padding: 32px;
  border-radius: 28px;
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
  }

  &--open {
    background: var(--fg-leaf-soft);
    color: #2f6b17;
  }
  &--closed {
    background: var(--fg-berry-soft);
    color: var(--fg-berry);
  }
}

.days {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    padding: 16px 14px;
    border-bottom: 1px solid var(--fg-line);
    border-radius: 12px;

    &:last-child {
      border-bottom: 0;
    }

    &.is-today {
      background: var(--fg-leaf-soft);
      border-color: transparent;

      span {
        font-weight: 800;
        color: var(--fg-forest);
      }
    }
  }
}

.side {
  display: grid;
  gap: 24px;

  &__card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 28px;
    border-radius: 28px;
    background: var(--fg-paper);
    border: 1px solid var(--fg-line);

    h2 {
      margin-bottom: 6px;
      font-size: 26px;
    }

    small {
      color: var(--fg-muted);
    }

    &--leaf {
      background: var(--fg-leaf-soft);
      border-color: transparent;
    }
  }

  &__link {
    margin-top: 12px;
    align-self: flex-start;
    font-weight: 700;
    color: var(--fg-forest);
    border-bottom: 2px solid var(--fg-leaf);
  }
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
