// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/css/main.scss"],
  app: {
    // Сайт живёт в корне домена andryushov.me (и webdozerz.github.io).
    baseURL: "/",
  },
  modules: [
    "@nuxt/eslint",
    [
      "@nuxtjs/google-fonts",
      {
        display: "swap",
        subsets: ["latin", "cyrillic"],
        families: {
          Inter: [400, 700],
          Onest: [400, 500, 600, 700],
          "JetBrains Mono": [400, 500],
        },
      },
    ],
  ],
  nitro: {
    // Статичные концепты лежат в public/redesign/<name>/, у Nuxt для них нет маршрутов.
    prerender: { ignore: ['/redesign/sttorg70'] },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api', 'import'],
        }
      }
    }
  }
});
