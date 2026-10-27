<script lang="ts" setup>
import MfIcon from '~/components/redesign/mrkfish/MfIcon.vue'
import MfMap from '~/components/redesign/mrkfish/MfMap.vue'

const ui = useMrkfishUi()
const track = ref<HTMLElement | null>(null)
const slide = ref(0)
const q = reactive({ name: '', phone: '', text: '' })

useSeoMeta({ title: 'Контакты — Миякинская Рыбная Компания | Концепт редизайна' })

// Слайдер «Как нас найти» оригинала: 8 вертикальных фото, счётчик «1 / 8». Здесь — лента с прокруткой и стрелками.
const onScroll = () => {
  const el = track.value
  if (!el) return
  const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1
  slide.value = Math.min(mfGallery.length - 1, Math.round(el.scrollLeft / (step + 12)))
}
const go = (dir: number) => {
  const el = track.value
  if (!el) return
  const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 300
  el.scrollBy({ left: dir * (step + 12), behavior: 'smooth' })
}
const ask = () => {
  ui.say('Демо: вопрос ушёл бы в отдел продаж. В концепте форма никуда не отправляется.')
  q.text = ''
}
</script>

<template>
  <div class="mf-wrap">
    <nav class="mf-crumbs" aria-label="Навигация">
      <NuxtLink :to="mfPath()">Главная</NuxtLink>
      <MfIcon name="arrow" :size="14" />
      <span>Контакты</span>
    </nav>

    <div class="mf-ct-top">
      <div>
        <h1>Контакты</h1>
        <p>Отдел продаж отвечает по всем вопросам и предложениям. Среднее время ответа — {{ mfContacts.answer }}</p>
      </div>
      <div class="mf-ct-top__links">
        <a :href="mfContacts.phone.href" class="mf-ct-top__phone">{{ mfContacts.phone.label }}</a>
        <a :href="mfContacts.mobile.href" class="mf-ct-top__phone mf-ct-top__phone--sm">{{ mfContacts.mobile.label }}</a>
        <div class="mf-ct-top__btns">
          <button type="button" class="mf-btn" @click="ui.modal.value = 'call'"><MfIcon name="phone" :size="20" /> Заказать звонок</button>
          <a :href="mfContacts.whatsapp" target="_blank" rel="noopener" class="mf-btn mf-btn--line"><MfIcon name="whatsapp" :size="20" /> WhatsApp</a>
          <a :href="mfContacts.vk" target="_blank" rel="noopener" class="mf-btn mf-btn--line"><MfIcon name="vk" :size="20" /> ВКонтакте</a>
        </div>
      </div>
    </div>

    <section v-for="s in mfSites" :key="s.id" class="mf-ct-site">
      <div class="mf-ct-site__info">
        <span class="mf-ct-site__label">{{ s.makes }}</span>
        <h2>с. {{ s.title }}</h2>
        <ul>
          <li><MfIcon name="pin" :size="20" /><span>{{ s.address }}</span></li>
          <li><MfIcon name="phone" :size="20" /><a :href="s.phone.href">{{ s.phone.label }}</a></li>
          <li><MfIcon name="mail" :size="20" /><a :href="`mailto:${s.email}`">{{ s.email }}</a></li>
          <li><MfIcon name="doc" :size="20" /><span>{{ s.company }}<template v-if="s.inn">, {{ s.inn }}</template></span></li>
        </ul>
        <a :href="s.mapLink" target="_blank" rel="noopener" class="mf-ct-site__rating">
          <MfIcon name="star" :size="18" /><b>{{ s.rating }}</b> в Яндекс Картах · {{ s.reviews }}
        </a>
      </div>
      <MfMap :site="s" />
    </section>

    <section class="mf-section">
      <div class="mf-head">
        <div>
          <h2>Как нас найти</h2>
          <p>Въезд, двор и вход в офис в Ерлыково.</p>
        </div>
        <div class="mf-gal-nav">
          <span>{{ slide + 1 }} / {{ mfGallery.length }}</span>
          <button type="button" class="mf-iconbtn" aria-label="Назад" @click="go(-1)"><MfIcon name="back" /></button>
          <button type="button" class="mf-iconbtn" aria-label="Вперёд" @click="go(1)"><MfIcon name="arrow" /></button>
        </div>
      </div>
      <div ref="track" class="mf-gal" @scroll.passive="onScroll">
        <img v-for="g in mfGallery" :key="g.img" :src="`/redesign/mrkfish/g/${g.img}`" :alt="g.alt" width="675" height="900" loading="lazy" />
      </div>
    </section>

    <section class="mf-section">
      <div class="mf-ask">
        <div>
          <h2>Задать вопрос производителю</h2>
          <p>Про ассортимент, фасовки, доставку в ваш город или сотрудничество — ответим по телефону.</p>
        </div>
        <form class="mf-form mf-ask__form" @submit.prevent="ask">
          <label class="mf-field">
            <span>Имя</span>
            <input v-model="q.name" required autocomplete="name" />
          </label>
          <label class="mf-field">
            <span>Телефон</span>
            <input v-model="q.phone" required type="tel" autocomplete="tel" placeholder="+7" />
          </label>
          <label class="mf-field mf-ask__wide">
            <span>Ваш вопрос</span>
            <textarea v-model="q.text" required />
          </label>
          <button type="submit" class="mf-btn">Спросить</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.mf-ct-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 24px 48px;
  margin-top: 16px;

  h1 {
    font-size: clamp(32px, 4vw, 48px);
  }

  p {
    margin-top: 10px !important;
    color: var(--mf-muted);
  }

  &__links {
    display: grid;
    justify-items: end;
    gap: 2px;
  }

  &__phone {
    color: var(--mf-ink);
    font-size: 28px;
    font-weight: 800;
    line-height: 1.2;

    &--sm {
      font-size: 18px;
    }
  }

  &__btns {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__links {
      justify-items: start;
    }

    &__btns {
      justify-content: flex-start;
    }
  }

  @media (max-width: 576px) {
    &__btns {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      width: 100%;

      .mf-btn:first-child {
        grid-column: 1 / -1;
      }
    }
  }

  @media (max-width: 375px) {
    &__btns {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.mf-ct-site {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 16px;
  margin-top: 32px;

  & + & {
    margin-top: 16px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 28px;
    border-radius: var(--mf-r-lg);
    background: var(--mf-surface);

    h2 {
      font-size: 28px;
    }

    ul {
      display: grid;
      gap: 10px;
      margin-top: 4px !important;
    }

    li {
      display: flex;
      align-items: flex-start;
      gap: 10px;

      svg {
        flex: none;
        margin-top: 2px;
        color: var(--mf-navy);
      }

      a {
        color: var(--mf-ink);
        font-weight: 700;

        &:hover {
          color: var(--mf-red);
        }
      }
    }
  }

  &__label {
    padding: 4px 10px;
    border-radius: 6px;
    background: var(--mf-navy);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
  }

  &__rating {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 12px;
    font-size: 14px;

    svg {
      color: #e0a400;
      fill: currentColor;
    }

    &:hover {
      color: var(--mf-navy);
    }
  }

  .mf-map {
    min-height: 340px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    .mf-map {
      min-height: 280px;
    }
  }

  @media (max-width: 576px) {
    &__info {
      padding: 20px;
    }
  }
}

.mf-gal-nav {
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    margin-right: 8px;
    color: var(--mf-muted);
    font-weight: 700;
  }

  .mf-iconbtn {
    border: 1px solid var(--mf-line);
  }

  @media (max-width: 768px) {
    .mf-iconbtn {
      display: none;
    }
  }
}

.mf-gal {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 36px) / 4);
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  img {
    width: 100%;
    aspect-ratio: 3 / 4;
    border-radius: var(--mf-r-lg);
    object-fit: cover;
    scroll-snap-align: start;
  }

  @media (max-width: 989px) {
    grid-auto-columns: calc((100% - 24px) / 3);
  }

  @media (max-width: 576px) {
    grid-auto-columns: 70%;
  }
}

.mf-ask {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 24px 48px;
  padding: clamp(24px, 3.4vw, 44px);
  border-radius: var(--mf-r-lg);
  background: var(--mf-navy-soft);

  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
  }

  p {
    margin-top: 10px !important;
  }

  &__form {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    .mf-btn {
      justify-self: start;
    }
  }

  &__wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 576px) {
    &__form {
      grid-template-columns: minmax(0, 1fr);

      .mf-btn {
        justify-self: stretch;
      }
    }
  }
}
</style>
