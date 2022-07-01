import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  head: {
    title: 'WWWEBDOZERZ',
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source%20Code%20Pro:100,300,400,500,600,700,900&display=swap' }
    ]
  },
  css: [
    // styles
    '@/assets/css/main.scss'
  ],
  vite: {
    plugins: [
      eslintPlugin()
    ]
  },
  modules: ['@nuxtjs/color-mode'],
  colorMode: {
    preference: 'system',
    fallback: 'dark'
  }
})
