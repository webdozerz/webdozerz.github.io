<script lang="ts" setup>
// Программа лояльности: на сайте оригинала страница пустая, условия — в FAQ; здесь собраны вместе, с плашкой о приостановке.
import { skPath, skContacts } from '~/utils/shokoladki'
import { useSkStore } from '~/composables/useShokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'
import SkPhone from '~/components/redesign/shokoladki/SkPhone.vue'

useSeoMeta({ title: 'Программа лояльности — АПРИОРИ | Концепт редизайна' })
const store = useSkStore()
const to = (p: string) => skPath(p)
const phone = ref('')
const ok = ref(false)
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Программа лояльности</span>
    </nav>
    <div class="sk-pagehead">
      <h1 class="sk-h1">Программа лояльности</h1>
      <p>Бонусная карта APRIORI: 500 бонусных рублей в подарок при оформлении и 3–5% бонусами с каждой покупки. Карту можно добавить в Wallet, баланс видно в личном кабинете и на кассе бутика.</p>
    </div>
    <p class="sk-cart__notice">Уважаемые покупатели! По техническим причинам оплата заказа бонусами временно приостановлена. Акции и скидки, указанные на сайте, остаются действительными. Приносим извинения за неудобства.</p>
    <div class="sk-loyal">
      <div class="sk-panel"><b>500 ₽</b><span>в подарок при оформлении карты</span></div>
      <div class="sk-panel"><b>3–5%</b><span>бонусами с каждой покупки</span></div>
      <div class="sk-panel"><b>1 = 1</b><span>один бонус равен одному рублю</span></div>
    </div>
    <div class="sk-box sk-loyal__form">
      <h2 class="sk-h2">Оформить карту</h2>
      <form v-if="!store.bonusCard.value" class="sk-bonus__row" @submit.prevent="store.issueCard(phone)">
        <SkPhone v-model="phone" class="sk-input" required aria-label="Телефон" />
        <button class="sk-btn" type="submit">Оформить карту</button>
        <label class="sk-check sk-check--small"><input v-model="ok" type="checkbox" required /><span>Согласен с <a :href="skContacts.offer" target="_blank" rel="noopener">договором публичной оферты</a></span></label>
      </form>
      <p v-else class="sk-done"><SkIcon name="check" />Карта на {{ store.bonusCard.value }} — демо, бонусы не начислены.</p>
    </div>
  </div>
</template>
