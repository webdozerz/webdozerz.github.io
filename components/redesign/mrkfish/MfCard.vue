<script lang="ts" setup>
import MfBuy from './MfBuy.vue'

// Карточка «бирка»: их предметка на сером фоне цеха, обработка вторым рядом, фасовки чипами, «В заявку».
const props = defineProps<{ product: MfProduct }>()
const req = useMrkfishRequest()
const p = computed(() => props.product)
</script>

<template>
  <article class="mf-card" :class="{ 'is-in': req.qtyOf(p.id) }">
    <NuxtLink :to="mfProductPath(p)" class="mf-card__photo">
      <img :src="mfImg(p.img)" :alt="mfTitle(p)" width="760" height="507" loading="lazy" />
      <span class="mf-card__tag">{{ mfSection(p.section).short }}</span>
    </NuxtLink>
    <div class="mf-card__body">
      <NuxtLink :to="mfProductPath(p)" class="mf-card__name">{{ p.name }}</NuxtLink>
      <p v-if="p.note" class="mf-card__note">{{ p.note }}</p>
      <div v-if="p.packs.length" class="mf-packs">
        <template v-if="p.packs.length > 1">
          <button
            v-for="pk in p.packs"
            :key="pk"
            type="button"
            class="mf-packs__item"
            :class="{ 'is-on': req.packOf(p) === pk }"
            @click="req.setPack(p.id, pk)"
          >
            {{ pk }}
          </button>
        </template>
        <span v-else class="mf-packs__item is-static">{{ p.packs[0] }}</span>
      </div>
      <div class="mf-card__foot">
        <p class="mf-card__price">Цена — в оптовом прайсе</p>
        <MfBuy :product="p" />
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.mf-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: var(--mf-r-lg);
  background: #fff;
  border: 1px solid var(--mf-line);
  overflow: hidden;
  transition: border-color 0.2s;

  &.is-in {
    border-color: var(--mf-navy);
  }

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    background: var(--mf-surface);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }


    &:hover img {
      transform: scale(1.04);
    }
  }

  &__tag {
    position: absolute;
    left: 10px;
    top: 10px;
    padding: 3px 9px;
    border-radius: 6px;
    background: var(--mf-navy);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px 16px;
  }

  &__name {
    color: var(--mf-ink);
    font-size: 17px;
    font-weight: 800;
    line-height: 1.25;

    &:hover {
      color: var(--mf-red);
    }
  }

  &__note {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: var(--mf-muted);
    font-size: 14px;
    line-height: 1.4;
  }

  &__foot {
    display: grid;
    gap: 10px;
    margin-top: auto;
    padding-top: 8px;
  }

  &__price {
    color: var(--mf-muted);
    font-size: 13px;
  }

  @media (max-width: 576px) {
    &__body {
      padding: 12px 12px 14px;
    }

    &__name {
      font-size: 15px;
    }

    &__note {
      font-size: 13px;
    }

    &__price,
    &__tag {
      display: none;
    }
  }
}
</style>
