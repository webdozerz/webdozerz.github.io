<script lang="ts" setup>
import SnBuy from '~/components/redesign/sanych/SnBuy.vue'
import SnProductCard from '~/components/redesign/sanych/SnProductCard.vue'

const route = useRoute()
const product = computed(() => snFind(String(route.params.id)))
const category = computed(() => (product.value ? snCategory(product.value.cat) : undefined))
const delivery = ref(snTomorrow())
onMounted(() => (delivery.value = snTomorrow()))

const facts = computed(() => {
  const p = product.value
  if (!p) return []
  const list: { label: string; value: string }[] = [{ label: 'Цена', value: `${snRub(p.price)} ${snPer(p)}` }]
  if (p.piece) list.push({ label: 'Вес куска', value: snPieceLabel(p).replace('кусок ', '') })
  if (p.unit === 'set') list.push({ label: 'Минимум', value: 'набор от 12 кг' })
  if (p.min) list.push({ label: 'Минимальный заказ', value: `${p.min} кг` })
  if (p.unit === 'kg' && !p.min) list.push({ label: 'Шаг', value: '0,5 кг' })
  if (p.cut) list.push({ label: 'Разделка', value: 'куском или нарубить' })
  if (p.cat !== 'grill' && p.cat !== 'sets') list.push({ label: 'Состояние', value: 'охлаждённое' })
  list.push({ label: 'Происхождение', value: 'фермы Новосибирской области' })
  return list
})

const related = computed(() =>
  product.value ? snOf(product.value.cat).filter((p) => p.id !== product.value!.id).slice(0, 4) : [],
)
const recipe = computed(() => snRecipes.find((r) => r.meat === product.value?.id))

useSeoMeta({
  title: () => `${product.value?.name ?? 'Товар'} | Мясная лавка «Саныч», концепт`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div v-if="product" class="sn-wrap snp">
    <nav class="sn-crumbs snp-crumbs" aria-label="Навигация">
      <NuxtLink :to="snPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="snPath('/catalog')">Каталог</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="snPath(`/catalog/${product.cat}`)">{{ category?.label }}</NuxtLink>
    </nav>

    <div class="snp-main">
      <div class="snp-photo">
        <img :src="snImg(product.img)" :alt="product.name" width="720" height="540" />
      </div>

      <div class="snp-info">
        <h1>{{ product.name }}</h1>
        <div class="snp-price">
          <b>{{ snRub(product.price) }}</b>
          <span>{{ snPer(product) }}</span>
          <span v-if="product.piece" class="snp-piece">{{ snPieceLabel(product) }}</span>
        </div>
        <p v-if="product.note || category?.lead" class="snp-lead">{{ product.note ?? category?.lead }}</p>

        <SnBuy :key="product.id" :product="product" variant="page" />

        <div class="snp-delivery">
          <div>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>
            <span v-if="product.cat === 'grill'"><b>Привезём за 25–45 минут</b> горячим, доставка бесплатная</span>
            <span v-else><b>Привезём завтра, {{ delivery.day }}</b> — утром позвоним и согласуем время</span>
          </div>
          <div>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
            </svg>
            <span>Бесплатно до подъезда от {{ snRub(snRules.freeFrom) }} или {{ snRules.freeKg }} кг, заказ от {{ snRub(snRules.minOrder) }}</span>
          </div>
          <div v-if="product.unit !== 'portion' && product.unit !== 'pack'">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 5h14v14H5zM9 9h6M9 13h6M9 17h3" />
            </svg>
            <span>{{ snRules.overweight }} — точную сумму пришлём SMS, когда соберём заказ</span>
          </div>
        </div>
      </div>
    </div>

    <section class="snp-details">
      <div>
        <h2>Характеристики</h2>
        <dl class="snp-facts">
          <div v-for="f in facts" :key="f.label">
            <dt>{{ f.label }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>
      </div>
      <div v-if="recipe" class="snp-recipe">
        <img :src="snImg(recipe.img)" :alt="recipe.title" loading="lazy" width="340" height="255" />
        <div>
          <span class="sn-muted">Рецепт из этого мяса</span>
          <h3>{{ recipe.title }}</h3>
          <ul>
            <li v-for="item in recipe.items.slice(0, 4)" :key="item">{{ item }}</li>
          </ul>
          <NuxtLink :to="snPath('/recipes')" class="sn-link">Все рецепты</NuxtLink>
        </div>
      </div>
      <div v-else class="snp-ask">
        <h3>Нужна другая разделка?</h3>
        <p>Напишите, как разрубить: на суп, на плов, порционно. Или спросите про кусок, которого нет на сайте.</p>
        <div class="snp-ask__actions">
          <a :href="snContacts.whatsapp" target="_blank" rel="noopener" class="sn-btn sn-btn--line">WhatsApp</a>
          <a :href="snContacts.phoneHref" class="sn-btn sn-btn--line">{{ snContacts.phone }}</a>
        </div>
      </div>
    </section>

    <section v-if="related.length" class="snp-related">
      <div class="sn-sechead">
        <h2>Ещё из раздела «{{ category?.label }}»</h2>
        <NuxtLink :to="snPath(`/catalog/${product.cat}`)" class="sn-link">Весь раздел</NuxtLink>
      </div>
      <div class="snp-related__grid">
        <SnProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </section>
  </div>

  <div v-else class="sn-wrap sn-pagehead">
    <h1>Товар не найден</h1>
    <p>Возможно, его уже нет в продаже. <NuxtLink :to="snPath('/catalog')" class="sn-link">Перейти в каталог</NuxtLink></p>
  </div>
</template>

<style lang="scss">
.sn .snp-crumbs {
  padding-top: 20px;
}

.sn .snp-main {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.sn .snp-photo {
  overflow: hidden;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }
}

.sn .snp-info {
  display: grid;
  gap: 18px;
  min-width: 0;

  h1 {
    font-size: clamp(26px, 3.4vw, 38px);
    overflow-wrap: anywhere;
  }
}

.sn .snp-price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;

  b {
    font-family: var(--sn-head);
    font-size: 32px;
    font-weight: 600;
    color: var(--sn-red);
  }

  span {
    color: var(--sn-muted);
  }
}

.sn .snp-piece {
  padding: 3px 10px;
  border-radius: 8px;
  background: var(--sn-paper);
  color: var(--sn-ink) !important;
  font-size: 14px;
  font-weight: 700;
}

.sn .snp-lead {
  color: var(--sn-muted);
}

.sn .snp-delivery {
  display: grid;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 16px;
  background: var(--sn-paper);
  font-size: 14px;
  color: var(--sn-muted);

  > div {
    display: flex;
    gap: 10px;
  }

  svg {
    color: var(--sn-green);
  }

  b {
    color: var(--sn-ink);
  }
}

.sn .snp-details {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 40px;
  margin-top: 48px;

  h2 {
    font-size: 22px;
    margin-bottom: 14px;
  }
}

.sn .snp-facts {
  display: grid;

  > div {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 16px;
    padding: 11px 0;
    border-bottom: 1px solid var(--sn-line);
  }

  dt {
    color: var(--sn-muted);
  }

  dd {
    font-weight: 600;
  }
}

.sn .snp-recipe {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 18px;
  align-self: start;
  padding: 16px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 14px;
  }

  > div {
    display: grid;
    align-content: start;
    gap: 6px;
    font-size: 14px;
  }

  h3 {
    font-size: 18px;
  }

  ul {
    padding-left: 18px;
    color: var(--sn-muted);
  }
}

.sn .snp-ask {
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 22px;
  border-radius: var(--sn-r-lg);
  background: var(--sn-paper);

  h3 {
    font-size: 18px;
  }

  p {
    color: var(--sn-muted);
  }
}

.sn .snp-ask__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sn .snp-related {
  margin-top: 56px;
}

.sn .snp-related__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 960px) {
  .sn .snp-main,
  .sn .snp-details {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .sn .snp-related__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .sn .snp-details {
    margin-top: 32px;
  }

  .sn .snp-recipe {
    grid-template-columns: 96px minmax(0, 1fr);
  }

  .sn .snp-related__grid {
    gap: 8px;
  }

  .sn .snp-related__grid .sn-card {
    padding: 6px 6px 10px;
  }

}
</style>
