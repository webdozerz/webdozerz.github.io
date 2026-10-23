<script lang="ts" setup>
import FmIcon from './FmIcon.vue'

// Отзывы с оригинала: текст из скриншотов переписки пузырями чата, сам скриншот — по кнопке.
const ui = useFermatomskUi()
const openShot = (i: number) => {
  ui.photo.value = { list: fmReviews.map((r, n) => ({ src: r.shot, alt: `Отзыв ${n + 1}, скриншот переписки` })), index: i }
}
</script>

<template>
  <div class="fm-reviews">
    <figure v-for="(r, i) in fmReviews" :key="r.time" class="fm-review">
      <blockquote class="fm-review__in">
        <p>{{ r.text }}</p>
        <span class="fm-review__time">{{ r.time }}</span>
      </blockquote>
      <figcaption class="fm-review__out">
        <p>{{ r.reply }}</p>
      </figcaption>
      <button type="button" class="fm-review__shot" @click="openShot(i)">
        <FmIcon name="zoom" :size="18" /> Скриншот переписки
      </button>
    </figure>
  </div>
</template>

<style lang="scss">
.fm-reviews {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: 16px;
}

.fm-review {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 20px;
  border-radius: var(--fm-r-lg);
  background: var(--fm-chat);

  p {
    font-size: 15px;
    line-height: 1.55;
  }

  &__in {
    position: relative;
    max-width: 92%;
    margin: 0;
    padding: 12px 14px 22px;
    border-radius: 16px 16px 16px 4px;
    background: #fff;
  }

  &__time {
    position: absolute;
    right: 12px;
    bottom: 6px;
    color: var(--fm-muted);
    font-size: 12px;
  }

  &__out {
    align-self: flex-end;
    max-width: 82%;
    padding: 10px 14px;
    border-radius: 16px 16px 4px 16px;
    background: var(--fm-bubble);
  }

  &__shot {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
    margin-top: auto;
    padding: 6px 0;
    color: var(--fm-green-d);
    font-size: 14px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
