// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/css/main.scss"],
  app: {
    // Сайт живёт в корне домена andryushov.me (и webdozerz.github.io).
    baseURL: "/",
    head: {
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      script: [{ src: "/metrika.js" }],
    },
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
    prerender: { ignore: ['/redesign/sttorg70', '/redesign/prodagro', '/redesign/sibprod'] },
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
