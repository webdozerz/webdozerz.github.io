<script lang="ts" setup>
import LfIcon from '~/components/redesign/lavkafish/LfIcon.vue'

useSeoMeta({ title: 'Оптовикам | Лавка Fish, концепт редизайна' })

const ui = useLavkafishUi()

// Лесенка цен на форель Хакасия 2–3 кг из поста канала 22.10.2026.
const ladder = [
  { label: 'Без предоплаты', price: 1390 },
  { label: 'От 1 шт', price: 1350 },
  { label: 'От 3 шт', price: 1310 },
  { label: 'От ящика', price: 1270 },
]

// Что идёт в оптовый прайс — фото из каталога.
const goods = ['trout-khakas', 'murmansk', 'salmon-brick', 'scallop'].map((id) => lfFindProduct(id)!)

const req = reactive({ name: '', email: '', phone: '', sent: false })
const send = () => {
  if (!req.name.trim() || req.phone.replace(/\D/g, '').length < 10) {
    ui.say('Нужны имя и телефон')
    return
  }
  req.sent = true
}
</script>

<template>
  <div class="lf-wrap lf-page">
    <div class="lf-page__top">
      <h1>Оптовикам</h1>
      <p>Кафе, рестораны, магазины и все, кто берёт рыбу ящиками. Чем больше заказ, тем ниже цена за килограмм.</p>
    </div>

    <div class="lf-page__grid">
      <section class="lf-panel">
        <h2><LfIcon name="scale" :size="24" />Как снижается цена</h2>
        <p class="lf-panel__note">Форель Хакасия 2–3 кг, охлаждённая, непотрошёная — пример из прайса прошлой недели:</p>
        <ul class="lf-zones">
          <li v-for="l in ladder" :key="l.label">
            <span>{{ l.label }}</span
            ><b>{{ lfPrice(l.price) }}/кг</b>
          </li>
        </ul>
        <p class="lf-panel__note">
          В прайсе: охлаждённая форель из Хакасии и Мурманска, лосось, брикеты сёмги и сельди, морепродукты, икра.
        </p>
      </section>

      <section class="lf-panel">
        <h2><LfIcon name="chat" :size="24" />Получить прайс</h2>
        <form v-if="!req.sent" class="lf-opt-form" @submit.prevent="send">
          <label class="lf-field">
            Имя
            <input v-model="req.name" type="text" autocomplete="name" />
          </label>
          <label class="lf-field">
            Эл. почта
            <input v-model="req.email" type="email" autocomplete="email" />
          </label>
          <label class="lf-field">
            Телефон
            <input v-model="req.phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7" />
          </label>
          <button type="submit" class="lf-btn">Получить прайс</button>
        </form>
        <p v-else class="lf-done">
          <LfIcon name="check" :size="20" />
          <span>Спасибо, {{ req.name }}! На настоящем сайте прайс пришёл бы на почту и в WhatsApp. Это демо — заявка никуда не ушла.</span>
        </p>
      </section>
    </div>

    <section class="lf-opt-goods">
      <h2>Что в прайсе</h2>
      <ul>
        <li v-for="g in goods" :key="g.id">
          <img :src="g.img" :alt="g.name" width="360" height="270" loading="lazy" />
          <b>{{ g.name }}</b>
          <span>от {{ lfPrice(Math.min(...g.variants.map((v) => v.price))) }}/кг в рознице</span>
        </li>
      </ul>
      <NuxtLink :to="lfPath('/#catalog')" class="lf-link">Весь каталог с розничными ценами<LfIcon name="arrow" :size="18" /></NuxtLink>
    </section>
  </div>
</template>

<style lang="scss">
.lf-opt-goods {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 18px;
  margin-top: 48px;

  h2 {
    font-size: clamp(26px, 3vw, 36px);
  }

  ul {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    width: 100%;

    @media (max-width: 989px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 4px;
    line-height: 1.3;

    img {
      width: 100%;
      aspect-ratio: 4 / 3;
      margin-bottom: 8px;
      object-fit: cover;
      border-radius: var(--lf-r-lg);
    }

    span {
      color: var(--lf-muted);
      font-size: 15px;
    }
  }
}

.lf-opt-form {
  display: flex;
  flex-direction: column;
  gap: 14px;

  .lf-btn {
    margin-top: 4px;
  }
}
</style>
