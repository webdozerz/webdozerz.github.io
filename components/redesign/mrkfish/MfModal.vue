<script lang="ts" setup>
import MfIcon from './MfIcon.vue'

// Два окна оригинала: «Заказать звонок» (имя, мобильный) и «Получить оптовый прайс» (имя, телефон, почта).
// В концепте форма проверяет поля и показывает, что было бы дальше, но никуда не отправляет.
const ui = useMrkfishUi()
const done = ref(false)
const f = reactive({ name: '', phone: '', email: '' })

const isPrice = computed(() => ui.modal.value === 'price')
watch(
  () => ui.modal.value,
  (v) => {
    done.value = false
    if (import.meta.client) document.documentElement.classList.toggle('mf-lock', !!v)
  },
)
const close = () => (ui.modal.value = null)
const submit = () => (done.value = true)
</script>

<template>
  <Transition name="mf-fade">
    <div v-if="ui.modal.value" class="mf-modal" role="dialog" aria-modal="true" @click.self="close">
      <div class="mf-modal__box">
        <button type="button" class="mf-modal__close" aria-label="Закрыть" @click="close"><MfIcon name="close" /></button>
        <template v-if="!done">
          <h2>{{ isPrice ? 'Оптовый прайс-лист' : 'Заказать звонок' }}</h2>
          <p class="mf-modal__lead">
            {{
              isPrice
                ? `Пришлём актуальный прайс на почту. Среднее время ответа — ${mfContacts.answer}`
                : 'Оставьте номер — менеджер отдела продаж перезвонит.'
            }}
          </p>
          <form class="mf-form" @submit.prevent="submit">
            <label class="mf-field">
              <span>Имя</span>
              <input v-model="f.name" required autocomplete="name" placeholder="Как к вам обращаться" />
            </label>
            <label class="mf-field">
              <span>{{ isPrice ? 'Телефон' : 'Мобильный' }}</span>
              <input v-model="f.phone" required type="tel" autocomplete="tel" placeholder="+7" />
            </label>
            <label v-if="isPrice" class="mf-field">
              <span>Почта</span>
              <input v-model="f.email" required type="email" autocomplete="email" placeholder="для прайса в Excel" />
            </label>
            <button type="submit" class="mf-btn mf-btn--wide">{{ isPrice ? 'Получить прайс' : 'Позвоните мне' }}</button>
            <p class="mf-form__note">Концепт: форма никуда не отправляется.</p>
          </form>
        </template>
        <div v-else class="mf-modal__done">
          <span class="mf-modal__ok"><MfIcon name="check" :size="28" /></span>
          <h2>{{ isPrice ? 'Прайс отправим на почту' : 'Перезвоним' }}</h2>
          <p>Так ответит сайт. В концепте заявка никуда не ушла — для настоящей позвоните {{ mfContacts.phone.label }}.</p>
          <button type="button" class="mf-btn mf-btn--line" @click="close">Хорошо</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
html.mf-lock {
  overflow: hidden;
}

.mf-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(11, 30, 56, 0.45);

  &__box {
    position: relative;
    width: min(440px, 100%);
    max-height: calc(100vh - 32px);
    overflow: auto;
    padding: 28px;
    border-radius: var(--mf-r-lg);
    background: #fff;

    h2 {
      padding-right: 40px;
      font-size: 24px;
    }

    @media (max-width: 375px) {
      padding: 22px 16px;
    }
  }

  &__lead {
    margin-top: 8px !important;
    color: var(--mf-muted);
  }

  &__close {
    position: absolute;
    right: 16px;
    top: 16px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--mf-surface) !important;
  }

  .mf-form {
    margin-top: 20px;
  }

  &__done {
    display: grid;
    justify-items: start;
    gap: 12px;

    p {
      color: var(--mf-muted);
    }
  }

  &__ok {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--mf-green-soft);
    color: var(--mf-green);
  }
}
</style>
