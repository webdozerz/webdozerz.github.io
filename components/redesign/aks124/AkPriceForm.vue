<script lang="ts" setup>
import AkIcon from './AkIcon.vue'
import AkPhone from './AkPhone.vue'

// Форма «Получить прайс-лист» — как внизу каждой страницы оригинала: имя, e-mail, телефон, объём заказа, вид деятельности.
const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const ui = useAks124Ui()
const f = reactive({ name: '', email: '', phone: '', volume: '', kind: '', agree: false })
const sent = ref(false)
const submit = () => {
  if (!f.agree) {
    ui.say('Отметьте согласие на обработку данных')
    return
  }
  sent.value = true
  ui.say('Демо: в концепте заявка никуда не отправляется')
}
</script>

<template>
  <div class="ak-priceform" :class="{ 'is-compact': props.compact }">
    <div class="ak-priceform__text">
      <h2 class="ak-h2">Получить прайс-лист</h2>
      <p>
        Пришлём полный прайс на {{ akTotal.items.toLocaleString('ru-RU') }} позиций на почту. Цены на сайте базовые: конечная цена зависит от
        объёма, постоянным клиентам — дополнительные скидки.
      </p>
    </div>
    <p v-if="sent" class="ak-done">
      <AkIcon name="check" :size="22" />
      <span>Спасибо, {{ f.name || 'заявка принята' }}! Прайс придёт на {{ f.email || 'почту' }} в рабочее время.</span>
    </p>
    <form v-else class="ak-form ak-priceform__form" @submit.prevent="submit">
      <label class="ak-field">
        <span>Имя *</span>
        <input v-model="f.name" required autocomplete="name" placeholder="Как к вам обращаться" />
      </label>
      <label class="ak-field">
        <span>E-mail *</span>
        <input v-model="f.email" required type="email" autocomplete="email" placeholder="для прайса" />
      </label>
      <label class="ak-field">
        <span>Телефон *</span>
        <AkPhone v-model="f.phone" required />
      </label>
      <label class="ak-field">
        <span>Объём заказа, ₽ *</span>
        <input v-model="f.volume" required inputmode="numeric" placeholder="например, 30 000" />
      </label>
      <label class="ak-field ak-field--select">
        <span>Вид деятельности *</span>
        <select v-model="f.kind" required>
          <option value="" disabled>Выберите</option>
          <option v-for="k in akKinds" :key="k">{{ k }}</option>
        </select>
      </label>
      <div class="ak-priceform__send">
        <label class="ak-check">
          <input v-model="f.agree" type="checkbox" />
          <span>Согласен на обработку персональных данных</span>
        </label>
        <button type="submit" class="ak-btn">Получить прайс</button>
      </div>
    </form>
  </div>
</template>
