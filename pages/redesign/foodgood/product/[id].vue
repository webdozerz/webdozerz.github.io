<script lang="ts" setup>
import FgCard from '~/components/redesign/foodgood/FgCard.vue'
import FgBuy from '~/components/redesign/foodgood/FgBuy.vue'

const route = useRoute()
const product = computed(() => fgFindProduct(String(route.params.id)))

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: true })
}

const p = computed(() => product.value!)
const category = computed(() => fgCategoryOf(p.value.category))
const discount = computed(() => fgDiscount(p.value))
const similar = computed(() => fgOf(p.value.category).filter((x) => x.id !== p.value.id).slice(0, 5))
const isGift = computed(() => p.value.category === 'gift')

const today = ref<{ today: boolean; text: string } | null>(null)
onMounted(() => (today.value = fgTodayLabel()))

useSeoMeta({ title: () => `${p.value.name} | FoodGood Tomsk` })
</script>

<template>
  <div class="fg-wrap">
    <nav class="fg-crumbs crumbs" aria-label="Навигация">
      <NuxtLink :to="fgPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="fgPath('/catalog')">Каталог</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="fgPath(`/catalog/${category.id}`)">{{ category.short }}</NuxtLink>
    </nav>

    <div class="item">
      <div class="item__photo">
        <img :src="p.image" :alt="p.name" />
        <span v-if="discount" class="item__sale">−{{ discount }}%</span>
      </div>

      <div class="item__info">
        <h1>{{ p.name }}</h1>
        <ul class="item__meta">
          <li>{{ p.pack }}</li>
          <li v-if="p.origin">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21z" />
            </svg>
            {{ p.origin }}
          </li>
          <li class="item__stock">В наличии</li>
        </ul>

        <div class="item__buybox">
          <div class="item__price">
            <strong class="fg-price" :class="{ 'is-sale': discount }">{{ fgFormatPrice(p.price) }}</strong>
            <s v-if="p.oldPrice" class="fg-price">{{ fgFormatPrice(p.oldPrice) }}</s>
          </div>
          <p v-if="p.perKg" class="item__note">
            Весовой товар: цена за 1 кг, точную сумму назовём после взвешивания.
          </p>
          <FgBuy :product="p" large class="item__buy" />
          <NuxtLink :to="fgPath('/cart')" class="fg-link item__tocart">Перейти в корзину</NuxtLink>
        </div>

        <ul class="item__terms">
          <li>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>
            <span>
              <strong>{{ today && !today.today ? 'Доставка завтра' : 'Доставка сегодня' }}</strong>
              заказы на текущий день принимаем до 18:00 · по Томску 300 ₽, от 5 000 ₽ бесплатно
            </span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
            </svg>
            <span>
              <strong>Самовывоз бесплатно</strong>
              {{ fgContacts.address }}, ежедневно 11:00–20:00
            </span>
          </li>
        </ul>

        <div v-if="isGift" class="fg-panel item__gift">
          <h2>Как работает сертификат</h2>
          <ul>
            <li>Любая продукция из наличия в магазине или в интернет-магазине.</li>
            <li>Тематическая открытка в комплекте, доставим бесплатно, если нужно.</li>
            <li>Действует 6 месяцев с момента покупки.</li>
            <li>
              Используется один раз: на всю сумму или на большую с доплатой. Сдача не выдаётся,
              обмен на деньги и оплата доставки сертификатом не предусмотрены.
            </li>
          </ul>
        </div>

        <a :href="fgOriginalHref(p.id)" target="_blank" rel="noopener" class="item__orig">
          Этот товар на сайте магазина
        </a>
      </div>
    </div>

    <section v-if="similar.length" class="fg-section">
      <div class="fg-head">
        <h2>Ещё в разделе «{{ category.short }}»</h2>
        <NuxtLink :to="fgPath(`/catalog/${category.id}`)" class="fg-link">Весь раздел</NuxtLink>
      </div>
      <div class="fg-grid similar">
        <FgCard v-for="s in similar" :key="s.id" :product="s" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.crumbs {
  padding-top: 24px;
}

.item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: start;

  &__photo {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1;
    border-radius: 28px;
    background: var(--fg-sage);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__sale {
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 4px 12px;
    border-radius: 10px;
    background: var(--fg-sale);
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 20px;

    h1 {
      font-size: clamp(28px, 3.4vw, 40px);
      line-height: 1.1;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: -6px;

    li {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 8px;
      background: var(--fg-sage);
      font-size: 15px;

      svg {
        color: var(--fg-leaf);
      }
    }
  }

  &__stock {
    color: var(--fg-leaf-d);
    font-weight: 500;
  }

  &__buybox {
    display: grid;
    gap: 14px;
    padding: 24px;
    border-radius: 22px;
    box-shadow: inset 0 0 0 1px var(--fg-line);
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 12px;

    strong {
      font-size: 36px;
      font-weight: 600;
      letter-spacing: -0.02em;

      &.is-sale {
        color: var(--fg-sale-d);
      }
    }

    s {
      color: var(--fg-muted);
      font-size: 20px;
    }
  }

  &__note {
    color: var(--fg-muted);
    font-size: 15px;
  }

  &__tocart {
    justify-self: center;
    font-size: 15px;
  }

  &__terms {
    display: grid;
    gap: 14px;

    li {
      display: flex;
      gap: 14px;
      color: var(--fg-muted);
      line-height: 1.4;
    }

    svg {
      color: var(--fg-leaf);
      margin-top: 1px;
    }

    strong {
      display: block;
      color: var(--fg-ink);
      font-weight: 600;
    }
  }

  &__gift {
    h2 {
      margin-bottom: 12px;
      font-size: 20px;
    }

    ul {
      display: grid;
      gap: 8px;
      padding-left: 18px;
      list-style: disc;
    }
  }

  &__orig {
    color: var(--fg-muted);
    font-size: 14px;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: var(--fg-leaf);
    }
  }
}

.similar {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

@media (max-width: 1100px) {
  .similar {
    grid-template-columns: repeat(4, minmax(0, 1fr));

    > :nth-child(5) {
      display: none;
    }
  }
}

@media (max-width: 860px) {
  .item {
    grid-template-columns: 1fr;
  }

  .item__photo {
    max-width: 560px;
  }

  .crumbs {
    padding-top: 16px;
  }
}

@media (max-width: 760px) {
  .similar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 10px;
  }

  .item__buybox {
    padding: 18px;
  }
}
</style>
