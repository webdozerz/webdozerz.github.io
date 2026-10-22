<script lang="ts" setup>
import FtIcon from './FtIcon.vue'

// Окна концепта: вход в кабинет, обратный звонок, «Купить в 1 клик». Всё демо: данные никуда не уходят.
const ui = useFermertomskaUi()
const cart = useFermertomskaCart()

const form = reactive({ name: '', phone: '', email: '', password: '', comment: '' })
const sent = ref(false)

const box = ref<HTMLElement | null>(null)

watch(ui.modal, async (value) => {
  sent.value = false
  form.comment = ''
  if (!value) return
  await nextTick()
  box.value?.querySelector<HTMLElement>('input, button.ft-btn')?.focus()
})

const product = computed(() => (ui.modal.value?.kind === 'oneclick' ? ftFindProduct(ui.modal.value.productId) : null))
const qty = computed(() => (product.value ? Math.max(cart.qtyOf(product.value.id), 1) : 1))

const title = computed(() => {
  switch (ui.modal.value?.kind) {
    case 'login':
      return ui.user.value ? 'Личный кабинет' : 'Вход в кабинет'
    case 'callback':
      return 'Перезвоните мне'
    case 'oneclick':
      return 'Купить в 1 клик'
    default:
      return ''
  }
})

const submit = () => {
  if (ui.modal.value?.kind === 'login') {
    ui.user.value = form.email || 'покупатель'
    ui.close()
    return
  }
  sent.value = true
}

const logout = () => {
  ui.user.value = null
  ui.close()
}
</script>

<template>
  <div v-if="ui.modal.value" class="ft-modal" role="dialog" aria-modal="true" :aria-label="title" @click.self="ui.close()">
    <div ref="box" class="ft-modal__box">
      <div class="ft-modal__head">
        <h2>{{ title }}</h2>
        <button type="button" class="ft-iconbtn" aria-label="Закрыть" @click="ui.close()">
          <FtIcon name="close" />
        </button>
      </div>

      <template v-if="ui.modal.value.kind === 'login' && ui.user.value">
        <p class="ft-modal__text">Вы вошли как <strong>{{ ui.user.value }}</strong>. Здесь будут история заказов и адреса доставки.</p>
        <div class="ft-modal__actions">
          <NuxtLink :to="ftPath('/catalog?fav=1')" class="ft-btn ft-btn--soft" @click="ui.close()">Избранное</NuxtLink>
          <button type="button" class="ft-btn ft-btn--ghost" @click="logout">Выйти</button>
        </div>
      </template>

      <div v-else-if="sent" class="ft-modal__done">
        <span class="ft-modal__done-icon"><FtIcon name="check" :size="28" /></span>
        <p v-if="ui.modal.value.kind === 'callback'">Спасибо! Перезвоним в рабочее время: пн–пт 9:00–17:20.</p>
        <p v-else>Заказ принят. Менеджер перезвонит, чтобы уточнить адрес и день доставки.</p>
        <small>Это концепт: заявка никуда не отправлена.</small>
        <button type="button" class="ft-btn" @click="ui.close()">Хорошо</button>
      </div>

      <form v-else class="ft-modal__form" @submit.prevent="submit">
        <template v-if="ui.modal.value.kind === 'login'">
          <p class="ft-modal__text">Кабинет нужен, чтобы видеть историю заказов. Оформить заказ можно и без него.</p>
          <label class="ft-field">Эл. почта<input v-model="form.email" type="email" required autocomplete="off" /></label>
          <label class="ft-field">Пароль<input v-model="form.password" type="password" required autocomplete="off" /></label>
          <button type="submit" class="ft-btn ft-btn--block">Войти</button>
          <small class="ft-modal__note">Демо: подойдут любые данные, они остаются в браузере.</small>
        </template>

        <template v-else>
          <div v-if="product" class="ft-modal__product">
            <img :src="product.images[0]" alt="" width="56" height="70" />
            <div>
              <strong>{{ product.name }}</strong>
              <span>{{ ftQtyLabel(qty, product.unit) }} · {{ ftPrice(product.price * qty) }}</span>
            </div>
          </div>
          <label class="ft-field">Имя<input v-model="form.name" type="text" required autocomplete="off" /></label>
          <label class="ft-field">Телефон<input v-model="form.phone" type="tel" required placeholder="+7" autocomplete="off" /></label>
          <label class="ft-field">Комментарий<textarea v-model="form.comment" rows="3" /></label>
          <label class="ft-check"><input type="checkbox" required /> Согласен на обработку персональных данных</label>
          <button type="submit" class="ft-btn ft-btn--block">{{ product ? 'Оформить заказ' : 'Жду звонка' }}</button>
        </template>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.ft .ft-modal {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 16px;
  overflow-y: auto;
  background: rgba(29, 43, 74, 0.4);

  &__box {
    width: min(460px, 100%);
    padding: 20px 24px 24px;
    border-radius: var(--ft-r-lg);
    background: #fff;
    box-shadow: 0 24px 60px rgba(29, 43, 74, 0.25);
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;

    h2 {
      font-size: 24px;
      font-weight: 900;
    }
  }

  &__text {
    color: var(--ft-muted);
  }

  &__form {
    display: grid;
    gap: 14px;
  }

  &__note {
    color: var(--ft-muted);
    font-size: 13px;
    text-align: center;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  &__product {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 16px;
    background: var(--ft-surface-2);

    img {
      width: 56px;
      height: 70px;
      border-radius: 12px;
      object-fit: cover;
    }

    div {
      display: grid;
      gap: 2px;
    }

    span {
      color: var(--ft-muted);
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__done {
    display: grid;
    justify-items: center;
    gap: 12px;
    padding: 12px 0 4px;
    text-align: center;

    small {
      color: var(--ft-muted);
    }
  }

  &__done-icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--ft-accent-soft);
    color: var(--ft-accent);
  }

  @media (max-width: 576px) {
    &__box {
      padding: 16px 16px 20px;
    }
  }
}
</style>
