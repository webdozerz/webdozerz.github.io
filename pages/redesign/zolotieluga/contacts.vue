<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

useSeoMeta({ title: 'Контакты «Золотых лугов» | Концепт редизайна' })
const route = useRoute()
const router = useRouter()
const ui = useZolotielugaUi()
const city = computed(() => {
  const q = String(route.query.city || '')
  return zlOffices.some((o) => o.city === q) ? q : 'Тюмень'
})
const office = computed(() => zlOffices.find((o) => o.city === city.value)!)
const setCity = (c: string) => router.replace({ query: { city: c } })
const mapUrl = computed(() => 'https://yandex.ru/maps/?text=' + encodeURIComponent(office.value.address.replace(/^\d{6},\s*/, '') + ', ' + city.value))

const form = reactive({ name: '', email: '', question: '' })
const sent = ref(false)
const send = () => {
  if (!form.name.trim() || !form.email.trim() || !form.question.trim()) return
  sent.value = true
}
const reset = () => {
  form.name = ''
  form.email = ''
  form.question = ''
  sent.value = false
}
</script>

<template>
  <div class="zl-wrap zl-page zl-contacts">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span>Контакты</span>
    </nav>
    <h1>Контакты</h1>

    <div class="zl-contacts__quick">
      <a :href="'tel:' + zlContacts.hotlineTel" class="zl-panel">
        <ZlIcon name="phone" :size="24" />
        <small>Горячая линия для покупателей</small>
        <b>{{ zlContacts.hotline }}</b>
        <span>{{ zlContacts.hotlineHours }}</span>
      </a>
      <a :href="'tel:' + zlContacts.receptionTel" class="zl-panel">
        <ZlIcon name="factory" :size="24" />
        <small>Приёмная, Тюмень</small>
        <b>{{ zlContacts.reception }}</b>
        <span>{{ zlContacts.email }}</span>
      </a>
      <a :href="'mailto:' + zlContacts.press" class="zl-panel">
        <ZlIcon name="mail" :size="24" />
        <small>Пресс-служба</small>
        <b>{{ zlContacts.press }}</b>
        <span>отдел по коммуникациям (3452) 54-03-92</span>
      </a>
    </div>

    <section class="zl-section">
      <div class="zl-head"><h2>Филиалы</h2></div>
      <div class="zl-tabs" role="tablist" aria-label="Город">
        <button v-for="o in zlOffices" :key="o.city" type="button" role="tab" :class="{ 'is-on': o.city === city }" @click="setCity(o.city)">
          {{ o.city }}
        </button>
      </div>

      <div class="zl-office">
        <div class="zl-office__main">
          <small>{{ office.title }}</small>
          <h3>{{ office.city }}</h3>
          <p class="zl-office__addr"><ZlIcon name="pin" :size="20" />{{ office.address }}</p>
          <a :href="mapUrl" target="_blank" rel="noopener" class="zl-link">Открыть в Яндекс Картах <ZlIcon name="external" :size="16" /></a>
          <div v-if="!office.lines" class="zl-office__phones">
            <a v-for="ph in office.phones" :key="ph" :href="'tel:' + zlTel(ph)">{{ ph }}</a>
          </div>
          <template v-if="office.city === 'Тюмень'">
            <p v-for="t in zlCompany.tyumen" :key="t" class="zl-office__about">{{ t }}</p>
          </template>
        </div>
        <dl v-if="office.lines" class="zl-office__lines">
          <div v-for="l in office.lines" :key="l.label">
            <dt>{{ l.label }}</dt>
            <dd>
              <a v-if="l.mail" :href="'mailto:' + l.value">{{ l.value }}</a>
              <a v-else :href="'tel:' + zlTel(l.value)">{{ l.value }}</a>
            </dd>
          </div>
        </dl>
        <div v-else class="zl-office__side zl-panel">
          <p>Продукцию «Золотых лугов» в городе {{ office.city }} продают магазины-партнёры.</p>
          <NuxtLink v-if="zlCities.includes(office.city)" :to="zlPath('/where')" class="zl-btn zl-btn--line" @click="ui.setCity(zlCities.indexOf(office.city))"
            >Где купить в {{ zlCityIn[office.city] }}</NuxtLink
          >
          <NuxtLink v-else :to="zlPath('/where')" class="zl-btn zl-btn--line">Где купить</NuxtLink>
        </div>
      </div>
    </section>

    <section id="feedback" class="zl-section">
      <div class="zl-feedback">
        <div>
          <h2>Обратная связь</h2>
          <p>Вопрос о продукции, сотрудничестве или работе сайта. Ответим на почту, которую вы укажете.</p>
          <span class="zl-demo"><ZlIcon name="doc" :size="16" /> Демо: в концепте вопрос никуда не отправляется</span>
        </div>
        <form v-if="!sent" class="zl-feedback__form" @submit.prevent="send">
          <label class="zl-field">Ваше имя*<input v-model="form.name" type="text" required autocomplete="name" /></label>
          <label class="zl-field">Email*<input v-model="form.email" type="email" required autocomplete="email" /></label>
          <label class="zl-field zl-feedback__wide">Вопрос*<textarea v-model="form.question" required rows="5" /></label>
          <button type="submit" class="zl-btn zl-btn--main">Отправить вопрос</button>
        </form>
        <div v-else class="zl-feedback__done zl-panel">
          <ZlIcon name="check" :size="28" />
          <b>Спасибо, {{ form.name }}!</b>
          <p>На сайте вопрос ушёл бы в приёмную, ответ — на {{ form.email }}. В концепте он никуда не отправлен.</p>
          <button type="button" class="zl-btn zl-btn--line" @click="reset">Задать ещё вопрос</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zl-contacts {
  &__quick {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 28px;
    .zl-panel {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      transition: background 0.2s;
      .zl-icon {
        color: var(--zl-accent);
        margin-bottom: 8px;
      }
      small {
        color: var(--zl-muted);
      }
      b {
        font-family: var(--zl-head);
        font-size: 22px;
        color: var(--zl-ink);
        overflow-wrap: anywhere;
      }
      span {
        font-size: 14px;
        color: var(--zl-muted);
        overflow-wrap: anywhere;
      }
      &:hover {
        background: var(--zl-soft);
      }
    }
  }
}
.zl-office {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 32px;
  margin-top: 20px;
  padding: 32px;
  border: 1px solid var(--zl-line);
  border-radius: 24px;
  &__main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    small {
      color: var(--zl-muted);
    }
    h3 {
      font-size: 30px;
      margin-top: -6px;
    }
  }
  &__addr {
    display: flex;
    gap: 8px;
    font-size: 17px;
    color: var(--zl-ink);
    .zl-icon {
      color: var(--zl-accent);
      margin-top: 2px;
    }
  }
  &__phones {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
    a {
      font-size: 20px;
      font-weight: 600;
      color: var(--zl-ink);
      &:hover {
        color: var(--zl-accent);
      }
    }
  }
  &__about {
    font-size: 14px;
    color: var(--zl-muted);
    &:first-of-type {
      margin-top: 10px;
    }
  }
  &__lines {
    margin: 0;
    > div {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--zl-line);
    }
    dt {
      color: var(--zl-muted);
    }
    dd {
      margin: 0;
      text-align: right;
      a {
        font-weight: 600;
        color: var(--zl-ink);
        &:hover {
          color: var(--zl-accent);
        }
      }
    }
  }
  &__side {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 14px;
  }
}
.zl-feedback {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 40px;
  padding: 36px;
  border-radius: 24px;
  background: var(--zl-surface);
  > div:first-child {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    h2 {
      font-size: clamp(26px, 2.6vw, 34px);
    }
  }
  &__form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    .zl-btn {
      justify-self: start;
    }
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__done {
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    > .zl-icon {
      color: var(--zl-grass);
    }
    b {
      font-family: var(--zl-head);
      font-size: 22px;
      color: var(--zl-ink);
    }
  }
}
@media (max-width: 989px) {
  .zl-contacts__quick {
    grid-template-columns: minmax(0, 1fr);
  }
  .zl-office,
  .zl-feedback {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 576px) {
  .zl-office {
    padding: 20px;
    &__lines > div {
      grid-template-columns: minmax(0, 1fr);
      gap: 2px;
    }
    &__lines dd {
      text-align: left;
    }
  }
  .zl-feedback {
    padding: 20px;
    &__form {
      grid-template-columns: minmax(0, 1fr);
      .zl-btn {
        justify-self: stretch;
      }
    }
  }
}
</style>
