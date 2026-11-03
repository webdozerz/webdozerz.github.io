<script lang="ts" setup>
// Иконки концепта одной стилистики: линия 1,8 px, скруглённые концы, цвет — currentColor.
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 22 })

const paths: Record<string, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  mail: 'M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7',
  list: 'M8 4.5h8v3H8zM6 6H4.5v14.5h15V6H18M8 12h8M8 16h5',
  copy: 'M9 9h10.5v11H9zM15 9V4.5H4.5V15H9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7M10.5 11v5M13.5 11v5',
  truck: 'M3 6h11v10H3zM14 9.5h3.5l3 3V16H14M8.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zM18.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z',
  doc: 'M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 15.5h6',
  card: 'M3.5 6h17v12h-17zM3.5 10h17M7 14.5h3',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4.5l3 2',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  tag: 'M4 12.5V4.5h8l8 8-8 8zM8.5 8.5v.01',
  chat: 'M4.5 5.5h15v10h-9l-4.5 4v-4h-1.5zM8.5 10.5h7',
  photo: 'M4 7.5h3.5L9 5h6l1.5 2.5H20V19H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  shield: 'M12 3.5l7.5 3v5.5c0 4.5-3.2 7.7-7.5 9-4.3-1.3-7.5-4.5-7.5-9V6.5zM8.5 12l2.5 2.5 4.5-5',
  repeat: 'M17 3.5l3 3-3 3M4 11.5v-1a4 4 0 0 1 4-4h12M7 20.5l-3-3 3-3M20 12.5v1a4 4 0 0 1-4 4H4',
  // улей-«домик» и соты — из названия «Мёд и Соты»
  hive: 'M5 9.5h14M4 14h16M5.5 18.5h13M7 5h10l2 4.5-1 9H6l-1-9zM10.5 21h3',
  comb: 'M8.5 3.5l3.5 2v4l-3.5 2-3.5-2v-4zM15.5 7.5l3.5 2v4l-3.5 2-3.5-2v-4zM8.5 11.5l3.5 2v4l-3.5 2-3.5-2v-4z',
  cube: 'M4.5 7.5L12 4l7.5 3.5v9L12 20l-7.5-3.5zM4.5 7.5L12 11l7.5-3.5M12 11v9',
  scale: 'M5 20.5h14M12 4v16.5M6 7.5h12M6 7.5l-3 6.5a3 3 0 0 0 6 0zM18 7.5l-3 6.5a3 3 0 0 0 6 0z',
}
</script>

<template>
  <svg
    class="bz-icon"
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
