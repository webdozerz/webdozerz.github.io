// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
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
  ]
});
