<script setup lang="ts">
import { contacts } from '~/data/profile'

const { copyEmail, terminalOpen } = useHomeUi()

const links = [
  { label: 'Telegram', value: contacts.telegramHandle, href: contacts.telegram },
  { label: 'GitHub', value: 'webdozerz', href: contacts.github },
  { label: 'LinkedIn', value: 'web-dev-ill', href: contacts.linkedin },
]
</script>

<template>
  <section id="contact" class="contact">
    <div class="shell">
      <span class="contact__index mono">04</span>
      <h2 class="contact__title">
        Есть задача или вакансия?<br>
        <span class="contact__muted">Напишите, обсудим.</span>
      </h2>

      <div class="contact__list">
        <button type="button" class="row" @click="copyEmail">
          <span class="row__label mono">Email</span>
          <span class="row__value">{{ contacts.email }}</span>
          <span class="row__hint mono">копировать</span>
        </button>
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener"
          class="row"
        >
          <span class="row__label mono">{{ link.label }}</span>
          <span class="row__value">{{ link.value }}</span>
          <span class="row__hint mono">↗</span>
        </a>
      </div>
    </div>

    <footer class="shell">
      <div class="footer mono">
        <span>© {{ new Date().getFullYear() }} Илья Андрюшов</span>
        <button type="button" class="footer__egg" @click="terminalOpen = true">
          Подсказка: нажмите <kbd>~</kbd>
        </button>
      </div>
    </footer>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  padding: 96px 0 0;
  border-top: 1px solid var(--h-line);
  scroll-margin-top: 48px;

  &__index {
    color: var(--h-accent);
    font-size: 12px;
  }

  &__title {
    margin: 14px 0 0;
    font-size: clamp(30px, 4.6vw, 52px);
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  &__muted {
    color: var(--h-muted);
  }

  &__list {
    margin-top: 48px;
    border-top: 1px solid var(--h-line);
  }
}

.row {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 0;
  border: 0;
  border-bottom: 1px solid var(--h-line);
  background: none;
  color: var(--h-text);
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;

  &__label {
    color: var(--h-muted);
    font-size: 13px;
  }

  &__value {
    font-size: clamp(18px, 2.4vw, 24px);
    font-weight: 500;
    overflow-wrap: anywhere;
    transition: color 0.2s;
  }

  &__hint {
    color: var(--h-faint);
    font-size: 12px;
    transition: color 0.2s;
  }

  &:hover &__value,
  &:hover &__hint {
    color: var(--h-accent);
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 72px;
  padding-bottom: 40px;
  color: var(--h-faint);
  font-size: 12px;

  &__egg {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: var(--h-text);
    }
  }

  kbd {
    padding: 1px 5px;
    border: 1px solid var(--h-line);
    border-radius: 4px;
    font-family: inherit;
  }
}

@media (max-width: 600px) {
  .row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px 12px;

    &__label {
      grid-column: 1 / -1;
    }
  }
}
</style>
