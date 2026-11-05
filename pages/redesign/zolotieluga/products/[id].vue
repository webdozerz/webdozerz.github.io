<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'
import ZlCard from '~/components/redesign/zolotieluga/ZlCard.vue'
import ZlWhere from '~/components/redesign/zolotieluga/ZlWhere.vue'

const route = useRoute()
const product = computed(() => zlProduct(String(route.params.id)))
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Продукт не найден', fatal: true })
const p = computed(() => product.value!)

const shot = ref(0)
watch(
  () => route.params.id,
  () => (shot.value = 0),
)
const brandInfo = computed(() => zlBrands.find((b) => b.id === p.value.brand)!)
const allAwards = ref(false)
const awards = computed(() => (allAwards.value ? p.value.awards : p.value.awards.slice(0, 4)))
const awardsTotal = computed(() => zlAwardsCount(p.value))
const playing = ref(false)
const others = computed(() => zlProducts.filter((x) => x.brand === p.value.brand && x.id !== p.value.id))
const facts = computed(() =>
  [
    p.value.fats.length ? { icon: 'milk', label: 'Жирность', value: p.value.fats.join(', ') } : null,
    p.value.volume ? { icon: 'doc', label: 'Объём и упаковка', value: p.value.volume } : null,
    p.value.shelf ? { icon: 'clock', label: 'Срок годности', value: p.value.shelf } : null,
  ].filter(Boolean) as { icon: string; label: string; value: string }[],
)
// Пищевая ценность: строки оригинала как есть, заголовки «… (в 100 г продукта):» — подзаголовками.
const nutrition = computed(() => p.value.chars.map((c) => ({ head: c.trim().endsWith(':'), text: c.replace(/;$/, '').replace(/:$/, '') })))

useSeoMeta({ title: () => `${p.value.name} «${zlBrandTitle(p.value.brand)}» | Концепт редизайна` })
</script>

<template>
  <div class="zl-wrap zl-page zl-product">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="zlPath('/products')">Продукция</NuxtLink></span>
      <span><NuxtLink :to="zlPath('/products?brand=' + p.brand)">{{ zlBrandTitle(p.brand) }}</NuxtLink></span>
      <span>{{ p.name }}</span>
    </nav>

    <div class="zl-product__top">
      <div class="zl-gallery">
        <div class="zl-gallery__main">
          <img :src="zlImg(p.imgs[shot])" :alt="zlBrandTitle(p.brand) + ', ' + p.name" width="600" height="600" />
          <span v-if="awardsTotal" class="zl-gallery__medal"><ZlIcon name="award" :size="18" /> {{ zlPlural(awardsTotal, 'награда', 'награды', 'наград') }}</span>
        </div>
        <div v-if="p.imgs.length > 1" class="zl-gallery__thumbs">
          <button
            v-for="(img, i) in p.imgs"
            :key="img"
            type="button"
            :class="{ 'is-on': i === shot }"
            :aria-label="'Фото ' + (i + 1)"
            @click="shot = i"
          >
            <img :src="zlImg(img)" alt="" width="80" height="80" />
          </button>
        </div>
      </div>

      <div class="zl-product__info">
        <NuxtLink :to="zlPath('/products?brand=' + p.brand)" class="zl-product__brand" :class="'zl-product__brand--' + p.brand">
          <img :src="zlImg(brandInfo.img)" alt="" width="261" height="250" />
          {{ brandInfo.title }}
        </NuxtLink>
        <h1>{{ p.name }}</h1>
        <div v-if="p.fats.length" class="zl-product__fats">
          <span v-for="f in p.fats" :key="f" class="zl-fat" :class="'zl-fat--' + zlFatTone(f)">{{ f }}</span>
        </div>
        <div v-if="p.variants" class="zl-product__variants">
          <small>Вкусы:</small>
          <span v-for="v in p.variants" :key="v">{{ v }}</span>
        </div>

        <dl class="zl-facts">
          <div v-for="f in facts" :key="f.label">
            <dt><ZlIcon :name="f.icon" :size="18" />{{ f.label }}</dt>
            <dd>{{ f.value }}</dd>
          </div>
        </dl>

        <ul class="zl-list zl-product__desc">
          <li v-for="d in p.desc" :key="d"><ZlIcon name="check" :size="18" /><span>{{ d }}</span></li>
        </ul>

        <div class="zl-product__actions">
          <a href="#where" class="zl-btn zl-btn--main"><ZlIcon name="pin" :size="18" /> Где купить</a>
          <a :href="'tel:' + zlContacts.hotlineTel" class="zl-btn zl-btn--line"><ZlIcon name="phone" :size="18" /> {{ zlContacts.hotline }}</a>
        </div>
        <p class="zl-product__note">Вопрос о продукте — на горячую линию для покупателей, {{ zlContacts.hotlineHours }}.</p>
      </div>
    </div>

    <div class="zl-product__more">
      <section v-if="nutrition.length" class="zl-panel zl-nutri">
        <h2>Пищевая ценность</h2>
        <ul>
          <li v-for="n in nutrition" :key="n.text" :class="{ 'is-head': n.head }">{{ n.text }}</li>
        </ul>
      </section>

      <section v-if="p.awards.length" class="zl-yawards">
        <h2>Награды</h2>
        <ol>
          <li v-for="a in awards" :key="(a.year || '') + a.items[0]">
            <b>{{ a.year || '—' }}</b>
            <ul>
              <li v-for="t in a.items" :key="t">{{ t }}</li>
            </ul>
          </li>
        </ol>
        <button v-if="p.awards.length > 4" type="button" class="zl-btn zl-btn--line zl-btn--small" @click="allAwards = !allAwards">
          {{ allAwards ? 'Свернуть' : 'Все годы — ' + p.awards.length }}
          <ZlIcon :name="allAwards ? 'minus' : 'plus'" :size="16" />
        </button>
        <NuxtLink :to="zlPath('/awards')" class="zl-link">Все награды компании <ZlIcon name="arrow" :size="18" /></NuxtLink>
      </section>

      <section v-if="p.video.length" class="zl-video">
        <h2>Видео</h2>
        <div class="zl-video__frame">
          <iframe
            v-if="playing"
            :src="'https://www.youtube-nocookie.com/embed/' + p.video[0] + '?autoplay=1'"
            title="Видео о продукте"
            allow="autoplay; encrypted-media"
            allowfullscreen
          />
          <button v-else type="button" class="zl-video__poster" aria-label="Смотреть видео" @click="playing = true">
            <img :src="'https://i.ytimg.com/vi/' + p.video[0] + '/hqdefault.jpg'" alt="" width="480" height="360" loading="lazy" />
            <span><ZlIcon name="play" :size="30" /></span>
          </button>
        </div>
      </section>
    </div>

    <section id="where" class="zl-section">
      <ZlWhere :title="'Где купить: ' + p.name.toLowerCase()" />
    </section>

    <div class="zl-product__back">
      <NuxtLink :to="zlPath('/products?brand=' + p.brand)" class="zl-link"><ZlIcon name="back" :size="18" /> Назад в раздел</NuxtLink>
    </div>

    <section v-if="others.length" class="zl-section">
      <div class="zl-head"><h2>Ещё «{{ zlBrandTitle(p.brand) }}»</h2></div>
      <div class="zl-rail">
        <div class="zl-rail__track">
          <ZlCard v-for="o in others" :key="o.id" :product="o" />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zl-product {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;
    align-items: start;
  }
  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: var(--zl-accent);
    img {
      width: 44px;
    }
    &--sit {
      color: var(--zl-sit);
    }
  }
  h1 {
    margin-top: 10px;
  }
  &__fats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
    .zl-fat {
      height: 30px;
      font-size: 14px;
    }
  }
  &__variants {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    small {
      color: var(--zl-muted);
      margin-right: 4px;
    }
    span {
      padding: 4px 10px;
      border-radius: 8px;
      background: var(--zl-surface);
      font-size: 14px;
      color: var(--zl-ink);
    }
  }
  ul.zl-product__desc {
    margin-top: 20px;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 26px;
  }
  &__note {
    margin-top: 10px;
    font-size: 13px;
    color: var(--zl-muted);
  }
  &__more {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-top: 56px;
    align-items: start;
    h2 {
      font-size: 24px;
      margin-bottom: 14px;
    }
  }
  &__back {
    margin-top: 28px;
  }
}
.zl-gallery {
  position: sticky;
  top: 100px;
  &__main {
    position: relative;
    aspect-ratio: 1 / 1;
    max-height: 560px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    border-radius: 24px;
    border: 1px solid var(--zl-line);
    background: #fff;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__medal {
    position: absolute;
    top: 16px;
    left: 16px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 32px;
    padding: 0 12px;
    border-radius: 9px;
    background: var(--zl-gold-bg);
    color: #8a5a00;
    font-weight: 700;
    font-size: 14px;
    .zl-icon {
      color: var(--zl-gold);
    }
  }
  &__thumbs {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    button,
    button:focus,
    button:active {
      width: 76px;
      height: 76px;
      padding: 6px;
      border-radius: 12px;
      border: 2px solid var(--zl-line);
      background: #fff;
    }
    button.is-on {
      border-color: var(--zl-accent);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
.zl-facts {
  margin: 24px 0 0;
  display: grid;
  border: 1px solid var(--zl-line);
  border-radius: var(--zl-R);
  > div {
    display: grid;
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 12px;
    padding: 14px 18px;
    & + div {
      border-top: 1px solid var(--zl-line);
    }
  }
  dt {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--zl-muted);
    .zl-icon {
      color: var(--zl-accent);
    }
  }
  dd {
    margin: 0;
    font-weight: 500;
    color: var(--zl-ink);
  }
}
.zl-nutri ul {
  display: flex;
  flex-direction: column;
  li {
    padding: 8px 0;
    border-bottom: 1px solid var(--zl-line);
    &:last-child {
      border-bottom: 0;
    }
    &.is-head {
      padding-top: 14px;
      font-weight: 600;
      color: var(--zl-ink);
      border-bottom: 0;
    }
  }
}
.zl-yawards {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 28px;
  border-radius: var(--zl-R);
  background: var(--zl-gold-bg);
  h2 {
    margin-bottom: 0 !important;
  }
  ol {
    display: flex;
    flex-direction: column;
    gap: 14px;
    list-style: none;
    padding: 0;
    margin: 0;
    > li {
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      gap: 12px;
    }
    b {
      font-family: var(--zl-head);
      font-size: 18px;
      color: #8a5a00;
    }
    ul li + li {
      margin-top: 6px;
    }
  }
}
@media (max-width: 1199px) {
  .zl-product__top {
    gap: 32px;
  }
  .zl-facts > div {
    grid-template-columns: 160px minmax(0, 1fr);
  }
}
@media (max-width: 989px) {
  .zl-product__top,
  .zl-product__more {
    grid-template-columns: minmax(0, 1fr);
  }
  .zl-gallery {
    position: static;
    &__main {
      max-height: 440px;
      aspect-ratio: auto;
      height: 440px;
    }
  }
}
@media (max-width: 576px) {
  .zl-gallery__main {
    height: 340px;
    padding: 20px;
  }
  .zl-facts > div {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
    padding: 12px 14px;
  }
  .zl-product__actions .zl-btn {
    flex: 1 1 100%;
  }
  .zl-yawards {
    padding: 20px;
    ol > li {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
  }
}
</style>
