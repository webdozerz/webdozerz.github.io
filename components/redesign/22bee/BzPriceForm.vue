<script lang="ts" setup>
import BzIcon from '~/components/redesign/22bee/BzIcon.vue'
import BzPhone from '~/components/redesign/22bee/BzPhone.vue'

// Форма «Получить прайс» — как три формы оригинала: имя, телефон с MAX / WhatsApp, согласие. В концепте никуда не уходит.
const props = withDefaults(defineProps<{ title?: string; button?: string }>(), { title: '', button: 'Получить цены' })
const order = useBee22Order()
const name = ref(order.form.value.name)
const phone = ref(order.form.value.phone)
const messenger = ref<BzForm['messenger']>(order.form.value.messenger)
const agree = ref(true)
const sent = ref(false)
const error = ref('')

const submit = () => {
  if (phone.value.replace(/\D/g, '').length < 11) {
    error.value = 'Укажите телефон полностью — на него пришлём прайс'
    return
  }
  if (!agree.value) {
    error.value = 'Нужно согласие на обработку персональных данных'
    return
  }
  error.value = ''
  order.form.value = { ...order.form.value, name: name.value, phone: phone.value, messenger: messenger.value }
  sent.value = true
}
</script>

<template>
  <div class="bz-pform">
    <div v-if="sent" class="bz-pform__done" role="status">
      <span class="bz-pform__ok"><BzIcon name="check" :size="26" /></span>
      <p>
        <b>Спасибо, {{ name || 'заявка принята' }}!</b>
        Пришлём оптовый прайс в {{ messenger === 'Звонок' ? 'звонке' : messenger }} на {{ phone }}. Мы на Алтае, {{ bzContacts.tz }}.
      </p>
      <small>Демо: в концепте форма никуда не отправляется.</small>
      <button type="button" class="bz-btn bz-btn--line" @click="sent = false">Изменить данные</button>
    </div>
    <form v-else novalidate @submit.prevent="submit">
      <p v-if="props.title" class="bz-pform__title">{{ props.title }}</p>
      <label class="bz-field">
        <span>Имя</span>
        <input v-model="name" type="text" autocomplete="name" placeholder="Как к вам обращаться" />
      </label>
      <label class="bz-field">
        <span>Телефон</span>
        <BzPhone v-model="phone" />
      </label>
      <div class="bz-field">
        <span>Куда прислать прайс</span>
        <div class="bz-seg" role="radiogroup" aria-label="Куда прислать прайс">
          <button
            v-for="m in ['MAX', 'WhatsApp', 'Звонок'] as const"
            :key="m"
            type="button"
            role="radio"
            :aria-checked="messenger === m"
            :class="{ 'is-on': messenger === m }"
            @click="messenger = m"
          >
            {{ m }}
          </button>
        </div>
      </div>
      <label class="bz-check">
        <input v-model="agree" type="checkbox" />
        <span>Согласен на обработку персональных данных</span>
      </label>
      <p v-if="error" class="bz-pform__error" role="alert">{{ error }}</p>
      <button type="submit" class="bz-btn bz-btn--main bz-pform__send">{{ props.button }}</button>
    </form>
  </div>
</template>

