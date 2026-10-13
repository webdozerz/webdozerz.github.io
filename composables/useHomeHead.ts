import type { Ref } from 'vue'
import { themeBootScript } from '~/composables/useHomeUi'
import { siteUrl } from '~/data/profile'

// Оформление страниц в стиле главной: класс на <html> для токенов темы,
// класс на <body> и скрипт, который ставит тему до отрисовки.
export function useHomeHead(options: { blueprint?: Ref<boolean> } = {}) {
  useHead({
    htmlAttrs: { lang: 'ru', class: 'home-root' },
    bodyAttrs: {
      class: computed(() => (options.blueprint?.value ? 'home-page is-blueprint' : 'home-page')),
    },
    script: [{ innerHTML: themeBootScript, tagPosition: 'head' }],
  })

  // Превью ссылки в Telegram, LinkedIn и т. п. Картинку снимали с карточки 1200×630.
  useSeoMeta({
    ogSiteName: 'Илья Андрюшов',
    ogLocale: 'ru_RU',
    ogImage: `${siteUrl}/og.png`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'Илья Андрюшов — Frontend-разработчик. Vue 3, Nuxt, TypeScript',
    twitterCard: 'summary_large_image',
  })
}
