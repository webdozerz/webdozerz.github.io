<script lang="ts" setup>
import MrIcon from './MrIcon.vue'

// Охапка роз Эквадор поштучно: у оригинала шесть товаров с одним фото — «от 15 / 25 / 51 шт.»
// по 169 / 139 / 99 ₽. Здесь это одна охапка: число роз, цвет, длина — цена за розу сама
// опускается на ступенях, фото меняется под цвет (снимки роз этого цвета с сайта магазина).
const props = withDefaults(defineProps<{ start?: number; hero?: boolean }>(), { start: 25, hero: false })
const shop = useMnerozyShop()
const ui = useMnerozyUi()

const count = ref(props.start)
const color = ref(mrStems.colors[1].id)
const long = ref(0)

const setCount = (n: number) => {
  count.value = Math.max(mrStems.min, Math.min(mrStems.max, Math.round(n) || mrStems.min))
}
const onInput = (e: Event) => setCount(Number((e.target as HTMLInputElement).value))

const tier = computed(() => mrStemTier(count.value))
const next = computed(() => mrStems.tiers.find((t) => t.from > count.value))
const each = computed(() => mrStemPrice(count.value, long.value === 1))
const sum = computed(() => each.value * count.value)
const activeColor = computed(() => mrStems.colors.find((c) => c.id === color.value)!)
const key = computed(() => mrStemsKey(count.value, color.value, long.value))
const inCart = computed(() => shop.qtyOf(key.value))

const add = () => {
  shop.add(key.value)
  ui.say(`Охапка из ${mrOfRoses(count.value)} в корзине`)
}
</script>

<template>
  <section class="mr-stems" :class="{ 'mr-stems--hero': props.hero }" aria-label="Охапка роз поштучно">
    <div class="mr-stems__photo">
      <Transition name="mr-fade" mode="out-in">
        <img :key="activeColor.img" :src="activeColor.img" :alt="`Розы Эквадор, ${activeColor.label.toLowerCase()}`" width="560" height="560" />
      </Transition>
      <span class="mr-stems__tag">{{ activeColor.label }} · фото из магазина</span>
    </div>

    <div class="mr-stems__body">
      <div class="mr-stems__head">
        <h2 class="mr-stems__title">Охапка роз Эквадор поштучно</h2>
        <p class="mr-stems__lead">Розы премиум из Эквадора: чем больше роз, тем дешевле каждая.</p>
      </div>

      <div class="mr-stems__row">
        <p class="mr-stems__label">Сколько роз</p>
        <div class="mr-stems__count">
          <div class="mr-stems__chips" role="group" aria-label="Быстрый выбор">
            <button
              v-for="n in mrStems.counts"
              :key="n"
              type="button"
              class="mr-chip"
              :class="{ 'is-on': count === n }"
              @click="setCount(n)"
            >
              {{ n }}
            </button>
          </div>
          <div class="mr-stems__stepper">
            <button type="button" aria-label="Меньше" :disabled="count <= mrStems.min" @click="setCount(count - 1)">
              <MrIcon name="minus" :size="18" />
            </button>
            <input :value="count" inputmode="numeric" aria-label="Число роз" @change="onInput" />
            <button type="button" aria-label="Больше" :disabled="count >= mrStems.max" @click="setCount(count + 1)">
              <MrIcon name="plus" :size="18" />
            </button>
          </div>
        </div>
      </div>

      <ol class="mr-stems__ladder" aria-label="Цена за розу">
        <li v-for="t in mrStems.tiers" :key="t.from" :class="{ 'is-on': t.from === tier.from }">
          <span>от {{ t.from }} шт</span>
          <b>{{ t.price + (long ? t.long : 0) }} ₽</b>
        </li>
      </ol>
      <p class="mr-stems__hint">
        <template v-if="next">
          Ещё {{ next.from - count }} {{ mrPlural(next.from - count, 'роза', 'розы', 'роз') }} — и каждая по
          {{ next.price + (long ? next.long : 0) }} ₽
        </template>
        <template v-else>Самая низкая цена за розу</template>
      </p>

      <div class="mr-stems__row">
        <p class="mr-stems__label">
          Цвет <span>{{ activeColor.label.toLowerCase() }}</span>
        </p>
        <div class="mr-stems__colors" role="radiogroup" aria-label="Цвет роз">
          <button
            v-for="c in mrStems.colors"
            :key="c.id"
            type="button"
            role="radio"
            class="mr-swatch"
            :class="{ 'is-on': color === c.id }"
            :aria-checked="color === c.id"
            :aria-label="c.label"
            :title="c.label"
            :style="{ background: c.hex }"
            @click="color = c.id"
          />
        </div>
      </div>

      <div class="mr-stems__row">
        <p class="mr-stems__label">Длина стебля</p>
        <div class="mr-seg" role="radiogroup" aria-label="Длина стебля">
          <button
            v-for="(l, i) in mrStems.lengths"
            :key="l"
            type="button"
            role="radio"
            :aria-checked="long === i"
            :class="{ 'is-on': long === i }"
            @click="long = i"
          >
            {{ l }}<small v-if="i">+{{ tier.long }} ₽</small>
          </button>
        </div>
      </div>

      <div class="mr-stems__total">
        <div class="mr-stems__sum">
          <span>{{ count }} × {{ each }} ₽</span>
          <b>{{ mrRub(sum) }}</b>
        </div>
        <button type="button" class="mr-btn mr-btn--accent mr-stems__add" @click="add">
          <MrIcon name="bag" :size="19" />
          <span>{{ inCart ? `Ещё одну · в корзине ${inCart}` : 'В корзину' }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.mr-stems {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  gap: 28px;
  padding: 20px;
  border-radius: var(--mr-r-panel);
  background: #fff;
  border: 1px solid var(--mr-line);

  &__photo {
    position: relative;
    border-radius: var(--mr-r-card);
    overflow: hidden;
    background: var(--mr-surface);
    min-height: 100%;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__tag {
    position: absolute;
    left: 12px;
    bottom: 12px;
    padding: 5px 10px;
    border-radius: 8px;
    background: rgb(255 255 255 / 0.92);
    font-size: 12px;
    font-weight: 600;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
    padding: 6px 4px 4px 0;
  }

  &__head {
    display: grid;
    gap: 6px;
  }

  &__title {
    font-size: 24px;
  }

  &__lead {
    color: var(--mr-muted);
    font-size: 14px;
  }

  &__row {
    display: grid;
    gap: 8px;
  }

  &__label {
    font-size: 13px;
    font-weight: 700;

    span {
      color: var(--mr-muted);
      font-weight: 500;
      margin-left: 4px;
    }
  }

  &__count {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__stepper {
    display: inline-flex;
    align-items: center;
    height: 40px;
    border-radius: var(--mr-r);
    background: var(--mr-surface);

    button {
      display: grid;
      place-items: center;
      width: 38px;
      height: 40px;

      &:disabled {
        opacity: 0.35;
        cursor: default;
      }
    }

    input {
      width: 46px;
      height: 40px;
      border: 0;
      background: transparent;
      text-align: center;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  }

  &__ladder {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;

    li {
      display: grid;
      gap: 2px;
      padding: 10px 12px;
      border-radius: var(--mr-r);
      background: var(--mr-surface);
      transition:
        background 0.2s,
        color 0.2s;

      span {
        color: var(--mr-muted);
        font-size: 12px;
      }

      b {
        font-size: 17px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }

      &.is-on {
        background: var(--mr-accent-soft);
        color: var(--mr-accent-dark);

        span {
          color: var(--mr-accent-dark);
        }
      }
    }
  }

  &__hint {
    margin-top: -8px;
    color: var(--mr-muted);
    font-size: 13px;
  }

  &__colors {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--mr-line);
  }

  &__sum {
    display: grid;
    min-width: 0;

    span {
      color: var(--mr-muted);
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }

    b {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
  }

  &__add {
    flex: none;
  }
}

@media (max-width: 989px) {
  .mr-stems {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      aspect-ratio: 16 / 10;
      min-height: 0;
    }
  }
}

@media (max-width: 576px) {
  .mr-stems {
    gap: 18px;
    padding: 12px;

    &__photo {
      aspect-ratio: 1;
    }

    &__body {
      padding: 0 4px 4px;
    }

    &__title {
      font-size: 21px;
    }

    &__ladder li {
      padding: 8px 10px;
    }

    &__count,
    &__chips {
      width: 100%;
    }

    &__chips {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));

      .mr-chip {
        justify-content: center;
        padding: 0;
      }
    }

    &__colors {
      gap: 6px;

      .mr-swatch {
        width: 30px;
        height: 30px;
      }
    }

    &__total {
      flex-direction: column;
      align-items: stretch;
    }

    &__add {
      width: 100%;
    }
  }
}
</style>
