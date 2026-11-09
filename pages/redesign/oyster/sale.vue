<script lang="ts" setup>
import { oyPath, oyProducts, oyPromos } from '~/utils/oyster'
import OyIcon from '~/components/redesign/oyster/OyIcon.vue'
import OyShelf from '~/components/redesign/oyster/OyShelf.vue'

useSeoMeta({ title: 'Акции — Oyster Market | Концепт редизайна' })
const live = oyProducts.filter((p) => p.live && p.price).slice(0, 12)
const certs = oyProducts.filter((p) => p.sec === 'sert')
const sale = oyProducts.filter((p) => p.old)
const share = ref('')
const doShare = async (id: string, title: string) => {
  const url = `${location.origin}${oyPath('/sale/')}#${id}`
  try {
    if (navigator.share) await navigator.share({ title, url })
    else await navigator.clipboard.writeText(url)
    share.value = id
  } catch {
    /* отменили — ничего не делаем */
  }
}
</script>

<template>
  <div class="oy-wrap oy-page">
    <nav class="oy-crumbs" aria-label="Навигация">
      <NuxtLink :to="oyPath('/')">Главная</NuxtLink>
      <span>Акции</span>
    </nav>
    <h1 class="oy-title">Акции</h1>
    <div class="oy-promos">
      <article v-for="pr in oyPromos" :id="pr.id" :key="pr.id" class="oy-promo">
        <img :src="pr.img" :alt="pr.title" width="800" height="560" loading="lazy" />
        <div class="oy-promo__body">
          <span class="oy-label oy-label--order">{{ pr.tag }}</span>
          <h2>{{ pr.title }}</h2>
          <p>{{ pr.text }}</p>
          <div class="oy-promo__btns">
            <NuxtLink :to="oyPath(pr.to)" class="oy-btn oy-btn--accent">{{ pr.cta }}</NuxtLink>
            <button type="button" class="oy-btn oy-btn--line" @click="doShare(pr.id, pr.title)">
              <OyIcon :name="share === pr.id ? 'check' : 'send'" :size="18" />{{ share === pr.id ? 'Ссылка скопирована' : 'Поделиться' }}
            </button>
          </div>
        </div>
      </article>
    </div>
    <section class="oy-sec">
      <div class="oy-head">
        <div>
          <h2>Живые морепродукты для самовывоза −5%</h2>
          <p>Скидка считается в корзине, если выбрать «Самовывоз со склада».</p>
        </div>
      </div>
      <OyShelf :items="live" />
    </section>
    <section v-if="sale.length" class="oy-sec">
      <div class="oy-head"><h2>Со скидкой</h2></div>
      <OyShelf :items="sale" />
    </section>
    <section class="oy-sec">
      <div class="oy-head"><h2>Подарочные сертификаты</h2></div>
      <OyShelf :items="certs" />
    </section>
  </div>
</template>

<style lang="scss">
.oy-promos { display: grid; gap: 20px; margin-top: 20px; }
.oy-promo {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); border-radius: 22px; overflow: hidden; background: var(--oy-surface); scroll-margin-top: 120px;
  img { width: 100%; height: 100%; object-fit: cover; min-height: 300px; }
  &__body { display: flex; flex-direction: column; gap: 14px; justify-content: center; align-items: flex-start; padding: 36px; }
  h2 { font-size: 36px; }
  p { color: var(--oy-muted); max-width: 520px; }
  &__btns { display: flex; flex-wrap: wrap; gap: 10px; }
  @media (max-width: 768px) { grid-template-columns: minmax(0, 1fr); img { min-height: 0; aspect-ratio: 16 / 10; height: auto; } &__body { padding: 22px 18px; } h2 { font-size: 28px; } }
}
</style>
