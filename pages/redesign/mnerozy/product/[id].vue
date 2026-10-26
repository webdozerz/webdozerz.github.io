<script lang="ts" setup>
import MrIcon from '~/components/redesign/mnerozy/MrIcon.vue'
import MrCard from '~/components/redesign/mnerozy/MrCard.vue'
import MrQty from '~/components/redesign/mnerozy/MrQty.vue'

const route = useRoute()
const shop = useMnerozyShop()
const ui = useMnerozyUi()

const product = computed(() => mrFind(String(route.params.id)))
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Товар не найден', fatal: false })
const p = computed(() => product.value!)
const section = computed(() => mrFindSection(p.value.sec)!)

useSeoMeta({ title: () => `${p.value.title} — купить с доставкой по Томску | Мне розы, концепт редизайна` })

// Выбор вариантов: индекс значения в каждой группе («Цвет», «Оформление», «Длина стебля»).
const picks = ref<number[]>([])
watch(
  () => p.value.id,
  () => (picks.value = (p.value.opts ?? []).map(() => 0)),
  { immediate: true },
)
const pick = computed(() => picks.value.join('-'))
const price = computed(() => mrPrice(p.value, pick.value))
const key = computed(() => shop.keyOf(p.value.id, pick.value))
const isGift = computed(() => p.value.sec === 'podarki')

const text = computed(() => p.value.text ?? p.value.short ?? '')
const related = computed(() => mrProducts.filter((x) => x.sec === p.value.sec && x.id !== p.value.id).slice(0, 4))
const gifts = ['konfety-raffaello', 'sharik-krasnoe-serdce', 'medvezhonok-mini', 'konfety-ferrero-rocher']
  .map((id) => mrFind(id))
  .filter((x): x is MrProduct => Boolean(x))

const share = async () => {
  const url = window.location.href
  try {
    if (navigator.share) await navigator.share({ title: p.value.title, url })
    else {
      await navigator.clipboard.writeText(url)
      ui.say('Ссылка скопирована')
    }
  } catch {
    /* отмена */
  }
}
</script>

<template>
  <div class="mr-wrap">
    <nav class="mr-crumbs" aria-label="Навигация">
      <NuxtLink :to="mrPath()">Главная</NuxtLink>
      <span><NuxtLink :to="mrPath('/catalog')">Каталог</NuxtLink></span>
      <span><NuxtLink :to="mrPath(`/catalog/${section.id}`)">{{ section.title }}</NuxtLink></span>
    </nav>

    <div class="mr-prod">
      <div class="mr-prod__photo">
        <img :src="p.img" :alt="p.title" width="800" height="800" />
        <span v-if="p.promo" class="mr-prod__badge">Акция</span>
        <button
          type="button"
          class="mr-prod__fav"
          :class="{ 'is-on': shop.isFav(p.id) }"
          :aria-label="shop.isFav(p.id) ? 'Убрать из избранного' : 'В избранное'"
          @click="shop.toggleFav(p.id)"
        >
          <MrIcon name="heart" />
        </button>
      </div>

      <div class="mr-prod__info">
        <p class="mr-prod__stock"><MrIcon name="check" :size="16" /> В наличии</p>
        <h1>{{ p.title }}</h1>
        <p v-if="p.short && p.short !== text" class="mr-prod__short">{{ p.short }}</p>

        <div v-for="(o, gi) in p.opts ?? []" :key="o.title" class="mr-prod__opt">
          <p class="mr-prod__label">
            {{ o.title }} <span>{{ o.values[picks[gi]]?.label.toLowerCase() }}</span>
          </p>
          <div class="mr-prod__vals">
            <button
              v-for="(v, vi) in o.values"
              :key="v.label"
              type="button"
              class="mr-chip"
              :class="{ 'is-on': picks[gi] === vi }"
              @click="picks[gi] = vi"
            >
              {{ v.label }}<small v-if="v.add">+{{ v.add }} ₽</small>
            </button>
          </div>
        </div>

        <div class="mr-prod__buy">
          <p class="mr-prod__price">{{ mrRub(price) }}</p>
          <MrQty :k="key" kind="big" />
        </div>
        <div class="mr-prod__alt">
          <a :href="mrContacts.whatsapp" target="_blank" rel="noopener" class="mr-btn mr-btn--line">
            <img :src="mrContacts.icons.whatsapp" alt="" width="22" height="22" /> Заказать в WhatsApp
          </a>
          <button type="button" class="mr-btn mr-btn--line" @click="share"><MrIcon name="send" :size="19" /> Поделиться</button>
        </div>

        <ul class="mr-prod__free">
          <li v-for="f in mrFree" :key="f.title">
            <MrIcon :name="f.icon" :size="20" />
            <span><b>{{ f.title }}</b> {{ f.text }}</span>
          </li>
        </ul>

        <div class="mr-prod__ratings">
          <a v-for="r in mrRatings" :key="r.title" :href="r.href" target="_blank" rel="noopener">
            <MrIcon name="star" :size="16" />
            <b>{{ r.value }}</b> {{ r.title }}
          </a>
        </div>
      </div>
    </div>

    <section class="mr-section mr-prod__more">
      <div v-if="text" class="mr-prod__text">
        <h2>Описание</h2>
        <p>{{ text }}</p>
        <p v-if="!isGift" class="mr-prod__note">
          Цветы — скоропортящийся товар: обмену и возврату не подлежат. Отменить заказ можно в течение 60 минут после оформления.
        </p>
      </div>
      <div class="mr-prod__deliv">
        <h2>Доставка</h2>
        <ul>
          <li v-for="z in mrZones.slice(0, 4)" :key="z.id">
            <span>{{ z.title }}</span>
            <b :class="{ 'is-free': !z.price }">{{ z.price ? mrRub(z.price) : 'бесплатно, за час' }}</b>
          </li>
          <li>
            <span>Самовывоз: Учебная, 8 или Усова, 4</span>
            <b class="is-free">бесплатно</b>
          </li>
        </ul>
        <NuxtLink :to="mrPath('/delivery')">Все зоны и способы оплаты</NuxtLink>
      </div>
    </section>

    <section v-if="!isGift" class="mr-section">
      <div class="mr-head">
        <h2>Добавить к букету</h2>
        <NuxtLink :to="mrPath('/catalog/podarki')">Все подарки <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-grid">
        <MrCard v-for="g in gifts" :key="g.id" :p="g" />
      </div>
    </section>

    <section v-if="related.length" class="mr-section">
      <div class="mr-head">
        <h2>{{ section.title }}</h2>
        <NuxtLink :to="mrPath(`/catalog/${section.id}`)">Весь раздел <MrIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mr-grid">
        <MrCard v-for="r in related" :key="r.id" :p="r" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.mr-prod {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 48px;
  padding-top: 20px;
  align-items: start;

  &__photo {
    position: sticky;
    top: 170px;
    border-radius: var(--mr-r-panel);
    overflow: hidden;
    background: var(--mr-surface);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
    }
  }

  &__badge {
    position: absolute;
    left: 16px;
    top: 16px;
    padding: 5px 12px;
    border-radius: 8px;
    background: var(--mr-accent);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
  }

  &__fav {
    position: absolute;
    top: 14px;
    right: 14px;
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.94);

    &.is-on {
      color: var(--mr-accent);

      :deep(path) {
        fill: currentColor;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;

    h1 {
      font-size: 34px;
    }
  }

  &__stock {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: -8px;
    color: var(--mr-green);
    font-size: 14px;
    font-weight: 600;
  }

  &__short {
    color: var(--mr-muted);
  }

  &__opt {
    display: grid;
    gap: 8px;
  }

  &__label {
    font-size: 14px;
    font-weight: 700;

    span {
      margin-left: 4px;
      color: var(--mr-muted);
      font-weight: 500;
    }
  }

  &__vals {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .mr-chip {
      height: auto;
      min-height: 38px;
      padding: 6px 12px;
      white-space: normal;
      text-align: left;
    }
  }

  &__buy {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    padding: 18px 0;
    border-top: 1px solid var(--mr-line);
    border-bottom: 1px solid var(--mr-line);
  }

  &__price {
    min-width: 150px;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__alt {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .mr-btn {
      height: 44px;
      font-size: 14px;
    }
  }

  &__free {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px;
      border-radius: var(--mr-r);
      background: var(--mr-surface);
      font-size: 13px;
      line-height: 1.4;
      color: var(--mr-muted);
    }

    svg {
      flex: none;
      color: var(--mr-accent);
    }

    b {
      display: block;
      color: var(--mr-ink);
      font-weight: 700;
    }
  }

  &__ratings {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 36px;
      padding: 0 12px;
      border-radius: var(--mr-r);
      border: 1px solid var(--mr-line);
      font-size: 13px;

      svg {
        color: #f2a20c;
        fill: currentColor;
      }

      &:hover {
        border-color: var(--mr-ink);
      }
    }
  }

  &__more {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 48px;

    h2 {
      margin-bottom: 14px;
      font-size: 24px;
    }
  }

  &__text {
    p {
      max-width: 720px;
      white-space: pre-line;
    }
  }

  &__note {
    margin-top: 14px;
    color: var(--mr-muted);
    font-size: 14px;
  }

  &__deliv {
    padding: 22px;
    border-radius: var(--mr-r-panel);
    background: var(--mr-surface);

    ul {
      display: grid;
      margin-bottom: 14px;
    }

    li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      font-size: 14px;

      & + li {
        border-top: 1px solid var(--mr-line-strong);
      }

      b {
        flex: none;
        font-weight: 700;
        white-space: nowrap;

        &.is-free {
          color: var(--mr-green);
        }
      }
    }

    a {
      color: var(--mr-accent);
      font-weight: 700;
    }
  }
}

@media (max-width: 1199px) {
  .mr-prod {
    gap: 32px;

    &__info h1 {
      font-size: 28px;
    }
  }
}

@media (max-width: 989px) {
  .mr-prod {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      position: relative;
      top: 0;
      max-width: 620px;
    }

    &__more {
      grid-template-columns: minmax(0, 1fr);
      gap: 32px;
    }
  }
}

@media (max-width: 576px) {
  .mr-prod {
    gap: 20px;
    padding-top: 14px;

    &__info {
      gap: 16px;

      h1 {
        font-size: 24px;
      }
    }

    &__price {
      font-size: 28px;
      min-width: 0;
    }

    &__buy {
      gap: 12px;

      .mr-qty {
        flex: 1 1 100%;
        justify-content: space-between;

        :deep(.mr-qty__add) {
          width: 100%;
        }
      }
    }

    &__alt .mr-btn {
      flex: 1 1 100%;
    }

    &__free {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
