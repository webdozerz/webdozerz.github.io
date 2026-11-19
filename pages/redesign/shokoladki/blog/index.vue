<script lang="ts" setup>
// Блог и новости оригинала (/articles/, /news/) — вкладками; дата, просмотры, обложка, «Показать ещё».
import { skPath } from '~/utils/shokoladki'
import { skPosts } from '~/utils/shokoladki.texts'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Блог и новости — АПРИОРИ | Концепт редизайна' })
const route = useRoute()
const router = useRouter()
const to = (p: string) => skPath(p)
const tab = computed(() => (route.query.tab === 'news' ? 'news' : 'articles'))
const setTab = (t: string) => router.replace({ query: t === 'news' ? { tab: 'news' } : {} })
const list = computed(() => skPosts.filter((p) => p.k === tab.value))
const shown = ref(12)
watch(tab, () => (shown.value = 12))
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>{{ tab === 'news' ? 'Новости' : 'Блог' }}</span>
    </nav>
    <div class="sk-pagehead">
      <h1 class="sk-h1">{{ tab === 'news' ? 'Новости компании' : 'Блог' }}</h1>
    </div>
    <div class="sk-chips">
      <button type="button" class="sk-chip" :class="{ 'is-on': tab === 'articles' }" @click="setTab('articles')">Блог <small>{{ skPosts.filter((p) => p.k === 'articles').length }}</small></button>
      <button type="button" class="sk-chip" :class="{ 'is-on': tab === 'news' }" @click="setTab('news')">Новости <small>{{ skPosts.filter((p) => p.k === 'news').length }}</small></button>
    </div>
    <div class="sk-bloglist">
      <NuxtLink v-for="(p, i) in list" v-show="i < shown" :key="p.id" :to="to(`/blog/${p.id}/`)" class="sk-post">
        <img :src="p.img" :alt="p.t" loading="lazy" width="372" height="200" />
        <small>{{ p.date }} · <SkIcon name="eye" />{{ p.views.toLocaleString('ru-RU') }}</small>
        <b>{{ p.t }}</b>
        <span class="sk-post__lead">{{ p.lead }}</span>
      </NuxtLink>
    </div>
    <button v-if="list.length > shown" type="button" class="sk-btn sk-btn--soft sk-btn--big sk-blog__more" @click="shown += 12">Показать ещё</button>
  </div>
</template>
