<script lang="ts" setup>
// Иконки концепта одной стилистики: линия 1,8 px, скруглённые концы, цвет — currentColor.
const props = withDefaults(defineProps<{ name: string; size?: number }>(), {
  size: 22,
})

const paths: Record<string, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  phone: 'M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
  chat: 'M4.5 5.5h15v10h-8l-4.5 4v-4h-2.5z',
  truck:
    'M3 6h11v10H3zM14 9.5h3.5l3 3V16H14M8.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zM18.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z',
  basket: 'M4 9.5h16l-1.6 9a2 2 0 0 1-2 1.5H7.6a2 2 0 0 1-2-1.5zM8.5 9.5L11 4M15.5 9.5L13 4M9 13.5v3M12 13.5v3M15 13.5v3',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  shield: 'M12 3.5l7 2.8V11c0 4.6-3 8.1-7 9.5-4-1.4-7-4.9-7-9.5V6.3zM8.8 12l2.2 2.2 4.4-4.4',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l7-7',
  calendar: 'M4.5 6h15v14h-15zM4.5 10h15M8.5 3.5v4M15.5 3.5v4',
  copy: 'M9 9h10.5v11H9zM15 9V4.5H4.5V15H9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7M10.5 11v5M13.5 11v5',
  zoom: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M11 8v6M8 11h6',
  scale: 'M12 4v3M5.5 7h13M5.5 7l-3 7a3 3 0 0 0 6 0zM18.5 7l-3 7a3 3 0 0 0 6 0zM8 20h8M12 7v13',
  card: 'M3.5 6h17v12h-17zM3.5 10h17M7 14.5h4',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.8-4.8',
  down: 'M6 9l6 6 6-6',
  clock: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2',
  fish: 'M2.5 7.5l3 4.5-3 4.5M5.5 12c2.5-4 6-6 9.5-6 3 0 5.5 2.5 6.5 6-1 3.5-3.5 6-6.5 6-3.5 0-7-2-9.5-6zM16.5 10.5v.01',
  whatsapp: 'M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6zM9.2 8.4c0 3.6 2.6 6.4 6.4 6.4l.9-1.6-2-1-.9.8c-1-.4-2-1.4-2.4-2.4l.8-.9-1-2z',
  vk: 'M3.5 7.5h3.2c.4 3 1.7 5 3.3 5.6V7.5h3v3.3c1.5-.2 2.9-1.8 3.5-3.3h3c-.5 2-2 3.8-3.3 4.6 1.3.6 3 2.3 3.8 4.4h-3.3c-.7-1.5-2.1-2.7-3.7-2.9v2.9h-.7c-5 0-8-3.4-8.8-9z',
}

// Знак Telegram — залитый фирменный самолётик.
const marks: Record<string, { box: string; d: string }> = {
  telegram: {
    box: '0 0 24 24',
    d: 'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z',
  },
}
</script>

<template>
  <svg
    v-if="marks[props.name]"
    class="lf-icon"
    :viewBox="marks[props.name].box"
    :width="props.size"
    :height="props.size"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="marks[props.name].d" />
  </svg>
  <svg
    v-else
    class="lf-icon"
    viewBox="0 0 24 24"
    :width="props.size"
    :height="props.size"
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
