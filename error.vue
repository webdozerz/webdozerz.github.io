<script setup lang="ts">
import type { NuxtError } from '#app'
import '~/assets/scss/home.scss'

// Страница ошибки в стиле главной. Внизу по «полу» гуляет крупный кот Пиксель.
const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error?.statusCode === 404)
const title = computed(() => (notFound.value ? 'Пиксель не нашёл эту страницу' : 'Что-то сломалось'))

useHomeHead()
useSeoMeta({
  title: () => (notFound.value ? 'Страница не найдена — Илья Андрюшов' : 'Ошибка — Илья Андрюшов'),
  robots: 'noindex',
})

const ui = useHomeUi()

// Размер кота подбираем под ширину экрана. Кот рендерится только в браузере, поэтому window тут доступен.
const petScale = ref(11)
onMounted(() => {
  ui.syncTheme()
  if (matchMedia('(max-width: 600px)').matches)
    petScale.value = 7
})

const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="home error-page">
    <main class="error-page__body">
      <p class="error-page__code mono">
        {{ error?.statusCode ?? 500 }}
      </p>
      <h1 class="error-page__title" :aria-label="title">
        <HomeScrambleText :text="title" />
      </h1>
      <p class="error-page__text">
        <template v-if="notFound">
          Он обыскал всё вокруг, но по этому адресу ничего нет. Возможно, ссылка устарела.
        </template>
        <template v-else>
          Произошла ошибка на стороне сайта. Попробуйте обновить страницу чуть позже.
        </template>
      </p>
      <div class="error-page__actions">
        <button type="button" class="h-btn h-btn--primary" @click="goHome">
          На главную
        </button>
        <NuxtLink to="/resume" class="h-btn h-btn--ghost">
          Резюме →
        </NuxtLink>
      </div>

      <div class="error-page__floor" :style="{ height: `${petScale * 14}px` }">
        <ClientOnly>
          <HomePet
            :scale="petScale"
            bubble-placement="above"
            :intro="notFound ? 'Я везде искал. Этой страницы тут нет.' : 'Ой. Я тут ни при чём.'"
          />
        </ClientOnly>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;


  &__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 48px 24px 96px;
  }

  &__code {
    margin: 0;
    color: var(--h-accent);
    font-size: 14px;
  }

  &__title {
    max-width: 900px;
    margin: 16px 0 0;
    font-size: clamp(36px, 6.5vw, 76px);
    font-weight: 600;
    line-height: 1.02;
    letter-spacing: -0.035em;
  }

  &__text {
    max-width: 560px;
    margin: 20px 0 0;
    color: var(--h-muted);
    font-size: 17px;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 32px;
  }

  // «Пол», по которому гуляет крупный Пиксель. Высота задаётся из скрипта: рост кота плюс запас на прыжок.
  &__floor {
    position: relative;
    height: 154px;
    margin-top: 72px;
    border-bottom: 1px solid var(--h-line);
  }
}

@media (max-width: 600px) {
  .error-page__body {
    padding: 32px 16px 64px;
  }
}
</style>
