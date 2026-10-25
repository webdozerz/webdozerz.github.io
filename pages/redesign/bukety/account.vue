<script lang="ts" setup>
import BkIcon from '~/components/redesign/bukety/BkIcon.vue'
import BkCard from '~/components/redesign/bukety/BkCard.vue'

useSeoMeta({ title: 'Кабинет и избранное — Любимые Букеты | Концепт редизайна' })

const shop = useBuketyShop()
const ui = useBuketyUi()
const favs = computed(() => shop.favs.value.map((id) => bkFind(id)).filter(Boolean) as BkProduct[])
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
const logout = () => {
  shop.user.value = null
  ui.say('Вы вышли из кабинета')
}
</script>

<template>
  <div class="bk-wrap bk-info bk-acc">
    <nav class="bk-crumbs">
      <NuxtLink :to="bkPath()">Главная</NuxtLink>
      <span>Кабинет</span>
    </nav>
    <div class="bk-acc__top">
      <h1>{{ shop.user.value ? `Здравствуйте, ${shop.user.value.name}` : 'Кабинет клиента' }}</h1>
      <button v-if="shop.user.value" type="button" class="bk-btn bk-btn--line" @click="logout">Выйти</button>
      <button v-else type="button" class="bk-btn bk-btn--accent" @click="ui.loginOpen.value = true"><BkIcon name="user" :size="20" /> Войти или зарегистрироваться</button>
    </div>

    <section class="bk-section">
      <div class="bk-head"><h2>Заказы</h2></div>
      <p v-if="!shop.user.value" class="bk-acc__none">Войдите, чтобы видеть историю заказов и повторять их в один клик.</p>
      <ul v-else-if="shop.orders.value.length" class="bk-acc__orders">
        <li v-for="o in shop.orders.value" :key="o.id">
          <div>
            <b>№ {{ o.id }} от {{ fmtDate(o.date) }}</b>
            <small>{{ o.when }}</small>
          </div>
          <p>{{ o.lines.map((l) => `${l.title}${l.pick ? ` (${l.pick})` : ''} × ${l.qty}`).join(', ') }}</p>
          <em>{{ bkRub(o.total) }}</em>
        </li>
      </ul>
      <p v-else class="bk-acc__none">Заказов пока нет. После оформления здесь будет история — удобно повторить букет маме на следующий праздник.</p>
    </section>

    <section class="bk-section">
      <div class="bk-head"><h2>Избранное</h2></div>
      <div v-if="favs.length" class="bk-grid">
        <BkCard v-for="p in favs" :key="p.id" :product="p" />
      </div>
      <p v-else class="bk-acc__none">Нажмите <BkIcon name="heart" :size="18" /> на букете, чтобы отложить его сюда.</p>
    </section>
  </div>
</template>

<style lang="scss">
.bk-acc {
  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;

    h1 {
      font-size: clamp(30px, 3vw, 44px);
    }
  }

  &__none {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    padding: 20px 24px;
    border-radius: 20px;
    background: var(--bk-gray);
    color: var(--bk-muted);

    svg {
      color: var(--bk-rose);
    }
  }

  ul.bk-acc__orders {
    display: grid;
    gap: 10px;

    li {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr) auto;
      gap: 8px 20px;
      align-items: start;
      padding: 18px 20px;
      border-radius: 18px;
      border: 1px solid var(--bk-line);

      > div {
        display: grid;
      }

      small {
        color: var(--bk-muted);
        font-size: 14px;
      }

      em {
        font-style: normal;
        font-weight: 800;
        white-space: nowrap;
      }
    }
  }
}

@media (max-width: 768px) {
  .bk-acc {
    &__top .bk-btn {
      width: 100%;
    }

    ul.bk-acc__orders li {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
