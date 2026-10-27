<script lang="ts" setup>
import MfIcon from '~/components/redesign/mrkfish/MfIcon.vue'
import MfCard from '~/components/redesign/mrkfish/MfCard.vue'
import MfBuy from '~/components/redesign/mrkfish/MfBuy.vue'

const route = useRoute()
const ui = useMrkfishUi()
const req = useMrkfishRequest()
const product = computed(() => mfFind(route.params.id as string))
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Позиция не найдена' })
const p = computed(() => product.value!)
const section = computed(() => mfSection(p.value.section))
const site = computed(() => mfSites.find((s) => s.title === section.value.where))
const related = computed(() => mfInSection(p.value.section).filter((x) => x.id !== p.value.id).slice(0, 4))

useSeoMeta({ title: () => `${mfTitle(p.value)} — Миякинская Рыбная Компания | Концепт редизайна` })
</script>

<template>
  <div class="mf-wrap">
    <nav class="mf-crumbs" aria-label="Навигация">
      <NuxtLink :to="mfPath()">Главная</NuxtLink>
      <MfIcon name="arrow" :size="14" />
      <NuxtLink :to="mfSectionPath()">Каталог</NuxtLink>
      <MfIcon name="arrow" :size="14" />
      <NuxtLink :to="mfSectionPath(p.section)">{{ section.title }}</NuxtLink>
    </nav>

    <div class="mf-pp">
      <div class="mf-pp__photo">
        <img :src="mfImg(p.img)" :alt="mfTitle(p)" width="760" height="507" />
      </div>
      <div class="mf-pp__info">
        <span class="mf-card__tag mf-pp__tag">{{ section.short }}</span>
        <h1>{{ p.name }}</h1>
        <p v-if="p.note" class="mf-pp__note">{{ p.note[0].toUpperCase() + p.note.slice(1) }}</p>

        <div v-if="p.packs.length" class="mf-pp__packs">
          <span>Фасовка</span>
          <div class="mf-packs">
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
          </div>
        </div>

        <div class="mf-pp__buy">
          <div class="mf-pp__price">
            <b>Цена — в оптовом прайсе</b>
            <span>Зависит от объёма и региона. <button type="button" @click="ui.modal.value = 'price'">Получить прайс</button></span>
          </div>
          <MfBuy :product="p" big />
          <NuxtLink v-if="req.qtyOf(p.id)" :to="mfPath('/request')" class="mf-btn mf-btn--line">Перейти к заявке</NuxtLink>
        </div>

        <ul class="mf-pp__facts">
          <li>
            <MfIcon name="fish" :size="20" />
            <span>{{ section.unit === 'кг' ? 'Продаём на вес, объём в заявке — в килограммах' : 'Продаём упаковками, объём в заявке — в штуках' }}</span>
          </li>
          <li v-if="site">
            <MfIcon name="factory" :size="20" />
            <span>Производство в с. {{ site.title }}, {{ site.company }}</span>
          </li>
          <li>
            <MfIcon name="truck" :size="20" />
            <span>Доставка своим транспортом: {{ mfRegions.join(', ') }}</span>
          </li>
          <li>
            <MfIcon name="clock" :size="20" />
            <span>Ответ на заявку в среднем за {{ mfContacts.answer }}</span>
          </li>
        </ul>
      </div>
    </div>

    <section class="mf-pp__about">
      <h2>{{ section.title }}</h2>
      <p>{{ section.intro }}</p>
      <ul v-if="p.section === 'smoked'" class="mf-pp__smoke">
        <li v-for="c in mfSmoke" :key="c.title"><MfIcon :name="c.icon" :size="20" />{{ c.title }}</li>
      </ul>
    </section>

    <section v-if="related.length" class="mf-section">
      <div class="mf-head">
        <h2>Ещё в разделе</h2>
        <NuxtLink :to="mfSectionPath(p.section)" class="mf-head__more">Весь раздел <MfIcon name="arrow" :size="18" /></NuxtLink>
      </div>
      <div class="mf-shelf">
        <MfCard v-for="r in related" :key="r.id" :product="r" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.mf-pp {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 40px;
  margin-top: 20px;

  &__photo {
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 3;
    border-radius: var(--mf-r-lg);
    background: var(--mf-surface);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h1 {
      margin-top: 12px !important;
      font-size: clamp(30px, 3.4vw, 44px);
    }
  }

  &__tag {
    position: static;
  }

  &__note {
    margin-top: 8px !important;
    color: var(--mf-muted);
    font-size: 17px;
  }

  &__packs {
    display: grid;
    gap: 8px;
    margin-top: 20px;

    > span {
      color: var(--mf-ink);
      font-size: 14px;
      font-weight: 700;
    }

    .mf-packs__item {
      padding: 8px 16px;
      font-size: 15px;
    }
  }

  &__buy {
    display: grid;
    gap: 12px;
    width: 100%;
    margin-top: 24px;
    padding: 20px;
    border-radius: var(--mf-r-lg);
    background: var(--mf-surface);
  }

  &__price {
    display: grid;
    gap: 2px;

    b {
      color: var(--mf-ink);
      font-size: 18px;
    }

    span {
      color: var(--mf-muted);
      font-size: 14px;
    }

    button {
      color: var(--mf-navy);
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .mf-buy--big .mf-btn,
  .mf-buy--big .mf-qty {
    min-height: 52px;
  }

  .mf-buy--big .mf-qty {
    background: #fff;
  }

  &__facts {
    display: grid;
    gap: 12px;
    margin-top: 24px !important;

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14px;
    }

    svg {
      flex: none;
      margin-top: 1px;
      color: var(--mf-navy);
    }
  }

  &__about {
    max-width: 820px;
    margin-top: 56px;

    h2 {
      font-size: 26px;
    }

    p {
      margin-top: 10px !important;
    }
  }

  &__smoke {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px !important;

    li {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--mf-navy-soft);
      color: var(--mf-navy);
      font-size: 14px;
      font-weight: 700;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}
</style>
