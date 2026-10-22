<script lang="ts" setup>
import FtIcon from './FtIcon.vue'

// Отзывы с формой «Можете похвалить или поругать нас!». Новый отзыв появляется в списке с пометкой «демо».
const props = defineProps<{ reviews: FtReview[]; storeKey: string; empty?: string }>()

const added = useState<FtReview[]>(`ft-reviews-${props.storeKey}`, () => [])
const list = computed(() => [...added.value, ...props.reviews])
const avg = computed(() =>
  list.value.length ? (list.value.reduce((n, r) => n + r.rating, 0) / list.value.length).toFixed(1).replace('.', ',') : null,
)

const form = reactive({ name: '', text: '', rating: 5 })
const open = ref(false)

const submit = () => {
  added.value = [
    { author: form.name.trim(), date: new Date().toISOString().slice(0, 10), rating: form.rating, text: form.text.trim() },
    ...added.value,
  ]
  form.name = ''
  form.text = ''
  form.rating = 5
  open.value = false
}
</script>

<template>
  <div class="ft-reviews">
    <div class="ft-reviews__summary">
      <template v-if="avg">
        <strong>{{ avg }}</strong>
        <span class="ft-reviews__stars" aria-hidden="true">
          <FtIcon v-for="i in 5" :key="i" name="star" :size="18" />
        </span>
        <span>{{ list.length }} {{ list.length === 1 ? 'отзыв' : list.length < 5 ? 'отзыва' : 'отзывов' }}</span>
      </template>
      <span v-else>{{ empty ?? 'Отзывов пока нет — будьте первым.' }}</span>
      <button type="button" class="ft-btn ft-btn--soft" :aria-expanded="open" @click="open = !open">
        {{ open ? 'Скрыть форму' : 'Написать отзыв' }}
      </button>
    </div>

    <form v-if="open" class="ft-reviews__form" @submit.prevent="submit">
      <p class="ft-reviews__lead">Можете похвалить или поругать нас!</p>
      <div class="ft-reviews__rate" role="radiogroup" aria-label="Оценка">
        <button
          v-for="i in 5"
          :key="i"
          type="button"
          role="radio"
          :aria-checked="form.rating === i"
          :aria-label="`${i} из 5`"
          :class="{ 'is-on': i <= form.rating }"
          @click="form.rating = i"
        >
          <FtIcon name="star" :size="26" />
        </button>
      </div>
      <label class="ft-field">Имя<input v-model="form.name" type="text" required autocomplete="off" /></label>
      <label class="ft-field">Отзыв<textarea v-model="form.text" required rows="4" /></label>
      <label class="ft-check"><input type="checkbox" required /> Согласен на обработку персональных данных</label>
      <button type="submit" class="ft-btn">Отправить</button>
    </form>

    <ul class="ft-reviews__list">
      <li v-for="(r, i) in list" :key="`${r.author}-${r.date}-${i}`" class="ft-reviews__item">
        <div class="ft-reviews__meta">
          <strong>{{ r.author }}</strong>
          <span class="ft-reviews__stars ft-reviews__stars--sm" :aria-label="`Оценка ${r.rating} из 5`">
            <FtIcon v-for="s in 5" :key="s" name="star" :size="15" :class="{ 'is-off': s > r.rating }" />
          </span>
          <time :datetime="r.date">{{ ftDate(r.date) }}</time>
        </div>
        <p>{{ r.text }}</p>
        <small v-if="i < added.length">Демо: отзыв виден только вам</small>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.ft .ft-reviews {
  display: grid;
  gap: 20px;

  &__summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    color: var(--ft-muted);
    font-weight: 700;

    > strong {
      color: var(--ft-ink);
      font-size: 32px;
      font-weight: 900;
      line-height: 1;
    }

    .ft-btn {
      margin-left: auto;
    }
  }

  &__stars {
    display: inline-flex;
    gap: 2px;
    color: var(--ft-orange);

    svg {
      fill: currentColor;
    }

    .is-off {
      color: #d6dde7;
    }
  }

  &__form {
    display: grid;
    gap: 14px;
    max-width: 560px;
    padding: 20px;
    border-radius: var(--ft-r-lg);
    background: var(--ft-surface-2);

    .ft-btn {
      justify-self: start;
    }
  }

  &__lead {
    font-size: 18px;
    font-weight: 900;
  }

  &__rate {
    display: flex;
    gap: 4px;

    button {
      color: #d6dde7;

      &.is-on {
        color: var(--ft-orange);

        svg {
          fill: currentColor;
        }
      }
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 16px;
  }

  &__item {
    display: grid;
    align-content: start;
    gap: 10px;
    padding: 20px;
    border-radius: var(--ft-r-lg);
    background: var(--ft-surface-2);

    small {
      color: var(--ft-accent);
      font-weight: 700;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;

    time {
      width: 100%;
      color: var(--ft-muted);
      font-size: 13px;
    }
  }

  @media (max-width: 576px) {
    &__summary .ft-btn {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
