<script lang="ts" setup>
// Позиция прайса: плитка с крупным брендом (фото у позиций оригинала нет) или строка прайса.
// Объём, число упаковок и «В заявку» — прямо в карточке.
import SbIcon from './SbIcon.vue'
import SbQty from './SbQty.vue'

const props = defineProps<{ item: SbItem; view?: 'grid' | 'list' }>()
const req = useSibirtreidRequest()

const section = computed(() => sbSection(props.item.sec)!)
const sub = computed(() => (props.item.sub ? sbSub(props.item.sec, props.item.sub) : undefined))
const vol = ref('')
const qty = ref(sbMin(props.item))
const to = computed(() => sbPath(`/item/${props.item.id}`))
const inReq = computed(() => req.qtyOf(props.item.id))
const showName = computed(() => props.item.name.replace(/[«»]/g, '') !== props.item.brand)
const unit = computed(() => props.item.unit ?? '')

const add = () => req.add(props.item.id, vol.value, qty.value)
</script>

<template>
  <article class="sb-card" :class="[`sb-card--${view ?? 'grid'}`, `sb-tone--${section.tone}`]">
    <NuxtLink :to="to" class="sb-card__face" :aria-label="item.name">
      <span class="sb-card__brand">{{ item.brand }}</span>
      <span class="sb-card__kind">{{ sub?.label ?? section.label }}</span>
      <img :src="section.img" alt="" loading="lazy" class="sb-card__img" />
    </NuxtLink>

    <div class="sb-card__body">
      <NuxtLink :to="to" class="sb-card__name">
        {{ showName ? item.name : item.brand }}
        <span v-if="item.taste" class="sb-card__taste">· {{ item.taste }}</span>
      </NuxtLink>
      <dl class="sb-card__specs">
        <div v-if="item.vols?.length">
          <dt>{{ sbVolLabel(item) }}</dt>
          <dd>{{ sbVols(item, 4) }}</dd>
        </div>
        <div v-if="item.packs?.length">
          <dt>В упаковке</dt>
          <dd>{{ sbPacks(item) }}</dd>
        </div>
        <div>
          <dt>Мин. заказ</dt>
          <dd>от {{ sbMin(item) }} уп.</dd>
        </div>
      </dl>
    </div>

    <div class="sb-card__buy">
      <div class="sb-card__price">
        <strong>от {{ sbKop(item.price) }}</strong>
        <span>за упаковку</span>
      </div>
      <label v-if="(item.vols?.length ?? 0) > 1" class="sb-select sb-card__vol">
        <span class="sb-sr">{{ sbVolLabel(item) }}</span>
        <select v-model="vol">
          <option value="">{{ sbVolLabel(item) }}: любой</option>
          <option v-for="v in item.vols" :key="v" :value="v">{{ v }} {{ unit }}</option>
        </select>
        <SbIcon name="down" :size="16" />
      </label>
      <div class="sb-card__actions">
        <SbQty v-model="qty" :min="sbMin(item)" :name="item.name" small />
        <button type="button" class="sb-btn sb-btn--sm" @click="add">
          <SbIcon name="plus" :size="18" />
          <span>В заявку</span>
        </button>
      </div>
      <NuxtLink v-if="inReq" :to="sbPath('/request')" class="sb-card__in">
        <SbIcon name="check" :size="16" />
        В заявке {{ sbPacksWord(inReq) }}
      </NuxtLink>
    </div>
  </article>
</template>

<style lang="scss">
.sb .sb-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 24px;
  background: #fff;
  box-shadow: inset 0 0 0 1px var(--sb-line);
  overflow: hidden;
  container-type: inline-size;

  &__face {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 6px;
    min-height: 148px;
    padding: 18px 18px 16px;
    background: var(--tone-bg);
    color: var(--tone-ink);
    overflow: hidden;
  }

  &__brand {
    position: relative;
    z-index: 1;
    max-width: 78%;
    font-family: var(--sb-display);
    font-size: 26px;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__kind {
    position: relative;
    z-index: 1;
    font-size: 13px;
    font-weight: 600;
    opacity: 0.75;
  }

  &__img {
    position: absolute;
    right: -10px;
    bottom: -8px;
    width: 112px;
    height: 96px;
    object-fit: contain;
    transition: transform 0.3s;
  }

  &__face:hover .sb-card__img {
    transform: scale(1.06) rotate(-3deg);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 18px 0;
    flex: 1;
  }

  &__name {
    font-weight: 700;
    line-height: 1.3;
    overflow-wrap: anywhere;

    &:hover {
      color: var(--sb-green);
    }
  }

  &__taste {
    color: var(--sb-muted);
    font-weight: 500;
  }

  &__specs {
    display: grid;
    gap: 4px;
    font-size: 13.5px;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      min-width: 0;
    }

    dt {
      color: var(--sb-muted);
      flex-shrink: 0;
    }

    dd {
      font-weight: 600;
      text-align: right;
      min-width: 0;
      overflow-wrap: anywhere;
    }
  }

  &__buy {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    padding: 14px 18px 18px;
  }

  &__price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 8px;

    strong {
      font-family: var(--sb-display);
      font-size: 22px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    span {
      font-size: 13px;
      color: var(--sb-muted);
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
  }

  &__in {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--sb-green);
  }

  // узкая плитка: счётчик на всю ширину, кнопка под ним
  @container (max-width: 250px) {
    &__actions {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  // ---------- строка прайса ----------
  &--list {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr) minmax(0, 330px);
    align-items: stretch;
    border-radius: 20px;
  }

  &--list .sb-card__face {
    min-height: 0;
    padding: 16px;
  }

  &--list .sb-card__brand {
    font-size: 20px;
    max-width: 70%;
  }

  &--list .sb-card__img {
    width: 78px;
    height: 70px;
  }

  &--list .sb-card__body {
    padding: 16px 18px;
    justify-content: center;
  }

  &--list .sb-card__specs {
    grid-template-columns: repeat(3, minmax(0, auto));
    justify-content: start;
    gap: 4px 24px;

    div {
      flex-direction: column;
      gap: 0;
    }

    dd {
      text-align: left;
    }
  }

  &--list .sb-card__buy {
    padding: 16px 18px;
    align-content: center;
    border-left: 1px solid var(--sb-line);
  }

  @media (max-width: 960px) {
    &--list {
      grid-template-columns: 150px minmax(0, 1fr);
    }

    &--list .sb-card__buy {
      grid-column: 1 / -1;
      border-left: 0;
      border-top: 1px solid var(--sb-line);
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: center;
    }

    &--list .sb-card__price {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 600px) {
    &--list {
      grid-template-columns: minmax(0, 1fr);
    }

    &--list .sb-card__face {
      min-height: 84px;
    }

    &--list .sb-card__specs {
      grid-template-columns: minmax(0, 1fr);

      div {
        flex-direction: row;
        justify-content: space-between;
      }

      dd {
        text-align: right;
      }
    }

    &--list .sb-card__buy {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
