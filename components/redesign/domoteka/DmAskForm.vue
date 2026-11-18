<script lang="ts" setup>
// «Задать вопрос» и «Форма обратной связи» — поля как у оригинала: ФИО, E-mail, вопрос/сообщение, согласие.
// Капча оригинала на CMS остаётся; в концепте отправка показывает демо-ответ.
import { dmContacts, dmPath } from '~/utils/domoteka'
import DmIcon from '~/components/redesign/domoteka/DmIcon.vue'

const props = defineProps<{ kind: 'ask' | 'feedback' }>()
const f = reactive({ name: '', mail: '', text: '', ok: false })
const sent = ref(false)
const tried = ref(false)
const textRequired = computed(() => props.kind === 'ask')
const valid = computed(() => f.name.trim() && /.+@.+\..+/.test(f.mail) && (!textRequired.value || f.text.trim()) && f.ok)
const submit = () => {
  tried.value = true
  if (valid.value) sent.value = true
}
</script>

<template>
  <div class="dm-form">
    <div v-if="sent" class="dm-form__done">
      <DmIcon name="check" />
      <b>{{ kind === 'ask' ? 'Вопрос принят' : 'Сообщение принято' }}</b>
      <p>Это демо: в концепте ничего не отправляется. На сайте письмо уйдёт менеджеру фабрики, ответ — на {{ f.mail }}.</p>
    </div>
    <form v-else novalidate @submit.prevent="submit">
      <label class="dm-field" :class="{ 'is-err': tried && !f.name.trim() }">
        <span>ФИО <i>*</i></span>
        <input v-model="f.name" type="text" autocomplete="name" placeholder="Иванов Иван" />
      </label>
      <label class="dm-field" :class="{ 'is-err': tried && !/.+@.+\..+/.test(f.mail) }">
        <span>E-mail <i>*</i></span>
        <input v-model="f.mail" type="email" autocomplete="email" placeholder="mail@example.ru" />
      </label>
      <label class="dm-field" :class="{ 'is-err': tried && textRequired && !f.text.trim() }">
        <span>{{ kind === 'ask' ? 'Вопрос' : 'Сообщение' }} <i v-if="textRequired">*</i></span>
        <textarea v-model="f.text" rows="4" :placeholder="kind === 'ask' ? 'Например: есть ли Вита К-1 в цвете серый бетон с белыми ножками?' : 'Ваше сообщение'" />
      </label>
      <label class="dm-check" :class="{ 'is-err': tried && !f.ok }">
        <input v-model="f.ok" type="checkbox" />
        <span>С <NuxtLink :to="dmPath('/politika/')">политикой обработки персональных данных</NuxtLink> ознакомлен(а) и согласен(на)</span>
      </label>
      <button type="submit" class="dm-btn dm-btn--big">Отправить</button>
      <p class="dm-form__alt">Или напишите на <a :href="`mailto:${dmContacts.sales}`">{{ dmContacts.sales }}</a></p>
    </form>
  </div>
</template>
