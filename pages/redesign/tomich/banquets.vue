<script lang="ts" setup>
useSeoMeta({ title: 'Кафе и банкеты | Торговый Дом «Томич»' })

const zoom = useTomichZoom()
const cafes = tmPlaces.filter((p) => p.kind === 'cafe')
</script>

<template>
  <div class="tm-wrap tmb">
    <header class="tm-pagehead">
      <div class="tm-crumbs">
        <NuxtLink :to="tmPath()">Главная</NuxtLink><span>/</span><span>Кафе и банкеты</span>
      </div>
      <h1>Кафе и банкеты</h1>
      <p>
        Всё мясо и полуфабрикаты собственного производства мы готовим в своих кафе. Приходите на
        завтрак, обед и бизнес-ланч или проведите у нас свадьбу, юбилей, корпоратив.
      </p>
    </header>

    <section class="tmb-cafes">
      <article v-for="c in cafes" :key="c.id" class="tmb-cafe">
        <button
          type="button"
          class="tmb-cafe__photo"
          :aria-label="`Фото: ${c.name}`"
          @click="zoom.open(c.photos.map((n) => tmGallery(n)), c.name)"
        >
          <img
            :src="tmGallery(c.noThumb ? c.photos[0] : c.photos[0] + 't')"
            :alt="c.name"
            loading="lazy"
            width="400"
            height="300"
          />
        </button>
        <h2>{{ c.name }}</h2>
        <div class="tmb-cafe__addr">{{ c.address }}</div>
        <p v-if="c.hours">{{ c.hours }}</p>
        <p class="tm-muted">{{ c.note }}</p>
      </article>
    </section>

    <section class="tmb-offers">
      <div class="tmb-offers__head">
        <h2>Предложения</h2>
        <p class="tm-muted">Цены — из новостей на сайте, опубликованных в 2016 году. Перед запуском уточним у администратора.</p>
      </div>
      <div class="tmb-offers__list">
        <article v-for="o in tmOffers" :key="o.title" class="tmb-offer">
          <div>
            <h3>{{ o.title }}</h3>
            <p>{{ o.text }}</p>
          </div>
          <strong>{{ o.price }}</strong>
        </article>
      </div>
      <div class="tmb-call">
        <span>Заявка на банкет — по телефону администратора</span>
        <a :href="tmContacts.phoneHref" class="tm-btn">{{ tmContacts.phone }}</a>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.tmb-cafes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.tmb-cafe {
  display: grid;
  align-content: start;
  gap: 6px;

  &__photo {
    display: block;
    margin-bottom: 10px;
    padding: 0;
    border: 0;
    border-radius: var(--tm-r-lg);
    overflow: hidden;
    background: var(--tm-mint);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      transition: transform 0.3s;
    }
    &:hover img {
      transform: scale(1.03);
    }
  }
  h2 {
    font-size: 22px;
  }
  &__addr {
    font-weight: 600;
  }
  p {
    font-size: 14px;
  }
}

.tmb-offers {
  margin-top: 56px;

  &__head {
    display: grid;
    gap: 6px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--tm-line);

    h2 {
      font-size: clamp(26px, 3.4vw, 36px);
    }
  }
}

.tmb-offer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px 32px;
  align-items: start;
  padding: 20px 0;
  border-bottom: 1px solid var(--tm-line);

  h3 {
    font-size: 20px;
  }
  p {
    margin-top: 6px;
    max-width: 720px;
    color: var(--tm-muted);
  }
  strong {
    font-size: 20px;
    font-weight: 800;
    white-space: nowrap;
    color: var(--tm-red);
  }
}

.tmb-call {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-top: 24px;
  padding: 20px 24px;
  border-radius: var(--tm-r-lg);
  background: var(--tm-mint);
  font-weight: 700;
  font-size: 17px;
}

@media (max-width: 860px) {
  .tmb-cafes {
    grid-template-columns: minmax(0, 1fr);
  }
  .tmb-cafe {
    grid-template-columns: 160px minmax(0, 1fr);
    column-gap: 16px;

    &__photo {
      grid-row: span 4;
      margin: 0;
    }
  }
}

@media (max-width: 560px) {
  .tmb-cafe {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      grid-row: auto;
      margin-bottom: 8px;
    }
  }
  .tmb-offer {
    grid-template-columns: minmax(0, 1fr);
  }
  .tmb-call .tm-btn {
    width: 100%;
  }
}
</style>
