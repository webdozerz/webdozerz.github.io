<script lang="ts" setup>
// Блок «Отдел продаж»: у производителя нет корзины и формы заказа — цену и отгрузку сообщают по телефону и почте.
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'

withDefaults(defineProps<{ title?: string; text?: string; subject?: string; body?: string }>(), {
  title: 'Цены и отгрузка — в отделе продаж',
  text: 'Перед заказом менеджер сверит стоимость, фасовку и логистику. Самовывоз со склада в Новошахтинске или доставка нашей логистической компанией.',
  subject: 'Запрос в отдел продаж',
  body: '',
})
const ui = useRkdonUi()
</script>

<template>
  <div class="rk-sales">
    <div class="rk-sales__text">
      <h3>{{ title }}</h3>
      <p>{{ text }}</p>
    </div>
    <div class="rk-sales__acts">
      <a :href="'tel:' + rkContacts.salesTel" class="rk-btn rk-btn--main"><RkIcon name="phone" :size="18" /> {{ rkContacts.sales }}</a>
      <a :href="rkMail(subject, body)" class="rk-btn rk-btn--line"><RkIcon name="mail" :size="18" /> Написать на почту</a>
      <button type="button" class="rk-btn rk-btn--line" @click="ui.openChat()"><RkIcon name="chat" :size="18" /> Онлайн-чат</button>
    </div>
  </div>
</template>

<style lang="scss">
.rk-sales {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px 40px;
  padding: 28px 32px;
  border-radius: var(--rk-R);
  background: var(--rk-soft);
  h3 {
    font-size: 26px;
  }
  &__text p {
    margin-top: 8px;
    max-width: 560px;
    color: var(--rk-text);
  }
  &__acts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;
  }
  .rk-btn--line {
    border-color: #ead3db;
  }
}
.rk-sales--gap {
  margin-top: 48px;
}
@media (max-width: 1199px) {
  .rk-sales {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-sales__acts {
    justify-content: flex-start;
  }
}
@media (max-width: 576px) {
  .rk-sales {
    padding: 22px 18px;
    h3 {
      font-size: 22px;
    }
  }
  .rk-sales__acts {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
