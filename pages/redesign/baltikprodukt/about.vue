<script lang="ts" setup>
import BpIcon from '~/components/redesign/baltikprodukt/BpIcon.vue'

useSeoMeta({ title: 'О компании — Балтик продукт | Концепт редизайна' })

// Тексты — со страницы «О компании» оригинала, сжатые без смены смысла.
const regions = ['Калининград', 'Мурманск', 'Новороссийск', 'Астрахань', 'Дальний Восток']
const services = [
  { icon: 'snow', title: 'Хранение при −25 °C', text: 'Несколько холодильных комплексов с импортным оборудованием для свежемороженой и переработанной рыбы.' },
  { icon: 'doc', title: 'Документы на отгрузку', text: 'Полный пакет отгрузочных и санитарных документов, декларации соответствия, ветеринарные сопроводительные.' },
  { icon: 'box', title: 'Резерв и работы под заказ', text: 'Зарезервируем рыбу из поставки и привезём позицию, которой нет в прайсе.' },
  { icon: 'truck', title: 'Доставка «до порога»', text: 'По Тульской области и в другие области России.' },
]
const open = ref<number | null>(0)
const allReviews = ref(false)
</script>

<template>
  <div class="bp-wrap bp-about">
    <section class="bp-about__intro">
      <div>
        <h1>Рыбная база «Балтик продукт» работает с&nbsp;1995 года</h1>
        <p>
          Поставляем свежемороженую рыбу в&nbsp;Тульскую область, а&nbsp;благодаря отстроенной логистике&nbsp;— и&nbsp;в&nbsp;другие области России. Работаем
          напрямую с&nbsp;рыболовецкими компаниями: от&nbsp;вылова до&nbsp;продажи.
        </p>
        <p>
          Порядка 180 наименований свежемороженой рыбы, креветок и&nbsp;икры и&nbsp;более 200 наименований переработанной рыбы и&nbsp;морепродуктов постоянно в&nbsp;наличии.
          Основа ассортимента&nbsp;— дикая рыба из&nbsp;Атлантики, Тихого океана, Балтийского, Чёрного и&nbsp;Каспийского морей. Без полифосфатов, текстурата
          и&nbsp;красителей.
        </p>
        <div class="bp-about__regions">
          <span>Партнёры-производители:</span>
          <b v-for="r in regions" :key="r">{{ r }}</b>
        </div>
      </div>
      <img src="/redesign/baltikprodukt/img/seafood.jpg" alt="Морепродукты" width="1600" height="343" />
    </section>

    <section class="bp-section">
      <h2 class="bp-h2">Что берём на себя</h2>
      <ul class="bp-about__services">
        <li v-for="s in services" :key="s.title">
          <span class="bp-ico"><BpIcon :name="s.icon" /></span>
          <b>{{ s.title }}</b>
          <p>{{ s.text }}</p>
        </li>
      </ul>
      <p class="bp-about__suppliers">
        Всегда готовы рассмотреть предложения поставщиков свежемороженой рыбы — пишите на
        <a :href="`mailto:${bpContacts.email}`">{{ bpContacts.email }}</a>.
      </p>
    </section>

    <section id="reviews" class="bp-section">
      <h2 class="bp-h2">Отзывы партнёров</h2>
      <div class="bp-reviews bp-about__reviews">
        <blockquote v-for="r in bpReviews.slice(0, allReviews ? undefined : 6)" :key="r.name" class="bp-review">
          <p>{{ r.text }}</p>
          <footer>{{ r.name }}</footer>
        </blockquote>
      </div>
      <button v-if="!allReviews" type="button" class="bp-btn bp-btn--line bp-about__more" @click="allReviews = true">
        Показать ещё {{ bpReviews.length - 6 }}
      </button>
    </section>

    <div class="bp-section bp-about__cols">
      <section id="faq">
        <h2 class="bp-h2">Вопросы и ответы</h2>
        <div class="bp-faq">
          <div v-for="(f, i) in bpFaq" :key="f.q" class="bp-faq__item" :class="{ 'is-open': open === i }">
            <button type="button" :aria-expanded="open === i" @click="open = open === i ? null : i">
              {{ f.q }}
              <BpIcon name="down" :size="20" />
            </button>
            <p v-if="open === i">{{ f.a }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="bp-h2">Статьи</h2>
        <ul class="bp-news">
          <li v-for="n in bpNews" :key="n.title">
            <a :href="n.url" target="_blank" rel="noopener">{{ n.title }} <BpIcon name="arrow" :size="18" /></a>
          </li>
        </ul>

        <NuxtLink :to="bpPath('/vacancy')" class="bp-vacancy">
          <span class="bp-ico"><BpIcon name="user" /></span>
          <div>
            <b>Вакансии · {{ bpVacancies.length }}</b>
            <p>{{ bpVacancies.map((v) => v.title).join(', ') }}. Резюме можно отправить с сайта.</p>
          </div>
          <BpIcon name="arrow" :size="20" class="bp-vacancy__go" />
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.bp-about {
  padding-top: 28px;

  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
    gap: 32px;
    align-items: stretch;

    h1 {
      font-size: clamp(30px, 3.2vw, 46px);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.02em;
    }
    p {
      margin-top: 16px;
      max-width: 62ch;
      color: var(--bp-muted);
      font-size: 16px;
    }
    img {
      width: 100%;
      height: 100%;
      min-height: 280px;
      border-radius: var(--bp-R);
      object-fit: cover;
    }
  }
  &__regions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 24px;

    span {
      color: var(--bp-muted);
      font-size: 14px;
    }
    b {
      padding: 6px 12px;
      border-radius: 10px;
      background: var(--bp-surface);
      font-weight: 600;
      font-size: 14px;
    }
  }
  &__services {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 24px;

    li {
      display: grid;
      align-content: start;
      gap: 8px;
      padding: 22px;
      border-radius: 18px;
      background: var(--bp-surface);
    }
    b {
      margin-top: 6px;
      font-size: 17px;
    }
    p {
      color: var(--bp-muted);
      font-size: 14px;
    }
  }
  &__suppliers {
    margin-top: 18px;
    color: var(--bp-muted);

    a {
      color: var(--bp-accent);
      font-weight: 600;
    }
  }
  &__reviews {
    margin-top: 24px;
  }
  &__more {
    margin-top: 16px;
  }
  &__cols {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
  }

  @media (max-width: 1199px) {
    &__services {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 989px) {
    &__intro,
    &__cols {
      grid-template-columns: minmax(0, 1fr);
    }
    &__intro img {
      min-height: 0;
      aspect-ratio: 16 / 7;
      order: -1;
    }
  }
  @media (max-width: 576px) {
    padding-top: 16px;

    &__services {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.bp-faq {
  display: grid;
  gap: 8px;
  margin-top: 20px;

  &__item {
    border-radius: 16px;
    background: var(--bp-surface);

    button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      padding: 18px 20px;
      font-weight: 600;
      text-align: left;

      svg {
        flex: none;
        transition: transform 0.2s;
      }
    }
    p {
      padding: 0 20px 18px;
      color: var(--bp-muted);
    }
    &.is-open button svg {
      transform: rotate(180deg);
    }
  }
}

.bp-news {
  display: grid;
  margin-top: 20px;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--bp-line);
    font-weight: 600;

    svg {
      flex: none;
      color: var(--bp-accent);
    }
    &:hover {
      color: var(--bp-accent);
    }
  }
}

.bp-vacancy {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
  padding: 20px;
  border-radius: 18px;
  background: var(--bp-surface);
  transition: background 0.15s;

  b {
    font-size: 17px;
  }
  p {
    margin-top: 4px;
    color: var(--bp-muted);
  }
  &__go {
    flex: none;
    margin-left: auto;
    color: var(--bp-accent);
  }
  &:hover {
    background: var(--bp-soft);
  }
}

ul.bp-about__services {
  margin-top: 24px;
}
ul.bp-news {
  margin-top: 20px;
}
</style>
