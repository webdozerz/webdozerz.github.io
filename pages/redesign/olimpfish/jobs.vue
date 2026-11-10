<script lang="ts" setup>
import { olJobs, olPath } from '~/utils/olimpfish'
import OlIcon from '~/components/redesign/olimpfish/OlIcon.vue'
import OlPhone from '~/components/redesign/olimpfish/OlPhone.vue'

useSeoMeta({ title: 'Вакансии — Олимп | Концепт редизайна' })
const form = reactive({ job: olJobs[0].title, name: '', phone: '', text: '', ok: true })
const file = ref('')
const done = ref(false)
const formEl = ref<HTMLElement | null>(null)
const reply = (title: string) => {
  form.job = title
  done.value = false
  formEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const onFile = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0]
  file.value = f ? f.name : ''
}
</script>

<template>
  <div class="ol-wrap ol-page ol-jobs">
    <nav class="ol-crumbs" aria-label="Навигация">
      <NuxtLink :to="olPath('/')">Главная</NuxtLink>
      <span><NuxtLink :to="olPath('/about')">О компании</NuxtLink></span>
      <span>Вакансии</span>
    </nav>
    <h1 class="ol-title">Вакансии</h1>
    <p class="ol-lead">Производство и офис продаж — в Москве, на Никулинской улице. Откликнитесь — пригласим на собеседование.</p>
    <div class="ol-jobs__list">
      <article v-for="j in olJobs" :key="j.title" class="ol-job">
        <h2>{{ j.title }}</h2>
        <h3>Обязанности</h3>
        <ul class="ol-job__list">
          <li v-for="d in j.duties" :key="d"><OlIcon name="check" />{{ d }}</li>
        </ul>
        <h3>Ждём от вас</h3>
        <div class="ol-chips"><span v-for="n in j.need" :key="n" class="ol-job__need">{{ n }}</span></div>
        <button type="button" class="ol-btn ol-btn--acc" @click="reply(j.title)">Откликнуться на вакансию</button>
      </article>
    </div>

    <section ref="formEl" class="ol-jobs__form">
      <h2>Отклик на вакансию</h2>
      <div v-if="done" class="ol-done">
        <span class="ol-done__ic"><OlIcon name="check" /></span>
        <h3>Отклик отправлен</h3>
        <p>Это демо: на настоящем сайте резюме уйдёт в отдел кадров.</p>
      </div>
      <form v-else class="ol-optform" @submit.prevent="done = true">
        <label class="ol-field ol-field--wide"><span>Вакансия</span>
          <select v-model="form.job"><option v-for="j in olJobs" :key="j.title">{{ j.title }}</option></select>
        </label>
        <label class="ol-field"><span>Имя *</span><input v-model="form.name" required autocomplete="name" /></label>
        <label class="ol-field"><span>Телефон *</span><OlPhone v-model="form.phone" required /></label>
        <label class="ol-field ol-field--wide"><span>Комментарий</span><textarea v-model="form.text" rows="3" placeholder="Коротко об опыте" /></label>
        <label class="ol-jobs__file ol-field--wide">
          <input type="file" accept=".pdf,.doc,.docx,.rtf,.txt" @change="onFile" />
          <OlIcon name="doc" /><span>{{ file || 'Прикрепить файл резюме' }}</span>
        </label>
        <label class="ol-check"><input v-model="form.ok" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
        <button type="submit" class="ol-btn ol-btn--acc">Отправить отклик</button>
      </form>
    </section>
  </div>
</template>

<style lang="scss">
.ol .ol-jobs {
  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 26px;
  }
  &__form {
    display: grid;
    gap: 16px;
    max-width: 720px;
    margin-top: 40px;
    padding: 28px;
    border: 1px solid var(--ol-line);
    border-radius: 20px;
    scroll-margin-top: 100px;
    h2 {
      font-size: 24px;
    }
  }
  &__file {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border: 1px dashed #c4cddb;
    border-radius: var(--ol-r);
    font-weight: 600;
    color: var(--ol-ink);
    cursor: pointer;
    input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .ol-icon {
      color: var(--ol-acc);
    }
    span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.ol .ol-job {
  display: grid;
  gap: 12px;
  align-content: start;
  justify-items: start;
  padding: 26px;
  border-radius: var(--ol-R);
  background: var(--ol-surf);
  h2 {
    font-size: 22px;
  }
  h3 {
    font-size: 15px;
    margin-top: 4px;
  }
  ul.ol-job__list {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
    li {
      display: flex;
      gap: 10px;
      font-size: 14.5px;
      .ol-icon {
        color: var(--ol-green);
        width: 18px;
        height: 18px;
        margin-top: 2px;
      }
    }
  }
  &__need {
    padding: 6px 12px;
    border-radius: 9px;
    background: #fff;
    font-size: 14px;
    font-weight: 600;
    color: var(--ol-ink);
  }
  .ol-btn {
    margin-top: 6px;
  }
}
@media (max-width: 989px) {
  .ol .ol-jobs__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 576px) {
  .ol .ol-job,
  .ol .ol-jobs__form {
    padding: 18px;
  }
  .ol .ol-job .ol-btn {
    width: 100%;
  }
}
</style>
