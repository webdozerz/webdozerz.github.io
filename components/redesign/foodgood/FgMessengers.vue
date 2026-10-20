<script lang="ts" setup>
// Мессенджеры магазина: на оригинале это главный канал заказа.
const icons: Record<string, string> = {
  telegram: 'M21 4 3 11l6 2 2 6 3-4 5 4 2-15zM9 13l8-6',
  whatsapp:
    'M4 20l1.3-4A8 8 0 1 1 8 18.8L4 20zM9 9c0 3 3 6 6 6l1.2-1.4-2-1-1 .9c-1-.4-2-1.4-2.4-2.4l.9-1-1-2L9 9z',
  max: 'M12 20a8 8 0 1 0-6.9-4L4 20l4-1.1A8 8 0 0 0 12 20zM8.5 14V10l3.5 3 3.5-3v4',
  'max-channel': 'M4 10v4h3l5 4V6L7 10H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11',
  vk: 'M3 7h3.2c.6 3.6 2.2 5.4 3.3 5.8V7h3v3.4c1.2-.1 2.6-1.8 3.2-3.4h3c-.5 2.2-2.1 4-3.2 4.7 1.1.5 2.9 1.9 3.5 4.3h-3.3c-.6-1.6-1.9-2.8-3.2-3v3H12c-5.2 0-8.2-3.6-9-9z',
}
</script>

<template>
  <ul class="fg-msg">
    <li v-for="m in fgContacts.messengers" :key="m.id">
      <a :href="m.href" target="_blank" rel="noopener" :class="`fg-msg__item fg-msg__item--${m.id}`">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path :d="icons[m.id]" /></svg>
        {{ m.title }}
      </a>
    </li>
  </ul>
</template>

<style lang="scss">
.fg .fg-msg {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 16px 0 12px;
    border-radius: var(--fg-r);
    background: #fff;
    font-weight: 500;
    white-space: nowrap;
    transition:
      color 0.15s,
      box-shadow 0.15s;

    &:hover {
      color: var(--fg-leaf);
      box-shadow: inset 0 0 0 1px var(--fg-leaf);
    }

    svg {
      color: var(--fg-leaf);
    }
  }
}
</style>
