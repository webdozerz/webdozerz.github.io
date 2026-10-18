<script lang="ts" setup>
import RsQty from '~/components/redesign/rybasibiri/RsQty.vue'

const route = useRoute()
const router = useRouter()
const cart = useRybasibiriCart()

const tab = computed<'retail' | 'opt'>(() => (route.query.tab === 'opt' ? 'opt' : 'retail'))
const setTab = (t: 'retail' | 'opt') => {
  cart.mode.value = t
  router.replace({ query: t === 'opt' ? { tab: 'opt' } : {} })
}
watch(tab, (t) => (cart.mode.value = t), { immediate: true })

const hasWhole = computed(() => cart.lines.value.some((l) => l.product.unit === 'whole'))

// ---------- розничный заказ ----------
const order = reactive({ name: '', phone: '', how: 'pickup' as 'pickup' | 'delivery', address: '', comment: '' })
const orderSent = ref<null | { total: string; count: number }>(null)
const sendOrder = () => {
  orderSent.value = { total: rsRange(cart.total.value), count: cart.count.value }
  cart.clear()
}

// ---------- оптовая заявка ----------
const buyerTypes = ['Оптовая компания', 'Магазин или сеть', 'Ресторан, кафе', 'Санаторий, гостиница', 'Детский сад, школа', 'Производство']
const req = reactive({
  company: '',
  inn: '',
  type: buyerTypes[0],
  person: '',
  phone: '',
  email: '',
  region: rsRegions[0],
  address: '',
  comment: '',
})
const reqSent = ref<null | { until: string; count: number }>(null)
const sendReq = () => {
  // Срок расчёта доставки — через 30 минут по кемеровскому времени, а не по часам зрителя.
  const until = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Novokuznetsk',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(Date.now() + 30 * 60 * 1000))
  reqSent.value = { until, count: cart.optCount.value }
  cart.clearOpt()
}
const innOk = computed(() => !req.inn || /^\d{10}(\d{2})?$/.test(req.inn))

const optLabel = (item: RsOptItem, qty: number) => (item.unit === 'kg' ? `${rsNum(qty)} кг` : `${qty} уп.`)

useSeoMeta({
  title: () => `${tab.value === 'opt' ? 'Оптовая заявка' : 'Корзина'} | «Стиль Продукт», концепт`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="rs-wrap rsk">
    <div class="rs-page-head">
      <h1>{{ tab === 'opt' ? 'Оптовая заявка' : 'Корзина' }}</h1>
    </div>

    <div class="rs-mode rsk-tabs" role="tablist" aria-label="Корзина или оптовая заявка">
      <button type="button" role="tab" :aria-selected="tab === 'retail'" :class="{ 'is-on': tab === 'retail' }" @click="setTab('retail')">
        Корзина · {{ cart.count.value }}
      </button>
      <button type="button" role="tab" :aria-selected="tab === 'opt'" :class="{ 'is-on': tab === 'opt' }" @click="setTab('opt')">
        Оптовая заявка · {{ cart.optCount.value }}
      </button>
    </div>

    <!-- ===================== розница ===================== -->
    <template v-if="tab === 'retail'">
      <div v-if="orderSent" class="rs-panel rsk-done" role="status">
        <h2>Заказ принят — это демо</h2>
        <p>
          {{ orderSent.count }} поз. на {{ orderSent.total }}. В настоящем магазине менеджер перезвонит, назовёт
          точную сумму после взвешивания и договорится, когда забрать или привезти заказ.
        </p>
        <NuxtLink :to="rsPath('/catalog')" class="rs-btn">Вернуться в магазин</NuxtLink>
      </div>

      <div v-else-if="!cart.count.value" class="rs-panel rsk-done">
        <h2>В корзине пусто</h2>
        <p>Загляните в магазин: стейки и филе собственной разделки, рыба целиком, салаты из морской капусты.</p>
        <NuxtLink :to="rsPath('/catalog')" class="rs-btn">В магазин</NuxtLink>
      </div>

      <div v-else class="rsk-layout">
        <div class="rsk-lines">
          <article v-for="l in cart.lines.value" :key="l.id" class="rsk-line">
            <NuxtLink :to="rsPath(`/product/${l.id}`)" class="rsk-line__photo">
              <img :src="rsImg(l.product.img, 200)" :alt="rsTitle(l.product)" width="200" height="200" loading="lazy" />
            </NuxtLink>
            <div class="rsk-line__info">
              <NuxtLink :to="rsPath(`/product/${l.id}`)" class="rsk-line__name">{{ rsTitle(l.product) }}</NuxtLink>
              <span class="rsk-line__per">
                {{ rsRub(l.product.price) }} {{ rsPer(l.product) }}
                <template v-if="l.product.unit === 'whole'"> · {{ rsWeightLabel(l.product) }}</template>
              </span>
            </div>
            <RsQty
              class="rsk-line__qty"
              :model-value="l.qty"
              :label="rsQtyLabel(l.product, l.qty)"
              :step="rsStep(l.product)"
              :min="rsMin(l.product)"
              :name="l.product.name"
              small
              @update:model-value="(v: number) => cart.setQty(l.id, v)"
            />
            <b class="rsk-line__sum">{{ l.product.unit === 'whole' ? '≈ ' : '' }}{{ rsRange(l.sum) }}</b>
            <button type="button" class="rs-iconbtn rsk-line__drop" :aria-label="`Удалить: ${l.product.name}`" @click="cart.setQty(l.id, 0)">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
              </svg>
            </button>
          </article>
          <button type="button" class="rs-link rsk-clear" @click="cart.clear()">Очистить корзину</button>
        </div>

        <form class="rsk-side" @submit.prevent="sendOrder">
          <div class="rsk-total">
            <div><span>Товаров</span><b>{{ cart.count.value }}</b></div>
            <div class="rsk-total__sum"><span>Итого</span><b>{{ hasWhole ? '≈ ' : '' }}{{ rsRange(cart.total.value) }}</b></div>
            <p v-if="hasWhole" class="rsk-total__hint">
              Рыбу целиком продаём по весу: точную сумму назовём после взвешивания.
            </p>
          </div>

          <label class="rs-field">
            <span>Имя</span>
            <input v-model="order.name" type="text" required autocomplete="name" />
          </label>
          <label class="rs-field">
            <span>Телефон</span>
            <input v-model="order.phone" type="tel" required autocomplete="tel" placeholder="+7" />
          </label>
          <div class="rs-field">
            <span>Как получить</span>
            <div class="rs-mode rs-mode--wide" role="radiogroup" aria-label="Как получить">
              <button type="button" role="radio" :aria-checked="order.how === 'pickup'" :class="{ 'is-on': order.how === 'pickup' }" @click="order.how = 'pickup'">Заберу сам</button>
              <button type="button" role="radio" :aria-checked="order.how === 'delivery'" :class="{ 'is-on': order.how === 'delivery' }" @click="order.how = 'delivery'">Нужна доставка</button>
            </div>
          </div>
          <label v-if="order.how === 'delivery'" class="rs-field">
            <span>Адрес</span>
            <input v-model="order.address" type="text" required autocomplete="street-address" placeholder="Кемерово, улица, дом" />
          </label>
          <label class="rs-field">
            <span>Комментарий</span>
            <textarea v-model="order.comment" placeholder="Например: сёмгу разделать на стейки" />
          </label>
          <p class="rsk-fine">Условия доставки и оплаты менеджер согласует по телефону.</p>
          <button type="submit" class="rs-btn rs-btn--wide">Оформить заказ</button>
        </form>
      </div>
    </template>

    <!-- ===================== опт ===================== -->
    <template v-else>
      <div v-if="reqSent" class="rs-panel rsk-done" role="status">
        <h2>Заявка принята — это демо</h2>
        <p>
          {{ reqSent.count }} поз. В настоящем сайте менеджер рассчитает стоимость доставки до
          {{ reqSent.until }} по кемеровскому времени (в рабочие часы) и пришлёт счёт на {{ req.email || 'почту' }}.
        </p>
        <NuxtLink :to="rsPath('/opt')" class="rs-btn">Вернуться к прайсу</NuxtLink>
      </div>

      <div v-else-if="!cart.optCount.value" class="rs-panel rsk-done">
        <h2>Заявка пустая</h2>
        <p>Отметьте позиции в оптовом прайсе — по умолчанию 10 кг или 10 упаковок.</p>
        <NuxtLink :to="rsPath('/opt')" class="rs-btn">Открыть прайс</NuxtLink>
      </div>

      <div v-else class="rsk-layout">
        <div class="rsk-lines">
          <article v-for="l in cart.optLines.value" :key="l.id" class="rsk-line rsk-line--opt">
            <div class="rsk-line__info">
              <span class="rsk-line__name">{{ l.item.name }}</span>
              <span class="rsk-line__per">
                <template v-if="l.item.price">{{ rsRub(l.item.price) }} за {{ l.item.per }}</template>
                <template v-else>цена по запросу</template>
              </span>
            </div>
            <RsQty
              class="rsk-line__qty"
              :model-value="l.qty"
              :label="optLabel(l.item, l.qty)"
              :step="l.item.unit === 'kg' ? 5 : 1"
              :min="l.item.unit === 'kg' ? 5 : 1"
              :name="l.item.name"
              small
              @update:model-value="(v: number) => cart.setOpt(l.id, v)"
            />
            <b class="rsk-line__sum">{{ l.item.price ? rsRub(l.sum) : '—' }}</b>
            <button type="button" class="rs-iconbtn rsk-line__drop" :aria-label="`Удалить: ${l.item.name}`" @click="cart.setOpt(l.id, 0)">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
              </svg>
            </button>
          </article>
          <div class="rsk-optsum">
            <span>По ценам прайса<template v-if="cart.optKg.value">, {{ rsNum(cart.optKg.value) }} кг весовых</template></span>
            <b>≈ {{ rsRub(cart.optTotal.value) }}</b>
          </div>
          <NuxtLink :to="rsPath('/opt')" class="rs-link rsk-clear">Добавить позиции из прайса</NuxtLink>
        </div>

        <form class="rsk-side" @submit.prevent="sendReq">
          <div class="rs-field">
            <span>Кто вы</span>
            <select v-model="req.type">
              <option v-for="t in buyerTypes" :key="t">{{ t }}</option>
            </select>
          </div>
          <label class="rs-field">
            <span>Компания</span>
            <input v-model="req.company" type="text" required autocomplete="organization" />
          </label>
          <label class="rs-field">
            <span>ИНН</span>
            <input v-model="req.inn" type="text" inputmode="numeric" maxlength="12" placeholder="10 или 12 цифр" />
            <small v-if="!innOk" class="rsk-err">ИНН — это 10 цифр у организации или 12 у ИП</small>
          </label>
          <div class="rs-form__row">
            <label class="rs-field">
              <span>Контактное лицо</span>
              <input v-model="req.person" type="text" required autocomplete="name" />
            </label>
            <label class="rs-field">
              <span>Телефон</span>
              <input v-model="req.phone" type="tel" required autocomplete="tel" placeholder="+7" />
            </label>
          </div>
          <label class="rs-field">
            <span>Почта для счёта</span>
            <input v-model="req.email" type="email" autocomplete="email" />
          </label>
          <div class="rs-field">
            <span>Регион доставки</span>
            <select v-model="req.region">
              <option v-for="r in rsRegions" :key="r">{{ r }}</option>
              <option>Другой регион</option>
            </select>
          </div>
          <label class="rs-field">
            <span>Адрес или город</span>
            <input v-model="req.address" type="text" />
          </label>
          <label class="rs-field">
            <span>Комментарий</span>
            <textarea v-model="req.comment" placeholder="Периодичность поставок, нарезка, упаковка" />
          </label>
          <button type="submit" class="rs-btn rs-btn--wide" :disabled="!innOk">Отправить заявку</button>
          <p class="rsk-fine">Рассчитаем стоимость доставки за 30 минут.</p>
        </form>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.rs .rsk {
  .rsk-tabs {
    margin-bottom: 24px;
  }

  .rsk-done {
    display: grid;
    justify-items: start;
    gap: 12px;
    max-width: 720px;

    h2 {
      font-size: 24px;
    }

    p {
      color: var(--rs-muted);
    }
  }

  .rsk-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 36px;
    align-items: start;
  }

  .rsk-lines {
    display: grid;
    align-content: start;
    min-width: 0;
  }

  .rsk-line {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr) 150px 120px 44px;
    gap: 16px;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--rs-line);

    &--opt {
      grid-template-columns: minmax(0, 1fr) 150px 120px 44px;
    }

    &__photo img {
      width: 84px;
      height: 84px;
      object-fit: cover;
      border-radius: 12px;
      background: var(--rs-ice);
    }

    &__info {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    &__name {
      font-weight: 500;
      line-height: 1.35;
      overflow-wrap: anywhere;

      &:hover {
        color: var(--rs-blue);
      }
    }

    &__per {
      font-size: 13px;
      color: var(--rs-muted);
    }

    &__sum {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  .rsk-optsum {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 0;
    font-size: 15px;

    span {
      color: var(--rs-muted);
    }

    b {
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
  }

  .rsk-clear {
    justify-self: start;
    margin-top: 14px;
    font-size: 14px;
  }

  .rsk-side {
    position: sticky;
    top: 140px;
    display: grid;
    gap: 14px;
    padding: 24px;
    border-radius: var(--rs-r-lg);
    background: #fff;
    box-shadow: inset 0 0 0 1px var(--rs-line);

    .rs-mode {
      background: var(--rs-ice);
    }
  }

  .rsk-total {
    display: grid;
    gap: 6px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--rs-line);

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;

      span {
        color: var(--rs-muted);
      }

      b {
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
    }

    &__sum b {
      font-size: 24px;
    }

    &__hint {
      font-size: 13px;
      color: var(--rs-muted);
    }
  }

  .rsk-fine {
    font-size: 13px;
    color: var(--rs-muted);
  }

  .rsk-err {
    font-size: 12px;
    color: #b2401f;
  }

  @media (max-width: 1024px) {
    .rsk-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .rsk-side {
      position: static;
    }
  }

  // Телефон: фото, название и корзинка в первой строке; счётчик фиксированной ширины
  // и сумма справа — во второй, поэтому строки выровнены между собой.
  @media (max-width: 680px) {
    .rsk-tabs {
      display: grid;
      width: 100%;
    }

    .rsk-line {
      grid-template-columns: 64px minmax(0, 1fr) 40px;
      gap: 10px 12px;
      align-items: start;

      &__photo img {
        width: 64px;
        height: 64px;
      }

      &__info {
        grid-column: 2;
      }

      &__drop {
        grid-column: 3;
        grid-row: 1;
        width: 40px;
        height: 40px;
      }

      &__qty {
        grid-column: 1 / 3;
        grid-row: 2;
        width: 150px;
      }

      &__sum {
        grid-column: 2 / 4;
        grid-row: 2;
        align-self: center;
        justify-self: end;
      }

      &--opt {
        grid-template-columns: minmax(0, 1fr) 40px;

        .rsk-line__info {
          grid-column: 1;
        }

        .rsk-line__drop {
          grid-column: 2;
        }

        .rsk-line__qty {
          grid-column: 1;
        }

        .rsk-line__sum {
          grid-column: 1 / 3;
        }
      }
    }

    .rsk-side {
      padding: 18px;
    }
  }

  // Совсем узко: сумма-диапазон за несколько рыб не должна упираться в счётчик.
  @media (max-width: 360px) {
    .rsk-line__qty {
      width: 118px;
    }

    .rsk-line__sum {
      font-size: 13px;
    }
  }
}
</style>
