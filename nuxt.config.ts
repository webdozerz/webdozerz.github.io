import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  meta: {
    title: 'WWWEBDOZERZ'
  },
  css: [
    // styles
    '@/assets/css/main.scss'
  ],
  vite: {
    plugins: [
      eslintPlugin()
    ]
  }
})
