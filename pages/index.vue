<script lang="ts" setup>
import '~/assets/scss/home.scss'
import { siteUrl } from '~/data/profile'

const ui = useHomeUi()
const { toastText, paletteOpen, terminalOpen, blueprint, snow } = ui

useSeoMeta({
  title: 'Илья Андрюшов — Frontend-разработчик',
  description: 'Frontend-разработчик (Middle+) из Томска: Vue 3, Nuxt, TypeScript. Торговые терминалы криптобирж, финансовые админ-панели, SSR-сайты и Telegram Mini Apps.',
  ogTitle: 'Илья Андрюшов — Frontend-разработчик',
  ogDescription: 'Vue 3, Nuxt, TypeScript. Торговые терминалы, админ-панели, SSR-сайты и Telegram Mini Apps.',
  ogType: 'website',
  ogUrl: siteUrl,
})

useHomeHead({ blueprint })
useHead({ link: [{ rel: 'canonical', href: siteUrl }] })

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
  ui.syncSnow()
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
    <ClientOnly>
      <HomeClickSpark />
      <HomePixelSnow v-if="snow" />
    </ClientOnly>

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
