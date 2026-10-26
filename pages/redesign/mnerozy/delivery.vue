<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'

useSeoMeta({ title: 'Доставка и оплата — Мне розы | Концепт редизайна' })

// Зоны и цены — как в меню и оформлении заказа оригинала (страница из подвала с другими ценами
// здесь не повторяется: на сайте должна остаться одна).
const zones = [
  {
    title: 'По Томску',
    price: 0,
    when: 'за час',
    places: 'Томск, центральное КПП, Степановка, Зелёные горки, Спичфабрика',
  },
  {
    title: 'Окраины Томска',
    price: 199,
    when: '',
    places:
      'Северный парк, Левобережный Life, Тимирязево, Ветеран-3, Кайдаловка, Нижние склады, Зональный (частный сектор), Предтеченск, Аникино, Геологов, Просторный, Заварзино, Еловый ручей, Красивый пруд, Мирный, Причальная, Спутник, Росинка, Кузовлево, Трубачево, Корнилово, Новомихайловка',
  },
  {
    title: 'Северск и пригород',
    price: 349,
    when: '',
    places:
      'Северск, Нефтехим, Кузовлево, Лоскутово, Апрель, Ключи, Копылово, Воронино, Дзержинский, Кисловка, Чёрная речка, Тахтамышево, Кафтанчиково, Барабинка, Синий утёс, Лучаново, Коларово, Казанка, Лязгино, Протопопово, Эушта, Петровский участок',
  },
  {
    title: 'Дальний пригород',
    price: 499,
    when: '',
    places:
      'Аэропорт, Богашево, Светлый, Зоркальцево, Калтай, Курлек, Кандинка, Борики, Поросино, Петрово, Батурино, Вершинино, Некрасово, Рассвет, Слобода Вольная, Аркашево',
  },
]
const q = ref('')
const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е')
const hit = computed(() => {
  const s = norm(q.value.trim())
  if (s.length < 3) return null
  return zones.find((z) => norm(z.places).includes(s)) ?? false
})
</script>

<template>
  <div class="mr-wrap mr-del">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span>Доставка и оплата</span>
    </nav>
    <div class="mr-del__head">
      <h1>Доставка и оплата</h1>
      <p>Своя курьерская служба, круглосуточно и без выходных. По Томску привозим за час и бесплатно.</p>
    </div>

    <div class="mr-del__grid">
      <section class="mr-del__zones">
        <div class="mr-del__find">
          <label class="mr-field">
            <span>Найдите свой район</span>
            <input v-model="q" placeholder="Например, Северск или Тимирязево" />
          </label>
          <p v-if="hit" class="mr-del__hit">
            <MrIcon name="check" :size="18" /> {{ hit.title }} — <b>{{ hit.price ? mrRub(hit.price) : 'бесплатно' }}</b>
          </p>
          <p v-else-if="hit === false" class="mr-del__miss">Такого района нет в списке — уточните цену по телефону {{ mrContacts.phone }}</p>
        </div>
        <article v-for="z in zones" :key="z.title" class="mr-del__zone" :class="{ 'is-hit': hit && hit.title === z.title }">
          <div>
            <h2>{{ z.title }}</h2>
            <p>{{ z.places }}</p>
          </div>
          <strong :class="{ 'is-free': !z.price }">{{ z.price ? mrRub(z.price) : 'бесплатно' }}<small v-if="z.when">{{ z.when }}</small></strong>
        </article>
      </section>

      <aside class="mr-del__side">
        <section class="mr-del__card">
          <h2>Самовывоз</h2>
          <p v-for="s in mrContacts.shops" :key="s.title"><b>{{ s.title }}</b> — {{ s.text }}</p>
        </section>
        <section class="mr-del__card">
          <h2>Оплата</h2>
          <ul>
            <li v-for="p in mrPayments" :key="p.id">
              <MrIcon name="wallet" :size="20" />
              <span><b>{{ p.title }}</b> {{ p.text }}</span>
            </li>
          </ul>
          <div class="mr-del__logos">
            <img src="https://mnerozy.ru/image/data/system/oplata-visa.png" alt="VISA" height="24" />
            <img src="https://mnerozy.ru/image/data/system/oplata-master.png" alt="MasterCard" height="24" />
            <img src="https://mnerozy.ru/image/data/system/oplata-sberbank.png" alt="Сбербанк" height="24" />
          </div>
        </section>
        <section class="mr-del__card">
          <h2>Важно знать</h2>
          <ul class="mr-del__rules">
            <li>Смена адреса меньше чем за час до доставки и повторная доставка, если получателя нет на месте, — 150 ₽.</li>
            <li>В форс-мажорных случаях курьер может опоздать до 30 минут.</li>
            <li>Заказ можно отменить не позднее 60 минут после оформления. Если букет уже отправлен на доставку, удерживается 30% его стоимости.</li>
            <li>Цветы — скоропортящийся товар, обмену и возврату не подлежат.</li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mr-del {
  &__head {
    display: grid;
    gap: 8px;
    padding: 14px 0 24px;

    h1 {
      font-size: 34px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  &__zones {
    display: grid;
    gap: 10px;
  }

  &__find {
    display: grid;
    gap: 10px;
    padding: 20px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);

    input {
      border-color: transparent;
    }
  }

  &__hit {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--mr-green);
    font-weight: 600;

    b {
      font-weight: 800;
    }
  }

  &__miss {
    color: var(--mr-muted);
    font-size: 14px;
  }

  &__zone {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 20px;
    border-radius: var(--mr-r-panel);
    border: 1px solid var(--mr-line);
    transition: border-color 0.2s;

    h2 {
      margin-bottom: 6px;
      font-size: 19px;
    }

    p {
      color: var(--mr-muted);
      font-size: 14px;
      line-height: 1.55;
    }

    strong {
      flex: none;
      display: grid;
      justify-items: end;
      font-size: 20px;
      font-weight: 800;
      white-space: nowrap;

      small {
        font-size: 13px;
        font-weight: 600;
      }

      &.is-free {
        color: var(--mr-green);
      }
    }

    &.is-hit {
      border-color: var(--mr-green);
    }
  }

  &__side {
    display: grid;
    gap: 12px;
  }

  &__card {
    display: grid;
    gap: 10px;
    padding: 22px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);

    h2 {
      font-size: 19px;
    }

    p,
    li {
      font-size: 14px;
      color: var(--mr-muted);

      b {
        color: var(--mr-ink);
        font-weight: 700;
      }
    }

    ul {
      display: grid;
      gap: 10px;
    }

    li {
      display: flex;
      gap: 10px;
    }

    li svg {
      flex: none;
      color: var(--mr-accent);
    }
  }

  &__rules li {
    display: list-item !important;
    margin-left: 18px;
    list-style: disc;
  }

  &__logos {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    img {
      height: 28px;
      width: auto;
      padding: 4px 8px;
      border-radius: 6px;
      background: #fff;
    }
  }
}

@media (max-width: 989px) {
  .mr-del__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 576px) {
  .mr-del {
    &__head h1 {
      font-size: 26px;
    }

    &__zone {
      flex-direction: column;
      gap: 10px;
      padding: 16px;

      strong {
        justify-items: start;
      }
    }

    &__find,
    &__card {
      padding: 16px;
    }
  }
}
</style>
