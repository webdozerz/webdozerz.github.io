<script lang="ts" setup>
// FAQ оригинала: все вопросы раскрываются, поиск по вопросам и ответам.
import { skPath, skContacts } from '~/utils/shokoladki'
import { skFaq } from '~/utils/shokoladki.texts'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Вопросы и ответы — АПРИОРИ | Концепт редизайна' })
const to = (p: string) => skPath(p)
const q = ref('')
const list = computed(() => {
  const s = q.value.trim().toLowerCase()
  return s ? skFaq.filter((f) => `${f.q} ${f.a.join(' ')}`.toLowerCase().includes(s)) : skFaq
})
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>FAQ</span>
    </nav>
    <div class="sk-pagehead">
      <h1 class="sk-h1">Вопросы и ответы</h1>
      <p>{{ skFaq.length }} вопросов о производстве, составе, хранении, доставке и оплате. Не нашли ответ — напишите на <a :href="`mailto:${skContacts.email}`">{{ skContacts.email }}</a>.</p>
    </div>
    <label class="sk-faq__search">
      <SkIcon name="search" />
      <input v-model="q" class="sk-input" placeholder="Например, срок годности" aria-label="Поиск по вопросам" />
    </label>
    <div class="sk-faq">
      <details v-for="f in list" :key="f.q" class="sk-faq__item">
        <summary>{{ f.q }}</summary>
        <div class="sk-text">
          <p v-for="(a, i) in f.a" :key="i">{{ a }}</p>
        </div>
      </details>
      <p v-if="!list.length" class="sk-empty">Ничего не нашлось — попробуйте другое слово.</p>
    </div>
  </div>
</template>
