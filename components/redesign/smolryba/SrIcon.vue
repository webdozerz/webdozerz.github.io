<script lang="ts" setup>
// Линейные иконки 24×24, обводка currentColor. Telegram, MAX и иконки преимуществ — их SVG с сайта, маской (класс .sr-mask).
const props = defineProps<{ name: string }>()
const paths: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  phone: 'M6 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2L21 15v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3Z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  down: 'M6 9l6 6 6-6',
  right: 'M9 6l6 6-6 6',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  copy: 'M9 9h10v11H9zM5 15V4h10',
  box: 'M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9ZM3.5 7.5 12 12l8.5-4.5M12 12v9',
  sheet: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5',
  ship: 'M3 17l2 3h14l2-3M5 17V11h14v6M8 11V7h8v4M12 3v4',
  up: 'M6 15l6-6 6 6',
  sort: 'M8 5v14M5 16l3 3 3-3M16 19V5M13 8l3-3 3 3',
}
</script>

<template>
  <svg class="sr-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[props.name] || ''" />
  </svg>
</template>
