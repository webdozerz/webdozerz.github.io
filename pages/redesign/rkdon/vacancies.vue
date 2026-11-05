<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'

useSeoMeta({ title: 'Вакансии — Рыбокомбинат Донской, Новошахтинск | Концепт редизайна' })

const open = ref<number | null>(0)
const toggle = (i: number) => (open.value = open.value === i ? null : i)
const resume = (title: string) =>
  'mailto:' + rkContacts.hrEmail + '?subject=' + encodeURIComponent('Резюме: ' + title) + '&body=' + encodeURIComponent('Здравствуйте! Откликаюсь на вакансию «' + title + '». Резюме во вложении.\n')
const perks = [
  { icon: 'truck', text: 'Доставка корпоративным транспортом из Гуково, Красного Сулина и Новошахтинска' },
  { icon: 'ruble', text: 'Белая зарплата два раза в месяц, официальное оформление по ТК РФ' },
  { icon: 'shield', text: 'Медосмотр и санитарная книжка за счёт компании' },
  { icon: 'people', text: 'Обучение без опыта, наставники, для бригад от 10 человек — жильё' },
]
</script>

<template>
  <div class="rk-vac">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink><span>Вакансии</span>
      </nav>
      <h1>Вакансии</h1>
      <p class="rk-pagehead__lead">
        Крупный стабильный работодатель: градообразующее предприятие Новошахтинска, около 1 000 человек. Собеседования — на Газопроводной,
        21, с 8:00 до 17:00, в том числе в выходные.
      </p>
    </div>
    <div class="rk-wrap rk-vac__grid">
      <div class="rk-vac__list">
        <article v-for="(v, i) in rkVacancies" :key="v.title" class="rk-vacancy" :class="{ 'is-open': open === i }">
          <button type="button" class="rk-vacancy__head" :aria-expanded="open === i" @click="toggle(i)">
            <span>
              <b>{{ v.title }}</b>
              <small v-if="v.salary">{{ v.salary }}</small>
              <small v-else>зарплата по итогам собеседования</small>
            </span>
            <RkIcon name="down" class="rk-vacancy__chev" />
          </button>
          <div v-show="open === i" class="rk-vacancy__body">
            <p v-if="v.intro">{{ v.intro }}</p>
            <div v-for="s in v.sections" :key="s.h" class="rk-vacancy__sec">
              <h3>{{ s.h }}</h3>
              <ul>
                <li v-for="it in s.items" :key="it"><RkIcon name="check" :size="18" /><span>{{ it }}</span></li>
              </ul>
            </div>
            <p v-if="v.note" class="rk-vacancy__note">{{ v.note }}</p>
            <a :href="resume(v.title)" class="rk-btn rk-btn--main"><RkIcon name="mail" :size="18" /> Отправить резюме</a>
          </div>
        </article>
      </div>
      <aside class="rk-vac__side">
        <div class="rk-vac__hr">
          <h2>Отдел кадров</h2>
          <a :href="'tel:' + rkContacts.hrTel" class="rk-vac__phone"><RkIcon name="phone" /><span>{{ rkContacts.hrPhones }}</span></a>
          <p><RkIcon name="clock" /><span>{{ rkContacts.hrHours }}</span></p>
          <p><RkIcon name="pin" /><span>г. Новошахтинск, ул. Газопроводная, д. 21</span></p>
          <a :href="resume('без вакансии')" class="rk-btn rk-btn--line"><RkIcon name="mail" :size="18" /> Отправить резюме</a>
        </div>
        <ul class="rk-vac__perks">
          <li v-for="p in perks" :key="p.text"><RkIcon :name="p.icon" /><span>{{ p.text }}</span></li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.rk-vac {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 40px;
    align-items: start;
  }
  &__list {
    display: grid;
    gap: 12px;
  }
  &__side {
    position: sticky;
    top: 100px;
    display: grid;
    gap: 16px;
  }
  &__hr {
    display: grid;
    gap: 14px;
    padding: 24px;
    border-radius: var(--rk-R);
    background: var(--rk-soft);
    h2 {
      font-size: 26px;
    }
    p,
    a.rk-vac__phone {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      svg {
        color: var(--rk-accent);
        flex: none;
      }
    }
    .rk-btn--line {
      border-color: #ead3db;
    }
  }
  &__phone {
    font-weight: 800;
    color: var(--rk-ink);
    font-size: 17px;
  }
  ul.rk-vac__perks {
    display: grid;
    gap: 10px;
    padding: 20px;
    border-radius: var(--rk-R);
    background: var(--rk-surface);
    li {
      display: flex;
      gap: 12px;
      font-size: 14px;
      svg {
        color: var(--rk-accent);
        flex: none;
      }
    }
  }
}
.rk-vacancy {
  border-radius: 18px;
  border: 1px solid var(--rk-line);
  background: #fff;
  &__head {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 20px 22px;
    text-align: left;
    > span {
      display: grid;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }
    b {
      font-size: 18px;
      color: var(--rk-ink);
      line-height: 1.3;
    }
    small {
      font-size: 15px;
      font-weight: 700;
      color: var(--rk-accent);
    }
  }
  &__chev {
    flex: none;
    color: var(--rk-muted);
    transition: transform 0.2s;
  }
  &.is-open {
    border-color: #d9c4cc;
    .rk-vacancy__chev {
      transform: rotate(180deg);
    }
  }
  &__body {
    display: grid;
    gap: 18px;
    justify-items: start;
    padding: 0 22px 24px;
  }
  &__sec {
    display: grid;
    gap: 10px;
    h3 {
      font-family: inherit;
      font-size: 16px;
      font-weight: 800;
    }
    ul {
      display: grid;
      gap: 6px;
    }
    li {
      display: flex;
      gap: 10px;
      svg {
        color: var(--rk-accent);
        flex: none;
        margin-top: 2px;
      }
    }
  }
  &__note {
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--rk-surface);
    font-size: 14px;
  }
}
@media (max-width: 1199px) {
  .rk-vac__grid {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 24px;
  }
}
@media (max-width: 989px) {
  .rk-vac__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .rk-vac__side {
    position: static;
    order: -1;
  }
}
@media (max-width: 576px) {
  .rk-vacancy__head {
    padding: 16px;
  }
  .rk-vacancy__body {
    padding: 0 16px 20px;
  }
  .rk-vacancy__body .rk-btn {
    width: 100%;
  }
}
</style>
