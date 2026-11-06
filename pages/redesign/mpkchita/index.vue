<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'
import MkCard from '~/components/redesign/mpkchita/MkCard.vue'
import MkStores from '~/components/redesign/mpkchita/MkStores.vue'

useSeoMeta({ title: 'Маккавеевский пищекомбинат — делиться лучшим! | Концепт редизайна' })

const ui = useMpkchitaUi()
const tab = ref(0)
const pick = ref(0)
const counter = computed(() => mkCounter[tab.value])
const items = computed(() => counter.value.ids.map((id) => mkProduct(id)!).filter(Boolean))
const cur = computed(() => items.value[pick.value] ?? items.value[0])
const setTab = (i: number) => {
  tab.value = i
  pick.value = 0
}
const openNow = computed(() => mkStores.filter((s) => mkStatus(s, ui.now.value).open).length)

const novelties = mkProducts.filter((p) => p.isNew)
const promo = mkNews[0]
const daysLeft = computed(() => mkPromoDaysLeft(promo, ui.now.value))
const weekend = mkNews[1]
const fresh = mkNews.filter((n) => n.kind === 'Новинка').slice(0, 4)
const subsOf = (top: string) => mkSubs.filter((s) => s.top === top)
</script>

<template>
  <div class="mk-home">
    <section class="mk-wrap mk-hero">
      <div class="mk-hero__panel">
        <p class="mk-hero__kicker">МПК — родное Забайкалье</p>
        <h1>Делиться лучшим!</h1>
        <p class="mk-hero__lead">
          Колбасы, деликатесы, полуфабрикаты и рыба собственного производства — с 1997 года, из Маккавеево и Читы. Продаём в своих магазинах
          «Маккавеевский» по городу и краю.
        </p>
        <div class="mk-hero__btns">
          <NuxtLink :to="mkPath('/catalog')" class="mk-btn mk-btn--main">Вся продукция <MkIcon name="arrow" :size="18" /></NuxtLink>
          <NuxtLink :to="mkPath('/gde-kupit')" class="mk-btn mk-btn--line"><MkIcon name="pin" :size="18" /> Где купить</NuxtLink>
        </div>
        <NuxtLink :to="mkPath('/gde-kupit')" class="mk-hero__now">
          <i class="mk-dot" :class="{ 'is-off': !openNow }" />
          <span>
            <b>{{ openNow ? 'Сейчас открыто ' + mkPlural(openNow, 'магазин', 'магазина', 'магазинов') : 'Магазины откроются в 09:00' }}</b>
            <small>«Маккавеевский» — {{ mkStores.length }} адресов в Чите и крае, без перерыва и выходных</small>
          </span>
          <MkIcon name="arrow" :size="18" />
        </NuxtLink>
      </div>

      <div class="mk-counter">
        <div class="mk-counter__tabs" role="tablist" aria-label="Что на прилавке">
          <button
            v-for="(c, i) in mkCounter"
            :key="c.title"
            type="button"
            role="tab"
            :aria-selected="i === tab"
            :class="{ 'is-on': i === tab }"
            @click="setTab(i)"
          >
            {{ c.title }}
          </button>
        </div>
        <div class="mk-counter__stage">
          <div class="mk-counter__herobox">
          <Transition name="mk-swap" mode="out-in">
            <NuxtLink :key="cur.id" :to="mkPath('/product/' + cur.id)" class="mk-counter__hero">
              <img :src="mkImg('h/' + cur.id + '.webp')" :alt="cur.name" width="640" height="600" />
            </NuxtLink>
          </Transition>
          </div>
          <div class="mk-counter__label">
            <small>{{ mkSub(cur.sub)?.title }}</small>
            <NuxtLink :to="mkPath('/product/' + cur.id)">{{ cur.name }}</NuxtLink>
            <p>{{ cur.comp || mkSub(cur.sub)?.title }}</p>
          </div>
        </div>
        <div class="mk-counter__thumbs">
          <button
            v-for="(p, i) in items"
            :key="p.id"
            type="button"
            :class="{ 'is-on': i === pick }"
            :aria-label="p.name"
            :title="p.name"
            @click="pick = i"
          >
            <img :src="mkImg('h/' + p.id + '.webp')" alt="" width="120" height="110" />
          </button>
          <NuxtLink :to="mkPath('/catalog/' + counter.to)" class="mk-counter__more">
            Весь раздел <MkIcon name="arrow" :size="16" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mk-wrap mk-section mk-sections">
      <div class="mk-head">
        <div>
          <h2>Продукция</h2>
          <p>287 позиций в 34 разделах. Состав и срок годности — у каждой, цены — в магазинах «Маккавеевский».</p>
        </div>
        <NuxtLink :to="mkPath('/catalog')" class="mk-head__more">Весь каталог <MkIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="mk-sections__grid">
        <article v-for="t in mkTops" :key="t.slug" class="mk-sect" :class="'mk-sect--' + t.slug">
          <NuxtLink :to="mkPath('/catalog/' + t.slug)" class="mk-sect__head">
            <img :src="mkImg(t.icon)" alt="" width="172" height="65" />
            <span>
              <b>{{ t.title }}</b>
              <small>{{ t.count ? mkPlural(t.count, 'позиция', 'позиции', 'позиций') : 'в магазинах «Маккавеевский»' }}</small>
            </span>
            <MkIcon name="arrow" :size="20" />
          </NuxtLink>
          <div class="mk-sect__subs">
            <NuxtLink v-for="s in subsOf(t.slug).slice(0, t.slug === 'myaso' ? 10 : 7)" :key="s.slug" :to="mkPath('/catalog/' + s.slug)">
              {{ s.short }}
            </NuxtLink>
            <NuxtLink v-if="subsOf(t.slug).length > 10 && t.slug === 'myaso'" :to="mkPath('/catalog/' + t.slug)" class="is-more"
              >ещё {{ subsOf(t.slug).length - 10 }}</NuxtLink
            >
          </div>
        </article>
      </div>
    </section>

    <section class="mk-section mk-section--tint">
      <div class="mk-wrap">
        <div class="mk-head">
          <div>
            <h2>Новинки</h2>
            <p>На упаковке — красный ярлык «Новинка», ищите их на витринах.</p>
          </div>
          <NuxtLink :to="mkPath('/news')" class="mk-head__more">Акции и новинки <MkIcon name="arrow" :size="16" /></NuxtLink>
        </div>
        <div class="mk-shelf">
          <MkCard v-for="p in novelties" :key="p.id" :p="p" />
        </div>
      </div>
    </section>

    <section class="mk-wrap mk-section mk-promo">
      <NuxtLink :to="mkPath('/news/' + promo.id)" class="mk-promo__main">
        <img :src="mkImg(promo.img)" :alt="promo.title" width="900" height="1273" loading="lazy" />
        <div>
          <span class="mk-flag mk-flag--red">Акция</span>
          <h2>{{ promo.title }}</h2>
          <p>{{ promo.text }}</p>
          <p v-if="daysLeft" class="mk-promo__left">
            <MkIcon name="clock" :size="18" />
            {{ daysLeft === 1 ? 'Последний день' : 'Ещё ' + mkPlural(daysLeft, 'день', 'дня', 'дней') }} — до 11 ноября включительно
          </p>
          <span class="mk-promo__go">Смотреть плакат акции <MkIcon name="arrow" :size="16" /></span>
        </div>
      </NuxtLink>
      <div class="mk-promo__side">
        <NuxtLink :to="mkPath('/news/' + weekend.id)" class="mk-promo__weekend">
          <img :src="mkImg(weekend.img)" alt="" width="900" height="1273" loading="lazy" />
          <span><span class="mk-flag">Каждые выходные</span><b>{{ weekend.title }}</b><small>{{ weekend.text }}</small></span>
        </NuxtLink>
        <div class="mk-promo__news">
          <NuxtLink v-for="n in fresh" :key="n.id" :to="mkPath('/news/' + n.id)">
            <img :src="mkImg(n.img)" alt="" width="900" height="1273" loading="lazy" />
            <span>{{ n.title }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mk-section mk-section--tint">
      <div class="mk-wrap mk-where">
        <div class="mk-where__intro">
          <h2>Где купить</h2>
          <p>
            Свои магазины «Маккавеевский» — в каждом районе Читы, в Читинском районе и по краю. Работают без перерыва и выходных; часть по понедельникам —
            с 11:00. Статус считаем по времени Читы.
          </p>
          <div class="mk-where__opt">
            <h3>Оптовым покупателям</h3>
            <ul>
              <li v-for="o in mkOpt" :key="o.address">
                <b>{{ o.address.replace(/,? ?стр\..*$/, '').replace(/,? проезд.*$/, '') }}</b>
                <a v-for="ph in o.phone.split(', ')" :key="ph" :href="'tel:' + ph.replace(/[^\d+]/g, '')">{{ ph }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="mk-where__list">
          <MkStores compact />
        </div>
      </div>
    </section>

    <section class="mk-wrap mk-section mk-about">
      <figure class="mk-about__pic">
        <img :src="mkImg('a/1.webp')" alt="Маккавеевский пищекомбинат" width="500" height="350" loading="lazy" />
      </figure>
      <div class="mk-about__text">
        <h2>С 1997 года — из Маккавеево</h2>
        <p>
          В советские годы в селе Маккавеево работал колбасный цех райпотребсоюза. В 90-е его едва не закрыли, но люди сохранили цех — и в 1997 году здесь
          появился Маккавеевский пищекомбинат. Через семь лет открылся цех в Чите, сегодня он основной.
        </p>
        <dl class="mk-about__nums">
          <div><dt>1997</dt><dd>год основания</dd></div>
          <div><dt>300+</dt><dd>сотрудников</dd></div>
          <div><dt>39</dt><dd>своих магазинов</dd></div>
          <div><dt>6</dt><dd>медалей и дипломов</dd></div>
        </dl>
        <div class="mk-about__links">
          <NuxtLink :to="mkPath('/about')" class="mk-btn mk-btn--line">О компании <MkIcon name="arrow" :size="16" /></NuxtLink>
          <NuxtLink :to="mkPath('/about#awards')" class="mk-btn mk-btn--soft"><MkIcon name="award" :size="18" /> Награды</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.mk-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 28px;
  padding-top: 28px;
  &__panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px 8px 8px 0;
  }
  &__kicker {
    font: 700 19px/1.2 var(--mk-head);
    color: var(--mk-red);
  }
  h1 {
    margin-top: 10px;
    font-size: clamp(44px, 5.6vw, 76px);
    line-height: 1;
    letter-spacing: -0.015em;
  }
  &__lead {
    margin-top: 18px;
    max-width: 520px;
    font-size: 17px;
    color: var(--mk-text);
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 26px;
    .mk-btn {
      min-height: 52px;
      padding: 0 24px;
    }
  }
  &__now {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 28px;
    max-width: 520px;
    padding: 14px 16px;
    border-radius: 14px;
    background: var(--mk-surface);
    transition: background 0.15s;
    &:hover {
      background: #ebebed;
    }
    span {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      line-height: 1.35;
    }
    b {
      color: var(--mk-ink);
    }
    small {
      font-size: 13px;
      color: var(--mk-muted);
    }
    > .mk-icon {
      color: var(--mk-red);
    }
  }
}

/* Прилавок: вкладки разделов, крупный продукт и ряд миниатюр */
.mk-counter {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 14px;
  border-radius: 24px;
  background: var(--mk-surface);
  &__tabs {
    display: flex;
    gap: 4px;
    padding: 4px;
    border-radius: 14px;
    background: #fff;
    overflow-x: auto;
    scrollbar-width: none;
    button {
      flex: 1 0 auto;
      height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14.5px;
      color: var(--mk-muted);
      white-space: nowrap;
      transition:
        background 0.15s,
        color 0.15s;
      &:hover {
        color: var(--mk-ink);
      }
      &.is-on {
        background: var(--mk-red);
        color: #fff;
      }
    }
  }
  &__stage {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    height: 352px;
    padding: 8px 8px 0;
  }
  &__herobox {
    height: 330px;
  }
  &__hero {
    display: grid;
    place-items: center;
    height: 100%;
    img {
      max-height: 300px;
      width: auto;
      max-width: 92%;
      object-fit: contain;
      filter: drop-shadow(0 18px 22px rgba(60, 30, 20, 0.16));
    }
  }
  &__label {
    position: absolute;
    left: 12px;
    bottom: 4px;
    max-width: min(330px, 62%);
    padding: 12px 14px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 6px 18px rgba(37, 31, 28, 0.08);
    small {
      display: block;
      font-size: 12.5px;
      color: var(--mk-muted);
    }
    a {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 700;
      font-size: 16px;
      line-height: 1.3;
      color: var(--mk-ink);
      &:hover {
        color: var(--mk-red);
      }
    }
    p {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.8em;
      margin-top: 4px;
      font-size: 13px;
      line-height: 1.4;
      color: var(--mk-muted);
    }
  }
  &__thumbs {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr)) auto;
    gap: 8px;
    margin-top: 14px;
    button {
      position: relative;
      aspect-ratio: 1.15;
      border-radius: 12px;
      background: #fff;
      border: 2px solid transparent;
      overflow: hidden;
      transition: border-color 0.15s;
      img {
        position: absolute;
        inset: 6px;
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        object-fit: contain;
      }
      &:hover {
        border-color: var(--mk-line);
      }
      &.is-on,
      &.is-on:focus {
        border-color: var(--mk-red);
      }
    }
  }
  &__more {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--mk-red);
    white-space: nowrap;
  }
}
.mk-swap-enter-active,
.mk-swap-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}
.mk-swap-enter-from {
  opacity: 0;
  transform: translateX(14px);
}
.mk-swap-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}

/* Разделы */
.mk-sections__grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 20px;
}
.mk-sect {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--mk-line);
  border-radius: var(--mk-R);
  &__head {
    display: flex;
    align-items: center;
    gap: 14px;
    img {
      width: 92px;
      height: 46px;
      object-fit: contain;
    }
    span {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    b {
      font: 700 24px/1.1 var(--mk-head);
      color: var(--mk-ink);
    }
    small {
      color: var(--mk-muted);
      font-size: 13.5px;
    }
    > .mk-icon {
      color: var(--mk-red);
    }
    &:hover b {
      color: var(--mk-red);
    }
  }
  &__subs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 18px;
    a {
      padding: 6px 11px;
      border-radius: 9px;
      background: var(--mk-surface);
      font-size: 13.5px;
      color: var(--mk-text);
      transition:
        background 0.15s,
        color 0.15s;
      &:hover {
        background: var(--mk-soft);
        color: var(--mk-red);
      }
      &.is-more {
        background: none;
        color: var(--mk-red);
        font-weight: 600;
      }
    }
  }
}

/* Полка новинок — лентой с краем следующей карточки */
.mk-shelf {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 4 * 20px) / 4.4);
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 12px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: #d4d4d8 transparent;
  .mk-card {
    scroll-snap-align: start;
  }
}

/* Акции */
.mk-promo {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 20px;
  &__main {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    align-items: start;
    gap: 28px;
    padding: 20px;
    border-radius: var(--mk-R);
    background: var(--mk-soft);
    img {
      width: 100%;
      border-radius: 12px;
      aspect-ratio: 0.72;
      object-fit: cover;
    }
    > div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 8px 4px;
    }
    h2 {
      font-size: clamp(28px, 3vw, 38px);
    }
  }
  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 10px;
    background: #fff;
    font-weight: 600;
    color: var(--mk-red);
  }
  &__go {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-weight: 600;
    color: var(--mk-red);
  }
  &__side {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 20px;
  }
  &__weekend {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    padding: 16px;
    border-radius: var(--mk-R);
    background: var(--mk-yellow-bg);
    img {
      border-radius: 10px;
      aspect-ratio: 0.72;
      object-fit: cover;
    }
    > span {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    b {
      font: 700 24px/1.15 var(--mk-head);
      color: var(--mk-ink);
    }
    small {
      color: var(--mk-text);
      font-size: 14px;
    }
  }
  &__news {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    align-items: start;
    a {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--mk-ink);
      &:hover {
        color: var(--mk-red);
      }
    }
    span {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.7em;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.35;
    }
    img {
      border-radius: 10px;
      aspect-ratio: 0.72;
      object-fit: cover;
      border: 1px solid var(--mk-line);
    }
  }
}

/* Где купить */
.mk-where {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 40px;
  &__intro {
    h2 {
      font-size: clamp(28px, 3vw, 38px);
    }
    > p {
      margin-top: 10px;
      color: var(--mk-muted);
    }
  }
  &__opt {
    margin-top: 28px;
    padding: 20px;
    border-radius: var(--mk-R);
    background: #fff;
    h3 {
      font-size: 21px;
      margin-bottom: 10px;
    }
    ul.mk-where__optlist,
    ul {
      display: grid;
      gap: 12px;
    }
    li {
      display: flex;
      flex-wrap: wrap;
      gap: 2px 12px;
      b {
        flex: 0 0 100%;
        font-weight: 600;
        color: var(--mk-ink);
      }
      a {
        color: var(--mk-red);
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
      }
    }
  }
  &__list {
    padding: 20px 24px 24px;
    border-radius: var(--mk-R);
    background: #fff;
    min-width: 0;
  }
}

/* О комбинате */
.mk-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;
  &__pic img {
    width: 100%;
    aspect-ratio: 1.43;
    object-fit: cover;
    border-radius: 20px;
  }
  &__text {
    h2 {
      font-size: clamp(28px, 3vw, 38px);
    }
    > p {
      margin-top: 14px;
      color: var(--mk-text);
    }
  }
  &__nums {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 26px;
    div {
      padding: 14px;
      border-radius: 14px;
      background: var(--mk-surface);
    }
    dt {
      font: 700 30px/1 var(--mk-head);
      color: var(--mk-red);
    }
    dd {
      margin-top: 6px;
      font-size: 13px;
      color: var(--mk-muted);
      line-height: 1.3;
    }
  }
  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
  }
}

@media (max-width: 1199px) {
  .mk-hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  .mk-counter__thumbs {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .mk-counter__more {
    display: none;
  }
  .mk-sections__grid {
    grid-template-columns: 1fr 1fr;
  }
  .mk-sect--myaso {
    grid-column: 1 / -1;
  }
  .mk-shelf {
    grid-auto-columns: calc((100% - 2 * 20px) / 3.3);
  }
  .mk-promo {
    grid-template-columns: minmax(0, 1fr);
  }
  .mk-promo__main {
    grid-template-columns: 260px minmax(0, 1fr);
  }
  .mk-about__nums {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 989px) {
  .mk-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
    padding-top: 20px;
  }
  .mk-hero__panel {
    display: contents;
  }
  .mk-hero__kicker {
    order: 1;
  }
  .mk-hero h1 {
    order: 2;
    margin-top: -8px;
  }
  .mk-hero__lead {
    order: 3;
    margin-top: -6px;
    max-width: none;
  }
  .mk-counter {
    order: 4;
  }
  .mk-hero__btns {
    order: 5;
    margin-top: 0;
  }
  .mk-hero__now {
    order: 6;
    margin-top: 0;
    max-width: none;
  }
  .mk-where {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  .mk-where__list {
    order: -1;
  }
  .mk-where__intro {
    display: contents;
  }
  .mk-where__intro h2 {
    order: -3;
  }
  .mk-where__intro > p {
    order: -2;
    margin-top: -14px;
  }
  .mk-where__opt {
    margin-top: 0;
  }
  .mk-about {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}
@media (max-width: 768px) {
  .mk-sections__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .mk-shelf {
    grid-auto-columns: calc((100% - 20px) / 2.3);
  }
  .mk-promo__main {
    grid-template-columns: minmax(0, 1fr);
    img {
      max-height: 360px;
      aspect-ratio: auto;
      object-fit: cover;
      object-position: top;
    }
  }
  .mk-promo__news {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .mk-counter__stage {
    height: auto;
  }
  .mk-counter__herobox {
    height: 250px;
  }
  .mk-counter__hero {
    img {
      max-height: 220px;
    }
  }
  .mk-counter__label {
    position: static;
    max-width: none;
    margin-top: 12px;
    a {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      min-height: 2.6em;
    }
  }
}
@media (max-width: 576px) {
  .mk-hero h1 {
    font-size: 44px;
  }
  .mk-hero__lead {
    font-size: 15.5px;
  }
  .mk-hero__btns .mk-btn {
    flex: 1 1 0;
    padding: 0 14px;
  }
  .mk-counter {
    padding: 10px;
    border-radius: 20px;
  }
  .mk-counter__tabs {
    margin: 0 -2px;
  }
  .mk-counter__tabs button {
    padding: 0 12px;
    font-size: 14px;
  }
  .mk-counter__herobox {
    height: 210px;
  }
  .mk-counter__hero {
    img {
      max-height: 190px;
    }
  }
  .mk-counter__thumbs {
    gap: 6px;
    margin-top: 10px;
  }
  .mk-shelf {
    grid-auto-columns: calc((100% - 12px) / 1.7);
    gap: 12px;
  }
  .mk-sect {
    padding: 16px;
  }
  .mk-sect__head img {
    width: 72px;
  }
  .mk-promo__weekend {
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 14px;
    b {
      font-size: 20px;
    }
  }
  .mk-where__list {
    padding: 16px;
    margin: 0 -4px;
  }
}
@media (max-width: 375px) {
  .mk-hero h1 {
    font-size: 38px;
  }
  .mk-hero__btns {
    flex-direction: column;
  }
  .mk-counter__tabs button {
    padding: 0 10px;
    font-size: 13.5px;
  }
  .mk-about__nums dt {
    font-size: 26px;
  }
}
</style>
