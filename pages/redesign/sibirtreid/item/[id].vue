<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'
import SbItemCard from '~/components/redesign/sibirtreid/SbItemCard.vue'
import SbQty from '~/components/redesign/sibirtreid/SbQty.vue'

const route = useRoute()
const req = useSibirtreidRequest()

const item = computed(() => sbFind(String(route.params.id)))
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Позиция не найдена' })

const it = computed(() => item.value!)
const section = computed(() => sbSection(it.value.sec)!)
const sub = computed(() => (it.value.sub ? sbSub(it.value.sec, it.value.sub) : undefined))
const vol = ref('')
const qty = ref(sbMin(it.value))
const added = ref(false)
watch(
  () => route.params.id,
  () => {
    vol.value = ''
    qty.value = sbMin(it.value)
    added.value = false
  },
)

const sum = computed(() => it.value.price * qty.value)
const inReq = computed(() => req.qtyOf(it.value.id))
const related = computed(() =>
  sbOf(it.value.sec, it.value.sub)
    .filter((i) => i.id !== it.value.id)
    .slice(0, 4),
)

const add = () => {
  req.add(it.value.id, vol.value, qty.value)
  added.value = true
}

useSeoMeta({ title: () => `${it.value.name} оптом — СибирьТрейд | Концепт редизайна` })
</script>

<template>
  <div class="sb-wrap sb-item">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="sbCatalogPath(section.id)">{{ section.label }}</NuxtLink>
      <template v-if="sub">
        <span aria-hidden="true">/</span>
        <NuxtLink :to="sbCatalogPath(section.id, sub.id)">{{ sub.label }}</NuxtLink>
      </template>
    </nav>

    <div class="sb-item__grid">
      <div class="sb-item__face" :class="`sb-tone--${section.tone}`">
        <span class="sb-item__kind">{{ sub?.label ?? section.label }}</span>
        <span class="sb-item__brand">{{ it.brand }}</span>
        <img :src="section.img" alt="" />
        <span v-if="section.adult" class="sb-item__age">18+</span>
      </div>

      <div class="sb-item__info">
        <h1>{{ it.name }}</h1>
        <p class="sb-item__lead">
          Оптом со склада в Новосибирске: минимальный заказ — {{ sbMin(it) }} упаковок, отгрузка до ТК
          или до вашего склада.
        </p>

        <dl class="sb-item__specs">
          <div v-if="it.taste"><dt>Вкус</dt><dd>{{ it.taste }}</dd></div>
          <div v-if="it.vols?.length"><dt>{{ sbVolLabel(it) }}, {{ it.unit }}</dt><dd>{{ it.vols.join(' · ') }}</dd></div>
          <div v-if="it.packs?.length"><dt>В упаковке, {{ it.box ? 'коробок' : 'шт' }}</dt><dd>{{ it.packs.join(' · ') }}</dd></div>
          <div><dt>Минимальный заказ</dt><dd>от {{ sbMin(it) }} упаковок</dd></div>
          <div><dt>Раздел</dt><dd>{{ section.label }}{{ sub ? ` → ${sub.label}` : '' }}</dd></div>
        </dl>

        <div class="sb-buy">
          <div class="sb-buy__price">
            <strong>от {{ sbKop(it.price) }}</strong>
            <span>за упаковку</span>
          </div>

          <div v-if="(it.vols?.length ?? 0) > 1" class="sb-buy__vols" role="radiogroup" :aria-label="sbVolLabel(it)">
            <button type="button" role="radio" :aria-checked="vol === ''" class="sb-chip" :class="{ 'is-on': vol === '' }" @click="vol = ''">Любой</button>
            <button
              v-for="v in it.vols"
              :key="v"
              type="button"
              role="radio"
              :aria-checked="vol === v"
              class="sb-chip"
              :class="{ 'is-on': vol === v }"
              @click="vol = v"
            >
              {{ v }} {{ it.unit }}
            </button>
          </div>

          <div class="sb-buy__row">
            <SbQty v-model="qty" :min="sbMin(it)" :name="it.name" />
            <button type="button" class="sb-btn sb-btn--lg" @click="add">
              <SbIcon :name="added ? 'check' : 'plus'" :size="18" />
              {{ added ? 'Добавлено' : 'В заявку' }}
            </button>
            <button type="button" class="sb-btn sb-btn--lg sb-btn--line" @click="req.askPrice(it.name)">Узнать точную цену</button>
          </div>

          <p class="sb-buy__sum">
            ≈ от <strong>{{ sbRub(sum) }}</strong> за {{ sbPacksWord(qty) }}{{ vol ? `, ${vol} ${it.unit}` : '' }}
          </p>
          <NuxtLink v-if="inReq" :to="sbPath('/request')" class="sb-buy__in">
            <SbIcon name="check" :size="16" />
            В заявке {{ sbPacksWord(inReq) }} — открыть заявку
          </NuxtLink>

          <p class="sb-buy__notice">
            <SbIcon name="info" :size="18" />
            Наличие и цену с учётом объёма и скидки подтвердит менеджер — цена «от» на сайте за минимальную фасовку.
          </p>
        </div>

        <div class="sb-item__terms">
          <div>
            <SbIcon name="truck" :size="22" />
            <span><strong>Доставка</strong> до ТК или вашего склада в Новосибирске — бесплатно от 100 000 ₽. В Якутию — по расчёту.</span>
          </div>
          <div>
            <SbIcon name="doc" :size="22" />
            <span><strong>Оплата</strong> по счёту, условия — индивидуально. Договор, ЭДО, сертификаты.</span>
          </div>
        </div>
      </div>
    </div>

    <section v-if="related.length" class="sb-section">
      <div class="sb-head">
        <h2>Ещё в разделе «{{ sub?.label ?? section.label }}»</h2>
        <NuxtLink :to="sbCatalogPath(section.id, sub?.id)" class="sb-link">Все позиции <SbIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="sb-list sb-list--grid">
        <SbItemCard v-for="r in related" :key="r.id" :item="r" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.sb .sb-item {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(20px, 4vw, 48px);
    align-items: start;
  }

  &__face {
    position: sticky;
    top: 136px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 480px;
    padding: clamp(24px, 4vw, 40px);
    border-radius: 36px;
    background: var(--tone-bg);
    color: var(--tone-ink);
    overflow: hidden;

    img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 74%;
      height: 58%;
      object-fit: contain;
      object-position: right bottom;
    }
  }

  &__kind {
    font-weight: 700;
    font-size: 15px;
  }

  &__brand {
    position: relative;
    z-index: 1;
    max-width: 90%;
    font-family: var(--sb-display);
    font-size: clamp(40px, 5.4vw, 72px);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  &__age {
    position: absolute;
    top: 24px;
    right: 24px;
    padding: 4px 12px;
    border-radius: 999px;
    background: #fff;
    color: var(--sb-ink);
    font-weight: 800;
  }

  &__info h1 {
    font-size: clamp(28px, 3.4vw, 42px);
    overflow-wrap: anywhere;
  }

  &__lead {
    margin-top: 10px;
    color: var(--sb-muted);
    font-size: 16px;
  }

  &__specs {
    display: grid;
    margin-top: 22px;
    border-radius: 22px;
    background: var(--sb-mint);
    padding: 6px 20px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 11px 0;

      &:not(:last-child) {
        border-bottom: 1px solid var(--sb-mint-2);
      }
    }

    dt {
      color: var(--sb-muted);
      flex-shrink: 0;
    }

    dd {
      font-weight: 700;
      text-align: right;
      min-width: 0;
      overflow-wrap: anywhere;
    }
  }

  &__terms {
    display: grid;
    gap: 12px;
    margin-top: 18px;

    div {
      display: flex;
      gap: 12px;
      padding: 16px 18px;
      border-radius: 20px;
      box-shadow: inset 0 0 0 1px var(--sb-line);
      font-size: 14.5px;
      color: var(--sb-muted);
    }

    strong {
      color: var(--sb-ink);
    }

    .sb-icon {
      color: var(--sb-green);
    }
  }

  @media (max-width: 900px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }

    &__face {
      position: relative;
      top: 0;
      min-height: 280px;
      border-radius: 28px;

      img {
        width: 52%;
        height: 70%;
      }
    }

    &__brand {
      max-width: 60%;
    }
  }
}

.sb .sb-buy {
  display: grid;
  gap: 16px;
  margin-top: 18px;
  padding: 24px;
  border-radius: 28px;
  background: #fff;
  box-shadow: inset 0 0 0 1.5px var(--sb-line);

  &__price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px 10px;

    strong {
      font-family: var(--sb-display);
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }

    span {
      color: var(--sb-muted);
    }
  }

  &__vols {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__row {
    display: grid;
    grid-template-columns: 170px minmax(0, 1fr);
    gap: 10px;

    .sb-btn--line {
      grid-column: 1 / -1;
    }

    .sb-qty {
      height: 56px;

      button {
        height: 56px;
      }
    }
  }

  &__sum {
    font-size: 15px;
    color: var(--sb-muted);

    strong {
      color: var(--sb-ink);
      font-variant-numeric: tabular-nums;
    }
  }

  &__in {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: var(--sb-green);
  }

  &__notice {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 16px;
    background: var(--sb-peach);
    color: #7a3a12;
    font-size: 14px;

    .sb-icon {
      color: var(--sb-orange-d);
      margin-top: 1px;
    }
  }

  @media (max-width: 640px) {
    padding: 18px;

    &__row {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    &__row .sb-btn {
      padding: 0 14px;
    }
  }

  @media (max-width: 360px) {
    &__row {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
