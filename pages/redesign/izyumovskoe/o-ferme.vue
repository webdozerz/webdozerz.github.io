<script lang="ts" setup>
// «О компании» и «Отзывы о нас» оригинала одной страницей. Отзывов на сайте нет (страница закрыта), поэтому —
// пустое состояние и форма; отзыв сохраняется только в браузере.
import IzIcon from '~/components/redesign/izyumovskoe/IzIcon.vue'

useSeoMeta({ title: 'О ферме и отзывы — Изюмовское | Концепт редизайна' })

const cart = useIzyumCart()
const ui = useIzyumUi()
const list = computed(() => cart.reviews.value.farm ?? [])
const rev = reactive({ name: '', text: '', stars: 5 })
const send = () => {
  cart.addReview('farm', { name: rev.name || 'Покупатель', text: rev.text, stars: rev.stars, date: new Date().toLocaleDateString('ru-RU') })
  rev.text = ''
  ui.toast.value = 'Отзыв сохранён в этом браузере — демо'
}
const years = new Date().getFullYear() - izContacts.since
</script>

<template>
  <div class="iz-wrap">
    <nav class="iz-crumbs" aria-label="Путь">
      <NuxtLink :to="izPath()">Главная</NuxtLink>
      <span>О ферме</span>
    </nav>
    <h1 class="iz-page-title">О ферме</h1>

    <section class="iz-about">
      <div class="iz-about__text">
        <p class="iz-about__lead">
          {{ izContacts.company }} — семейное хозяйство в деревне Гауф Азовского района Омской области. На рынке с {{ izContacts.since }} года.
        </p>
        <p>
          Ферма стоит вдали от заводов и жилых массивов, в экологически чистой зоне. Птица гуляет на свободе, рацион — комбикорма, свежая трава,
          овощи, злаки и подкормки, ветеринар наблюдает её постоянно.
        </p>
        <p>Выращиваем перепелов, бройлеров, уток и индоуток на мясо, выводим суточный молодняк для подворий и держим бычков «Герефорд» на зерновом откорме.</p>
        <ul class="iz-about__nums">
          <li>
            <b>{{ years }}</b><span>{{ izPlural(years, 'год', 'года', 'лет') }} на рынке</span>
          </li>
          <li><b>3</b><span>направления: мясо птицы, молодняк, говядина</span></li>
          <li>
            <b>{{ izProducts.length }}</b><span>товаров в каталоге</span>
          </li>
        </ul>
      </div>
      <div class="iz-about__photo">
        <img :src="izImg('hero-dvor.jpg')" alt="Утка с утятами" width="1600" height="1000" loading="lazy" />
      </div>
    </section>

    <section class="iz-sec">
      <div class="iz-req">
        <h2>Реквизиты</h2>
        <dl>
          <div>
            <dt>Название</dt>
            <dd>{{ izContacts.company }}</dd>
          </div>
          <div>
            <dt>ИНН / КПП</dt>
            <dd>{{ izContacts.req.inn }} / {{ izContacts.req.kpp }}</dd>
          </div>
          <div>
            <dt>ОГРН</dt>
            <dd>{{ izContacts.req.ogrn }}</dd>
          </div>
          <div>
            <dt>ОКПО / ОКВЭД</dt>
            <dd>{{ izContacts.req.okpo }} / {{ izContacts.req.okved }}</dd>
          </div>
          <div>
            <dt>Адрес</dt>
            <dd>{{ izContacts.address }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="otzyvy" class="iz-sec">
      <div class="iz-head">
        <div>
          <h2>Отзывы о нас</h2>
          <p>Брали мясо или выращиваете наших утят — расскажите, как вам. Отзыв появится здесь после проверки.</p>
        </div>
      </div>
      <div class="iz-farmrev">
        <div class="iz-reviews__list">
          <article v-for="(r, i) in list" :key="i" class="iz-review">
            <div class="iz-review__head">
              <b>{{ r.name }}</b>
              <span class="iz-stars"
                ><span v-for="n in 5" :key="n" :class="{ 'is-on': n <= r.stars }"><IzIcon name="star" :size="16" fill /></span
              ></span>
              <small>{{ r.date }}</small>
            </div>
            <p>{{ r.text }}</p>
          </article>
          <p v-if="!list.length" class="iz-farmrev__empty">Здесь будут отзывы покупателей — с датой и оценкой.</p>
        </div>
        <form class="iz-form iz-reviews__form" @submit.prevent="send">
          <b>Оставить отзыв</b>
          <span class="iz-stars" role="group" aria-label="Оценка">
            <button v-for="n in 5" :key="n" type="button" :class="{ 'is-on': n <= rev.stars }" :aria-label="`${n} из 5`" @click="rev.stars = n">
              <IzIcon name="star" :size="22" fill />
            </button>
          </span>
          <label>Имя<input v-model="rev.name" autocomplete="off" /></label>
          <label>Отзыв<textarea v-model="rev.text" required /></label>
          <button type="submit" class="iz-btn iz-btn--main">Отправить</button>
          <small class="iz-form__fine">Концепт: отзыв сохраняется только в этом браузере.</small>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.iz-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 32px;
  margin-top: 24px;

  &__text {
    display: grid;
    align-content: start;
    gap: 16px;
    font-size: 16px;
  }
  &__lead {
    font-size: 20px;
    color: var(--iz-dark);
  }
  ul.iz-about__nums {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 10px;

    li {
      display: grid;
      align-content: start;
      gap: 4px;
      padding: 18px;
      border-radius: var(--iz-R);
      background: var(--iz-surface);
    }
    b {
      font-family: var(--iz-head);
      font-size: 36px;
      line-height: 1;
      color: var(--iz-dark);
    }
    span {
      font-size: 14px;
    }
  }
  &__photo {
    border-radius: var(--iz-R);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      order: -1;
      aspect-ratio: 16 / 9;
    }
  }
  @media (max-width: 576px) {
    ul.iz-about__nums {
      grid-template-columns: minmax(0, 1fr);

      li {
        grid-template-columns: 72px minmax(0, 1fr);
        align-items: center;
      }
    }
  }
}
.iz-req {
  display: grid;
  gap: 16px;
  padding: 30px;
  border-radius: var(--iz-R);
  border: 1px solid var(--iz-line);

  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
  }
  dl {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 32px;

    div {
      display: grid;
      gap: 2px;
    }
    dt {
      color: var(--iz-muted);
      font-size: 14px;
    }
    dd {
      color: var(--iz-dark);
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    padding: 22px 18px;

    dl {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.iz-farmrev {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  align-items: start;

  &__empty {
    padding: 22px;
    border-radius: var(--iz-R);
    border: 1px dashed var(--iz-line);
    color: var(--iz-muted);
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
