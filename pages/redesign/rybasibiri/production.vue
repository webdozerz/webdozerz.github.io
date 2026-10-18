<script lang="ts" setup>
import RsWorkshops from '~/components/redesign/rybasibiri/RsWorkshops.vue'

const form = reactive({ company: '', phone: '', volume: '', comment: '', services: [] as string[] })
const sent = ref(false)

const own = [
  'Салаты из морской капусты с клюквой, кальмаром или морковью',
  'Полуфабрикаты из замороженных овощей с рыбой или курицей в кулинарной термостойкой плёнке',
  'Копчёная рыба из производственных коптильных шкафов на ольховой щепе',
]

const toggle = (id: string) => {
  form.services = form.services.includes(id) ? form.services.filter((s) => s !== id) : [...form.services, id]
}

useSeoMeta({
  title: 'Производство и СТМ | «Стиль Продукт», концепт',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="rs-wrap rsm">
    <div class="rs-page-head">
      <nav class="rs-crumbs" aria-label="Навигация">
        <NuxtLink :to="rsPath()">Главная</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>Производство</span>
      </nav>
      <h1>Производство и СТМ</h1>
      <p>
        Изготавливаем рыбные и мясные полуфабрикаты, выпускаем готовую продукцию под вашей торговой маркой
        и берём на копчение, нарезку, глазирование, заморозку и хранение продукцию заказчика.
      </p>
    </div>

    <section class="rsm-own">
      <div class="rs-panel rsm-own__panel">
        <h2>Собственные цеха</h2>
        <RsWorkshops compact />
      </div>
      <div class="rs-panel rsm-own__panel rsm-own__panel--white">
        <h2>Что делаем сами</h2>
        <ul class="rsm-list">
          <li v-for="o in own" :key="o">{{ o }}</li>
        </ul>
        <p class="rs-muted">Всё это можем выпустить под вашей торговой маркой.</p>
      </div>
    </section>

    <section id="services" class="rs-section">
      <div class="rs-head">
        <div>
          <h2>Услуги для производителей и сетей</h2>
          <p>Увеличиваем срок хранения и готовим продукт к полке.</p>
        </div>
      </div>
      <div class="rsm-services">
        <article v-for="s in rsServices" :key="s.id" class="rsm-service">
          <img :src="rsImg(s.img, 640, 420)" :alt="s.title" width="640" height="420" loading="lazy" />
          <div class="rsm-service__body">
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
            <ul class="rsm-facts">
              <li v-for="f in s.facts" :key="f">{{ f }}</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <section id="price" class="rs-section rsm-req">
      <div class="rsm-req__text">
        <h2>Узнать цены на услуги</h2>
        <p class="rs-muted">Пришлём расчёт под ваш объём. Или позвоните в отдел продаж:</p>
        <div class="rsm-phones">
          <a v-for="p in rsContacts.phones" :key="p.href" :href="p.href">{{ p.label }}</a>
          <span>факс {{ rsContacts.fax }}</span>
          <a :href="`mailto:${rsContacts.email}`" class="rs-link">{{ rsContacts.email }}</a>
        </div>
      </div>

      <form class="rs-panel rs-form" @submit.prevent="sent = true">
        <div class="rs-field">
          <span>Какие услуги нужны</span>
          <div class="rs-seg">
            <button
              v-for="s in rsServices"
              :key="s.id"
              type="button"
              :class="{ 'is-on': form.services.includes(s.id) }"
              :aria-pressed="form.services.includes(s.id)"
              @click="toggle(s.id)"
            >
              {{ s.title }}
            </button>
            <button type="button" :class="{ 'is-on': form.services.includes('stm') }" :aria-pressed="form.services.includes('stm')" @click="toggle('stm')">
              Выпуск под СТМ
            </button>
          </div>
        </div>
        <div class="rs-form__row">
          <label class="rs-field">
            <span>Компания</span>
            <input v-model="form.company" type="text" required autocomplete="organization" />
          </label>
          <label class="rs-field">
            <span>Телефон</span>
            <input v-model="form.phone" type="tel" required autocomplete="tel" placeholder="+7" />
          </label>
        </div>
        <label class="rs-field">
          <span>Объём в месяц</span>
          <input v-model="form.volume" type="text" placeholder="Например, 2 тонны горбуши на стейки" />
        </label>
        <label class="rs-field">
          <span>Комментарий</span>
          <textarea v-model="form.comment" />
        </label>
        <button type="submit" class="rs-btn">Запросить цены</button>
        <p v-if="sent" class="rs-note" role="status">Это демо: в настоящем сайте заявка уйдёт в отдел продаж.</p>
      </form>
    </section>
  </div>
</template>

<style lang="scss">
.rs .rsm {
  .rsm-own {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    &__panel {
      display: grid;
      align-content: start;
      gap: 16px;

      h2 {
        font-size: 22px;
      }

      &--white {
        background: #fff;
        box-shadow: inset 0 0 0 1px var(--rs-line);
      }
    }
  }

  ul.rsm-list {
    display: grid;
    gap: 8px;
    list-style: none;

    li {
      position: relative;
      padding: 12px 14px 12px 48px;
      border-radius: 14px;
      background: var(--rs-ice);
      line-height: 1.4;

      // Галочка маской, красится цветом бренда.
      &::before {
        content: '';
        position: absolute;
        left: 14px;
        top: 12px;
        width: 22px;
        height: 22px;
        background: var(--rs-blue);
        -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center / contain no-repeat;
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E") center / contain no-repeat;
      }
    }
  }

  .rsm-services {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .rsm-service {
    display: grid;
    align-content: start;
    gap: 14px;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 11;
      object-fit: cover;
      border-radius: var(--rs-r-lg);
      background: var(--rs-ice);
    }

    &__body {
      display: grid;
      gap: 8px;

      h3 {
        font-size: 19px;
      }

      p {
        font-size: 14px;
        color: var(--rs-muted);
      }
    }
  }

  ul.rsm-facts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
    list-style: none;

    li {
      padding: 4px 10px;
      border-radius: 6px;
      background: var(--rs-ice);
      color: var(--rs-blue-d);
      font-size: 13px;
      font-weight: 500;
    }
  }

  .rsm-req {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 40px;
    align-items: start;

    h2 {
      font-size: clamp(24px, 3vw, 34px);
    }

    &__text {
      display: grid;
      gap: 14px;
    }
  }

  .rsm-phones {
    display: grid;
    gap: 6px;

    a:not(.rs-link) {
      font-size: 18px;
      font-weight: 600;

      &:hover {
        color: var(--rs-blue);
      }
    }

    span {
      color: var(--rs-muted);
    }
  }

  @media (max-width: 960px) {
    .rsm-services {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rsm-req {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
  }

  @media (max-width: 640px) {
    .rsm-own,
    .rsm-services {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
