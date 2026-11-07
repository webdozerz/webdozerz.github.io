<script lang="ts" setup>
import DrIcon from '~/components/redesign/dereda/DrIcon.vue'
import DrPhone from '~/components/redesign/dereda/DrPhone.vue'

useSeoMeta({ title: 'Личный кабинет — Дереда | Концепт редизайна' })
const shop = useDeredaShop()
const ui = useDrUi()

// Вход и регистрация — демо: данные запоминаются в браузере. Для примера у «старого» покупателя заказов на 23 400 ₽ — это уже 3 %.
const mode = ref<'login' | 'register'>('login')
const auth = reactive({ email: '', pass: '', name: '', phone: '', agree: false })
const login = () => {
  if (!auth.email.includes('@')) return
  shop.user.value = { name: auth.email.split('@')[0], email: auth.email, phone: '', spent: 23400, birthday: '' }
  ui.toast.value = 'Вы вошли — демо, история заказов для примера'
}
const register = () => {
  if (!auth.name.trim() || !auth.email.includes('@') || !auth.agree) return
  shop.user.value = { name: auth.name.trim(), email: auth.email, phone: auth.phone, spent: 0, birthday: '' }
  ui.toast.value = 'Вы зарегистрированы — накопительная скидка начнёт копиться с первого заказа'
}
const logout = () => {
  shop.user.value = null
}

const spent = computed(() => shop.user.value?.spent ?? 0)
const nextLevel = computed(() => drLevels.find((l) => spent.value < l.from))
const progress = computed(() => Math.min(100, Math.round((spent.value / 80000) * 100)))
</script>

<template>
  <div class="dr-wrap dr-page dr-acc">
    <nav class="dr-crumbs" aria-label="Навигация">
      <NuxtLink :to="drPath('/')">Главная</NuxtLink>
      <span>Личный кабинет</span>
    </nav>

    <template v-if="!shop.user.value">
      <div class="dr-acc__auth">
        <div class="dr-acc__tabs" role="tablist">
          <button type="button" role="tab" :aria-selected="mode === 'login'" :class="{ 'is-on': mode === 'login' }" @click="mode = 'login'">Вход</button>
          <button type="button" role="tab" :aria-selected="mode === 'register'" :class="{ 'is-on': mode === 'register' }" @click="mode = 'register'">
            Регистрация
          </button>
        </div>
        <form v-if="mode === 'login'" class="dr-form" @submit.prevent="login">
          <label class="dr-field"><span>Email</span><input v-model="auth.email" type="email" autocomplete="email" required /></label>
          <label class="dr-field"><span>Пароль</span><input v-model="auth.pass" type="password" autocomplete="current-password" /></label>
          <button type="submit" class="dr-btn dr-btn--main dr-btn--big">Войти</button>
          <p class="dr-muted">Демо: подойдёт любой email, пароль не проверяется.</p>
        </form>
        <form v-else class="dr-form" @submit.prevent="register">
          <label class="dr-field"><span>Имя *</span><input v-model="auth.name" autocomplete="name" required /></label>
          <label class="dr-field"><span>Email *</span><input v-model="auth.email" type="email" autocomplete="email" required /></label>
          <label class="dr-field"><span>Телефон</span><DrPhone v-model="auth.phone" /></label>
          <label class="dr-check"><input v-model="auth.agree" type="checkbox" /><span>Согласен с условиями оферты и политики конфиденциальности</span></label>
          <button type="submit" class="dr-btn dr-btn--main dr-btn--big" :disabled="!auth.name.trim() || !auth.email.includes('@') || !auth.agree">
            Зарегистрироваться
          </button>
        </form>
        <div class="dr-acc__why">
          <DrIcon name="gift" :size="24" />
          <p>Зарегистрированным покупателям — накопительная скидка до 6 % и 5 % на день рождения.</p>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="dr-sechead">
        <h1>Здравствуйте, {{ shop.user.value.name }}!</h1>
        <button type="button" class="dr-link" @click="logout">Выйти</button>
      </div>

      <div class="dr-acc__grid">
        <section class="dr-acc__level">
          <h2>Накопительная скидка</h2>
          <p>
            Сумма выполненных заказов — <b>{{ drMoney(spent) }}</b
            >.
            <template v-if="shop.level.value">Ваша скидка — <b>{{ shop.level.value.pct }} %</b>, считается в корзине сама.</template>
            <template v-else>Скидка 3 % начнётся с 20 000 ₽.</template>
          </p>
          <div class="dr-acc__bar">
            <i :style="{ width: `${progress}%` }" />
            <span v-for="l in drLevels" :key="l.from" :style="{ left: `${(l.from / 80000) * 100}%` }" :class="{ 'is-on': spent >= l.from }">
              {{ l.pct }}&nbsp;%
            </span>
          </div>
          <p v-if="nextLevel" class="dr-muted">До {{ nextLevel.pct }} % — ещё {{ drMoney(nextLevel.from - spent) }}</p>
          <NuxtLink :to="drPath('/akcii#nakopitelnaya')" class="dr-acc__more">Условия программы</NuxtLink>
        </section>

        <section class="dr-acc__profile">
          <h2>Мои данные</h2>
          <label class="dr-field"><span>Имя</span><input v-model="shop.user.value.name" /></label>
          <label class="dr-field"><span>Email</span><input v-model="shop.user.value.email" type="email" /></label>
          <label class="dr-field"><span>Телефон</span><DrPhone v-model="shop.user.value.phone" /></label>
          <label class="dr-field"><span>Дата рождения — для скидки 5 %</span><input v-model="shop.user.value.birthday" type="date" /></label>
        </section>
      </div>

      <section class="dr-sec">
        <h2>Мои заказы</h2>
        <ul v-if="shop.orders.value.length" class="dr-acc__orders">
          <li v-for="o in shop.orders.value" :key="o.n">
            <b>№ {{ o.n }}</b>
            <span>от {{ o.date }}</span>
            <span>{{ o.pickup ? 'самовывоз' : 'доставка' }} в {{ o.day }}</span>
            <span>{{ o.count }} {{ drPlural(o.count, 'товар', 'товара', 'товаров') }}</span>
            <b>{{ drMoney(o.total) }}</b>
            <em>Принят</em>
          </li>
        </ul>
        <p v-else class="dr-muted">Заказов пока нет — оформите первый, и он появится здесь.</p>
      </section>
    </template>
  </div>
</template>

<style lang="scss">
.dr-acc {
  &__auth {
    display: grid;
    gap: 20px;
    max-width: 480px;
    margin: 12px auto 0;
    padding: 32px;
    border: 1px solid var(--dr-line);
    border-radius: var(--dr-R);

    @media (max-width: 576px) {
      padding: 22px 18px;
    }
  }

  &__tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 4px;
    border-radius: var(--dr-r);
    background: var(--dr-surface);

    button {
      height: 42px;
      border: 0;
      border-radius: 9px;
      background: none;
      color: var(--dr-muted);
      font-weight: 600;
      cursor: pointer;

      &.is-on {
        background: #fff;
        color: var(--dr-dark);
        box-shadow: 0 1px 4px rgba(58, 36, 32, 0.1);
      }
    }
  }

  &__why {
    display: flex;
    gap: 12px;
    padding: 14px 16px;
    border-radius: var(--dr-r);
    background: var(--dr-accent-soft);
    color: var(--dr-accent-hover);

    svg {
      flex: none;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__level,
  &__profile {
    display: grid;
    gap: 14px;
    padding: 28px;
    border-radius: var(--dr-R);

    h2 {
      font-size: 28px;
    }

    @media (max-width: 576px) {
      padding: 22px 18px;
    }
  }

  &__level {
    background: var(--dr-surface);
  }

  &__profile {
    border: 1px solid var(--dr-line);
  }

  &__bar {
    position: relative;
    height: 12px;
    margin: 6px 0 30px;
    border-radius: 6px;
    background: #fff;

    i {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: 6px;
      background: var(--dr-accent);
    }

    span {
      position: absolute;
      top: 18px;
      color: var(--dr-muted);
      font-size: 14px;
      font-weight: 700;
      transform: translateX(-100%);

      &.is-on {
        color: var(--dr-accent);
      }
    }
  }

  &__more {
    color: var(--dr-accent);
    font-weight: 600;
  }

  ul.dr-acc__orders {
    display: grid;
    gap: 10px;
    margin-top: 14px;

    li {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 4px 18px;
      padding: 16px 20px;
      border: 1px solid var(--dr-line);
      border-radius: var(--dr-r);
    }

    span {
      color: var(--dr-muted);
    }

    em {
      margin-left: auto;
      padding: 2px 10px;
      border-radius: 8px;
      background: var(--dr-green-soft);
      color: var(--dr-green);
      font-style: normal;
      font-weight: 600;
    }
  }
}
</style>
