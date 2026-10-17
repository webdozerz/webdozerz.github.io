<script lang="ts" setup>
useSeoMeta({ title: 'О компании | Торговый Дом «Томич»' })

const links: Record<string, { to: string; label: string }> = {
  meat: { to: tmPath('/shops'), label: 'Где купить' },
  supply: { to: tmPath('/shops'), label: 'Позвонить в офис' },
  semi: { to: tmPath('/shops'), label: 'Магазины' },
  lunch: { to: tmPath('/menu'), label: 'Меню на завтра' },
  shops: { to: tmPath('/shops'), label: 'Адреса и карта' },
}
</script>

<template>
  <div class="tm-wrap tma">
    <header class="tm-pagehead">
      <div class="tm-crumbs">
        <NuxtLink :to="tmPath()">Главная</NuxtLink><span>/</span><span>О компании</span>
      </div>
      <h1>Торговый Дом «Томич»</h1>
      <p>
        Многопрофильная семейная компания: собственное производство, переработка и хранение
        фермерского мяса из томских хозяйств, полуфабрикаты ручной лепки, обеды в офис, кафе и
        магазины по всему городу.
      </p>
    </header>

    <nav class="tma-toc" aria-label="Направления">
      <a v-for="(d, i) in tmDirections" :key="d.id" :href="`#${d.id}`">
        <span>0{{ i + 1 }}</span>{{ d.title }}
      </a>
    </nav>

    <section v-for="(d, i) in tmDirections" :id="d.id" :key="d.id" class="tma-dir">
      <div class="tma-dir__num">0{{ i + 1 }}</div>
      <div>
        <h2>{{ d.title }}</h2>
        <p>{{ d.text }}</p>
      </div>
      <div>
        <ul>
          <li v-for="pt in d.points" :key="pt">{{ pt }}</li>
        </ul>
        <NuxtLink :to="links[d.id].to" class="tma-dir__link">{{ links[d.id].label }}</NuxtLink>
      </div>
    </section>

    <section class="tma-contact">
      <div>
        <h2>Поставки для ресторанов и магазинов</h2>
        <p>Договор поставки, бесплатная доставка своим транспортом от 1 кг. Позвоните в офис — подберём объём и график.</p>
      </div>
      <a :href="tmContacts.phoneHref" class="tm-btn">{{ tmContacts.phone }}</a>
    </section>
  </div>
</template>

<style lang="scss">
.tma-toc {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 24px;

  a {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px;
    border-radius: var(--tm-r);
    background: var(--tm-mint);
    font-weight: 600;
    font-size: 14px;
    line-height: 1.3;

    span {
      color: var(--tm-red);
      font-weight: 800;
    }
    &:hover {
      background: var(--tm-soft);
    }
  }
}

.tma-dir {
  display: grid;
  grid-template-columns: 80px minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 32px;
  padding: 40px 0;
  border-bottom: 1px solid var(--tm-line);
  scroll-margin-top: 130px;

  &__num {
    font-size: 40px;
    font-weight: 800;
    line-height: 1;
    color: var(--tm-red);
  }
  h2 {
    font-size: clamp(24px, 3vw, 32px);
  }
  p {
    margin-top: 12px;
    font-size: 16px;
    color: var(--tm-muted);
  }
  ul[class],
  ul {
    margin: 0 0 16px;
    padding: 0;
    list-style: none;
  }
  li {
    padding: 9px 0 9px 18px;
    border-bottom: 1px solid var(--tm-line);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 18px;
      width: 8px;
      height: 2px;
      background: var(--tm-red);
    }
  }
  &__link {
    font-weight: 700;
    color: var(--tm-red);
    border-bottom: 1.5px solid currentColor;
  }
}

.tma-contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 48px;
  padding: 32px;
  border-radius: var(--tm-r-lg);
  background: var(--tm-soft);

  h2 {
    font-size: 26px;
  }
  p {
    margin-top: 8px;
    max-width: 620px;
    color: var(--tm-muted);
  }
}

@media (max-width: 960px) {
  .tma-toc {
    grid-template-columns: repeat(2, 1fr);
    a:last-child {
      grid-column: 1 / -1;
    }
  }
  .tma-dir {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding: 32px 0;
    scroll-margin-top: 110px;

    &__num {
      font-size: 28px;
    }
  }
}

@media (max-width: 560px) {
  .tma-contact {
    padding: 24px 20px;
    .tm-btn {
      width: 100%;
    }
  }
}
</style>
