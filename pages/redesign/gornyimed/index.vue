<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'
import GmJarCard from '~/components/redesign/gornyimed/GmJarCard.vue'
import GmMore from '~/components/redesign/gornyimed/GmMore.vue'

useSeoMeta({ title: 'Пасеки Соловьёвых — мёд с Горного Алтая | Концепт редизайна' })

const shop = useGornyimedShop()
const ui = useGornyimedUi()
const [sergey] = gmContacts.people

// Две банки на фото первого экрана — 1 кг каждого сорта
const heroJars = ['grech-1', 'razno-1'].map((id) => gmProduct(id)!)
const addJar = (id: string) => {
  shop.add(`p:${id}`)
  const p = gmProduct(id)!
  ui.say(`В корзине: ${gmSort(p.sort)?.title}, ${p.pack}`)
}

// Лесенка «цена за кг от тары» — по гречишному (у разнотравья те же цены)
const ladder = gmPacksOf('grech')
const maxKg = Math.max(...ladder.map(gmPerKg))

const offers = gmBulk.filter((b) => b.perKg)
const addBulk = (id: string) => {
  shop.add(`b:${id}`)
  ui.say(`В корзине: опт, ${gmBulkOf(id)?.short} — куботейнер`)
}

const latest = gmNews.slice(0, 3)
const stickMail = `mailto:${gmContacts.email}?subject=${encodeURIComponent('Мёд в стиках для кафе')}`
</script>

<template>
  <div class="gm-home">
    <!-- Первый экран Y «пасека за банкой» -->
    <section class="gm-wrap gm-hero">
      <div class="gm-hero__text">
        <span class="gm-label">Мёд сбора 2026 в продаже</span>
        <h1>Наши пчёлки работают для&nbsp;Вас</h1>
        <p>
          Мёд с личной пасеки и пасеки наших родителей: 800 пчелосемей в Чойском районе Горного Алтая. Откачиваем вручную, без нагревания. Продаём в банках,
          оптом и на экспорт.
        </p>
        <div class="gm-hero__btns">
          <NuxtLink :to="{ hash: '#med' }" class="gm-btn gm-btn--main">Купить мёд</NuxtLink>
          <NuxtLink :to="gmPath('/opt')" class="gm-btn gm-btn--line">Опт и куботейнеры</NuxtLink>
        </div>
      </div>

      <div class="gm-hero__photo">
        <img :src="gmImg('hero2.jpg')" alt="Пчеловод в зарослях цветущего дягиля, кочевая пасека" width="1400" height="1050" />
        <span class="gm-hero__cap"><GmIcon name="mountain" :size="17" />Дягиль выше человека — кочевая пасека, Чойский район</span>
        <div class="gm-hero__jars">
          <div v-for="p in heroJars" :key="p.id" class="gm-hjar">
            <NuxtLink :to="gmPath(`/product/${p.id}`)" class="gm-hjar__img"><img :src="p.img" :alt="p.title" /></NuxtLink>
            <div class="gm-hjar__txt">
              <NuxtLink :to="gmPath(`/product/${p.id}`)">{{ gmSort(p.sort)?.title }}</NuxtLink>
              <span>{{ p.pack }} · {{ gmMoney(p.price) }}</span>
            </div>
            <button type="button" class="gm-hjar__add" :aria-label="`В корзину: ${p.title}`" @click="addJar(p.id)">
              <GmIcon :name="shop.qtyOf(`p:${p.id}`) ? 'check' : 'plus'" :size="20" />
            </button>
          </div>
        </div>
      </div>

      <div class="gm-hero__proof">
        <a :href="gmContacts.ntv" target="_blank" rel="noopener" class="gm-proof">
          <span class="gm-proof__icon"><GmIcon name="award" :size="26" /></span>
          <span class="gm-proof__text">
            <small>Роскачество и НТВ, август 2026</small>
            <b>Проверили мёд 7 брендов с маркетплейсов — без нарушений только «Пасеки Соловьёвых»</b>
            <span class="gm-link">Выпуск «НашПотребНадзор» <GmIcon name="arrow" :size="16" /></span>
          </span>
        </a>
        <ul class="gm-facts">
          <li><b>800</b><span>пчелосемей на двух пасеках</span></li>
          <li><b>с 2015</b><span>экспорт, 18 контейнеров</span></li>
          <li><b>1–3 дня</b><span>доставка через WB и Ozon</span></li>
        </ul>
      </div>
    </section>

    <!-- Магазин: два сорта, три фасовки -->
    <section id="med" class="gm-wrap gm-section">
      <div class="gm-head">
        <div>
          <h2>Мёд 2026 года в банках</h2>
          <p>Гречишный и разнотравье — в стекле на 1 кг и в пищевом пластике на 1,5 и 3 кг. Отправим любой службой, до транспортной компании довезём сами.</p>
        </div>
        <NuxtLink :to="gmPath('/shop')" class="gm-link">Все товары и сортировка <GmIcon name="arrow" :size="17" /></NuxtLink>
      </div>
      <div class="gm-jars">
        <GmJarCard v-for="s in gmSorts" :key="s.id" :sort="s.id" />
      </div>
    </section>

    <!-- Фирменная деталь: лесенка цены за килограмм -->
    <section class="gm-wrap gm-section">
      <div class="gm-ladder">
        <div class="gm-ladder__text">
          <h2>Чем больше банка, тем дешевле килограмм</h2>
          <p>В банке на 3 кг гречишный и разнотравье выходят по {{ gmMoney(gmPerKg(ladder[2])) }} за килограмм. Ещё выгоднее — куботейнером, оптом.</p>
          <NuxtLink :to="gmPath('/opt')" class="gm-link">Цены опта <GmIcon name="arrow" :size="17" /></NuxtLink>
        </div>
        <ol class="gm-ladder__steps">
          <li v-for="(p, i) in ladder" :key="p.id" :style="{ '--h': gmPerKg(p) / maxKg, '--s': 0.7 + i * 0.16 }">
            <span class="gm-ladder__bar"><i /></span>
            <span class="gm-ladder__jar" aria-hidden="true" />
            <b>{{ gmMoney(gmPerKg(p)) }}<small>/кг</small></b>
            <span>{{ p.pack }} · {{ gmMoney(p.price) }}</span>
          </li>
          <li class="is-bulk" style="--h: 0.2; --s: 1.2">
            <span class="gm-ladder__bar"><i /></span>
            <span class="gm-ladder__jar gm-ladder__jar--cube" aria-hidden="true" />
            <b>опт</b>
            <span>куботейнер 30–33 кг</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- Опт коротко -->
    <section class="gm-wrap gm-section">
      <div class="gm-head">
        <div>
          <h2>Опт куботейнерами</h2>
          <p>Для магазинов, переработчиков и фасовщиков. Документы и сертификаты качества — к каждой партии.</p>
        </div>
        <NuxtLink :to="gmPath('/opt')" class="gm-link">Все сорта, экспорт и документы <GmIcon name="arrow" :size="17" /></NuxtLink>
      </div>
      <div class="gm-offers">
        <article v-for="b in offers" :key="b.id" class="gm-offer">
          <div class="gm-offer__top">
            <h3>{{ b.title }}</h3>
            <span class="gm-offer__stock">{{ b.stock }}</span>
          </div>
          <p>{{ b.note }}</p>
          <dl>
            <div>
              <dt>Куботейнер</dt>
              <dd>{{ b.cube }} кг</dd>
            </div>
            <div>
              <dt>Опт</dt>
              <dd>
                <b>{{ gmMoney(b.perKg!) }}/кг</b>
              </dd>
            </div>
            <div>
              <dt>За куботейнер</dt>
              <dd>{{ gmMoney(b.perKg! * b.cube!) }}</dd>
            </div>
            <div v-if="b.retailKg">
              <dt>{{ b.retailNote }}</dt>
              <dd>{{ gmMoney(b.retailKg) }}/кг</dd>
            </div>
          </dl>
          <div class="gm-offer__buy">
            <span v-if="shop.qtyOf(`b:${b.id}`)" class="gm-offer__in"><GmIcon name="check" :size="17" />{{ gmCubes(shop.qtyOf(`b:${b.id}`)) }} в корзине</span>
            <button type="button" class="gm-btn gm-btn--main" @click="addBulk(b.id)"><GmIcon name="cube" :size="19" />Куботейнер в заказ</button>
          </div>
        </article>
        <article class="gm-offer gm-offer--call">
          <h3>Гречишный и разнотравье</h3>
          <p>Свежий мёд 2026 года крупными партиями — цену уточняйте у Сергея Владимировича.</p>
          <a :href="`tel:${sergey.tel}`" class="gm-offer__phone">{{ sergey.phone }}</a>
          <span class="gm-offer__hint">WhatsApp, MAX — на этот же номер</span>
          <NuxtLink :to="gmPath('/opt')" class="gm-btn gm-btn--line">Добавить в заказ</NuxtLink>
        </article>
      </div>
    </section>

    <!-- Стики для кафе -->
    <section class="gm-wrap gm-section">
      <div class="gm-stick">
        <div class="gm-stick__photo"><img :src="gmStick.img" alt="Мёд в порционных стик-пакетах" loading="lazy" /></div>
        <div class="gm-stick__text">
          <h2>Мёд в стиках для кафе и ресторанов</h2>
          <p>К чаю или кофе гость выбирает сахар или мёд в стике — и многие берут мёд.</p>
          <ul>
            <li v-for="f in gmStick.facts" :key="f"><GmIcon name="check" :size="19" />{{ f }}</li>
          </ul>
          <div class="gm-stick__btns">
            <a :href="stickMail" class="gm-btn gm-btn--main"><GmIcon name="mail" :size="19" />Обсудить стики</a>
            <button type="button" class="gm-btn gm-btn--line" @click="ui.callback.value = true">Заказать звонок</button>
          </div>
        </div>
      </div>
    </section>

    <!-- WB и Ozon -->
    <section class="gm-wrap gm-section">
      <div class="gm-mp">
        <div>
          <h2>Наш мёд на Wildberries и Ozon</h2>
          <p>Удобно, если нужна одна-две банки в другой город.</p>
        </div>
        <ul>
          <li v-for="m in gmMarket" :key="m"><GmIcon name="check" :size="18" />{{ m }}</li>
        </ul>
        <div class="gm-mp__btns">
          <a :href="gmContacts.wb" target="_blank" rel="noopener" class="gm-btn gm-btn--line">Wildberries</a>
          <a :href="gmContacts.ozon" target="_blank" rel="noopener" class="gm-btn gm-btn--line">Ozon</a>
          <NuxtLink :to="gmPath('/wb-ozon')" class="gm-link">Подробнее <GmIcon name="arrow" :size="16" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- Ещё с пасеки -->
    <section class="gm-wrap gm-section">
      <div class="gm-head">
        <div>
          <h2>Ещё с пасеки</h2>
          <p>Соты, перга, прополис, воск, тара и подарки — наличие меняется по сезону, спросите у Сергея.</p>
        </div>
      </div>
      <GmMore />
    </section>

    <!-- Фото -->
    <section class="gm-wrap gm-section">
      <div class="gm-head">
        <div>
          <h2>С пасеки</h2>
          <p>Четыре альбома, 435 фото: кочёвка на дягиль, медосбор, первый снег.</p>
        </div>
        <NuxtLink :to="gmPath('/gallery')" class="gm-link">Фотогалерея <GmIcon name="arrow" :size="17" /></NuxtLink>
      </div>
      <div class="gm-albums">
        <NuxtLink v-for="a in gmAlbums" :key="a.id" :to="gmPath('/gallery') + `#album-${a.id}`" class="gm-album">
          <img :src="a.photos[a.cover - 1]" :alt="a.title" loading="lazy" />
          <span><b>{{ a.title }}</b>{{ a.count }} фото</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Новости -->
    <section class="gm-wrap gm-section">
      <div class="gm-head">
        <div><h2>Новости</h2></div>
        <NuxtLink :to="gmPath('/news')" class="gm-link">Все новости <GmIcon name="arrow" :size="17" /></NuxtLink>
      </div>
      <div class="gm-newsrow">
        <NuxtLink v-for="n in latest" :key="n.u" :to="gmPath('/news') + `#n${gmNews.indexOf(n)}`" class="gm-ncard">
          <span class="gm-ncard__img"><img v-if="n.img" :src="gmNewsImg(n.img)" :alt="n.t" loading="lazy" /></span>
          <span class="gm-ncard__body">
            <time :datetime="n.d">{{ gmDate(n.d) }}</time>
            <b>{{ n.t }}</b>
            <span>{{ n.i }}</span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Покупатели и контакты -->
    <section class="gm-wrap gm-section">
      <div class="gm-panel gm-contact">
        <div class="gm-contact__text">
          <h2>Позвоните — подберём мёд и тару</h2>
          <p>Заказы принимаем по телефону, в WhatsApp и MAX, по почте <a :href="`mailto:${gmContacts.email}`" class="gm-link">{{ gmContacts.email }}</a>.</p>
          <div class="gm-contact__buyers">
            <span>Постоянные оптовые покупатели</span>
            <img :src="gmContacts.buyers" alt="АлтайWest" width="209" height="36" loading="lazy" />
          </div>
        </div>
        <div class="gm-people">
          <div v-for="p in gmContacts.people" :key="p.tel" class="gm-person">
            <b>{{ p.phone }}</b>
            <span>{{ p.name }} — {{ p.role }}</span>
            <div class="gm-person__acts">
              <a :href="`tel:${p.tel}`" class="gm-btn gm-btn--main gm-btn--small"><GmIcon name="phone" :size="17" />Позвонить</a>
              <a v-if="p.wa" :href="`https://wa.me/${p.wa}`" target="_blank" rel="noopener" class="gm-btn gm-btn--line gm-btn--small">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.gm-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  grid-template-areas:
    'text photo'
    'proof photo';
  grid-template-rows: auto 1fr;
  column-gap: 40px;
  row-gap: 28px;
  padding-top: 32px;

  &__text {
    grid-area: text;
    display: grid;
    justify-items: start;
    gap: 18px;
    padding-top: 24px;

    h1 {
      font-size: clamp(36px, 4.6vw, 60px);
      line-height: 1.06;
    }
    p {
      max-width: 520px;
      font-size: 17px;
      color: var(--gm-muted);
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
  }
  &__photo {
    grid-area: photo;
    position: relative;
    min-height: 560px;
    border-radius: 18px;
    overflow: hidden;
    background: #3e5a2a;

    > img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 30%;
    }
  }
  &__cap {
    position: absolute;
    top: 16px;
    left: 16px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    max-width: calc(100% - 32px);
    padding: 7px 12px;
    border-radius: var(--gm-r);
    background: rgba(255, 255, 255, 0.92);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--gm-ink);
  }
  &__jars {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  &__proof {
    grid-area: proof;
    display: grid;
    align-content: end;
    gap: 22px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'text' 'photo' 'proof';
    grid-template-rows: auto;
    padding-top: 20px;

    &__text {
      padding-top: 0;
    }
    &__photo {
      min-height: 0;
      aspect-ratio: 4 / 3;
    }
  }
  @media (max-width: 576px) {
    row-gap: 20px;

    &__text {
      gap: 14px;

      p {
        font-size: 15.5px;
      }
    }
    &__photo {
      aspect-ratio: 3 / 4;
      border-radius: var(--gm-R);
    }
    &__cap {
      top: 10px;
      left: 10px;
      font-size: 12.5px;
    }
    &__jars {
      left: 10px;
      right: 10px;
      bottom: 10px;
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }
  }
}
.gm-hjar {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(20, 30, 12, 0.22);

  &__img {
    width: 52px;
    height: 64px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--gm-pack);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__txt {
    display: grid;
    line-height: 1.25;
    min-width: 0;

    a {
      font-family: 'Lora', Georgia, serif;
      font-weight: 700;
      font-size: 17px;
      color: var(--gm-ink);
    }
    span {
      font-size: 13.5px;
      color: var(--gm-muted);
      white-space: nowrap;
    }
  }
  &__add {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--gm-r);
    background: var(--gm-accent);
    color: #fff;

    &:hover {
      background: var(--gm-accent-hover);
    }
  }
}
.gm-proof {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  padding: 18px;
  border-radius: var(--gm-R);
  background: var(--gm-surface);

  &__icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--gm-honey);
    color: var(--gm-ink);
  }
  &__text {
    display: grid;
    gap: 4px;

    small {
      font-size: 13px;
      color: var(--gm-muted);
    }
    b {
      color: var(--gm-ink);
      line-height: 1.35;
    }
  }
  &:hover b {
    color: var(--gm-accent);
  }
}
ul.gm-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  li {
    display: grid;
    gap: 2px;
    padding-left: 14px;
    border-left: 2px solid var(--gm-honey);
  }
  b {
    font-family: 'Lora', Georgia, serif;
    font-size: 24px;
    color: var(--gm-ink);
    line-height: 1.2;
  }
  span {
    font-size: 13.5px;
    color: var(--gm-muted);
    line-height: 1.35;
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}

.gm-ladder {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 40px;
  align-items: center;
  padding: 36px;
  border-radius: 18px;
  background: var(--gm-surface);

  &__text {
    display: grid;
    justify-items: start;
    gap: 12px;

    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }
    p {
      color: var(--gm-muted);
    }
  }
  ol.gm-ladder__steps {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    align-items: end;

    li {
      display: grid;
      justify-items: center;
      gap: 6px;
      text-align: center;

      > b {
        order: 1;
        font-size: 20px;
        color: var(--gm-ink);
        white-space: nowrap;

        small {
          font-size: 13px;
          font-weight: 500;
          color: var(--gm-muted);
        }
      }
      > span:last-child {
        order: 2;
        font-size: 13px;
        color: var(--gm-muted);
        line-height: 1.3;
      }
      &.is-bulk > b {
        color: var(--gm-green);
      }
    }
  }
  &__bar {
    display: flex;
    align-items: end;
    justify-content: center;
    width: 100%;
    height: calc(var(--h) * 120px);
    border-bottom: 2px solid #d9c6b3;

    i {
      width: 64%;
      height: 100%;
      border-radius: 10px 10px 0 0;
      background: #eadbcb;
    }
  }
  li.is-bulk &__bar i {
    background: #d3e6d2;
  }
  &__jar {
    order: -1;
    width: 40px;
    height: 52px;
    border-radius: 6px 6px 10px 10px;
    background: linear-gradient(var(--gm-honey) 0 9px, #d9a21b 9px);
    transform: scale(var(--s));
    transform-origin: 50% 100%;
    margin-top: 20px;
    margin-bottom: -2px;

    &--cube {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      background: linear-gradient(#f4f4f0 0 7px, #e7c25a 7px);
      border: 2px solid #d8d2c4;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  @media (max-width: 576px) {
    padding: 22px 16px;

    ol.gm-ladder__steps {
      gap: 8px;

      li > b {
        font-size: 16px;
      }
    }
    &__bar {
      height: calc(var(--h) * 90px);
    }
    &__jar {
      width: 26px;
      height: 34px;

      &--cube {
        width: 30px;
        height: 30px;
      }
    }
  }
}

.gm-offers {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.gm-offer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-R);
  background: #fff;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 10px;

    h3 {
      font-size: 22px;
    }
  }
  &__stock {
    flex: none;
    padding: 3px 9px;
    border-radius: 6px;
    background: #e7f2e6;
    color: var(--gm-green);
    font-size: 12.5px;
    font-weight: 700;
    white-space: nowrap;
  }
  > p {
    font-size: 14.5px;
    color: var(--gm-muted);
  }
  dl {
    display: grid;
    gap: 6px;
    padding: 12px 0;
    border-top: 1px solid var(--gm-line);
    border-bottom: 1px solid var(--gm-line);

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    dt {
      color: var(--gm-muted);
      font-size: 14px;
    }
    dd {
      font-weight: 600;
      color: var(--gm-ink);
      white-space: nowrap;

      b {
        font-size: 18px;
        color: var(--gm-accent);
      }
    }
  }
  &__buy {
    display: grid;
    gap: 8px;
    margin-top: auto;
  }
  &__in {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--gm-green);
  }
  &--call {
    background: var(--gm-surface);
    border-color: transparent;

    h3 {
      font-size: 22px;
    }
    .gm-btn {
      margin-top: auto;
    }
  }
  &__phone {
    font-size: 22px;
    font-weight: 700;
    color: var(--gm-ink);

    &:hover {
      color: var(--gm-accent);
    }
  }
  &__hint {
    margin-top: -8px;
    font-size: 13px;
    color: var(--gm-muted);
  }
}

.gm-stick {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  border-radius: 18px;
  overflow: hidden;
  background: var(--gm-surface);

  &__photo {
    min-height: 100%;
    background: #f4efe7;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__text {
    display: grid;
    align-content: center;
    gap: 14px;
    padding: 40px;

    h2 {
      font-size: clamp(26px, 3vw, 34px);
    }
    > p {
      color: var(--gm-muted);
    }
    ul {
      display: grid;
      gap: 8px;
    }
    li {
      display: flex;
      gap: 10px;
      color: var(--gm-ink);

      .gm-icon {
        margin-top: 2px;
        color: var(--gm-green);
      }
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 6px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__photo {
      aspect-ratio: 960 / 430;
    }
  }
  @media (max-width: 576px) {
    &__text {
      padding: 22px 18px;
    }
  }
}

.gm-mp {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px 40px;
  padding: 28px 32px;
  border: 1px solid var(--gm-line);
  border-radius: 18px;

  h2 {
    font-size: 26px;
  }
  p {
    margin-top: 6px;
    color: var(--gm-muted);
  }
  ul {
    display: grid;
    gap: 6px;
  }
  li {
    display: flex;
    gap: 8px;
    font-size: 14.5px;

    .gm-icon {
      margin-top: 2px;
      color: var(--gm-green);
    }
  }
  &__btns {
    display: grid;
    gap: 8px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__btns {
      display: flex;
      flex-wrap: wrap;
    }
  }
  @media (max-width: 576px) {
    padding: 22px 18px;
  }
}

.gm-contact {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 32px;
  align-items: center;

  &__text {
    display: grid;
    gap: 12px;

    h2 {
      font-size: clamp(24px, 2.6vw, 30px);
    }
    p {
      color: var(--gm-muted);
    }
  }
  &__buyers {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 14px;
    margin-top: 6px;
    font-size: 13px;
    color: var(--gm-muted);

    img {
      height: 30px;
      width: auto;
      padding: 0;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
