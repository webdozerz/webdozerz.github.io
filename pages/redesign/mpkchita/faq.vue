<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'

useSeoMeta({ title: 'Вопрос-ответ — Маккавеевский пищекомбинат | Концепт редизайна' })
const open = ref(0)
const form = reactive({ email: '', text: '', error: '' })
const mine = ref<string[]>([])
const send = () => {
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return (form.error = 'Укажите e-mail — ответ придёт на него')
  if (form.text.trim().length < 5) return (form.error = 'Напишите вопрос')
  mine.value.unshift(form.text.trim())
  Object.assign(form, { text: '', error: '' })
}
</script>

<template>
  <div class="mk-wrap mk-faq">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
    </nav>
    <h1 class="mk-page-title">Вопрос-ответ</h1>
    <div class="mk-faq__grid">
      <div class="mk-faq__list">
        <div v-for="(m, i) in mine" :key="'m' + i" class="mk-qa is-mine">
          <div class="mk-qa__q"><span>{{ m }}</span><small>Ваш вопрос ждёт ответа · демо</small></div>
        </div>
        <div v-for="(f, i) in mkFaq" :key="f.q" class="mk-qa" :class="{ 'is-open': open === i }">
          <button type="button" class="mk-qa__q" :aria-expanded="open === i" @click="open = open === i ? -1 : i">
            <span>{{ f.q }}</span>
            <MkIcon name="down" :size="20" />
          </button>
          <p v-if="open === i" class="mk-qa__a">{{ f.a }}</p>
        </div>
      </div>
      <aside class="mk-faq__ask">
        <h2>Задать вопрос</h2>
        <p>Ответим на почту и опубликуем ответ здесь.</p>
        <form class="mk-form" @submit.prevent="send">
          <label><span>E-mail</span><input v-model="form.email" type="email" autocomplete="email" placeholder="name@mail.ru" /></label>
          <label><span>Вопрос</span><textarea v-model="form.text" placeholder="Например, где купить позы ручной лепки" /></label>
          <small v-if="form.error" class="mk-form__err">{{ form.error }}</small>
          <button type="submit" class="mk-btn mk-btn--main">Отправить вопрос</button>
          <small class="mk-faq__demo">Демо: вопрос появится в списке, но никуда не отправится.</small>
        </form>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.mk-faq {
  padding-bottom: 72px;
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 40px;
    margin-top: 28px;
    align-items: start;
  }
  &__ask {
    padding: 24px;
    border-radius: var(--mk-R);
    background: var(--mk-surface);
    h2 {
      font-size: 26px;
    }
    > p {
      margin: 6px 0 16px;
      color: var(--mk-muted);
    }
  }
  &__demo {
    color: var(--mk-muted);
    font-size: 12.5px;
  }
}
.mk-qa {
  border-bottom: 1px solid var(--mk-line);
  &__q {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 18px 0;
    text-align: left;
    font-weight: 600;
    font-size: 16.5px;
    color: var(--mk-ink);
    .mk-icon {
      color: var(--mk-muted);
      transition: transform 0.15s;
    }
  }
  &.is-open .mk-qa__q .mk-icon {
    transform: rotate(180deg);
  }
  &__a {
    padding: 0 0 18px;
    color: var(--mk-text);
  }
  &.is-mine .mk-qa__q {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    small {
      color: var(--mk-red);
      font-weight: 500;
      font-size: 13px;
    }
  }
}
@media (max-width: 989px) {
  .mk-faq__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
