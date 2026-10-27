<script lang="ts" setup>
// Иконки концепта одной стилистики: линия 1,8 px, скруглённые концы, цвет — currentColor.
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 22 })

const paths: Record<string, string> = {
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.8-4.8',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  down: 'M6 9l6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  phone: 'M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
  mail: 'M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7',
  list: 'M8 4.5h8v3H8zM6 6H4.5v14.5h15V6H18M8 12h8M8 16h5',
  copy: 'M9 9h10.5v11H9zM15 9V4.5H4.5V15H9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7M10.5 11v5M13.5 11v5',
  truck: 'M3 6h11v10H3zM14 9.5h3.5l3 3V16H14M8.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zM18.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z',
  doc: 'M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 15.5h6',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4.5l3 2',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  star: 'M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z',
  play: 'M8 5.5v13l10.5-6.5z',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l8-8',
  drop: 'M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5zM4 4l16 16',
  ban: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM6.4 6.4l11.2 11.2',
  shield: 'M12 3.5l7 2.8v5.2c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6.3zM8.8 12l2.3 2.3 4.2-4.6',
  fish: 'M3 12c3-4.5 7-6 11-6 2.5 0 5 1.6 6.5 6-1.5 4.4-4 6-6.5 6-4 0-8-1.5-11-6zM3 12l-1 3.5M3 12L2 8.5M16.5 10.5v.01',
  factory: 'M3.5 20V10l5 3V10l5 3V5h3v15zM3.5 20h17M16.5 8h4v12',
  chat: 'M4.5 5.5h15v10h-9l-4.5 3.5v-3.5h-1.5z',
  external: 'M14 4.5h5.5V10M19.5 4.5L11 13M17 14v5.5H4.5V7H10',
}

// Залитые знаки мессенджеров — с полями под размер линейных иконок.
const marks: Record<string, { box: string; d: string }> = {
  whatsapp: {
    box: '-2 -2 28 28',
    d: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z',
  },
  vk: {
    box: '-2 -2 28 28',
    d: 'M12.8 18C6.4 18 2.7 13.6 2.6 6.2h3.2c.1 5.4 2.5 7.7 4.4 8.2V6.2h3v4.7c1.9-.2 3.8-2.3 4.5-4.7h3a8.9 8.9 0 0 1-4.1 5.8 9.2 9.2 0 0 1 4.8 6h-3.3a5.8 5.8 0 0 0-4.9-4.2V18z',
  },
}
</script>

<template>
  <svg v-if="marks[props.name]" class="mf-icon" :width="props.size" :height="props.size" :viewBox="marks[props.name].box" fill="currentColor" aria-hidden="true">
    <path :d="marks[props.name].d" />
  </svg>
  <svg
    v-else
    class="mf-icon"
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
