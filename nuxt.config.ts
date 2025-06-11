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
  runtimeConfig: {
    // Приватные переменные (доступны только на сервере)  
    redmineApiKey: process.env.REDMINE_API_KEY,
    redmineUsername: process.env.REDMINE_USERNAME,
    redminePassword: process.env.REDMINE_PASSWORD,
    
    // Публичные переменные (доступны на клиенте)
    public: {
      redmineUrl: process.env.REDMINE_URL || 'https://redmine.crypton.studio',
      redmineProjectId: process.env.PROJECT_ID || 'vacation',
    }
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
