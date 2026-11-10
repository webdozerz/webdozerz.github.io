<script lang="ts" setup>
// Линейные иконки одной стилистики (24×24, обводка currentColor)
const props = defineProps<{ name: string }>()
const paths: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  cart: 'M3 4h2.5l2.2 10.5h10.2L20 7H7M9.5 19.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 19.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  phone: 'M6 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2L21 15v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  close: 'M6 6l12 12M18 6 6 18',
  down: 'M6 9l6 6 6-6',
  right: 'M9 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6',
  filter: 'M4 6h16M7 12h10M10 18h4',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.500 9.7l5.900-.9Z',
  truck: 'M3 6h11v10H3zM14 9h4l3 3.5V16h-7M7.5 19a1.5 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3ZM17.500 19a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3Z',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  gift: 'M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7s-1-4-4-4-2 4 4 4ZM12 7s1-4 4-4 2 4-4 4Z',
  back: 'M9 7l-5 5 5 5M4 12h11a5 5 0 0 1 5 5v1',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  bolt: 'M13 3 5 13h6l-1 8 8-10h-6l1-8Z',
  scale: 'M4 20h16M7 20c0-5 2-8 5-8s5 3 5 8M5 9h14M12 9v3M8 6h8',
}
const filled = computed(() => props.name === 'star')
</script>

<template>
  <svg class="ap-icon" viewBox="0 0 24 24" width="24" height="24" :fill="filled ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name] || ''" />
  </svg>
</template>
