<script lang="ts" setup>
import { zdOrig, zdPath, zdPosts, zdRubrics } from '~/utils/zdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'

useSeoMeta({ title: 'Блог — пасека «Ширяев и сыновья» | Концепт редизайна' })

const route = useRoute()
const router = useRouter()
const rub = computed(() => zdRubrics.find((r) => r.id === route.query.r) ?? null)
const posts = computed(() => (rub.value ? zdPosts.filter((p) => p.r === rub.value!.id) : zdPosts))
const rubName = (id: string) => zdRubrics.find((r) => r.id === id)?.label ?? ''
const pick = (id: string | null) => router.replace({ query: id ? { r: id } : {} })
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>Блог</span></nav>
    <header class="zd-pagehead">
      <h1>Блог пчеловода</h1>
      <p>Около 150 статей Алексея Ширяева: как выбрать и купить мёд, апитерапия, технология, медоносы и новости пасеки. В концепте — подборка, статьи открываются на сайте пасеки.</p>
    </header>

    <div class="zd-tabs" role="tablist">
      <button type="button" role="tab" :class="{ 'is-on': !rub }" :aria-selected="!rub" @click="pick(null)">Все</button>
      <button v-for="r in zdRubrics" :key="r.id" type="button" role="tab" :class="{ 'is-on': rub?.id === r.id }" :aria-selected="rub?.id === r.id" @click="pick(r.id)">{{ r.label }}</button>
    </div>

    <div class="zd-posts">
      <a v-for="p in posts" :key="p.url" :href="zdOrig(p.url)" target="_blank" rel="noopener" class="zd-post">
        <small>{{ rubName(p.r) }}</small>
        <h2>{{ p.title }}</h2>
        <p>{{ p.lead }}</p>
        <span class="zd-link">Читать на сайте пасеки<ZdIcon name="ext" :size="15" /></span>
      </a>
    </div>
    <p v-if="rub" class="zd-posts__more">
      <a :href="zdOrig(rub.url)" target="_blank" rel="noopener" class="zd-btn zd-btn--line">Все статьи рубрики «{{ rub.label }}»<ZdIcon name="ext" :size="16" /></a>
    </p>
  </div>
</template>

<style lang="scss">
.zd-posts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  &__more {
    margin-top: 24px;
  }

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-post {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border-radius: 20px;
  border: 1px solid var(--zd-line);

  small {
    font-size: 13px;
    font-weight: 600;
    color: var(--zd-accent);
  }
  h2 {
    font-size: 19px;
    line-height: 1.3;
  }
  p {
    color: var(--zd-muted);
    font-size: 14px;
  }
  .zd-link {
    margin-top: auto;
    padding-top: 4px;
    font-size: 14px;
  }
  &:hover {
    border-color: var(--zd-accent);

    h2 {
      color: var(--zd-accent);
    }
  }
}
</style>
