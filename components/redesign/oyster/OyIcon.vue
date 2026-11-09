<script lang="ts" setup>
// Иконки концепта: линия 1,8 px, скруглённые концы, цвет — currentColor.
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 22 })

const paths: Record<string, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20',
  heart: 'M12 19.5s-7.5-4.5-7.5-10A4 4 0 0 1 12 7a4 4 0 0 1 7.5 2.5c0 5.5-7.5 10-7.5 10z',
  compare: 'M7 20V10M12 20V4M17 20v-7',
  cart: 'M3.5 4.5h2.2l2 10.5h10l1.8-7.5H7M9.5 19.5h.01M16.5 19.5h.01',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6',
  phone: 'M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2z',
  mail: 'M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4.5l3 2',
  truck: 'M3 6h11v10H3zM14 9.5h3.5l3 3V16H14M8.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zM18.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7M10.5 11v5M13.5 11v5',
  tag: 'M4 12.5V4.5h8l8 8-8 8zM8.5 8.5v.01',
  chat: 'M4.5 5.5h15v10h-9l-4.5 4v-4h-1.5zM8.5 10.5h7',
  send: 'M20.5 3.5L3.5 10.5l6.5 2.5 2.5 6.5zM10 13l4.5-4.5',
  doc: 'M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 15.5h6',
  card: 'M3.5 6h17v12h-17zM3.5 10h17M7 14.5h3',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 6.5l2.5-2M9.5 19.5L12 17.5l2.5 2',
  knife: 'M4 20l8.5-8.5M12.5 11.5l6-6.5a2 2 0 0 1 1.5 3l-5.5 6.5zM6.5 17.5l-2-2',
  shield: 'M12 3.5l7.5 3v5.5c0 4.5-3.2 7.7-7.5 9-4.3-1.3-7.5-4.5-7.5-9V6.5zM8.5 12l2.5 2.5 4.5-5',
  home: 'M4 11l8-6.5 8 6.5M6 9.5v10h12v-10M10 19.5v-5h4v5',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  ext: 'M14 4.5h5.5V10M19.5 4.5L11 13M17 14v5.5H4.5V7H10',
  quote: 'M10 7H6.5v5H10v1.5c0 1.5-1 2.5-3 3M18 7h-3.5v5H18v1.5c0 1.5-1 2.5-3 3',
  gift: 'M4 9.5h16v4H4zM5.5 13.5v7h13v-7M12 9.5v11M12 9.5c-1.5-4-6-4-5-1 .5 1 2.5 1 5 1zM12 9.5c1.5-4 6-4 5-1-.5 1-2.5 1-5 1z',
  filter: 'M4 6h16M7 12h10M10 18h4',
  repeat: 'M17 3.5l3 3-3 3M4 11.5v-1a4 4 0 0 1 4-4h12M7 20.5l-3-3 3-3M20 12.5v1a4 4 0 0 1-4 4H4',
  star: 'M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z',
}
</script>

<template>
  <svg
    class="oy-icon"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[props.name]" />
  </svg>
</template>
