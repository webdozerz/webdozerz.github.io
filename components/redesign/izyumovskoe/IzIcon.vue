<script lang="ts" setup>
// Иконки концепта одной стилистики: линия 1,8 px, скруглённые концы, цвет — currentColor.
const props = withDefaults(defineProps<{ name: string; size?: number; fill?: boolean }>(), { size: 22, fill: false })

const paths: Record<string, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
  search: 'M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM16 16l4 4',
  user: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5',
  bag: 'M5.5 8h13l-1 12h-11zM9 8V6.5a3 3 0 0 1 6 0V8',
  compare: 'M7 4v16M17 4v16M4 8h6M14 14h6M4 8l3 7 3-7M14 14l3-7 3 7M4 15a3 3 0 0 0 6 0M14 7',
  scales: 'M12 4v16M7 20h10M5 7h14M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z',
  phone: 'M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2z',
  mail: 'M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4.5l3 2',
  truck: 'M3 6h11v10H3zM14 9.5h3.5l3 3V16H14M8.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zM18.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z',
  meet: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 19c.5-3 2.6-4.5 5.5-4.5s5 1.5 5.5 4.5M13 15.2c.9-.5 1.9-.7 3-.7 2.9 0 5 1.5 5.5 4.5',
  barn: 'M3.5 10L12 4l8.5 6v10h-17zM9 20v-6h6v6M9 14l6 6M15 14l-6 6',
  card: 'M3.5 6h17v12h-17zM3.5 10h17M7 14.5h3',
  cash: 'M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 10v4M18 10v4',
  doc: 'M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 15.5h6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7M10.5 11v5M13.5 11v5',
  share: 'M17 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM7 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM9.2 10.8l5.6-3M9.2 13.2l5.6 3',
  copy: 'M9 9h10.5v11H9zM15 9V4.5H4.5V15H9',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l7-7',
  shield: 'M12 3.5l7.5 3v5.5c0 4.5-3.2 7.7-7.5 9-4.3-1.3-7.5-4.5-7.5-9V6.5zM8.5 12l2.5 2.5 4.5-5',
  gift: 'M4 9.5h16v3H4zM5.5 12.5h13V20h-13zM12 9.5V20M12 9.5c-1-3-5-4-5-1.5S12 9.5 12 9.5zM12 9.5c1-3 5-4 5-1.5S12 9.5 12 9.5z',
  egg: 'M12 3.5c3.5 0 6.5 6 6.5 10a6.5 6.5 0 0 1-13 0c0-4 3-10 6.5-10z',
  timer: 'M12 6.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 10v3.5l2.5 1.5M9.5 3.5h5',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  rows: 'M4.5 5h15M4.5 12h15M4.5 19h15',
  filter: 'M4 6h16M7 12h10M10 18h4',
  vk: 'M3.5 7h3c.3 3.8 2 5.6 3.3 5.9V7h2.8v3.3c1.3-.1 2.6-1.6 3.1-3.3h2.7c-.4 2.1-2 3.6-3.1 4.3 1.1.5 2.9 1.9 3.5 4.2h-3c-.6-1.6-1.9-2.8-3.2-2.9v2.9h-.3C6.6 15.5 3.7 12.3 3.5 7z',
  star: 'M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z',
}
</script>

<template>
  <svg
    class="iz-icon"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    :fill="props.fill ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[props.name]" />
  </svg>
</template>
