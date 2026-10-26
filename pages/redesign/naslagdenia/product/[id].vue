<script lang="ts" setup>
import NsIcon from '~/components/redesign/naslagdenia/NsIcon.vue'
import NsCard from '~/components/redesign/naslagdenia/NsCard.vue'
import NsQty from '~/components/redesign/naslagdenia/NsQty.vue'
import NsCalc from '~/components/redesign/naslagdenia/NsCalc.vue'

const route = useRoute()
const order = useNaslagdeniaOrder()
const ui = useNaslagdeniaUi()
const product = computed(() => nsFind(String(route.params.id)))
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Торт не найден' })
const p = computed(() => product.value!)
const section = computed(() => nsSection(p.value.section))
const custom = computed(() => nsIsCustom(p.value))
const others = computed(() => nsProducts.filter((x) => x.section === p.value.section && x.id !== p.value.id).slice(0, 4))
const labelText: Record<string, string> = { hit: 'Популярный', new: 'Новинка', order: 'Под заказ' }

const eta = ref<ReturnType<typeof nsReadyEta> | null>(null)
onMounted(() => (eta.value = nsReadyEta()))

const add = () => {
  order.add(p.value)
  ui.say(`${nsShort(p.value)} — в заказе`)
}
const quick = () => ui.openQuick(custom.value ? `${p.value.title}, вес — кг, к дате —` : p.value.title)

useSeoMeta({ title: () => `${p.value.title} — кондитерская «Наслаждение» | Концепт редизайна` })
</script>

<template>
  <div class="ns-wrap ns-prod">
    <nav class="ns-crumbs" aria-label="Навигация">
      <NuxtLink :to="nsPath()">Главная</NuxtLink>
      <span>/</span>
      <NuxtLink :to="nsPath(`/catalog/${section.id}`)">{{ section.title }}</NuxtLink>
      <span>/</span>
      <span>{{ nsShort(p) }}</span>
    </nav>

    <div class="ns-prod__grid">
      <div class="ns-prod__photo">
        <img :src="p.img" :alt="p.title" width="1200" height="880" />
        <span v-if="p.labels?.length" class="ns-card__labels">
          <span v-for="l in p.labels" :key="l" class="ns-label" :class="`ns-label--${l}`">{{ labelText[l] }}</span>
        </span>
      </div>

      <div class="ns-prod__info">
        <span class="ns-prod__section"><NsIcon :name="section.icon" :size="18" /> {{ section.title }}</span>
        <h1>{{ p.title.replace(/"/g, '') }}</h1>

        <template v-if="custom">
          <div class="ns-prod__price">
            <b>{{ nsMoney(p.price) }}</b>
            <span>за 1 кг</span>
          </div>
          <p class="ns-prod__note">
            <NsIcon name="info" :size="20" />
            <span>На фото — вид будущего торта. Начинку выбираете из наших готовых тортов, менеджер перезвонит и уточнит детали.</span>
          </p>
          <NsCalc :key="p.id" :product="p" />
        </template>

        <template v-else>
          <p v-if="p.desc" class="ns-prod__desc">{{ p.desc }}</p>
          <dl class="ns-prod__specs">
            <template v-if="p.box">
              <div>
                <dt>В коробке</dt>
                <dd>{{ p.box }} шт</dd>
              </div>
              <div>
                <dt>Одно пирожное</dt>
                <dd>{{ p.weight }} · {{ nsMoney(p.piece!) }}</dd>
              </div>
            </template>
            <div v-else-if="p.weight">
              <dt>Вес</dt>
              <dd>{{ p.weight }}</dd>
            </div>
            <div v-if="p.labels?.includes('order')">
              <dt>Наличие</dt>
              <dd>Под заказ — уточнит менеджер</dd>
            </div>
          </dl>
          <div class="ns-prod__buy">
            <div class="ns-prod__price">
              <b>{{ nsMoney(p.price) }}</b>
              <span>{{ p.box ? `за коробку ${p.box} шт` : `за торт ${p.weight ?? ''}` }}</span>
            </div>
            <NsQty v-if="order.qty(p.id)" :id="p.id" class="ns-qty--big" :unit="p.box ? 'кор' : 'шт'" />
            <button v-else type="button" class="ns-btn ns-btn--main ns-btn--lg" @click="add">
              <NsIcon name="plus" :size="20" />
              <span>В заказ</span>
            </button>
          </div>
          <NuxtLink v-if="order.qty(p.id)" :to="nsPath('/zakaz')" class="ns-prod__go"
            >Перейти к заказу <NsIcon name="arrow" :size="18"
          /></NuxtLink>
          <ul class="ns-prod__terms">
            <li>
              <NsIcon name="truck" :size="20" />
              <span v-if="p.box">Пирожные — только коробками, заказ от {{ nsMoney(nsRules.pieMinSum) }}. Поштучно — в магазинах.</span>
              <span v-else>
                Доставка по Новосибирску бесплатно, кроме Советского и Первомайского районов<template v-if="eta"
                  >. Оформите сейчас — привезём {{ eta.text }}</template
                >.
              </span>
            </li>
            <li>
              <NsIcon name="store" :size="20" />
              <span>Можно забрать в любом из <NuxtLink :to="nsPath('/magaziny')">12 магазинов</NuxtLink>.</span>
            </li>
          </ul>
        </template>

        <button type="button" class="ns-btn ns-btn--line ns-prod__quick" @click="quick">
          <NsIcon name="phone" :size="18" />
          <span>Быстрый заказ по телефону</span>
        </button>
      </div>
    </div>

    <section v-if="others.length" class="ns-section">
      <div class="ns-head">
        <h2>{{ custom ? 'Похожие дизайны' : 'Ещё из этого раздела' }}</h2>
        <NuxtLink :to="nsPath(`/catalog/${section.id}`)" class="ns-head__more"
          >{{ section.title }} <NsIcon name="arrow" :size="18"
        /></NuxtLink>
      </div>
      <div class="ns-grid">
        <NsCard v-for="o in others" :key="o.id" :product="o" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ns .ns-prod {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
    margin-top: 20px;
  }

  &__photo {
    position: sticky;
    top: 136px;
    overflow: hidden;
    aspect-ratio: 15 / 11;
    background: var(--ns-terra);
    border-radius: var(--ns-r-panel);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ns-card__labels {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 6px;
    }
  }

  &__info {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;

    h1 {
      font-size: clamp(34px, 3.6vw, 52px);
    }
  }

  &__section {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ns-accent);
  }

  &__desc {
    font-size: 17px;
  }

  &__price {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;

    b {
      font-size: 34px;
      font-weight: 700;
      color: var(--ns-dark);
      font-variant-numeric: tabular-nums;
    }

    span {
      color: var(--ns-muted);
    }
  }

  &__note {
    display: flex;
    gap: 10px;
    padding: 14px 16px;
    font-size: 14px;
    background: var(--ns-gold-soft);
    border-radius: 16px;

    .ns-icon {
      flex: none;
      color: var(--ns-gold);
    }
  }

  &__specs {
    display: grid;
    gap: 8px;
    margin: 0;

    div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--ns-line);
    }

    dt {
      color: var(--ns-muted);
    }

    dd {
      margin: 0;
      font-weight: 600;
      color: var(--ns-dark);
      text-align: right;
    }
  }

  &__buy {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 18px;
    background: var(--ns-surface);
    border-radius: var(--ns-r-card);
  }

  &__go {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: -6px;
    font-weight: 600;
    color: var(--ns-accent);
    text-decoration: none;
  }

  ul.ns-prod__terms {
    display: grid;
    gap: 10px;

    li {
      display: flex;
      gap: 10px;
      font-size: 14px;
    }

    .ns-icon {
      flex: none;
      color: var(--ns-accent);
    }

    a {
      font-weight: 600;
      color: var(--ns-accent);
    }
  }

  &__quick {
    justify-self: start;
  }

  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    &__photo {
      position: relative;
      top: 0;
      border-radius: 24px;
    }
  }

  @media (max-width: 576px) {
    &__buy {
      display: grid;
      grid-template-columns: minmax(0, 1fr);

      .ns-btn,
      .ns-qty {
        width: 100%;
      }
    }

    &__quick {
      justify-self: stretch;
    }
  }
}
</style>
