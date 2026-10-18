<script lang="ts" setup>
import RsQty from '~/components/redesign/rybasibiri/RsQty.vue'

const cart = useRybasibiriCart()
const query = ref('')

const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  return rsOpt
    .map((g) => ({ ...g, items: q ? g.items.filter((i) => i.name.toLowerCase().includes(q)) : g.items }))
    .filter((g) => g.items.length)
})
const total = rsOpt.reduce((n, g) => n + g.items.length, 0)

const unitLabel = (item: RsOptItem, qty: number) => (item.unit === 'kg' ? `${rsNum(qty)} кг` : `${qty} уп.`)

const priceForm = reactive({ email: '', company: '' })
const priceSent = ref(false)

useSeoMeta({
  title: 'Оптовый прайс | «Стиль Продукт», концепт',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="rs-wrap rso">
    <div class="rs-page-head">
      <nav class="rs-crumbs" aria-label="Навигация">
        <NuxtLink :to="rsPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Опт</span>
      </nav>
      <h1>Оптовый прайс</h1>
      <p>
        Для оптовых компаний, магазинов, ресторанов, санаториев, детских садов и школ. Цены со страниц
        «Витрины» — за килограмм или за упаковку. Актуальные цены и условия поставки менеджер пришлёт по
        заявке.
      </p>
    </div>

    <div class="rso-layout">
      <div class="rso-main">
        <div class="rso-tools">
          <label class="rs-field">
            <span class="rs-sr">Поиск по прайсу</span>
            <input v-model="query" type="search" :placeholder="`Найти среди ${total} позиций: филе, фарш, скумбрия`" />
          </label>
          <nav class="rs-seg rso-chips" aria-label="Разделы прайса">
            <a v-for="g in rsOpt" :key="g.id" :href="`#${g.id}`">{{ g.label }}</a>
          </nav>
        </div>

        <section v-for="g in groups" :id="g.id" :key="g.id" class="rso-group">
          <header class="rso-group__head">
            <img :src="rsImg(g.img, 160)" alt="" width="160" height="160" loading="lazy" />
            <div>
              <h2>{{ g.label }}</h2>
              <p>{{ g.note }}</p>
            </div>
          </header>

          <div class="rso-table" role="table" :aria-label="g.label">
            <div class="rso-row rso-row--head" role="row">
              <span role="columnheader">Наименование</span>
              <span role="columnheader">Цена</span>
              <span role="columnheader">В заявку</span>
            </div>
            <div v-for="item in g.items" :key="item.id" class="rso-row" :class="{ 'is-in': cart.optQtyOf(item.id) }" role="row">
              <span class="rso-row__name" role="cell">
                {{ item.name }}
                <small v-if="item.pack">{{ item.pack }}</small>
              </span>
              <span class="rso-row__price" role="cell">
                <template v-if="item.price">
                  <b>{{ rsRub(item.price) }}</b>
                  <small>за {{ item.per }}</small>
                </template>
                <small v-else>по запросу</small>
              </span>
              <span class="rso-row__qty" role="cell">
                <RsQty
                  v-if="cart.optQtyOf(item.id)"
                  :model-value="cart.optQtyOf(item.id)"
                  :label="unitLabel(item, cart.optQtyOf(item.id))"
                  :min="0"
                  :step="item.unit === 'kg' ? 5 : 1"
                  :name="item.name"
                  small
                  @update:model-value="(v: number) => cart.setOpt(item.id, v)"
                />
                <button
                  v-else
                  type="button"
                  class="rs-btn rs-btn--soft rso-row__add"
                  :aria-label="`В заявку: ${item.name}`"
                  @click="cart.setOpt(item.id, item.unit === 'kg' ? 10 : 10)"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>
                  <span>В заявку</span>
                </button>
              </span>
            </div>
          </div>
        </section>

        <div v-if="!groups.length" class="rs-panel">Ничего не нашли. Позвоните в отдел продаж: {{ rsContacts.phone }}.</div>
      </div>

      <aside class="rso-side">
        <div class="rso-sum">
          <h2>Ваша заявка</h2>
          <template v-if="cart.optCount.value">
            <dl>
              <div><dt>Позиций</dt><dd>{{ cart.optCount.value }}</dd></div>
              <div v-if="cart.optKg.value"><dt>Весовых</dt><dd>{{ rsNum(cart.optKg.value) }} кг</dd></div>
              <div><dt>По ценам прайса</dt><dd>≈ {{ rsRub(cart.optTotal.value) }}</dd></div>
            </dl>
            <NuxtLink :to="rsPath('/cart') + '?tab=opt'" class="rs-btn rs-btn--wide">Оформить заявку</NuxtLink>
            <button type="button" class="rs-link rso-sum__clear" @click="cart.clearOpt()">Очистить</button>
          </template>
          <p v-else class="rs-muted">
            Нажмите «В заявку» у нужных позиций — по умолчанию 10 кг или 10 упаковок, дальше шагом 5 кг.
          </p>
          <p class="rso-sum__fine">Менеджер рассчитает стоимость доставки за 30 минут и пришлёт счёт.</p>
        </div>

        <form id="request" class="rso-price" @submit.prevent="priceSent = true">
          <h3>Прайс на почту</h3>
          <label class="rs-field">
            <span>Компания</span>
            <input v-model="priceForm.company" type="text" autocomplete="organization" placeholder="ООО «Ромашка»" />
          </label>
          <label class="rs-field">
            <span>Электронная почта</span>
            <input v-model="priceForm.email" type="email" required autocomplete="email" placeholder="zakupki@company.ru" />
          </label>
          <button type="submit" class="rs-btn rs-btn--line rs-btn--wide">Запросить прайс</button>
          <p v-if="priceSent" class="rs-note" role="status">Это демо: в настоящем сайте прайс уйдёт на {{ priceForm.email }}.</p>
        </form>
      </aside>
    </div>

    <section class="rs-section rso-terms">
      <div class="rs-panel">
        <h3>География</h3>
        <p>{{ rsRegions.join(', ') }}. Готовы расширять географию работы.</p>
      </div>
      <div class="rs-panel">
        <h3>Цены и условия</h3>
        <p>Ценовая политика лояльна к клиенту. Объёмы, условия поставки и оплаты обсуждаем с каждым.</p>
      </div>
      <div class="rs-panel">
        <h3>Документы</h3>
        <p>Декларации ЕАС на замороженную рыбу и рыбные полуфабрикаты.</p>
        <NuxtLink :to="rsPath('/contacts') + '#docs'" class="rs-link">Скачать</NuxtLink>
      </div>
      <div class="rs-panel">
        <h3>Своя марка</h3>
        <p>Производим продукцию под СТМ: копчение, стейки, филе, фасовка в вакуум.</p>
        <NuxtLink :to="rsPath('/production')" class="rs-link">Услуги производства</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.rs .rso {
  .rso-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 36px;
    align-items: start;
  }

  .rso-main {
    display: grid;
    gap: 40px;
    min-width: 0;
  }

  .rso-tools {
    display: grid;
    gap: 12px;
  }

  .rso-chips {
    a {
      font-size: 13px;
    }
  }

  .rso-group {
    scroll-margin-top: 140px;

    &__head {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;

      img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 14px;
        flex-shrink: 0;
      }

      h2 {
        font-size: 22px;
      }

      p {
        margin-top: 4px;
        font-size: 14px;
        color: var(--rs-muted);
      }
    }
  }

  // Прайс — одна карточка: рамка и скругление у таблицы, между строками ровные линии.
  .rso-table {
    display: grid;
    overflow: hidden;
    border-radius: var(--rs-r-lg);
    box-shadow: inset 0 0 0 1px var(--rs-line);
  }

  .rso-row {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 150px 170px;
    gap: 16px;
    align-items: center;
    min-height: 64px;
    padding: 10px 16px 10px 20px;
    border-top: 1px solid var(--rs-line);
    transition: background-color 0.15s;

    &:hover {
      background: #f5f8fc;
    }

    // Позиция в заявке: заметный фон и синяя полоса слева.
    &.is-in {
      background: var(--rs-ice);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: var(--rs-blue);
      }

      .rs-qty {
        background: #fff;
      }
    }

    &--head {
      min-height: 44px;
      border-top: 0;
      background: var(--rs-ice);
      font-size: 13px;
      font-weight: 600;
      color: var(--rs-muted);

      &:hover {
        background: var(--rs-ice);
      }
    }

    &__name {
      display: grid;
      font-weight: 500;
      line-height: 1.35;
      overflow-wrap: anywhere;

      small {
        font-size: 13px;
        font-weight: 400;
        color: var(--rs-muted);
      }
    }

    &__price {
      display: grid;
      line-height: 1.3;

      b {
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      small {
        font-size: 13px;
        color: var(--rs-muted);
      }
    }

    &__add {
      width: 100%;
      min-height: 42px;
      padding: 0 12px;
    }
  }

  .rso-side {
    position: sticky;
    top: 140px;
    display: grid;
    gap: 12px;
  }

  .rso-sum,
  .rso-price {
    display: grid;
    gap: 14px;
    padding: 22px;
    border-radius: var(--rs-r-lg);
    background: var(--rs-ice);

    h2,
    h3 {
      font-size: 19px;
    }
  }

  .rso-price {
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--rs-line);
  }

  .rso-sum {
    dl {
      display: grid;
      gap: 6px;

      div {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-size: 14px;
      }

      dt {
        color: var(--rs-muted);
      }

      dd {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
    }

    &__clear {
      justify-self: start;
      font-size: 14px;
    }

    &__fine {
      font-size: 13px;
      color: var(--rs-muted);
    }
  }

  .rso-terms {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;

    .rs-panel {
      display: grid;
      align-content: start;
      justify-items: start;
      gap: 8px;
      padding: 22px;
    }

    h3 {
      font-size: 17px;
    }

    p {
      font-size: 14px;
      color: var(--rs-muted);
    }
  }

  @media (max-width: 1100px) {
    .rso-terms {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 960px) {
    .rso-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    // На телефоне сводка после прайса: число позиций и так видно в нижней панели.
    .rso-side {
      position: static;
    }

    .rso-chips {
      flex-wrap: nowrap;
      margin: 0 -16px;
      padding: 0 16px 2px;
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  @media (max-width: 640px) {
    .rso-row {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 8px 12px;
      padding: 12px 14px 12px 16px;

      &--head {
        display: none;
      }

      // Шапка таблицы скрыта — первой строке линия сверху не нужна.
      &--head + .rso-row {
        border-top: 0;
      }

      &__name {
        grid-column: 1 / -1;
      }
    }

    .rso-terms {
      grid-template-columns: minmax(0, 1fr);
    }

    .rso-group__head img {
      width: 56px;
      height: 56px;
    }
  }
}
</style>
