<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'
import RkCard from '~/components/redesign/rkdon/RkCard.vue'

useSeoMeta({ title: 'Рыбокомбинат Донской — рыбные снеки и кальмар оптом от производителя | Концепт редизайна' })

// Горка тарелок первого экрана: их предметка сверху, у каждой — ссылка на позицию.
const plates = [
  { id: 'kalmar-struzhka-rvanaya-premium', x: 27, y: 0, s: 46 },
  { id: 'gorbusha-solomka-so-vkusom-kopcheniya', x: 0, y: 30, s: 36 },
  { id: 'kalmar-pautinka-svetlaya', x: 66, y: 16, s: 34 },
  { id: 'zhyeltyy-polosatik-s-pertsem', x: 22, y: 50, s: 42 },
  { id: 'kalmar-koltsa', x: 62, y: 52, s: 38 },
  { id: 'yantarnaya-rybka-kusochki-s-pertsem', x: 4, y: 72, s: 26 },
].map((p) => ({ ...p, product: rkProduct(p.id)! }))

const entries = [
  {
    to: rkPath('/products'),
    icon: 'box',
    title: 'Весовая продукция',
    text: `${rkPositions(rkProducts.length)} · пачки по 1 кг, короба по 10 кг`,
  },
  { to: rkPath('/stm'), icon: 'tag', title: 'Под вашей маркой', text: 'Рецептура, дизайн упаковки, штрих-коды, печать' },
  { to: rkPath('/tixy'), icon: 'store', title: 'Тиксы в магазинах', text: `${rkTixy.length} вкусов в пачках по 70 г` },
]

const kindsCount = rkKinds.map((k) => ({ ...k, list: rkProducts.filter((p) => p.kind === k.id) }))
const kindText: Record<string, string> = {
  squid: 'Кольца, стружка, полоски и паутинка — с солью, копчением, крабом, перцем, по-шанхайски и по-тайски.',
  fish: 'Жёлтый полосатик, таранка, янтарная рыбка, анчоус, минтай, соломка из лосося, горбуши, сома и щуки.',
}

const ribbon = [
  'kalmar-koltsa-so-vkusom-kraba',
  'kalmar-poloski-po-shankhayski',
  'taranka-s-pertsem-premium',
  'kalmar-pautinka-tyemnaya',
  'losos-solomka-s-aromatom-kopcheniya',
  'zhyeltyy-polosatik',
  'kalmar-koltsa-s-aromatom-kopcheniya',
  'som-solomka-so-vkusom-kopcheniya',
].map((id) => rkProduct(id)!)

const terms = [
  { icon: 'box', title: 'Короба по 10 кг', text: 'Пачки от 18 г до 1 кг или балком, если нужно' },
  { icon: 'store', title: 'Самовывоз', text: 'Все позиции — со склада в Новошахтинске' },
  { icon: 'truck', title: 'Своя логистика', text: 'Доставляет наша логистическая компания, часть рейсов — сторонние перевозчики' },
  { icon: 'snow', title: '4 холодильные камеры', text: 'Логистический центр при производстве' },
]

const ribbonEl = ref<HTMLElement>()
const newsEl = ref<HTMLElement>()
const scrollBy = (el: HTMLElement | undefined, dir: number) => {
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}
const tixyRow = rkTixy.filter((_, i) => [0, 4, 8, 3, 6, 14].includes(i))
</script>

<template>
  <div class="rk-home">
    <section class="rk-hero">
      <div class="rk-wrap rk-hero__grid">
        <div class="rk-hero__panel">
          <h1>Произведено на Дону</h1>
          <p class="rk-hero__lead">
            Сушёно-вяленые снеки из кальмара и рыбы. Отгружаем оптом коробами по 10 кг, делаем продукцию под маркой сетей и выпускаем
            «Тиксы» для магазинов.
          </p>
          <ul class="rk-hero__entries">
            <li v-for="e in entries" :key="e.title">
              <NuxtLink :to="e.to" class="rk-entry">
                <span class="rk-entry__icon"><RkIcon :name="e.icon" /></span>
                <span class="rk-entry__text"
                  ><b>{{ e.title }}</b><small>{{ e.text }}</small></span
                >
                <RkIcon name="arrow" :size="20" class="rk-entry__arrow" />
              </NuxtLink>
            </li>
          </ul>
          <div class="rk-hero__acts">
            <a :href="'tel:' + rkContacts.salesTel" class="rk-btn rk-btn--main"><RkIcon name="phone" :size="18" /> Отдел продаж</a>
            <a :href="rkMail('Запрос в отдел продаж')" class="rk-btn rk-btn--line"><RkIcon name="mail" :size="18" /> {{ rkContacts.email }}</a>
          </div>
        </div>
        <div class="rk-plates" aria-label="Продукция">
          <NuxtLink
            v-for="(p, i) in plates"
            :key="p.id"
            :to="rkProductPath(p.id)"
            class="rk-plate"
            :style="{ left: p.x + '%', top: p.y + '%', width: p.s + '%', '--d': i * 70 + 'ms' }"
            :aria-label="p.product.name"
          >
            <img :src="rkImg(p.product.imgs[0])" alt="" width="560" height="560" :loading="i < 3 ? 'eager' : 'lazy'" />
            <span class="rk-plate__label">{{ p.product.name }}</span>
          </NuxtLink>
          <span class="rk-plates__badge"><b>20 лет</b> качества</span>
        </div>
      </div>
      <div class="rk-wrap">
        <ul class="rk-facts rk-hero__facts">
          <li><b>~1 000</b><span>сотрудников на производстве</span></li>
          <li>
            <b>{{ rkProducts.length }}</b><span>позиции весовой рыбы и кальмара</span>
          </li>
          <li>
            <b>{{ rkStm.length + 1 }}</b><span>сетей продают нашу продукцию под своей маркой</span>
          </li>
          <li><b>2026</b><span>«Лучшее рыбоперерабатывающее предприятие» Ростовской области</span></li>
        </ul>
      </div>
    </section>

    <section class="rk-section rk-section--tight">
      <div class="rk-wrap rk-lines">
        <NuxtLink
          v-for="k in kindsCount"
          :key="k.id"
          :to="{ path: rkPath('/products'), query: { kind: k.id } }"
          class="rk-line"
          :class="'rk-line--' + k.id"
        >
          <span class="rk-line__text">
            <b>{{ k.id === 'squid' ? 'Кальмар' : 'Сушёная рыбка' }}</b>
            <span>{{ kindText[k.id] }}</span>
            <small>{{ rkPositions(k.list.length) }} <RkIcon name="arrow" :size="18" /></small>
          </span>
          <img :src="rkImg(k.icon)" alt="" width="440" height="398" loading="lazy" />
        </NuxtLink>
      </div>
    </section>

    <section class="rk-section rk-section--tight">
      <div class="rk-wrap">
        <div class="rk-head">
          <div>
            <h2>Весовая продукция</h2>
            <p>Пачки по 1 кг, отгрузка коробами по 10 кг. В карточке — состав и срок годности.</p>
          </div>
          <div class="rk-arrows">
            <button type="button" class="rk-arrow" aria-label="Назад" @click="scrollBy(ribbonEl, -1)"><RkIcon name="left" /></button>
            <button type="button" class="rk-arrow" aria-label="Вперёд" @click="scrollBy(ribbonEl, 1)"><RkIcon name="right" /></button>
            <NuxtLink :to="rkPath('/products')" class="rk-link">Все {{ rkPositions(rkProducts.length) }} <RkIcon name="arrow" :size="18" /></NuxtLink>
          </div>
        </div>
        <div ref="ribbonEl" class="rk-ribbon">
          <RkCard v-for="p in ribbon" :key="p.id" :p="p" />
        </div>
      </div>
    </section>

    <section class="rk-section rk-section--surface">
      <div class="rk-wrap rk-terms">
        <div class="rk-terms__intro">
          <h2>Оптом от производителя</h2>
          <p>
            Выпускаем десятки видов рыбных снеков, сушёной и вяленой рыбы, стружки кальмара и рыбных нарезок — для оптовых и розничных
            покупателей. Перед заказом сверьте стоимость и логистику с отделом продаж.
          </p>
          <div class="rk-terms__acts">
            <a :href="'tel:' + rkContacts.salesTel" class="rk-btn rk-btn--main"><RkIcon name="phone" :size="18" /> {{ rkContacts.sales }}</a>
            <a :href="rkMail('Оптовый заказ')" class="rk-btn rk-btn--line"><RkIcon name="mail" :size="18" /> Написать</a>
          </div>
        </div>
        <ul class="rk-terms__list">
          <li v-for="t in terms" :key="t.title">
            <span class="rk-terms__icon"><RkIcon :name="t.icon" /></span>
            <span
              ><b>{{ t.title }}</b><small>{{ t.text }}</small></span
            >
          </li>
        </ul>
      </div>
    </section>

    <section class="rk-section">
      <div class="rk-wrap rk-split">
        <div class="rk-split__text">
          <h2>Под вашей торговой маркой</h2>
          <p>
            Размещаем на упаковке фирменную символику заказчика, по желанию разрабатываем эксклюзивную рецептуру. Дизайн упаковки,
            штрих-коды и печать в типографии берём на себя.
          </p>
          <NuxtLink :to="rkPath('/stm')" class="rk-link">Как работаем с сетями <RkIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <div class="rk-logos">
          <span v-for="l in rkStm.slice(0, 9)" :key="l"><img :src="rkImg(l)" alt="" loading="lazy" /></span>
        </div>
      </div>
    </section>

    <section class="rk-section rk-section--tight">
      <div class="rk-wrap">
        <NuxtLink :to="rkPath('/tixy')" class="rk-tixyband">
          <span class="rk-tixyband__text">
            <img :src="rkImg('i/logotiksi.png')" alt="Тиксы" width="180" height="58" />
            <b>Закуска к пиву. Попробуй каждый цвет!</b>
            <small>{{ rkTixy.length }} вкусов в пачках по 70 г <RkIcon name="arrow" :size="18" /></small>
          </span>
          <span class="rk-tixyband__packs">
            <img v-for="t in tixyRow" :key="t.img" :src="rkImg(t.img)" :alt="t.name" width="250" height="321" loading="lazy" />
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="rk-section rk-section--tight">
      <div class="rk-wrap">
        <div class="rk-head">
          <h2>Новости</h2>
          <div class="rk-arrows">
            <button type="button" class="rk-arrow" aria-label="Предыдущие новости" @click="scrollBy(newsEl, -1)"><RkIcon name="left" /></button>
            <button type="button" class="rk-arrow" aria-label="Следующие новости" @click="scrollBy(newsEl, 1)"><RkIcon name="right" /></button>
            <NuxtLink :to="rkPath('/news')" class="rk-link">Все новости <RkIcon name="arrow" :size="18" /></NuxtLink>
          </div>
        </div>
        <div ref="newsEl" class="rk-newsrow">
          <NuxtLink v-for="n in rkNews.slice(0, 6)" :key="n.id" :to="rkNewsPath(n.id)" class="rk-newscard">
            <time>{{ n.date }}</time>
            <b>{{ n.title }}</b>
            <span>{{ n.text[0] }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="rk-section">
      <div class="rk-wrap rk-factory">
        <img :src="rkImg('i/company1.jpg')" alt="Здание рыбокомбината в Новошахтинске" width="1400" height="577" loading="lazy" />
        <div class="rk-factory__text">
          <h2>Производство без аналогов в России</h2>
          <p>
            Высокая автоматизация сушки и вялки, оборудование для филетировки и упаковки, контроль сырья и готовой продукции на всех
            стадиях.
          </p>
          <NuxtLink :to="rkPath('/company')" class="rk-link">О компании <RkIcon name="arrow" :size="18" /></NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.rk-hero {
  padding-top: 40px;
  padding-bottom: 8px;
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 48px;
    align-items: center;
  }
  &__panel {
    display: grid;
    gap: 22px;
    align-content: center;
    h1 {
      font-size: clamp(44px, 5.6vw, 76px);
      line-height: 1;
      color: var(--rk-accent);
    }
  }
  &__lead {
    font-size: 18px;
    max-width: 560px;
  }
  &__entries {
    display: grid;
    gap: 8px;
  }
  &__acts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  ul.rk-hero__facts {
    margin-top: 32px;
    padding-top: 28px;
    border-top: 1px solid var(--rk-line);
  }
}
.rk-entry {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px 12px 12px;
  border-radius: 16px;
  background: var(--rk-surface);
  transition: background 0.2s;
  &__icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #fff;
    color: var(--rk-accent);
    flex: none;
  }
  &__text {
    display: grid;
    line-height: 1.3;
    min-width: 0;
    b {
      color: var(--rk-ink);
      font-size: 16px;
    }
    small {
      color: var(--rk-muted);
      font-size: 14px;
    }
  }
  &__arrow {
    margin-left: auto;
    color: var(--rk-accent);
    flex: none;
    transition: transform 0.2s;
  }
  &:hover {
    background: var(--rk-soft);
    .rk-entry__arrow {
      transform: translateX(3px);
    }
  }
}

.rk-plates {
  position: relative;
  aspect-ratio: 1 / 0.98;
  &__badge {
    position: absolute;
    left: 2%;
    top: 4%;
    z-index: 4;
    display: grid;
    padding: 12px 16px;
    border-radius: 16px;
    background: var(--rk-soft);
    color: var(--rk-accent);
    font-weight: 700;
    line-height: 1.15;
    b {
      font-family: var(--rk-head);
      font-weight: 600;
      font-size: 30px;
    }
  }
}
.rk-plate {
  position: absolute;
  aspect-ratio: 1;
  z-index: 1;
  animation: rk-plate-in 0.6s both;
  animation-delay: var(--d);
  img {
    width: 100%;
    height: 100%;
    clip-path: circle(43.5% at 50% 50%);
    transition: transform 0.35s;
  }
  &__label {
    position: absolute;
    left: 50%;
    bottom: 4%;
    width: max-content;
    max-width: 100%;
    padding: 6px 12px;
    text-align: center;
    line-height: 1.3;
    border-radius: 10px;
    background: #fff;
    border: 1px solid var(--rk-line);
    box-shadow: 0 6px 18px rgba(42, 17, 24, 0.12);
    font-size: 14px;
    font-weight: 700;
    color: var(--rk-ink);
    transform: translate(-50%, 6px);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.2s,
      transform 0.2s;
  }
  &:hover,
  &:focus-visible {
    z-index: 3;
    img {
      transform: scale(1.05);
    }
    .rk-plate__label {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
}
@keyframes rk-plate-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
  }
}

.rk-lines {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.rk-line {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
  align-items: center;
  gap: 12px;
  min-height: 260px;
  padding: 28px 20px 28px 32px;
  border-radius: var(--rk-R);
  overflow: hidden;
  &--squid {
    background: var(--rk-squid-bg);
    --c: var(--rk-squid);
  }
  &--fish {
    background: var(--rk-fish-bg);
    --c: var(--rk-fish);
  }
  &__text {
    display: grid;
    gap: 10px;
    align-content: center;
    b {
      font-family: var(--rk-head);
      font-weight: 600;
      font-size: clamp(28px, 3vw, 38px);
      line-height: 1.05;
      color: var(--rk-ink);
    }
    small {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 800;
      color: var(--c);
    }
  }
  img {
    width: 100%;
    max-height: 230px;
    object-fit: contain;
    transition: transform 0.35s;
  }
  &:hover img {
    transform: scale(1.05) rotate(-2deg);
  }
}

.rk-arrows {
  display: flex;
  align-items: center;
  gap: 8px;
  .rk-link {
    margin-left: 10px;
  }
}
.rk-arrow,
.rk-arrow:focus,
.rk-arrow:active {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--rk-line);
  background: #fff;
  color: var(--rk-ink);
}
.rk-arrow:hover {
  border-color: var(--rk-accent);
  color: var(--rk-accent);
}
.rk-ribbon,
.rk-newsrow {
  display: grid;
  grid-auto-flow: column;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: #dccbd1 transparent;
  padding-bottom: 12px;
  -webkit-mask-image: linear-gradient(90deg, #000 94%, transparent);
  mask-image: linear-gradient(90deg, #000 94%, transparent);
  > * {
    scroll-snap-align: start;
  }
}
.rk-ribbon {
  grid-auto-columns: calc((100% - 3 * 20px) / 4.3);
}
.rk-newsrow {
  grid-auto-columns: calc((100% - 2 * 20px) / 3.3);
}
.rk-newscard {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 220px;
  padding: 22px 24px;
  border-radius: var(--rk-R);
  background: var(--rk-surface);
  transition: background 0.2s;
  time {
    font-size: 14px;
    font-weight: 700;
    color: var(--rk-accent);
  }
  b {
    font-size: 18px;
    line-height: 1.3;
    color: var(--rk-ink);
  }
  span {
    color: var(--rk-muted);
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &:hover {
    background: var(--rk-soft);
  }
}

.rk-terms {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: center;
  &__intro {
    display: grid;
    gap: 16px;
    h2 {
      font-size: clamp(28px, 3.2vw, 40px);
    }
    p {
      font-size: 16px;
    }
  }
  &__acts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
  }
  ul.rk-terms__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    li {
      display: flex;
      gap: 14px;
      padding: 20px;
      border-radius: 18px;
      background: #fff;
    }
    span:last-child {
      display: grid;
      gap: 4px;
      line-height: 1.35;
    }
    b {
      color: var(--rk-ink);
      font-size: 16px;
    }
    small {
      color: var(--rk-muted);
      font-size: 14px;
    }
  }
  &__icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--rk-soft);
    color: var(--rk-accent);
    flex: none;
  }
}

.rk-split {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: center;
  &__text {
    display: grid;
    gap: 16px;
    justify-items: start;
    h2 {
      font-size: clamp(28px, 3.2vw, 40px);
    }
    p {
      font-size: 16px;
    }
  }
}
.rk-logos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  span {
    display: grid;
    place-items: center;
    height: 96px;
    padding: 14px 18px;
    border-radius: 16px;
    border: 1px solid var(--rk-line);
    background: #fff;
  }
  img {
    max-width: 100%;
    max-height: 60px;
    width: auto;
    object-fit: contain;
  }
}

.rk-tixyband {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 24px;
  padding: 32px 0 32px 40px;
  border-radius: var(--rk-R);
  background: #0a92c4;
  color: #fff;
  overflow: hidden;
  &__text {
    display: grid;
    gap: 12px;
    justify-items: start;
    img {
      width: 170px;
    }
    b {
      font-family: var(--rk-head);
      font-weight: 600;
      font-size: clamp(24px, 2.6vw, 34px);
      line-height: 1.1;
    }
    small {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 800;
    }
  }
  &__packs {
    display: flex;
    gap: 14px;
    margin-right: -40px;
    img {
      width: 150px;
      flex: none;
      border-radius: 12px;
      transition: transform 0.3s;
    }
  }
  &:hover &__packs img:nth-child(odd) {
    transform: translateY(-6px) rotate(-2deg);
  }
}

.rk-factory {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
  img {
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
    object-fit: cover;
    border-radius: var(--rk-R);
  }
  &__text {
    display: grid;
    gap: 16px;
    justify-items: start;
    h2 {
      font-size: clamp(28px, 3.2vw, 40px);
    }
    p {
      font-size: 16px;
    }
  }
}

@media (max-width: 1400px) {
  .rk-tixyband__packs img {
    width: 130px;
  }
}
@media (max-width: 1199px) {
  .rk-hero__grid {
    gap: 32px;
  }
  .rk-ribbon {
    grid-auto-columns: calc((100% - 2 * 20px) / 3.3);
  }
  .rk-terms,
  .rk-split,
  .rk-factory {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  .rk-tixyband {
    grid-template-columns: minmax(0, 1fr);
    padding: 28px 0 0 28px;
    &__packs {
      margin-right: 0;
      margin-bottom: -24px;
    }
  }
}
@media (max-width: 989px) {
  .rk-hero__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-plates {
    order: -1;
    width: min(100%, 560px);
    margin: 0 auto;
    aspect-ratio: 1 / 0.86;
  }
  .rk-lines {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-newsrow {
    grid-auto-columns: calc((100% - 20px) / 2.2);
  }
}
@media (max-width: 768px) {
  .rk-hero {
    padding-top: 16px;
  }
  .rk-hero__panel {
    gap: 18px;
  }
  .rk-hero__lead {
    font-size: 16px;
  }
  .rk-plates__badge {
    padding: 8px 12px;
    font-size: 13px;
    b {
      font-size: 22px;
    }
  }
  ul.rk-hero__facts {
    grid-template-columns: 1fr 1fr;
    b {
      font-size: 26px;
    }
  }
  .rk-ribbon {
    grid-auto-columns: calc((100% - 12px) / 2.25);
    gap: 12px;
  }
  .rk-newsrow {
    grid-auto-columns: 82%;
    gap: 12px;
  }
  .rk-arrows .rk-arrow {
    display: none;
  }
  .rk-arrows .rk-link {
    margin-left: 0;
  }
  .rk-terms ul.rk-terms__list {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-logos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    span {
      height: 80px;
    }
  }
  .rk-line {
    min-height: 0;
    padding: 22px 12px 22px 20px;
    img {
      max-height: 150px;
    }
  }
  .rk-tixyband {
    padding: 24px 0 0 20px;
    &__packs img {
      width: 108px;
    }
  }
}
@media (max-width: 576px) {
  .rk-hero__acts {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-line {
    grid-template-columns: minmax(0, 1fr) 110px;
    &__text span {
      font-size: 14px;
    }
  }
}
@media (max-width: 375px) {
  ul.rk-hero__facts {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-entry {
    padding: 10px 12px 10px 10px;
    gap: 10px;
    &__icon {
      width: 38px;
      height: 38px;
    }
  }
}
@media (max-width: 768px) {
  .rk-logos span:nth-child(9) {
    display: none;
  }
}
</style>
