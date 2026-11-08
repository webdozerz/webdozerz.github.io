<script lang="ts" setup>
import { zdPath } from '~/utils/zdrava22'
import { zdReviews } from '~/utils/zdrava22Reviews'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'
import ZdPhone from '~/components/redesign/zdrava22/ZdPhone.vue'

useSeoMeta({ title: 'Отзывы — пасека «Ширяев и сыновья» | Концепт редизайна' })

// Как у оригинала: 3 страницы по 50 отзывов (?page=N), длинные — свёрнуты
const PER = 50
const route = useRoute()
const router = useRouter()
const pages = Math.ceil(zdReviews.length / PER)
const page = computed(() => Math.min(pages, Math.max(1, Number(route.query.page) || 1)))
const list = computed(() => zdReviews.slice((page.value - 1) * PER, page.value * PER))
const go = (n: number) => {
  router.push({ query: n > 1 ? { page: n } : {} })
  nextTick(() => document.getElementById('spisok')?.scrollIntoView())
}
const open = ref<Record<string, boolean>>({})
// Карточки в ряду одной высоты: длинный текст режем по словам (~3 строки), «Читать полностью» внизу карточки
const long = (t: string) => t.length > 190
const cut = (t: string) => `${t.slice(0, 165).replace(/\s+\S*$/, '').replace(/[,.;:!?—-]+$/, '')}…`

const form = reactive({ city: '', name: '', otch: '', phone: '', text: '' })
const sent = ref(false)
const tried = ref(false)
const ok = computed(() => form.name.trim() && form.city.trim() && form.text.trim().length > 10)
const send = () => {
  tried.value = true
  if (!ok.value) return
  sent.value = true
}
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>Отзывы</span></nav>
    <header class="zd-pagehead">
      <h1>Отзывы</h1>
      <p>{{ zdReviews.length }} отзывов покупателей. На сайте размещаются исключительно реальные отзывы, перед текстом — имя и отчество автора, населённый пункт и дата.</p>
      <a href="#otzyv" class="zd-btn zd-btn--line zd-revpage__write">Оставить отзыв</a>
    </header>

    <section class="zd-sec zd-sec--first zd-revpage">
      <div id="spisok">
        <div class="zd-revlist">
          <article v-for="r in list" :key="r.author + r.date" class="zd-review">
            <div class="zd-review__head"><b>{{ r.author }}</b><time>{{ r.date }}</time></div>
            <p>{{ long(r.text) && !open[r.author + r.date] ? cut(r.text) : r.text }}</p>
            <button v-if="long(r.text)" type="button" class="zd-link zd-review__more" @click="open[r.author + r.date] = !open[r.author + r.date]">
              {{ open[r.author + r.date] ? 'Свернуть' : 'Читать полностью' }}
            </button>
          </article>
        </div>
        <nav class="zd-pager" aria-label="Страницы отзывов">
          <button type="button" :disabled="page === 1" aria-label="Назад" @click="go(page - 1)"><ZdIcon name="left" :size="18" /></button>
          <button v-for="n in pages" :key="n" type="button" :class="{ 'is-on': n === page }" @click="go(n)">{{ n }}</button>
          <button type="button" :disabled="page === pages" aria-label="Вперёд" @click="go(page + 1)"><ZdIcon name="right" :size="18" /></button>
        </nav>
      </div>

      <aside id="otzyv" class="zd-revform">
        <h2>Оставить отзыв</h2>
        <div v-if="sent" class="zd-revform__done">
          <ZdIcon name="check" :size="28" />
          <p><b>Спасибо за отзыв!</b> Он появится на сайте после проверки.</p>
          <p class="zd-done__demo">Демо: в концепте отзыв никуда не отправлен.</p>
        </div>
        <form v-else novalidate @submit.prevent="send">
          <label class="zd-field"><span>Населённый пункт</span><input v-model="form.city" type="text" /></label>
          <div class="zd-revform__two">
            <label class="zd-field"><span>Имя</span><input v-model="form.name" type="text" autocomplete="given-name" /></label>
            <label class="zd-field"><span>Отчество</span><input v-model="form.otch" type="text" /></label>
          </div>
          <label class="zd-field"><span>Телефон</span><ZdPhone v-model="form.phone" /><small>Не публикуется</small></label>
          <label class="zd-field"><span>Отзыв</span><textarea v-model="form.text" rows="5" /></label>
          <small v-if="tried && !ok" class="zd-err">Заполните населённый пункт, имя и текст отзыва.</small>
          <button type="submit" class="zd-btn zd-btn--big">Отправить отзыв</button>
          <small class="zd-revform__rule">Автор отзыва, размещая его, соглашается с политикой обработки персональных данных. Отзыв удаляется по первому требованию автора.</small>
        </form>
      </aside>
    </section>
  </div>
</template>

<style lang="scss">
.zd-revpage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);

    .zd-revform {
      position: static;
    }
  }
}
.zd-revpage__write {
  margin-top: 16px;

  @media (min-width: 1200px) {
    display: none;
  }
}
.zd-revlist {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;

  .zd-review__more {
    align-self: flex-start;
    margin-top: auto;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-revform {
  position: sticky;
  top: 96px;
  padding: 24px;
  border-radius: var(--zd-R);
  border: 1px solid var(--zd-line);

  h2 {
    margin-bottom: 14px;
    font-size: 22px;
  }
  form {
    display: grid;
    gap: 12px;
  }
  &__two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  &__rule {
    font-size: 12px;
    color: var(--zd-muted);
  }
  &__done {
    display: grid;
    gap: 8px;

    > svg {
      color: var(--zd-accent);
    }
  }

  @media (max-width: 375px) {
    padding: 18px 16px;

    &__two {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
