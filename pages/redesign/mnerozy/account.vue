<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'

useSeoMeta({ title: 'Личный кабинет — Мне розы | Концепт редизайна' })

const shop = useMnerozyShop()
const ui = useMnerozyUi()

const openLogin = () => {
  ui.closeAll()
  ui.loginOpen.value = true
}
const logout = () => {
  shop.user.value = null
  ui.say('Вы вышли из кабинета')
}
const repeat = (o: MrOrder) => {
  ui.say(`Позвоните ${mrContacts.phone}, и оператор повторит заказ № ${o.id}`)
}
const fmt = (iso: string) => {
  const d = new Date(iso)
  return `${mrDay(d)} ${d.getFullYear()}`
}
</script>

<template>
  <div class="mr-wrap mr-acc">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span>Личный кабинет</span>
    </nav>

    <div v-if="!shop.user.value" class="mr-acc__guest">
      <h1>Личный кабинет</h1>
      <p>Войдите, чтобы видеть историю заказов и не вводить адрес и телефон заново.</p>
      <button type="button" class="mr-btn mr-btn--accent" @click="openLogin">Войти или зарегистрироваться</button>
    </div>

    <template v-else>
      <div class="mr-acc__head">
        <div>
          <h1>{{ shop.user.value.name }}</h1>
          <p>{{ shop.user.value.email }}</p>
        </div>
        <button type="button" class="mr-btn mr-btn--line" @click="logout">Выйти</button>
      </div>

      <div class="mr-acc__grid">
        <section class="mr-acc__orders">
          <h2>Мои заказы</h2>
          <p v-if="!shop.orders.value.length" class="mr-acc__empty">
            Заказов пока нет. <NuxtLink :to="mrPath('/catalog')">Перейти в каталог</NuxtLink>
          </p>
          <article v-for="o in shop.orders.value" :key="o.id" class="mr-acc__order">
            <div class="mr-acc__order-top">
              <b>№ {{ o.id }}</b>
              <span>от {{ fmt(o.date) }}</span>
              <strong>{{ mrRub(o.total) }}</strong>
            </div>
            <p class="mr-acc__when"><MrIcon name="clock" :size="16" /> {{ o.when }}</p>
            <ul>
              <li v-for="l in o.lines" :key="l.title + l.pick">{{ l.title }}<template v-if="l.pick"> · {{ l.pick }}</template> — {{ l.qty }} шт</li>
            </ul>
            <button type="button" class="mr-acc__repeat" @click="repeat(o)">Повторить заказ</button>
          </article>
        </section>
        <aside class="mr-acc__side">
          <NuxtLink :to="mrPath('/favorites')" class="mr-acc__link">
            <MrIcon name="heart" />
            <span><b>Избранное</b><small>{{ shop.favs.value.length }} {{ mrPlural(shop.favs.value.length, 'товар', 'товара', 'товаров') }}</small></span>
          </NuxtLink>
          <NuxtLink :to="mrPath('/cart')" class="mr-acc__link">
            <MrIcon name="bag" />
            <span><b>Корзина</b><small>{{ shop.count.value ? mrRub(shop.total.value) : 'пустая' }}</small></span>
          </NuxtLink>
          <p class="mr-acc__note">Демо: кабинет и заказы хранятся только в этом браузере.</p>
        </aside>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.mr-acc {
  &__guest {
    display: grid;
    justify-items: start;
    gap: 14px;
    max-width: 560px;
    padding: 28px 0;

    h1 {
      font-size: 34px;
    }

    p {
      color: var(--mr-muted);
    }
  }

  &__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
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
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  &__orders {
    display: grid;
    gap: 12px;

    h2 {
      font-size: 22px;
    }
  }

  &__empty {
    color: var(--mr-muted);

    a {
      color: var(--mr-accent);
      font-weight: 700;
    }
  }

  &__order {
    display: grid;
    gap: 8px;
    padding: 20px;
    border-radius: var(--mr-r-panel);
    border: 1px solid var(--mr-line);

    ul {
      display: grid;
      gap: 2px;
      color: var(--mr-muted);
      font-size: 14px;
    }
  }

  &__order-top {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;

    span {
      color: var(--mr-muted);
      font-size: 14px;
    }

    strong {
      margin-left: auto;
      font-size: 18px;
      font-weight: 800;
    }
  }

  &__when {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
  }

  &__repeat {
    justify-self: start;
    color: var(--mr-accent);
    font-weight: 700;
  }

  &__side {
    display: grid;
    gap: 8px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);

    > svg {
      color: var(--mr-accent);
    }

    span {
      display: grid;
    }

    small {
      color: var(--mr-muted);
    }
  }

  &__note {
    color: var(--mr-muted);
    font-size: 13px;
  }
}

@media (max-width: 989px) {
  .mr-acc__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 576px) {
  .mr-acc {
    &__guest h1,
    &__head h1 {
      font-size: 26px;
    }

    &__order {
      padding: 16px;
    }
  }
}
</style>
