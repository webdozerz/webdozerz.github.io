<script lang="ts" setup>
const colors: Record<string, string> = {
  telegram: '#2a9ddc',
  whatsapp: '#25a84a',
  max: '#6b4be0',
  'max-channel': '#6b4be0',
  vk: '#2f6fc9',
}
</script>

<template>
  <div class="msg">
    <a
      v-for="m in fgContacts.messengers"
      :key="m.id"
      :href="m.href"
      target="_blank"
      rel="noopener"
      class="msg__item"
      :style="{ '--c': colors[m.id] }"
    >
      <span class="msg__icon" aria-hidden="true">
        <svg v-if="m.id === 'telegram'" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.8 18.6l.3-4.2 7.7-6.9c.3-.3-.1-.5-.5-.2L7.7 13.3 3.6 12c-.9-.2-.9-.9.2-1.3L19.8 4.5c.7-.3 1.4.2 1.2 1.3l-2.7 12.8c-.2.9-.7 1.1-1.5.7l-4.2-3.1-2 1.9c-.2.2-.4.4-.8.4z" />
        </svg>
        <svg v-else-if="m.id === 'whatsapp'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
          <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5z" />
          <path fill="currentColor" stroke="none" d="M9 8.5c0 3 2.5 5.5 5.5 5.5l1-1.5-1.8-1-.8.7a3.5 3.5 0 0 1-1.6-1.6l.7-.8-1-1.8z" />
        </svg>
        <svg v-else-if="m.id === 'max'" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3a8.5 8.5 0 0 0-7.3 12.8L4 21l4.7-1.1A8.5 8.5 0 1 0 12 3zm-3 9.8l1.6-4.6h1.1l1.6 3.4 1.6-3.4H16l-1.9 5.2h-1l-1.2-2.6-1.2 2.6h-1z" fill-rule="evenodd" />
        </svg>
        <svg v-else-if="m.id === 'max-channel'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 10v4h3l7 4V6l-7 4H4z" />
          <path d="M17.5 9.5a3.5 3.5 0 0 1 0 5" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <text x="12" y="16" text-anchor="middle" font-size="11" font-weight="800" font-family="Manrope, sans-serif">VK</text>
        </svg>
      </span>
      {{ m.title }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.msg {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 20px 6px 6px;
    border-radius: 999px;
    border: 1px solid var(--fg-line);
    background: var(--fg-paper);
    font-weight: 700;
    font-size: 15px;
    color: var(--fg-forest);
    transition: transform 0.15s, border-color 0.15s;

    &:hover {
      transform: translateY(-2px);
      border-color: var(--c);
    }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--c);
    color: #fff;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
