<script lang="ts" setup>
// Иконки концепта одной стилистики: линия 1,8 px, скруглённые концы, цвет — currentColor.
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 22 })

const paths: Record<string, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  share: 'M17.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.7 13.3l6.6 3.4M15.3 7.3L8.7 10.7',
  photo: 'M4 7.5h3.5L9 5h6l1.5 2.5H20V19H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  box: 'M4 8l8-4 8 4v8.5l-8 4-8-4zM4 8l8 4 8-4M12 12v8.5',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5',
  download: 'M12 4v11M7 10.5l5 5 5-5M5 19.5h14',
  fish: 'M3 12c3-4.5 7-6 11-5 2.5.6 4.5 2.4 6 5-1.5 2.6-3.5 4.4-6 5-4 1-8-.5-11-5zM3 12l-1.5-3.5M3 12l-1.5 3.5M16 10.5v.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0',
  info: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 11v5M12 8v.01',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.8-4.8',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
  phone: 'M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
  mail: 'M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7',
  list: 'M8 4.5h8v3H8zM6 6H4.5v14.5h15V6H18M8 12h8M8 16h5',
  copy: 'M9 9h10.5v11H9zM15 9V4.5H4.5V15H9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7M10.5 11v5M13.5 11v5',
  truck: 'M3 6h11v10H3zM14 9.5h3.5l3 3V16H14M8.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zM18.8 18a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z',
  store: 'M3.5 10L12 4l8.5 6v10h-17zM8 20v-6h8v6M8 17h8',
  doc: 'M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 15.5h6',
  card: 'M3.5 6h17v12h-17zM3.5 10h17M7 14.5h3',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4.5l3 2',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  print: 'M7 8V3.5h10V8M7 17H4.5V8h15v9H17M7 13.5h10v7H7z',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  star: 'M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z',
  scale: 'M12 4v16M5 20h14M6 8h12M6 8l-2.5 6a2.5 2.5 0 0 0 5 0zM18 8l-2.5 6a2.5 2.5 0 0 0 5 0z',
}

// Знак MAX с maxicons.ru — залитый, с полями под размер линейных иконок.
const marks: Record<string, { box: string; d: string }> = {
  max: {
    box: '-15 -15 750 750',
    d: 'M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z',
  },
}
</script>

<template>
  <svg
    v-if="marks[props.name]"
    class="bp-icon"
    :width="props.size"
    :height="props.size"
    :viewBox="marks[props.name].box"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="marks[props.name].d" />
  </svg>
  <svg
    v-else
    class="bp-icon"
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
