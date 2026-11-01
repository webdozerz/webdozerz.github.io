<script lang="ts" setup>
import AkIcon from './AkIcon.vue'
import AkPhone from './AkPhone.vue'

// Окна оригинала: «Обратный звонок» в шапке, онлайн-консультант (чат / заявка / звонок) и «Пользователи» (вход, регистрация).
const ui = useAks124Ui()
const list = useAks124List()

const call = reactive({ name: '', phone: '', kind: '', agree: false })
const chat = reactive({ tab: 'chat' as 'chat' | 'request', text: '', name: '', email: '', phone: '' })
const chatLog = ref<{ me: boolean; text: string }[]>([
  { me: false, text: 'Здравствуйте! Подскажем по наличию, ценам и доставке. Пн–пт с 9:00 до 18:00.' },
])
const login = reactive({ tab: 'in' as 'in' | 'up', email: '', pass: '', name: '', phone: '' })
const done = ref<string | null>(null)

const close = () => {
  ui.modal.value = null
  done.value = null
}
const sendCall = () => {
  done.value = `Перезвоним ${call.name ? `${call.name}, ` : ''}на ${call.phone || 'указанный номер'} в рабочее время.`
}
const sendChat = () => {
  if (!chat.text.trim()) return
  chatLog.value.push({ me: true, text: chat.text.trim() })
  chat.text = ''
  setTimeout(() => chatLog.value.push({ me: false, text: 'Демо: в концепте консультант не отвечает. На сайте здесь ответит менеджер.' }), 500)
}
const sendRequest = () => {
  done.value = 'Заявка принята — менеджер ответит на почту или перезвонит.'
}
const sendLogin = () => {
  done.value =
    login.tab === 'in'
      ? 'Демо: в кабинете будут ваши прошлые списки и персональные цены.'
      : 'Демо: после регистрации менеджер подтвердит кабинет и откроет ваши цены.'
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && ui.modal.value) close()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="ui.modal.value" class="ak-modal" @click.self="close">
    <section class="ak-modal__box" role="dialog" aria-modal="true">
      <button type="button" class="ak-iconbtn ak-modal__close" aria-label="Закрыть" @click="close"><AkIcon name="close" /></button>

      <template v-if="done">
        <p class="ak-done">
          <AkIcon name="check" :size="22" />
          <span>{{ done }}</span>
        </p>
        <button type="button" class="ak-btn ak-btn--line" @click="close">Закрыть</button>
      </template>

      <template v-else-if="ui.modal.value === 'call'">
        <h2>Обратный звонок</h2>
        <p class="ak-modal__lead">Перезвоним в рабочее время, пн–пт с 9:00 до 18:00.</p>
        <form class="ak-form" @submit.prevent="sendCall">
          <label class="ak-field"><span>Ваше имя *</span><input v-model="call.name" required autocomplete="name" /></label>
          <label class="ak-field"><span>Телефон *</span><AkPhone v-model="call.phone" required /></label>
          <label class="ak-field ak-field--select">
            <span>Вид деятельности *</span>
            <select v-model="call.kind" required>
              <option value="" disabled>Выберите</option>
              <option v-for="k in akKinds" :key="k">{{ k }}</option>
            </select>
          </label>
          <label class="ak-check"><input v-model="call.agree" type="checkbox" required /><span>Согласен на обработку персональных данных</span></label>
          <button type="submit" class="ak-btn">Жду звонка</button>
        </form>
      </template>

      <template v-else-if="ui.modal.value === 'chat'">
        <h2>Консультант</h2>
        <div class="ak-tabs" role="tablist">
          <button type="button" role="tab" :aria-selected="chat.tab === 'chat'" :class="{ 'is-on': chat.tab === 'chat' }" @click="chat.tab = 'chat'">Онлайн-чат</button>
          <button type="button" role="tab" :aria-selected="chat.tab === 'request'" :class="{ 'is-on': chat.tab === 'request' }" @click="chat.tab = 'request'">
            Отправить заявку
          </button>
          <button type="button" role="tab" @click="ui.modal.value = 'call'">Обратный звонок</button>
        </div>
        <template v-if="chat.tab === 'chat'">
          <div class="ak-chat">
            <p v-for="(m, i) in chatLog" :key="i" :class="{ 'is-me': m.me }">{{ m.text }}</p>
          </div>
          <form class="ak-chat__send" @submit.prevent="sendChat">
            <input v-model="chat.text" placeholder="Есть ли «Вегета» по 1 кг?" aria-label="Сообщение" />
            <button type="submit" class="ak-btn" aria-label="Отправить"><AkIcon name="arrow" :size="20" /></button>
          </form>
        </template>
        <form v-else class="ak-form" @submit.prevent="sendRequest">
          <label class="ak-field">
            <span>Сообщение *</span>
            <textarea v-model="chat.text" required rows="3" :placeholder="list.count.value ? 'Приложим ваш список заказа' : 'Что нужно и сколько'" />
          </label>
          <label class="ak-field"><span>Ваше имя *</span><input v-model="chat.name" required autocomplete="name" /></label>
          <label class="ak-field"><span>E-mail *</span><input v-model="chat.email" required type="email" autocomplete="email" /></label>
          <label class="ak-field"><span>Телефон *</span><AkPhone v-model="chat.phone" required /></label>
          <button type="submit" class="ak-btn">Отправить</button>
        </form>
      </template>

      <template v-else-if="ui.modal.value === 'login'">
        <h2>{{ login.tab === 'in' ? 'Вход для клиентов' : 'Регистрация' }}</h2>
        <p class="ak-modal__lead">В кабинете — прошлые списки заказа и ваши цены от объёма. <b>Демо.</b></p>
        <div class="ak-tabs" role="tablist">
          <button type="button" role="tab" :aria-selected="login.tab === 'in'" :class="{ 'is-on': login.tab === 'in' }" @click="login.tab = 'in'">Вход</button>
          <button type="button" role="tab" :aria-selected="login.tab === 'up'" :class="{ 'is-on': login.tab === 'up' }" @click="login.tab = 'up'">Регистрация</button>
        </div>
        <form class="ak-form" @submit.prevent="sendLogin">
          <label v-if="login.tab === 'up'" class="ak-field"><span>Имя или организация *</span><input v-model="login.name" required /></label>
          <label v-if="login.tab === 'up'" class="ak-field"><span>Телефон *</span><AkPhone v-model="login.phone" required /></label>
          <label class="ak-field"><span>E-mail *</span><input v-model="login.email" required type="email" autocomplete="email" /></label>
          <label class="ak-field"><span>Пароль *</span><input v-model="login.pass" required type="password" autocomplete="current-password" /></label>
          <button type="submit" class="ak-btn">{{ login.tab === 'in' ? 'Войти' : 'Зарегистрироваться' }}</button>
        </form>
      </template>
    </section>
  </div>
</template>
