<script setup lang="ts">
const { theme, toggleTheme, paletteOpen, scrollTo, snow, toggleSnow } = useHomeUi()

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
        <span class="logo__path">~/</span>a<span class="logo__rest">ndryushov</span><span class="logo__tail" aria-hidden="true"><span class="logo__tld">.me</span><span class="logo__cursor">_</span></span>
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
        <NuxtLink to="/resume" class="nav__link">Резюме</NuxtLink>
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
          :class="{ 'icon-btn--on': snow }"
          type="button"
          :aria-label="snow ? 'Остановить снег' : 'Включить снег'"
          :aria-pressed="snow"
          :title="snow ? 'Остановить снег' : 'Включить снег'"
          @click="toggleSnow"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 3.8 12 6.3l2.5-2.5M9.5 20.2 12 17.7l2.5 2.5M3.3 10.1l3.4.9-.9-3.4M20.7 13.9l-3.4-.9.9 3.4M5.8 16.6l.9-3.4-3.4.9M18.2 7.4l-.9 3.4 3.4-.9" />
          </svg>
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

// Словесный знак в виде промпта: ~/andryushov_ с мигающим курсором.
// При наведении «допечатывается» домен .me. Хвост с доменом и курсором вынесен
// из потока, чтобы навигация не сдвигалась.
.logo {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  color: var(--h-text);
  font-family: var(--h-mono);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-decoration: none;

  &__path {
    color: var(--h-accent);
  }

  &__tail {
    position: absolute;
    left: 100%;
    bottom: 0;
    display: inline-flex;
    align-items: baseline;
  }

  &__tld {
    display: inline-block;
    overflow: hidden;
    max-width: 0;
    color: var(--h-muted);
    vertical-align: bottom;
    transition: max-width 0.24s steps(3, end);
  }

  &:hover &__tld,
  &:focus-visible &__tld {
    max-width: 3ch;
  }

  &__cursor {
    color: var(--h-accent);
    animation: logo-blink 1.05s steps(1) infinite;
  }
}

@keyframes logo-blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo__cursor {
    animation: none;
  }

  .logo__tld {
    transition: none;
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

  &--on {
    border-color: color-mix(in srgb, var(--h-accent) 45%, var(--h-line));
    color: var(--h-accent);

    &:hover {
      color: var(--h-accent);
    }
  }
}

@media (max-width: 760px) {
  .nav,
  .logo__rest,
  .logo__tld,
  .cmdk__kbd {
    display: none;
  }

  .cmdk {
    padding-right: 12px;
  }
}
</style>
