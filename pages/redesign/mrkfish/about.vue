<script lang="ts" setup>
import MfIcon from '~/components/redesign/mrkfish/MfIcon.vue'
import MfFacade from '~/components/redesign/mrkfish/MfFacade.vue'

const ui = useMrkfishUi()
useSeoMeta({ title: 'О производстве и доставке — Миякинская Рыбная Компания | Концепт редизайна' })
</script>

<template>
  <div class="mf-wrap">
    <nav class="mf-crumbs" aria-label="Навигация">
      <NuxtLink :to="mfPath()">Главная</NuxtLink>
      <MfIcon name="arrow" :size="14" />
      <span>О производстве</span>
    </nav>

    <section class="mf-ab-top">
      <div>
        <h1>33 года на пути к совершенству</h1>
        <p>
          Производственно-торговая компания из Миякинского района Башкортостана. С 1993 года коптим, солим, вялим и замораживаем рыбу и
          продаём её оптом — магазинам, сетям и кафе. Ассортимент — более 200 наименований.
        </p>
      </div>
      <ul class="mf-ab-top__facts">
        <li v-for="f in mfFacts" :key="f.value">
          <b>{{ f.value }}</b>
          <span>{{ f.label }}</span>
        </li>
      </ul>
    </section>

    <section class="mf-section">
      <div class="mf-head">
        <div>
          <h2>Две площадки</h2>
          <p>Копчёная и свежемороженая рыба — в Ерлыково, солёная продукция и пресервы — в Киргиз-Мияках.</p>
        </div>
      </div>
      <div class="mf-sites">
        <article v-for="s in mfSites" :key="s.id" class="mf-site">
          <span class="mf-site__ico"><MfIcon name="factory" /></span>
          <h3>с. {{ s.title }}</h3>
          <p class="mf-site__makes">{{ s.makes }}</p>
          <p class="mf-site__addr">{{ s.address }}</p>
          <p class="mf-site__co">{{ s.company }}<template v-if="s.inn"> · {{ s.inn }}</template></p>
        </article>
      </div>
    </section>

    <section class="mf-section">
      <div class="mf-ab-smoke">
        <div>
          <h2>Холодное копчение на натуральном дыме</h2>
          <p>
            Свежую рыбу обрабатываем натуральным дымом из щепы ольхи и бука, на родниковой воде. Копчение забирает половину влаги, но
            сохраняет полезные свойства и увеличивает срок хранения. На столе — продукт с узнаваемым ароматом, вкусом и цветом.
          </p>
          <NuxtLink :to="mfSectionPath('smoked')" class="mf-btn">Копчёная рыба <MfIcon name="arrow" :size="18" /></NuxtLink>
        </div>
        <ul>
          <li v-for="c in mfSmoke" :key="c.title">
            <span><MfIcon :name="c.icon" :size="22" /></span>
            <p>
              <b>{{ c.title }}</b>
              {{ c.text }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <section id="delivery" class="mf-section">
      <div class="mf-fleet">
        <img src="/redesign/mrkfish/g/fleet.jpg" alt="Здание компании и машины автопарка" width="1400" height="785" loading="lazy" />
        <div class="mf-fleet__text">
          <h2>Доставка своим автопарком</h2>
          <p>Ежедневно возим продукцию по трём регионам. Про доставку в другие регионы России договариваемся с отделом продаж.</p>
          <ul>
            <li v-for="r in mfRegions" :key="r"><MfIcon name="pin" :size="20" />{{ r }}</li>
          </ul>
          <button type="button" class="mf-btn mf-btn--line" @click="ui.modal.value = 'call'"><MfIcon name="phone" :size="20" /> Уточнить доставку</button>
        </div>
      </div>
    </section>

    <section class="mf-section">
      <div class="mf-ab-facade">
        <MfFacade />
        <div>
          <h2>Медиафасад МРК</h2>
          <p>Наше здание видно издалека: 20 000 адресных светодиодов, каждый день новая анимация, 4,3 кВт света и управление онлайн.</p>
        </div>
      </div>
    </section>

    <section class="mf-section">
      <div class="mf-head">
        <div>
          <h2>О нас говорят</h2>
          <p>{{ mfPartners.join(' · ') }}</p>
        </div>
        <a :href="mfContacts.youtube" target="_blank" rel="noopener" class="mf-head__more">Канал на YouTube <MfIcon name="external" :size="16" /></a>
      </div>
      <div class="mf-videos">
        <a v-for="v in mfVideos" :key="v" :href="`https://www.youtube.com/watch?v=${v}`" target="_blank" rel="noopener" class="mf-video">
          <img :src="`https://i.ytimg.com/vi/${v}/hqdefault.jpg`" alt="Видео о компании" width="480" height="360" loading="lazy" />
          <span><MfIcon name="play" :size="26" /></span>
        </a>
      </div>
      <a :href="mfContacts.vkPost" target="_blank" rel="noopener" class="mf-vk"><MfIcon name="vk" :size="24" /> Пост партнёра во ВКонтакте</a>
    </section>

    <section class="mf-section">
      <div class="mf-head">
        <h2>Знаки качества</h2>
      </div>
      <ul class="mf-badges mf-badges--wide">
        <li v-for="b in mfBadges" :key="b.title">
          <img :src="`/redesign/mrkfish/g/${b.img}`" :alt="b.title" width="120" height="120" loading="lazy" />
          <span>{{ b.title }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.mf-ab-top {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: end;
  gap: 32px 56px;
  margin-top: 16px;

  h1 {
    font-size: clamp(32px, 4vw, 52px);
    line-height: 1.06;
  }

  p {
    max-width: 680px;
    margin-top: 16px !important;
    font-size: 17px;
  }

  &__facts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;

    li {
      display: grid;
      align-content: start;
      padding: 16px;
      border-radius: var(--mf-r-lg);
      background: var(--mf-surface);
    }

    b {
      color: var(--mf-navy);
      font-size: 26px;
      font-weight: 800;
      line-height: 1.15;
    }

    span {
      color: var(--mf-muted);
      font-size: 14px;
      line-height: 1.35;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.mf-sites {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.mf-site {
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 24px;
  border: 1px solid var(--mf-line);
  border-radius: var(--mf-r-lg);

  &__ico {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    border-radius: 12px;
    background: var(--mf-red-soft);
    color: var(--mf-red);
  }

  h3 {
    font-size: 22px;
  }

  &__makes {
    color: var(--mf-ink);
    font-weight: 700;
  }

  &__addr,
  &__co {
    color: var(--mf-muted);
    font-size: 14px;
  }
}

.mf-ab-smoke {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 32px 56px;
  padding: clamp(24px, 3.4vw, 44px);
  border-radius: var(--mf-r-lg);
  background: var(--mf-navy-soft);

  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
  }

  > div p {
    margin: 12px 0 24px !important;
  }

  ul {
    display: grid;
    gap: 12px;
  }

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    border-radius: var(--mf-r-lg);
    background: #fff;

    > span {
      display: grid;
      flex: none;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--mf-navy-soft);
      color: var(--mf-navy);
    }

    p {
      color: var(--mf-muted);
      font-size: 14px;
      line-height: 1.4;
    }

    b {
      display: block;
      color: var(--mf-ink);
      font-size: 15px;
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.mf-ab-facade {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: center;
  gap: 24px 48px;

  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
  }

  p {
    margin-top: 10px !important;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.mf-videos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}

.mf-video {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--mf-r-lg);
  background: var(--mf-surface);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--mf-red);
    color: #fff;
    transform: translate(-50%, -50%);

    svg {
      fill: currentColor;
    }
  }

  &:hover img {
    transform: scale(1.04);
  }
}

.mf-vk {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--mf-navy);
  font-weight: 700;

  &:hover {
    color: var(--mf-red);
  }
}

.mf-badges--wide img {
  width: 96px;
  height: 96px;
}
</style>
