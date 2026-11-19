<script lang="ts" setup>
// Запись блога или новость: обложка, дата, просмотры, текст и товары, на которые ссылается запись.
import { skPath, skProduct } from '~/utils/shokoladki'
import { skPosts } from '~/utils/shokoladki.texts'
import SkCard from '~/components/redesign/shokoladki/SkCard.vue'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

const route = useRoute()
const to = (p: string) => skPath(p)
const post = computed(() => skPosts.find((p) => p.id === route.params.id))
if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Запись не найдена', fatal: false })
useSeoMeta({ title: () => `${post.value?.t || 'Блог'} — АПРИОРИ | Концепт редизайна` })
const items = computed(() => (post.value?.items || []).map((id) => skProduct(id)).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 4))
const more = computed(() => skPosts.filter((p) => p.k === post.value?.k && p.id !== post.value?.id).slice(0, 3))
const words = computed(() => (post.value?.body.join(' ').split(/\s+/).length || 0) + (post.value?.lead.split(/\s+/).length || 0))
</script>

<template>
  <div v-if="post" class="sk-wrap sk-page sk-article">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span><NuxtLink :to="{ path: to('/blog/'), query: post.k === 'news' ? { tab: 'news' } : {} }">{{ post.k === 'news' ? 'Новости' : 'Блог' }}</NuxtLink></span>
    </nav>
    <article class="sk-article__in">
      <small class="sk-article__meta">{{ post.date }} · <SkIcon name="eye" />{{ post.views.toLocaleString('ru-RU') }} · {{ Math.max(1, Math.round(words / 180)) }} мин чтения</small>
      <h1 class="sk-h1">{{ post.t }}</h1>
      <img :src="post.img.replace('/resize_cache', '').replace(/\/372_200_2/, '')" :alt="post.t" class="sk-article__img" @error="($event.target as HTMLImageElement).src = post.img" />
      <div class="sk-text">
        <p class="sk-article__lead">{{ post.lead }}</p>
        <template v-for="(b, i) in post.body" :key="i">
          <h2 v-if="b.startsWith('## ')">{{ b.slice(3) }}</h2>
          <p v-else-if="b.startsWith('- ')" class="sk-article__li">{{ b.slice(2) }}</p>
          <p v-else>{{ b }}</p>
        </template>
        <p class="sk-muted">В концепте — начало записи. Полный текст — на <a :href="`https://www.shokoladki.ru/${post.k}/${post.id}/`" target="_blank" rel="noopener">сайте фабрики</a>.</p>
      </div>
    </article>
    <section v-if="items.length">
      <h2 class="sk-h2 sk-page__h">Товары из записи</h2>
      <div class="sk-grid">
        <SkCard v-for="p in items" :key="p.id" :p="p" />
      </div>
    </section>
    <section v-if="more.length">
      <h2 class="sk-h2 sk-page__h">Ещё {{ post.k === 'news' ? 'новости' : 'в блоге' }}</h2>
      <div class="sk-bloglist">
        <NuxtLink v-for="p in more" :key="p.id" :to="to(`/blog/${p.id}/`)" class="sk-post">
          <img :src="p.img" :alt="p.t" loading="lazy" width="372" height="200" />
          <small>{{ p.date }}</small>
          <b>{{ p.t }}</b>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
