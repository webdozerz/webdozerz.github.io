// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/css/main.scss"],
  app: {
    baseURL:
      process.env.NODE_ENV === "production" ? "/webdozerz.github.io/" : "/",
  },
  modules: [
    "@nuxt/eslint",
    [
      "@nuxtjs/google-fonts",
      { display: "swap", families: { Inter: [400, 700] } },
    ],
  ],
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
