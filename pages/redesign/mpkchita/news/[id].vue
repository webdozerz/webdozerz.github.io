<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'

const route = useRoute()
const ui = useMpkchitaUi()
const n = computed(() => mkNews.find((x) => x.id === Number(route.params.id)))
if (!n.value) throw createError({ statusCode: 404, statusMessage: 'Новость не найдена' })
useSeoMeta({ title: () => n.value!.title + ' — Маккавеевский пищекомбинат | Концепт редизайна' })
const left = computed(() => mkPromoDaysLeft(n.value!, ui.now.value))
const idx = computed(() => mkNews.findIndex((x) => x.id === n.value!.id))
const prev = computed(() => mkNews[idx.value - 1])
const next = computed(() => mkNews[idx.value + 1])
const more = computed(() => mkNews.filter((x) => x.id !== n.value!.id && x.kind === n.value!.kind).slice(0, 4))
const share = async () => {
  const url = window.location.href
  try {
    if (navigator.share) return await navigator.share({ title: n.value!.title, url })
    await navigator.clipboard.writeText(url)
    ui.say('Ссылка скопирована')
  } catch {
    ui.say('Ссылка: ' + url)
  }
}
</script>

<template>
  <div v-if="n" class="mk-wrap mk-article">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="mkPath('/news')">Акции и новинки</NuxtLink></span>
    </nav>
    <div class="mk-article__grid">
      <figure class="mk-article__poster">
        <img :src="mkImg(n.img)" :alt="n.title" width="900" height="1273" />
      </figure>
      <div class="mk-article__text">
        <span class="mk-flag" :class="{ 'mk-flag--red': n.kind === 'Акция', 'mk-flag--grey': n.kind === 'Производство' }">{{ n.kind }}</span>
        <h1>{{ n.title }}</h1>
        <p>{{ n.text }}</p>
        <p v-if="left" class="mk-article__left"><MkIcon name="clock" :size="18" /> Ещё {{ mkPlural(left, 'день', 'дня', 'дней') }}, до 11 ноября включительно</p>
        <a v-if="n.video" :href="mkVideoUrl" target="_blank" rel="noopener" class="mk-article__video">
          <img :src="mkImg('a/video.webp')" alt="" width="1100" height="621" loading="lazy" />
          <span><MkIcon name="play" :size="28" /></span>
          <small>Видео с производства — на сайте комбината <MkIcon name="external" :size="14" /></small>
        </a>
        <div class="mk-article__btns">
          <NuxtLink :to="mkPath('/gde-kupit')" class="mk-btn mk-btn--main"><MkIcon name="pin" :size="18" /> Где купить</NuxtLink>
          <button type="button" class="mk-btn mk-btn--line" @click="share"><MkIcon name="share" :size="18" /> Поделиться</button>
        </div>
        <nav class="mk-article__nav" aria-label="Соседние новости">
          <NuxtLink v-if="prev" :to="mkPath('/news/' + prev.id)"><MkIcon name="back" :size="16" /> {{ prev.title }}</NuxtLink>
          <NuxtLink v-if="next" :to="mkPath('/news/' + next.id)" class="is-next">{{ next.title }} <MkIcon name="arrow" :size="16" /></NuxtLink>
        </nav>
      </div>
    </div>
    <section v-if="more.length" class="mk-article__more">
      <div class="mk-head">
        <h2>{{ n.kind === 'Акция' ? 'Другие акции' : 'Ещё новинки' }}</h2>
        <NuxtLink :to="mkPath('/news')" class="mk-head__more">Все акции и новинки <MkIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="mk-news__grid">
        <NuxtLink v-for="m in more" :key="m.id" :to="mkPath('/news/' + m.id)" class="mk-post">
          <span class="mk-post__pic"><img :src="mkImg(m.img)" :alt="m.title" width="900" height="1273" loading="lazy" /></span>
          <b>{{ m.title }}</b>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.mk-article {
  padding-bottom: 72px;
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
    gap: 48px;
    margin-top: 22px;
  }
  &__poster img {
    width: 100%;
    border-radius: 18px;
    border: 1px solid var(--mk-line);
  }
  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    h1 {
      font-size: clamp(30px, 3.4vw, 46px);
    }
    > p {
      font-size: 17px;
    }
  }
  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    background: var(--mk-soft);
    color: var(--mk-red);
    font-weight: 600;
    font-size: 15px !important;
  }
  &__video {
    position: relative;
    display: block;
    width: 100%;
    img {
      width: 100%;
      border-radius: 16px;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }
    > span {
      position: absolute;
      top: calc(50% - 52px);
      left: calc(50% - 36px);
      display: grid;
      place-items: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--mk-red);
      color: #fff;
    }
    small {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      color: var(--mk-muted);
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
  }
  &__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid var(--mk-line);
    a {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--mk-muted);
      &:hover {
        color: var(--mk-red);
      }
    }
    .is-next {
      grid-column: 2;
      justify-content: flex-end;
      text-align: right;
    }
  }
  &__more {
    margin-top: 64px;
  }
}
@media (max-width: 989px) {
  .mk-article__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  .mk-article__poster {
    max-width: 480px;
  }
}
@media (max-width: 576px) {
  .mk-article__nav {
    grid-template-columns: minmax(0, 1fr);
    .is-next {
      grid-column: auto;
    }
  }
}
</style>
