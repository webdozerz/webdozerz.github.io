<script lang="ts" setup>
import RsBuy from '~/components/redesign/rybasibiri/RsBuy.vue'
import RsProductCard from '~/components/redesign/rybasibiri/RsProductCard.vue'

const route = useRoute()
const cart = useRybasibiriCart()
const product = computed(() => rsFind(String(route.params.id)))
const category = computed(() => (product.value ? rsCategory(product.value.cat) : undefined))
const stock = computed(() => (product.value ? rsInStock(product.value) : false))

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })
}

const specs = computed(() => {
  const p = product.value!
  const rows: [string, string][] = [['Раздел', category.value?.label ?? '']]
  if (p.sub) rows.push(['Разделка и вид', p.sub])
  rows.push(['Цена', `${rsRub(p.price)} ${rsPer(p)}`])
  if (p.unit === 'g100') rows.push(['За килограмм', rsRub(rsPerKg(p))])
  if (p.weight) rows.push(['Вес рыбы', rsWeightLabel(p).replace('рыба ', '')])
  if (p.pack && p.pack !== 'упаковка') rows.push(['Упаковка', p.pack])
  if (p.note) rows.push(['Примечание', p.note])
  return rows
})

const related = computed(() =>
  rsProducts.filter((p) => p.cat === product.value!.cat && p.id !== product.value!.id && rsInStock(p)).slice(0, 4),
)

const copied = ref(false)
const share = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch {
    /* буфер обмена может быть недоступен */
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2500)
}

useSeoMeta({
  title: () => `${product.value ? rsTitle(product.value) : 'Товар'} | «Стиль Продукт», концепт`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div v-if="product" class="rs-wrap rsp">
    <nav class="rs-crumbs rsp-crumbs" aria-label="Навигация">
      <NuxtLink :to="rsPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="rsPath('/catalog')">Магазин</NuxtLink>
      <template v-if="category">
        <span aria-hidden="true">/</span>
        <NuxtLink :to="rsPath(`/catalog/${category.id}`)">{{ category.label }}</NuxtLink>
      </template>
    </nav>

    <div class="rsp-layout">
      <div class="rsp-photo" :class="{ 'is-out': !stock }">
        <img :src="rsImg(product.img, 900)" :alt="rsTitle(product)" width="900" height="900" />
        <span v-if="product.badge" class="rs-badge rsp-photo__badge" :class="{ 'rs-badge--new': product.badge === 'new' }">
          {{ rsBadges[product.badge] }}
        </span>
      </div>

      <div class="rsp-info">
        <h1>{{ product.name }}</h1>
        <p v-if="product.sub" class="rsp-sub">{{ product.sub }}</p>

        <div class="rsp-status">
          <span v-if="stock" class="rsp-status__ok">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            В наличии
          </span>
          <span v-else class="rs-badge rs-badge--out">Нет в наличии</span>
          <button
            type="button"
            class="rsp-status__fav"
            :class="{ 'is-on': cart.isFav(product.id) }"
            :aria-pressed="cart.isFav(product.id)"
            @click="cart.toggleFav(product.id)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
            {{ cart.isFav(product.id) ? 'В избранном' : 'В избранное' }}
          </button>
          <button type="button" class="rsp-status__fav" @click="share">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M8 12h8M14 7l5 5-5 5M5 5v14" />
            </svg>
            {{ copied ? 'Ссылка скопирована' : 'Поделиться' }}
          </button>
        </div>

        <div v-if="stock" class="rsp-price">
          <div class="rsp-price__main">
            <b>{{ rsRub(product.price) }}</b>
            <s v-if="product.old">{{ rsRub(product.old) }}</s>
            <span class="rs-card__per">{{ rsPer(product) }}</span>
          </div>
          <p v-if="product.unit === 'g100'" class="rs-muted">
            Это {{ rsRub(rsPerKg(product)) }} за килограмм. Берёте на вес — шаг 0,5 кг.
          </p>
          <p v-else-if="product.unit === 'whole'" class="rs-muted">
            Продаём рыбу целиком: {{ rsWeightLabel(product) }}, поэтому сумма примерная. Точную скажем после взвешивания.
          </p>
          <p v-else-if="product.unit === 'kg'" class="rs-muted">Весовой товар, от 1 кг с шагом 0,5 кг.</p>
        </div>

        <RsBuy :product="product" variant="page" class="rsp-buy" />

        <div class="rsp-how">
          <h2>Как получить заказ</h2>
          <p>
            Оформите заказ на сайте — менеджер перезвонит и согласует, когда и как его забрать или
            привезти. Можно заказать и сообщением во
            <a :href="rsContacts.vk" target="_blank" rel="noopener" class="rs-link">ВКонтакте</a>.
          </p>
          <a :href="rsContacts.phoneHref" class="rs-link">{{ rsContacts.phone }}</a>
        </div>

        <dl class="rsp-specs">
          <div v-for="[k, v] in specs" :key="k">
            <dt>{{ k }}</dt>
            <dd>{{ v }}</dd>
          </div>
        </dl>

        <p class="rsp-opt">
          Нужно от 10 кг для кафе, магазина или школы?
          <NuxtLink :to="rsPath('/opt')" class="rs-link">Оптовый прайс</NuxtLink>
        </p>
      </div>
    </div>

    <section v-if="related.length" class="rs-section">
      <div class="rs-head">
        <h2>Ещё в разделе «{{ category?.label }}»</h2>
        <NuxtLink :to="rsPath(`/catalog/${product.cat}`)" class="rs-link">Весь раздел</NuxtLink>
      </div>
      <div class="rs-grid">
        <RsProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.rs .rsp {
  .rsp-crumbs {
    padding-top: 24px;
  }

  .rsp-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;
    align-items: start;
  }

  .rsp-photo {
    position: sticky;
    top: 140px;
    overflow: hidden;
    border-radius: 24px;
    background: var(--rs-ice);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
      mix-blend-mode: multiply;
    }

    &.is-out img {
      opacity: 0.55;
      filter: grayscale(0.5);
    }

    &__badge {
      position: absolute;
      top: 16px;
      left: 16px;
    }
  }

  .rsp-info {
    display: grid;
    gap: 18px;
    min-width: 0;

    h1 {
      font-size: clamp(28px, 3.4vw, 40px);
    }
  }

  .rsp-sub {
    margin-top: -10px;
    font-size: 17px;
    color: var(--rs-muted);
  }

  .rsp-status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 18px;
    font-size: 14px;

    &__ok {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--rs-green);
      font-weight: 600;
    }

    &__fav {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--rs-muted);
      transition: color 0.15s;

      &:hover {
        color: var(--rs-blue);
      }

      &.is-on {
        color: var(--rs-salmon);

        svg {
          fill: currentColor;
        }
      }
    }
  }

  .rsp-price {
    display: grid;
    gap: 6px;
    padding: 20px;
    border-radius: var(--rs-r-lg);
    background: var(--rs-ice);

    &__main {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px 12px;

      b {
        font-size: 34px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }

      s {
        color: var(--rs-muted);
      }

      .rs-card__per {
        background: #fff;
        font-size: 13px;
      }
    }

    p {
      font-size: 14px;
    }
  }

  .rsp-how {
    display: grid;
    justify-items: start;
    gap: 8px;
    padding: 20px;
    border-radius: var(--rs-r-lg);
    box-shadow: inset 0 0 0 1px var(--rs-line);

    h2 {
      font-size: 17px;
    }

    p {
      font-size: 14px;
      color: var(--rs-muted);
    }
  }

  dl.rsp-specs {
    display: grid;

    div {
      display: grid;
      grid-template-columns: 160px minmax(0, 1fr);
      gap: 12px;
      padding: 11px 0;
      border-bottom: 1px solid var(--rs-line);
      font-size: 14px;
    }

    dt {
      color: var(--rs-muted);
    }
  }

  .rsp-opt {
    font-size: 14px;
    color: var(--rs-muted);
  }

  @media (max-width: 860px) {
    .rsp-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    .rsp-photo {
      position: relative;
      top: 0;
    }
  }

  @media (max-width: 520px) {
    .rsp-buy .rs-buy__row {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    dl.rsp-specs div {
      grid-template-columns: 120px minmax(0, 1fr);
    }
  }
}
</style>
