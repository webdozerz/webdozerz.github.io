<script setup lang="ts">
const { theme, toggleTheme, paletteOpen, scrollTo } = useHomeUi()

const nav = [
  { id: 'experience', label: 'Опыт' },
  { id: 'projects', label: 'Проекты' },
  { id: 'skills', label: 'Навыки' },
  { id: 'contact', label: 'Контакты' },
]

const active = ref('')
const scrolled = ref(false)
const isMac = ref(true)

let observer: IntersectionObserver | undefined

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting)
          active.value = entry.target.id
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  for (const item of nav) {
    const el = document.getElementById(item.id)
    if (el)
      observer.observe(el)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <header class="site-header" :class="{ 'site-header--scrolled': scrolled }">
    <div class="site-header__inner shell">
      <a href="#top" class="logo" aria-label="Наверх" @click.prevent="scrollTo('top')">
        <span class="logo__mark">ИА</span>
        <span class="logo__name">Андрюшов</span>
      </a>

      <nav class="nav" aria-label="Разделы">
        <a
          v-for="item in nav"
          :key="item.id"
          :href="`#${item.id}`"
          class="nav__link"
          :class="{ 'nav__link--active': active === item.id }"
          @click.prevent="scrollTo(item.id)"
        >{{ item.label }}</a>
      </nav>

      <div class="site-header__track">
        <ClientOnly>
          <HomePet />
        </ClientOnly>
      </div>

      <div class="site-header__actions">
        <button class="cmdk" type="button" aria-label="Открыть палитру команд" @click="paletteOpen = true">
          <span class="cmdk__label">Меню</span>
          <kbd class="cmdk__kbd">{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
        </button>
        <button
          class="icon-btn"
          type="button"
          :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
          @click="toggleTheme"
        >
          <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid transparent;
  transition: background-color 0.2s, border-color 0.2s;

  &--scrolled {
    background: color-mix(in srgb, var(--h-bg) 82%, transparent);
    backdrop-filter: saturate(140%) blur(12px);
    border-bottom-color: var(--h-line);
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 64px;
  }

  &__track {
    position: relative;
    flex: 1 1 auto;
    align-self: stretch;
    min-width: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--h-text);
  text-decoration: none;
  font-weight: 600;

  &__mark {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--h-line-strong);
    border-radius: 8px;
    font-family: var(--h-mono);
    font-size: 12px;
    letter-spacing: 0.02em;
    transition: border-color 0.2s, color 0.2s;
  }

  &:hover &__mark {
    border-color: var(--h-accent);
    color: var(--h-accent);
  }

  &__name {
    font-size: 15px;
  }
}

.nav {
  display: flex;
  gap: 4px;
  margin-left: 24px;

  &__link {
    position: relative;
    padding: 6px 10px;
    border-radius: 6px;
    color: var(--h-muted);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s, background-color 0.2s;

    &:hover {
      color: var(--h-text);
      background: var(--h-surface);
    }

    &--active {
      color: var(--h-text);
    }

    &--active::after {
      content: '';
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: -1px;
      height: 1px;
      background: var(--h-accent);
    }
  }
}

.cmdk {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 34px;
  padding: 0 6px 0 12px;
  border: 1px solid var(--h-line);
  border-radius: 8px;
  background: var(--h-surface);
  color: var(--h-muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: var(--h-line-strong);
    color: var(--h-text);
  }

  &__kbd {
    padding: 2px 6px;
    border: 1px solid var(--h-line);
    border-radius: 5px;
    font-family: var(--h-mono);
    font-size: 11px;
  }
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--h-line);
  border-radius: 8px;
  background: var(--h-surface);
  color: var(--h-muted);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;

  svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  &:hover {
    border-color: var(--h-line-strong);
    color: var(--h-text);
  }
}

@media (max-width: 760px) {
  .nav,
  .logo__name,
  .cmdk__kbd {
    display: none;
  }

  .cmdk {
    padding-right: 12px;
  }
}
</style>
