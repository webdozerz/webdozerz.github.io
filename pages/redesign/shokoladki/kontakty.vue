<script lang="ts" setup>
import { skPath, skContacts, skRequisites } from '~/utils/shokoladki'
import SkFeedback from '~/components/redesign/shokoladki/SkFeedback.vue'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Контакты — АПРИОРИ | Концепт редизайна' })
const to = (p: string) => skPath(p)
const copied = ref(false)
const copyReq = async () => {
  try {
    await navigator.clipboard.writeText(skRequisites.map(([k, v]) => `${k}: ${v}`).join('\n'))
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Контакты</span>
    </nav>
    <h1 class="sk-h1">Контакты</h1>
    <div class="sk-contacts">
      <div class="sk-contacts__cards">
        <a :href="`tel:${skContacts.tel}`" class="sk-panel sk-contact"><SkIcon name="phone" /><span><small>Интернет-магазин</small><b>{{ skContacts.phone }}</b></span></a>
        <a :href="`tel:${skContacts.shopTel}`" class="sk-panel sk-contact"><SkIcon name="phone" /><span><small>Мобильный</small><b>{{ skContacts.shopPhone }}</b></span></a>
        <a :href="`tel:${skContacts.coopTel}`" class="sk-panel sk-contact"><SkIcon name="chat" /><span><small>Сотрудничество и предложения</small><b>{{ skContacts.coopPhone }}</b></span></a>
        <a :href="`mailto:${skContacts.email}`" class="sk-panel sk-contact"><SkIcon name="mail" /><span><small>Опт, сертификаты, вопросы</small><b>{{ skContacts.email }}</b></span></a>
        <div class="sk-panel sk-contact"><SkIcon name="pin" /><span><small>Офис</small><b>{{ skContacts.office }}</b><em>{{ skContacts.officeMetro }}</em></span></div>
        <div class="sk-panel sk-contact"><SkIcon name="clock" /><span><small>Режим работы</small><b>{{ skContacts.ordersHours }}</b><em>{{ skContacts.courierHours }}</em></span></div>
      </div>
      <SkFeedback />
    </div>
    <section class="sk-box sk-req">
      <div class="sk-sechead">
        <h2 class="sk-h2">Реквизиты</h2>
        <button type="button" class="sk-link" @click="copyReq"><SkIcon name="copy" />{{ copied ? 'Скопировано' : 'Скопировать' }}</button>
      </div>
      <dl class="sk-facts-list">
        <template v-for="[k, v] in skRequisites" :key="k">
          <dt>{{ k }}</dt>
          <dd>{{ v }}</dd>
        </template>
      </dl>
    </section>
  </div>
</template>
