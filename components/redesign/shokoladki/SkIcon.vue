<script lang="ts" setup>
import { RD_ICON_CATALOG } from '~/utils/redesignIcons'
// Линейные иконки 24×24, обводка currentColor.
const props = defineProps<{ name: string }>()
// Линейные иконки 24×24, обводка currentColor (общий набор концептов + свои: конфета, лента, крышка).
const paths: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  phone: 'M6 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2L21 15v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3Z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  right: 'M9 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
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
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5',
  truck: 'M3 6h11v10H3zM14 9h4l3 3v4h-7M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  smoke: 'M8 21c-2-2-2-4 0-6s2-4 0-6M13 21c-2-2-2-4 0-6s2-4 0-6M18 21c-2-2-2-4 0-6s2-4 0-6',
  doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2ZM10 21h4',
  drag: 'M9 7l-5 5 5 5M15 7l5 5-5 5',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  up: 'M6 15l6-6 6 6',
  down: 'M6 9l6 6 6-6',
  bag: 'M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2',
  grid: RD_ICON_CATALOG,
  cart: 'M3 4h2.5l2.2 11h10.6l2-8H7M9.5 20a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM17.5 20a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z',
  candy: 'M8 8a5.6 5.6 0 0 1 8 8 5.6 5.6 0 0 1-8-8ZM8 8 5 5M5 5H3l2-2v2ZM16 16l3 3M19 19h2l-2 2v-2Z',
  ribbon: 'M12 8c-2-4-7-5-7-1.5S10 8 12 8Zm0 0c2-4 7-5 7-1.5S14 8 12 8Zm0 0-3 13 3-2 3 2-3-13Z',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  photo: 'M4 6h3l1.5-2h7L17 6h3v13H4V6ZM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  bolt: 'M13 3 5 14h6l-1 7 8-11h-6l1-7Z',
  eye: 'M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  lid: 'M3 10h18M5 10l1-4h12l1 4M5 10v9h14v-9',
  shuffle: 'M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3',
  percent: 'M6 18 18 6M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  vk: '',

  scale: 'M12 4v3M5 21h14l-2-12H7L5 21ZM9.5 9a2.5 2.5 0 0 1 5 0',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3ZM9 12l2 2 4-4',
  gift: 'M4 9h16v4H4zM5 13h14v8H5zM12 9v12M12 9c-2-4-6-4-6-1s6 1 6 1Zm0 0c2-4 6-4 6-1s-6 1-6 1Z',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8L12 3.5Z',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z',
  compare: 'M7 4v16M17 4v16M3 9h8M13 15h8M4 9l3-3 3 3M14 15l3 3 3-3',
  share: 'M8.5 13.5l7-4M8.5 10.5l7 4M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  play: 'M8 5.5v13l10.5-6.5L8 5.5Z',
  ruler: 'M3 16 16 3l5 5L8 21l-5-5ZM7 12l2 2M10 9l2 2M13 6l2 2',
  expand: 'M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4',
  horn: 'M4 10v4h3l7 4V6L7 10H4ZM17 9a4 4 0 0 1 0 6M7 14l1.5 5h2.5l-1-5',
  factory: 'M3 21V10l5 3V10l5 3V6l4 2v13H3ZM17 21V4h3v17M7 17h2M11 17h2',
  table: 'M3 8h18M5 8l-1 12M19 8l1 12M8 8v6h8V8',
  tag: 'M3 12V4h8l9.5 9.5-8 8L3 12ZM7.5 8.5h.01',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
  medal: 'M12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.5 10 6 3h4l2 5M15.5 10 18 3h-4l-2 5M12 13v4',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  store: 'M4 9l1.5-5h13L20 9M4 9h16v11H4V9ZM4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M10 20v-5h4v5',
  chat: 'M4 5h16v11H9l-5 4V5ZM8 10h8M8 13h5',
  login: 'M14 4h5v16h-5M10 8l4 4-4 4M14 12H3',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 12.5l9 5 9-5M3 17l9 5 9-5',
  filter: 'M4 6h16M7 12h10M10 18h4',
}
</script>

<template>
  <svg class="sk-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[props.name] || ''" />
  </svg>
</template>
