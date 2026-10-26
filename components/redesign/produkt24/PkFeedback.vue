<script lang="ts" setup>
// Форма связи оригинала: имя, почта, телефон, сообщение и согласие. В концепте — демо.
const ui = useProdukt24Ui()
const form = reactive({ name: '', email: '', phone: '', text: '', agree: false })
const sent = ref(false)
const send = () => {
  if (!form.agree) return ui.say('Отметьте согласие на обработку данных')
  sent.value = true
  ui.say('Демо: на сайте сообщение уйдёт менеджеру на почту. Здесь оно никуда не отправляется.')
}
</script>

<template>
  <form class="pk-feedback" @submit.prevent="send">
    <h3>Напишите нам</h3>
    <p v-if="sent" class="pk-feedback__ok">Спасибо! Менеджер ответит в рабочее время: пн–пт 8:30–16:30.</p>
    <template v-else>
      <div class="pk-feedback__row">
        <label class="pk-field">Имя<input v-model="form.name" required autocomplete="name" /></label>
        <label class="pk-field">Телефон<input v-model="form.phone" type="tel" autocomplete="tel" /></label>
      </div>
      <label class="pk-field">Почта<input v-model="form.email" type="email" required autocomplete="email" /></label>
      <label class="pk-field">Сообщение<textarea v-model="form.text" required /></label>
      <label class="pk-check"><input v-model="form.agree" type="checkbox" />Согласен на обработку персональных данных</label>
      <button type="submit" class="pk-btn">Отправить</button>
    </template>
  </form>
</template>

<style lang="scss">
.pk-feedback {
  display: grid;
  gap: 14px;
  align-content: start;
  padding: 24px;
  border: 1px solid var(--pk-line);
  border-radius: var(--pk-r-lg);
  background: #fff;

  h3 {
    font-size: 20px;
  }

  &__row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .pk-btn {
    justify-self: start;
  }

  &__ok {
    padding: 14px 16px;
    border-radius: var(--pk-r);
    background: var(--pk-soft);
    color: var(--pk-green-d);
  }

  @media (max-width: 375px) {
    padding: 18px 16px;
  }
}
</style>
