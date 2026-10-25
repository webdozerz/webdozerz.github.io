<script lang="ts" setup>
import PcIcon from '~/components/redesign/38pchel/PcIcon.vue'
import PcCard from '~/components/redesign/38pchel/PcCard.vue'

const shop = usePchelShop()
const ui = usePchelUi()
useSeoMeta({ title: 'Кабинет — 38пчёл | Концепт редизайна' })

const favs = computed(() => shop.favs.value.map((id) => pcFindProduct(id)).filter((p): p is PcProduct => Boolean(p)))
const date = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
const logout = () => {
  shop.user.value = null
  ui.say('Вы вышли из кабинета')
}
</script>

<template>
  <div class="pc-wrap pc-account">
    <nav class="pc-crumbs" aria-label="Навигация">
      <NuxtLink :to="pcPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Кабинет</span>
    </nav>
    <div class="pc-account__top">
      <h1 class="pc-title">{{ shop.user.value ? `Здравствуйте, ${shop.user.value.name}` : 'Кабинет' }}</h1>
      <button v-if="shop.user.value" type="button" class="pc-btn pc-btn--line" @click="logout">Выйти</button>
      <button v-else type="button" class="pc-btn pc-btn--accent" @click="ui.loginOpen.value = true">Войти или зарегистрироваться</button>
    </div>
    <p class="pc-account__note">Демо: кабинет, закладки и заказы хранятся только в этом браузере.</p>

    <section class="pc-section">
      <div class="pc-head"><h2>Закладки</h2></div>
      <div v-if="favs.length" class="pc-grid">
        <PcCard v-for="p in favs" :key="p.id" :product="p" />
      </div>
      <div v-else class="pc-panel pc-account__empty">
        <PcIcon name="heart" :size="32" />
        <p>Нажмите на сердечко у товара — он появится здесь.</p>
        <NuxtLink :to="pcPath('/catalog')" class="pc-btn pc-btn--dark">В каталог</NuxtLink>
      </div>
    </section>

    <section class="pc-section">
      <div class="pc-head"><h2>История заказов</h2></div>
      <ul v-if="shop.orders.value.length" class="pc-account__orders">
        <li v-for="o in shop.orders.value" :key="o.id" class="pc-panel">
          <div class="pc-account__order-head">
            <b>№ {{ o.id }}</b>
            <span>{{ date(o.date) }}</span>
            <em>{{ pcRub(o.total) }}</em>
          </div>
          <ul class="pc-account__order-lines">
            <li v-for="l in o.lines" :key="l.title + l.label">{{ l.title }} · {{ l.label }} × {{ l.qty }}</li>
          </ul>
        </li>
      </ul>
      <p v-else class="pc-account__note">Заказов пока нет.</p>
    </section>
  </div>
</template>

<style lang="scss">
.pc-account {
  &__top {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  &__note {
    margin-top: 10px;
    color: var(--pc-muted);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    svg {
      color: var(--pc-accent);
    }
  }

  ul.pc-account__orders {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__order-head {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    align-items: baseline;

    b {
      font-family: var(--pc-head);
      font-size: 22px;
    }

    span {
      color: var(--pc-muted);
    }

    em {
      margin-left: auto;
      font-style: normal;
      font-weight: 600;
    }
  }

  ul.pc-account__order-lines {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 10px;
    color: #403a32;
  }
}
</style>
