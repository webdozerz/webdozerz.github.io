<script lang="ts" setup>
import BpIcon from '~/components/redesign/baltikprodukt/BpIcon.vue'
import BpPhone from '~/components/redesign/baltikprodukt/BpPhone.vue'

// Вакансии: как у оригинала — список и «Отправить резюме» с формой и файлом. В концепте форма демо, ничего не уходит.
useSeoMeta({ title: 'Вакансии — Балтик продукт | Концепт редизайна' })

const ui = useBaltikproduktUi()
const open = ref<string | null>(null)
const sent = ref(false)
const form = reactive({ name: '', phone: '', email: '', file: '', message: '', agree: false })
const current = computed(() => bpVacancies.find((v) => v.id === open.value))

const start = (id: string) => {
  open.value = id
  sent.value = false
}
const onFile = (e: Event) => {
  form.file = (e.target as HTMLInputElement).files?.[0]?.name ?? ''
}
const submit = () => {
  if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 11 || !form.agree) {
    ui.say('Заполните имя, телефон и отметьте согласие')
    return
  }
  sent.value = true
  ui.say('Демо: на сайте резюме уйдёт в отдел кадров. Здесь ничего не отправляется.')
}
const close = () => {
  open.value = null
}
</script>

<template>
  <div class="bp-wrap bp-vac">
    <h1>Вакансии</h1>
    <p class="bp-vac__lead">Рыбная база в Туле, ул. Демонстрации, 197а. Откликнитесь на вакансию — пришлите резюме или позвоните в офис.</p>

    <div class="bp-vac__list">
      <article v-for="v in bpVacancies" :key="v.id" class="bp-vac__item">
        <span class="bp-ico"><BpIcon name="user" /></span>
        <div class="bp-vac__text">
          <h2>{{ v.title }}</h2>
          <p class="bp-vac__salary">{{ v.salary }}</p>
          <p>
            {{ v.text }} Телефоны:
            <template v-for="(ph, i) in v.phones" :key="ph"
              ><a :href="`tel:+74872${ph.replace(/-/g, '')}`">{{ ph }}</a><template v-if="i < v.phones.length - 1">, </template></template
            >
          </p>
        </div>
        <button type="button" class="bp-btn" @click="start(v.id)"><BpIcon name="doc" :size="20" /> Отправить резюме</button>
      </article>
    </div>

    <div v-if="current" class="bp-modal" @click.self="close">
      <form class="bp-modal__panel" @submit.prevent="submit">
        <div class="bp-modal__head">
          <div>
            <h2>Отправить резюме</h2>
            <p>{{ current.title }}</p>
          </div>
          <button type="button" class="bp-iconbtn" aria-label="Закрыть" @click="close"><BpIcon name="close" /></button>
        </div>

        <div v-if="sent" class="bp-modal__done">
          <span class="bp-ico"><BpIcon name="check" /></span>
          <b>Резюме принято</b>
          <p>В концепте ничего не отправляется — на сайте резюме придёт в офис, вам перезвонят.</p>
          <button type="button" class="bp-btn bp-btn--line" @click="close">Закрыть</button>
        </div>
        <template v-else>
          <label class="bp-field">
            <span>Должность</span>
            <input :value="current.title" readonly />
          </label>
          <label class="bp-field">
            <span>Ваше имя *</span>
            <input v-model="form.name" autocomplete="name" placeholder="Фамилия, имя" />
          </label>
          <div class="bp-modal__two">
            <label class="bp-field">
              <span>Телефон *</span>
              <BpPhone v-model="form.phone" />
            </label>
            <label class="bp-field">
              <span>E-mail</span>
              <input v-model="form.email" type="email" autocomplete="email" placeholder="mail@example.ru" />
            </label>
          </div>
          <label class="bp-file">
            <input type="file" accept=".pdf,.doc,.docx,.rtf,.txt,.jpg,.png" @change="onFile" />
            <BpIcon name="doc" :size="20" />
            <span>{{ form.file || 'Прикрепить резюме' }}</span>
            <small>PDF, Word или фото</small>
          </label>
          <label class="bp-field">
            <span>Сообщение</span>
            <textarea v-model="form.message" placeholder="Опыт работы, удобное время для звонка" />
          </label>
          <label class="bp-check">
            <input v-model="form.agree" type="checkbox" />
            <span>Согласен на обработку персональных данных</span>
          </label>
          <button type="submit" class="bp-btn">Отправить</button>
        </template>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.bp-vac {
  padding-top: 28px;

  > h1 {
    font-size: clamp(28px, 2.8vw, 38px);
    font-weight: 800;
  }
  &__lead {
    margin-top: 8px;
    max-width: 62ch;
    color: var(--bp-muted);
  }
  &__list {
    display: grid;
    gap: 12px;
    margin-top: 24px;
  }
  &__item {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 24px;
    border-radius: var(--bp-R);
    background: var(--bp-surface);

    > .bp-btn {
      flex: none;
      margin-left: auto;
    }
  }
  &__text {
    display: grid;
    gap: 4px;
    min-width: 0;

    h2 {
      font-size: 20px;
      font-weight: 700;
    }
    p {
      color: var(--bp-muted);
    }
    a {
      color: var(--bp-accent);
      font-weight: 600;
      white-space: nowrap;
    }
  }
  &__salary {
    color: var(--bp-ink) !important;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    &__item {
      flex-wrap: wrap;
      align-items: flex-start;

      > .bp-btn {
        flex: 1 1 100%;
        margin-left: 0;
      }
    }
    &__text {
      flex: 1;
    }
  }
  @media (max-width: 576px) {
    padding-top: 16px;

    &__item {
      padding: 20px 16px;
    }
  }
}
</style>
