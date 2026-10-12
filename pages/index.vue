<script lang="ts" setup>
import { themeBootScript } from '~/composables/useHomeUi'

const ui = useHomeUi()
const { toastText, paletteOpen, terminalOpen, blueprint } = ui

useSeoMeta({
  title: 'Илья Андрюшов — Frontend-разработчик',
  description: 'Frontend-разработчик (Middle+) из Томска: Vue 3, Nuxt, TypeScript. Торговые терминалы криптобирж, финансовые админ-панели, SSR-сайты и Telegram Mini Apps.',
  ogTitle: 'Илья Андрюшов — Frontend-разработчик',
  ogDescription: 'Vue 3, Nuxt, TypeScript. Торговые терминалы, админ-панели, SSR-сайты и Telegram Mini Apps.',
  ogType: 'website',
})

useHead({
  htmlAttrs: { lang: 'ru', class: 'home-root' },
  bodyAttrs: { class: computed(() => (blueprint.value ? 'home-page is-blueprint' : 'home-page')) },
  script: [{ innerHTML: themeBootScript, tagPosition: 'head' }],
})

// Konami-код включает «режим чертежа».
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
let konamiStep = 0

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    terminalOpen.value = false
    paletteOpen.value = !paletteOpen.value
    return
  }

  if (isTyping(event.target))
    return

  if (['`', '~', 'ё', 'Ё'].includes(event.key) || event.code === 'Backquote') {
    event.preventDefault()
    paletteOpen.value = false
    terminalOpen.value = !terminalOpen.value
    return
  }

  // B и A берём по физической клавише, чтобы код срабатывал и на русской раскладке.
  const key = event.code === 'KeyB' ? 'b' : event.code === 'KeyA' ? 'a' : event.key
  konamiStep = key === KONAMI[konamiStep] ? konamiStep + 1 : key === KONAMI[0] ? 1 : 0
  if (konamiStep === KONAMI.length) {
    konamiStep = 0
    ui.toggleBlueprint()
  }
}

function greetInConsole() {
  const accent = 'color:#6f8cff;font-weight:600'
  const plain = 'color:inherit'
  console.log(
    '%cПривет, коллега.%c\nРаз уж вы здесь: на странице есть консоль (клавиша ~) и палитра команд (⌘K / Ctrl+K).\nА если ищете фронтендера — пишите: https://t.me/web_dev_ill',
    accent,
    plain,
  )
}

onMounted(() => {
  ui.syncTheme()
  ui.syncPet()
  window.addEventListener('keydown', onKeydown)
  greetInConsole()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  blueprint.value = false
})
</script>

<template>
  <div class="home">
    <HomeHeader />

    <main>
      <HomeHero />

      <HomeSection id="experience" index="01" title="Опыт">
        <HomeExperience />
      </HomeSection>

      <HomeSection id="projects" index="02" title="Проекты">
        <HomeProjects />
      </HomeSection>

      <HomeSection id="skills" index="03" title="Навыки">
        <HomeSkills />
      </HomeSection>

      <HomeContact />
    </main>

    <HomeCommandPalette />
    <HomeTerminal />

    <div v-if="blueprint" class="blueprint-grid" aria-hidden="true">
      <div class="shell blueprint-grid__cols">
        <span v-for="i in 12" :key="i" />
      </div>
    </div>

    <Transition name="toast">
      <p v-if="toastText" class="toast" role="status">
        {{ toastText }}
      </p>
    </Transition>
  </div>
</template>

<style lang="scss">
// Токены главной. Остальные страницы сайта их не используют.
html.home-root {
  --h-sans: 'Onest', system-ui, -apple-system, sans-serif;
  --h-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;

  --h-bg: #0e0f12;
  --h-surface: #16181c;
  --h-raised: #1a1c21;
  --h-line: #24272d;
  --h-line-strong: #353942;
  --h-dot: #2a2d34;
  --h-text: #eceef1;
  --h-text-soft: #c4c8cf;
  --h-muted: #9097a1;
  --h-faint: #626873;
  --h-accent: #7d95ff;
  --h-accent-glow: rgba(125, 149, 255, 0.13);
  --h-up: #3ecf8e;
  --h-down: #f0716a;
  --h-overlay: rgba(6, 7, 9, 0.6);
  --h-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.6);

  --h-term-bg: #0a0b0d;
  --h-term-line: #1f2227;
  --h-term-text: #d9dde3;
  --h-term-dim: #6b717c;
  --h-term-accent: #7d95ff;
}

html.home-root[data-theme='light'] {
  --h-bg: #f7f8fa;
  --h-surface: #eef0f4;
  --h-raised: #ffffff;
  --h-line: #e1e4ea;
  --h-line-strong: #c9ced8;
  --h-dot: #d5d9e1;
  --h-text: #0f1217;
  --h-text-soft: #333944;
  --h-muted: #5c6370;
  --h-faint: #8a909b;
  --h-accent: #2f4fe0;
  --h-accent-glow: rgba(47, 79, 224, 0.08);
  --h-up: #128a55;
  --h-down: #c8382f;
  --h-overlay: rgba(15, 18, 23, 0.28);
  --h-shadow: 0 24px 64px -20px rgba(15, 18, 23, 0.28);
}

html.home-root {
  background: var(--h-bg);
  scrollbar-color: var(--h-line-strong) var(--h-bg);
  transition: background-color 0.25s;
}

body.home-page {
  height: auto;
  min-height: 100%;
  background: var(--h-bg);
  color: var(--h-text);
  font-family: var(--h-sans);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.25s, color 0.25s;

  *::-webkit-scrollbar-track,
  *::-webkit-scrollbar-corner {
    background: var(--h-bg);
  }

  *::-webkit-scrollbar-thumb,
  *::-webkit-scrollbar-thumb:hover {
    background: var(--h-line-strong);
    border-color: var(--h-bg);
  }

  ::selection {
    background: var(--h-accent);
    color: var(--h-bg);
  }

  :focus-visible {
    outline: 2px solid var(--h-accent);
    outline-offset: 2px;
  }
}

.home {
  .shell {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .mono {
    font-family: var(--h-mono);
    letter-spacing: 0;
  }

  .h-btn {
    display: inline-flex;
    align-items: center;
    height: 44px;
    padding: 0 18px;
    border: 1px solid var(--h-line-strong);
    border-radius: 10px;
    background: var(--h-surface);
    color: var(--h-text);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s, color 0.2s;

    &:hover {
      border-color: var(--h-muted);
    }

    &--primary {
      border-color: var(--h-text);
      background: var(--h-text);
      color: var(--h-bg);

      &:hover {
        border-color: var(--h-accent);
        background: var(--h-accent);
        color: #fff;
      }
    }

    // Фирменный цвет Telegram: кнопка сразу узнаётся.
    &--telegram {
      gap: 9px;
      border-color: #2aabee;
      background: #2aabee;
      color: #fff;

      &:hover {
        border-color: #229ed9;
        background: #229ed9;
      }
    }

    &__icon {
      flex-shrink: 0;
      width: 19px;
      height: 19px;
      fill: currentColor;
    }

    &--ghost {
      border-color: transparent;
      background: none;
      color: var(--h-muted);

      &:hover {
        border-color: transparent;
        color: var(--h-text);
      }
    }
  }
}

// Режим чертежа: колонки сетки и контуры блоков.
.blueprint-grid {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;

  &__cols {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;
    height: 100%;

    span {
      background: color-mix(in srgb, var(--h-accent) 7%, transparent);
      border-inline: 1px solid color-mix(in srgb, var(--h-accent) 22%, transparent);
    }
  }
}

body.is-blueprint .home main * {
  outline: 1px dashed color-mix(in srgb, var(--h-accent) 35%, transparent);
  outline-offset: -1px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 80;
  margin: 0;
  padding: 10px 16px;
  border: 1px solid var(--h-line-strong);
  border-radius: 10px;
  background: var(--h-raised);
  box-shadow: var(--h-shadow);
  color: var(--h-text);
  font-size: 14px;
  transform: translateX(-50%);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .home .shell {
    padding: 0 16px;
  }

  .blueprint-grid__cols {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    span:nth-child(n + 5) {
      display: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .home *,
  body.home-page {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
  }
}
</style>
