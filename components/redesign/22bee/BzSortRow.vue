<script lang="ts" setup>
import BzQty from '~/components/redesign/22bee/BzQty.vue'

// Строка прайса: куботейнер сверху, две ступени цены колонками, счётчик куботейнеров.
// Ступень, по которой сейчас считается заявка, подсвечена; под счётчиком — вес, сумма и сколько добрать до «от 200 кг».
const props = defineProps<{ sort: BzSort }>()
const order = useBee22Order()

const qty = computed(() => order.qtyOf(props.sort.id))
const line = computed(() => (qty.value ? order.lineOf(props.sort, qty.value) : null))
const active = computed(() => (line.value && !props.sort.frames ? (line.value.bulk ? 1 : 0) : -1))
</script>

<template>
  <article class="bz-row" :class="{ 'is-out': !props.sort.stock, 'is-in': qty }">
    <NuxtLink :to="bzSortPath(props.sort.id)" class="bz-row__photo" :aria-label="props.sort.title">
      <img :src="props.sort.img" :alt="props.sort.title" width="550" height="311" loading="lazy" />
    </NuxtLink>

    <div class="bz-row__name">
      <NuxtLink :to="bzSortPath(props.sort.id)">{{ props.sort.title }}</NuxtLink>
      <p>
        <span class="bz-stock" :class="{ 'is-out': !props.sort.stock }">{{ props.sort.stock ? 'В наличии' : 'Нет в наличии' }}</span>
        <span>Сбор {{ bzYear }}</span>
        <span>{{ props.sort.frames ? `от ${bzMinFrames} рамок` : 'куботейнер 34 кг' }}</span>
      </p>
    </div>

    <dl class="bz-row__tiers">
      <div v-for="(t, i) in props.sort.tiers" :key="t.from" class="bz-tier" :class="{ 'is-active': active === i, 'is-bulk': i === 1 }">
        <dt>от {{ t.from }} кг</dt>
        <dd>
          <b>{{ bzMoney(t.price) }}</b><span>/кг</span>
        </dd>
      </div>
    </dl>

    <div class="bz-row__buy">
      <BzQty :sort="props.sort" />
      <p v-if="line && !props.sort.frames" class="bz-row__sum">
        <span>{{ bzKg(line.kg) }} · <b>{{ bzMoney(line.sum) }}</b></span>
        <small v-if="line.toBulk">ещё {{ line.toBulk }}&nbsp;куб.&nbsp;— и&nbsp;{{ bzMoney(props.sort.tiers[1].price) }}/кг</small>
        <small v-else class="is-ok">цена от 200 кг</small>
      </p>
      <p v-else-if="line" class="bz-row__sum">
        <span>{{ bzFramesLabel(line.qty) }}</span>
        <small>сумма — по весу рамок</small>
      </p>
    </div>
  </article>
</template>

<style lang="scss">
.bz-row {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr) 260px 196px;
  align-items: center;
  gap: 8px 24px;
  padding: 14px 18px 14px 14px;
  border-radius: var(--bz-R);
  background: #fff;
  border: 1px solid var(--bz-line);
  transition: border-color 0.2s;

  &.is-in {
    border-color: var(--bz-accent);
    box-shadow: inset 0 0 0 1px var(--bz-accent);
  }

  &__photo {
    display: block;
    overflow: hidden;
    border-radius: 12px;
    background: var(--bz-surface);

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 550 / 311;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  &.is-out &__photo img {
    filter: grayscale(0.7);
    opacity: 0.75;
  }

  &__name {
    min-width: 0;

    > a {
      color: var(--bz-ink);
      font-size: 19px;
      font-weight: 700;
      line-height: 1.25;
      text-decoration: none;

      &:hover {
        color: var(--bz-copper);
      }
    }

    p {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px;
      margin-top: 6px;
      color: var(--bz-muted);
      font-size: 14px;
    }
  }

  &__tiers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin: 0;
  }

  &__buy {
    display: grid;
    gap: 6px;
    justify-items: stretch;
  }

  &__sum {
    display: grid;
    gap: 1px;
    margin: 0;
    font-size: 14px;
    text-align: center;
    color: var(--bz-text);

    b {
      color: var(--bz-ink);
    }

    small {
      color: var(--bz-copper);
      font-size: 13px;

      &.is-ok {
        color: var(--bz-green);
      }
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 128px minmax(0, 1fr) 236px;

    &__buy {
      grid-column: 2 / -1;
      grid-template-columns: 196px minmax(0, 1fr);
      align-items: center;
    }

    &__sum {
      text-align: left;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 112px minmax(0, 1fr);
    padding: 12px;
    gap: 12px 14px;

    &__name > a {
      font-size: 17px;
    }

    &__tiers,
    &__buy {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 375px) {
    grid-template-columns: 92px minmax(0, 1fr);

    &__buy {
      grid-template-columns: minmax(0, 1fr);
    }

    &__sum {
      text-align: center;
    }
  }
}


</style>
