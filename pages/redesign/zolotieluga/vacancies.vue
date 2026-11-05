<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

useSeoMeta({ title: 'Вакансии «Золотых лугов» | Концепт редизайна' })
const route = useRoute()
const router = useRouter()
const cities = zlVacancyIntro.cities.map((c) => ({ c, n: zlVacancies.filter((v) => v.city === c).length }))
const city = computed(() => {
  const q = String(route.query.city || '')
  return cities.some((x) => x.c === q) ? q : 'all'
})
const list = computed(() => (city.value === 'all' ? zlVacancies : zlVacancies.filter((v) => v.city === city.value)))
const setCity = (c: string) => router.replace({ query: c === 'all' ? {} : { city: c } })
const open = ref<string | null>(null)

const isMail = (s: string) => /@/.test(s)
const isPhone = (s: string) => /^[\d\s()+-]{7,}$/.test(s.trim())
const lead = (v: (typeof zlVacancies)[number]) => v.secs.find((s) => !s.h)?.items[0] || ''
const mailOf = (v: (typeof zlVacancies)[number]) => v.secs.find((s) => s.h === 'Контакты')?.items.find(isMail)
const fmtDate = (d: string | null) => (d ? 'от ' + d : '')
</script>

<template>
  <div class="zl-wrap zl-page zl-vac">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span>Вакансии</span>
    </nav>
    <div class="zl-vac__top">
      <div>
        <h1>Вакансии</h1>
        <p class="zl-page__lead">{{ zlVacancyIntro.lead }}</p>
      </div>
      <ul class="zl-panel zl-vac__perks">
        <li v-for="p in zlVacancyIntro.perks" :key="p"><ZlIcon name="check" :size="18" /><span>{{ p }}</span></li>
      </ul>
    </div>

    <div class="zl-tabs zl-vac__cities" role="tablist" aria-label="Город">
      <button type="button" role="tab" :class="{ 'is-on': city === 'all' }" @click="setCity('all')">
        Все города <small>{{ zlVacancies.length }}</small>
      </button>
      <button v-for="x in cities" :key="x.c" type="button" role="tab" :class="{ 'is-on': city === x.c }" @click="setCity(x.c)">
        {{ x.c }} <small>{{ x.n }}</small>
      </button>
    </div>

    <div v-if="list.length" class="zl-vac__list">
      <article v-for="v in list" :key="v.id" class="zl-vac__item" :class="{ 'is-open': open === v.id }">
        <button type="button" class="zl-vac__head" :aria-expanded="open === v.id" @click="open = open === v.id ? null : v.id">
          <span>
            <b>{{ v.title }}</b>
            <small
              ><ZlIcon name="pin" :size="14" /> {{ v.city }}<template v-if="v.date"> · {{ fmtDate(v.date) }}</template></small
            >
          </span>
          <em v-if="lead(v) && /руб|₽|плата/i.test(lead(v))">{{ lead(v).replace('Заработная плата: ', '') }}</em>
          <ZlIcon :name="open === v.id ? 'minus' : 'plus'" />
        </button>
        <div v-if="open === v.id" class="zl-vac__body">
          <template v-for="s in v.secs" :key="(s.h || '') + s.items[0]">
            <div v-if="s.h !== 'Контакты'" class="zl-vac__sec">
              <h3 v-if="s.h">{{ s.h }}</h3>
              <ul>
                <li v-for="t in s.items" :key="t">{{ t }}</li>
              </ul>
            </div>
          </template>
          <div class="zl-vac__contacts">
            <h3>Контакты</h3>
            <template v-for="t in v.secs.find((s) => s.h === 'Контакты')?.items || []" :key="t">
              <a v-if="isMail(t)" :href="zlMail(t, 'Отклик на вакансию: ' + v.title + ', ' + v.city)">{{ t }}</a>
              <a v-else-if="isPhone(t)" :href="'tel:' + zlTel(t)">{{ t }}</a>
              <span v-else>{{ t }}</span>
            </template>
            <a v-if="mailOf(v)" :href="zlMail(mailOf(v)!, 'Отклик на вакансию: ' + v.title + ', ' + v.city)" class="zl-btn zl-btn--main"
              >Откликнуться письмом</a
            >
          </div>
        </div>
      </article>
    </div>
    <div v-else class="zl-panel zl-vac__empty">
      <ZlIcon name="briefcase" :size="28" />
      <p>
        Сейчас в {{ zlCityIn[city] || city }} открытых вакансий нет. Больше всего вакансий на производстве в Ситниково — посмотрите, возможно, подойдёт.
      </p>
      <button type="button" class="zl-btn zl-btn--line" @click="setCity('Ситниково')">Вакансии в Ситниково</button>
    </div>

    <aside class="zl-vac__note">
      <ZlIcon name="mail" :size="22" />
      <p>
        Если письмо на корпоративный адрес «Золотых лугов» не доходит, напишите на
        <a :href="'mailto:' + zlContacts.hr">{{ zlContacts.hr }}</a
        >: время и дату отправки, текст ошибки, с какого и на какой адрес отправляли. Техподдержка ответит в течение суток в рабочие дни.
      </p>
    </aside>
  </div>
</template>

<style lang="scss">
.zl-vac {
  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 40px;
    align-items: start;
  }
  ul.zl-vac__perks {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    li {
      display: flex;
      gap: 10px;
      .zl-icon {
        color: var(--zl-accent);
        margin-top: 2px;
      }
    }
  }
  &__cities {
    margin-top: 32px;
  }
  &__list {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__item {
    border: 1px solid var(--zl-line);
    border-radius: var(--zl-R);
    transition: border-color 0.2s;
    &.is-open {
      border-color: #e8bbb5;
    }
  }
  &__head {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 22px;
    text-align: left;
    > span {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    b {
      font-family: var(--zl-head);
      font-size: 19px;
      font-weight: 500;
      color: var(--zl-ink);
    }
    small {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--zl-muted);
      font-size: 14px;
    }
    em {
      font-style: normal;
      font-weight: 600;
      color: var(--zl-ink);
      white-space: nowrap;
    }
    > .zl-icon {
      color: var(--zl-accent);
    }
  }
  &__body {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr)) 280px;
    gap: 24px;
    padding: 4px 22px 24px;
    h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }
    ul {
      display: flex;
      flex-direction: column;
      gap: 6px;
      li {
        position: relative;
        padding-left: 14px;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 6px;
          height: 2px;
          background: var(--zl-accent);
        }
      }
    }
  }
  &__sec:first-child:not(:has(h3)) {
    grid-column: 1 / -1;
    font-weight: 600;
    color: var(--zl-ink);
    ul li {
      padding-left: 0;
      &::before {
        display: none;
      }
    }
  }
  &__contacts {
    grid-column: 3;
    grid-row: 2 / span 3;
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 18px;
    border-radius: 14px;
    background: var(--zl-surface);
    a:not(.zl-btn) {
      color: var(--zl-accent);
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    .zl-btn {
      margin-top: 10px;
    }
  }
  &__empty {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    > .zl-icon {
      color: var(--zl-accent);
    }
  }
  &__note {
    display: flex;
    gap: 14px;
    margin-top: 32px;
    max-width: 880px;
    font-size: 14px;
    color: var(--zl-muted);
    .zl-icon {
      color: var(--zl-accent);
      margin-top: 2px;
    }
    a {
      color: var(--zl-accent);
    }
  }
}
@media (max-width: 1199px) {
  .zl-vac__body {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .zl-vac__contacts {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}
@media (max-width: 989px) {
  .zl-vac__top {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}
@media (max-width: 576px) {
  .zl-vac {
    &__head {
      padding: 16px;
      flex-wrap: wrap;
      gap: 8px 12px;
      em {
        order: 3;
        flex-basis: 100%;
        white-space: normal;
      }
    }
    &__body {
      grid-template-columns: minmax(0, 1fr);
      padding: 0 16px 18px;
    }
  }
}
</style>
