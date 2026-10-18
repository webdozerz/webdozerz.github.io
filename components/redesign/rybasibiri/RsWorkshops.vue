<script lang="ts" setup>
// Цеха компании плитками: у каждого своя иконка из того, что там делают.
defineProps<{ compact?: boolean }>()

const icons: Record<(typeof rsWorkshops)[number]['icon'], string> = {
  fillet: 'M3 12c2.4-3.7 5.9-5.6 10-5.6 3 0 5.4 1.4 7 3.4L22 7.5v9l-2-2.3c-1.6 2-4 3.4-7 3.4-4.1 0-7.6-1.9-10-5.6zM10 7.5v9M14 7v10',
  squid: 'M8 3h8l-1 9H9zM9 12l-2 8M11 12l-.5 9M13 12l.5 9M15 12l2 8',
  smoke: 'M8 20c-2-3 2-5 0-8s2-5 0-8M12 20c-2-3 2-5 0-8s2-5 0-8M16 20c-2-3 2-5 0-8s2-5 0-8',
  meat: 'M3 5h12v8H3zM15 8h6v2h-6zM6.5 9h.01',
  salad: 'M3 12h18a9 7 0 0 1-18 0zM8 12c0-2 1-4 3-5M13 12c.3-2 1.6-3.2 3.6-3.6',
  vacuum: 'M5 4h14v16H5zM5 8h14M9 13h6M9 16h4',
  frost: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5',
}
</script>

<template>
  <ul class="rs-shops" :class="{ 'rs-shops--compact': compact }">
    <li v-for="w in rsWorkshops" :key="w.icon" class="rs-shop">
      <span class="rs-shop__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24"><path :d="icons[w.icon]" /></svg>
      </span>
      <span class="rs-shop__text">
        <b>{{ w.label }}</b>
        <span>{{ w.text }}</span>
      </span>
    </li>
  </ul>
</template>

<style lang="scss">
.rs ul.rs-shops {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  list-style: none;

  &--compact {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.rs .rs-shop {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--rs-ice);

  &__icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #fff;
    color: var(--rs-blue);
  }

  &__text {
    display: grid;
    min-width: 0;
    line-height: 1.3;

    b {
      font-weight: 600;
    }

    span {
      font-size: 13px;
      color: var(--rs-muted);
    }
  }
}

// На ледяной панели плитки белые, а подложка иконки — ледяная.
.rs .rs-panel .rs-shop {
  background: #fff;

  .rs-shop__icon {
    background: var(--rs-ice);
  }
}
</style>
