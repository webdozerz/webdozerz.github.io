<script lang="ts" setup>
import PlIcon from '~/components/redesign/papinalavka/PlIcon.vue'
import PlNatalya from '~/components/redesign/papinalavka/PlNatalya.vue'

useSeoMeta({ title: 'О нас — Папина лавка | Концепт редизайна' })

const ui = usePapinalavkaUi()
const mine = ref<{ name: string; text: string }[]>([])
const review = ref({ name: '', text: '' })
const addReview = () => {
  if (!review.value.text.trim()) return
  mine.value = [{ name: review.value.name || 'Без имени', text: review.value.text }, ...mine.value]
  review.value = { name: '', text: '' }
  ui.say('Отзыв добавлен — в концепте он виден только вам')
}

const farmer = ref({ name: '', phone: '', product: '', link: '', sent: false })
const sendFarmer = () => {
  if (!farmer.value.phone.trim()) return
  farmer.value.sent = true
}
</script>

<template>
  <div class="pl-wrap pl-about">
    <nav class="pl-crumbs" aria-label="Навигация">
      <NuxtLink :to="plPath()">Главная</NuxtLink>
      <span>О нас</span>
    </nav>

    <section class="pl-about__intro">
      <div class="pl-about__text">
        <h1 class="pl-h1">О нас</h1>
        <p>
          Мы — это я, Папина Наталья, моя семья, мои друзья, родственники, знакомые, знакомые знакомых и каждый человек, который хоть немного
          задумывается о том, что он и его дети едят на завтрак, обед или ужин.
        </p>
        <p>
          Наша цель — сделать доступной качественную, свежую и полезную еду, произведённую нашими русскими фермерскими хозяйствами. Мы ищем честных
          фермеров, изучаем хозяйства и привозим их продукты для себя и знакомых.
        </p>
        <p>
          Для этого «Папина лавка» организует совместные закупки: собираем заказы и заказываем напрямую у хозяйства. Все продукты привозятся только под
          заказ. Когда вы нажимаете «Отправить заказ», рыба ещё плавает, сосиски и колбаски ещё «бегают» по ферме вместе с курочками и кроликами, а
          грибы и ягоды прячутся в лесу от глаз грибника.
        </p>
        <p>Если вы по какой-либо причине недовольны качеством продукта, мы примем возврат, заменим продукт или вернём его стоимость.</p>
      </div>
      <div class="pl-about__art">
        <PlNatalya />
        <ul>
          <li><b>с 2010</b><span>года возим продукты от фермеров</span></li>
          <li><b>7</b><span>офисов выдачи в Воронеже и Новой Усмани</span></li>
          <li><b>34</b><span>раздела, 491 товар в каталоге</span></li>
          <li><b>29 520</b><span>человек уже с нами</span></li>
        </ul>
      </div>
    </section>

    <section id="reviews" class="pl-section">
      <div class="pl-head">
        <h2>Отзывы и предложения</h2>
      </div>
      <div class="pl-about__reviews">
        <form class="pl-about__form" @submit.prevent="addReview">
          <h3>Оставить отзыв <span class="pl-demo">демо</span></h3>
          <label class="pl-field"><span>Имя</span><input v-model="review.name" type="text" autocomplete="given-name" /></label>
          <label class="pl-field"><span>Отзыв или предложение</span><textarea v-model="review.text" required /></label>
          <button type="submit" class="pl-btn pl-btn--main">Отправить</button>
        </form>
        <blockquote v-for="(r, i) in mine" :key="`m${i}`" class="pl-about__review">
          <p>{{ r.text }}</p>
          <footer><b>{{ r.name }}</b><span>только что</span></footer>
        </blockquote>
        <blockquote v-for="r in plReviews" :key="r.date + r.name" class="pl-about__review">
          <p>{{ r.text }}</p>
          <footer><b>{{ r.name }}</b><span>{{ r.date }}</span></footer>
        </blockquote>
      </div>
    </section>

    <section id="farmers" class="pl-section">
      <div class="pl-about__farm">
        <div>
          <h2>Хотите стать нашим фермером?</h2>
          <p>
            Ищем хозяйства, которые производят натуральные продукты. Расскажите, что вы делаете, — пришлите ссылки на фото и видео хозяйства, мы
            свяжемся с вами.
          </p>
        </div>
        <form v-if="!farmer.sent" class="pl-about__farmform" @submit.prevent="sendFarmer">
          <label class="pl-field"><span>Хозяйство или имя</span><input v-model="farmer.name" type="text" /></label>
          <label class="pl-field"><span>Телефон *</span><input v-model="farmer.phone" type="tel" required /></label>
          <label class="pl-field"><span>Что производите</span><input v-model="farmer.product" type="text" placeholder="Сыры из козьего молока" /></label>
          <label class="pl-field"><span>Ссылки на фото и видео</span><input v-model="farmer.link" type="text" placeholder="YouTube, диск, соцсети" /></label>
          <div>
            <button type="submit" class="pl-btn pl-btn--main">Отправить заявку</button>
            <span class="pl-demo">демо</span>
          </div>
        </form>
        <p v-else class="pl-when is-stock"><PlIcon name="check" :size="18" /><span>Заявка собрана. В концепте она никуда не отправляется.</span></p>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.pl-about {
  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 40px;
  }

  &__text {
    display: grid;
    align-content: start;
    gap: 14px;
    font-size: 17px;

    p {
      max-width: 700px;
    }
  }


  &__art {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 28px;
    border-radius: 22px;
    background: var(--pl-kraft);

    ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    li {
      display: grid;
      gap: 2px;
      font-size: 14px;
      line-height: 1.35;
    }

    b {
      color: var(--pl-dark);
      font-family: var(--pl-hand);
      font-size: 36px;
      line-height: 1;
    }

    span {
      color: var(--pl-muted);
    }
  }


  &__reviews {
    columns: 3 300px;
    column-gap: 16px;

    > * {
      break-inside: avoid;
      margin-bottom: 16px;
    }
  }

  &__form {
    display: grid;
    gap: 12px;
    padding: 22px;
    border-radius: 18px;
    background: var(--pl-accent-soft);

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 19px;
    }
  }

  &__review {
    display: grid;
    gap: 12px;
    padding: 20px;
    border: 1px solid var(--pl-line);
    border-radius: 18px;
    font-size: 15px;

    footer {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 4px 10px;

      b {
        color: var(--pl-dark);
        font-family: var(--pl-hand);
        font-size: 22px;
        line-height: 1;
      }

      span {
        color: var(--pl-muted);
        font-size: 14px;
      }
    }
  }

  &__farm {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 32px;
    padding: 32px;
    border-radius: 22px;
    background: var(--pl-kraft);

    h2 {
      margin-bottom: 12px;
      font-size: clamp(24px, 2.6vw, 30px);
    }
  }

  &__farmform {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    > div {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  @media (max-width: 1199px) {
    &__intro,
    &__farm {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 768px) {
    &__text {
      font-size: 16px;
    }

    &__art,
    &__farm {
      padding: 20px 16px;
    }

    &__farmform {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
