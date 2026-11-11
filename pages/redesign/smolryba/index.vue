<script lang="ts" setup>
import { SR_DATE, SR_TOTAL, SR_VIDEO, SR_XLSX, srAbout, srAdvantages, srAsset, srContacts, srMatch, srNowStatus, srPath, srPos, srRub0 } from '~/utils/smolryba'
import { srItems, srSections } from '~/utils/smolryba.data'
import { useSrList, useSrUi } from '~/composables/useSmolryba'
import SrIcon from '~/components/redesign/smolryba/SrIcon.vue'
import SrRow from '~/components/redesign/smolryba/SrRow.vue'
import SrPhone from '~/components/redesign/smolryba/SrPhone.vue'

useSeoMeta({ title: 'Рыбная база — рыба, морепродукты и икра оптом и в розницу, Смоленск | Концепт редизайна' })

const list = useSrList()
const ui = useSrUi()
const short: Record<string, string> = {
  ikra: 'Икра',
  ryba: 'Рыба с/м',
  steiki: 'Стейки, филе',
  more: 'Морепродукты',
  polar: 'POLAR',
  exprod: 'ЭКСПРОД',
  kopch: 'Копчёная, вяленая',
  konserv: 'Консервы, салаты',
}

// ---- AF «Прайс на сегодня»: лист прайса на их воде ----
const sec = ref('ryba')
const q = ref('')
const hints = ['Минтай', 'Креветка', 'Семга', 'Кальмар', 'Икра кеты', 'Треска']
const found = computed(() => {
  const s = q.value.trim()
  return s ? srItems.filter((i) => srMatch(i, s)) : srItems.filter((i) => i.s === sec.value)
})
const shown = computed(() => found.value.slice(0, 5))
const secNow = computed(() => srSections.find((s) => s.id === sec.value)!)
const moreLink = computed(() => {
  const s = q.value.trim()
  return { path: srPath('/price/'), query: s ? { q: s } : { r: sec.value } }
})
const pick = (id: string) => {
  sec.value = id
  q.value = ''
}

const video = ref<HTMLVideoElement | null>(null)
const status = ref({ open: false, text: '' })
onMounted(() => {
  status.value = srNowStatus()
  // видео воды оригинала — только на широком экране и без экономии трафика
  const v = video.value
  if (v && window.matchMedia('(min-width: 990px) and (prefers-reduced-motion: no-preference)').matches) {
    v.src = SR_VIDEO
    v.play().catch(() => {})
  }
})

const facts = [
  { b: 'более 50 лет', t: 'на рыбном рынке' },
  { b: `${SR_TOTAL} позиций`, t: 'в прайсе, 8 разделов' },
  { b: 'от флотов', t: 'прямые поставки — низкие цены' },
  { b: 'экспорт', t: 'склад аккредитован на страны ТС и Беларусь' },
]

const more = ref(false)

const consult = reactive({ name: '', phone: '', ok: true, done: false })
const sendConsult = () => {
  if (consult.phone.replace(/\D/g, '').length < 11 || !consult.ok) return
  consult.done = true
}
</script>

<template>
  <div class="sr-home">
    <!-- первый экран -->
    <section class="sr-hero">
      <div class="sr-hero__water">
        <img :src="srAsset('img/water.jpg')" alt="" width="1600" height="900" />
        <video ref="video" muted loop playsinline preload="none" aria-hidden="true" />
      </div>
      <div class="sr-wrap sr-hero__top">
        <h1>Вы покупаете не рыбу, а&nbsp;здоровье!</h1>
        <p>Рыба, морепродукты и икра оптом и в розницу по самым низким ценам со склада в Смоленске</p>
      </div>

      <div class="sr-wrap">
        <div class="sr-sheet">
          <div class="sr-sheet__head">
            <div class="sr-sheet__title">
              <span class="sr-sheet__fish" aria-hidden="true" />
              <div>
                <b>Каталог цен на {{ SR_DATE }}</b>
                <span>{{ SR_TOTAL }} позиций · цена за кг или за штуку · отгрузка коробками</span>
              </div>
            </div>
            <div class="sr-sheet__btns">
              <a class="sr-btn sr-btn--line" :href="SR_XLSX" download><SrIcon name="download" />Скачать .xlsx</a>
              <NuxtLink class="sr-btn sr-btn--soft" :to="srPath('/price/')">Весь прайс<SrIcon name="right" /></NuxtLink>
            </div>
          </div>

          <div class="sr-sheet__tabs" role="tablist" aria-label="Разделы прайса">
            <button
              v-for="s in srSections"
              :key="s.id"
              type="button"
              role="tab"
              class="sr-sheet__tab"
              :aria-selected="!q.trim() && sec === s.id"
              :class="{ 'is-on': !q.trim() && sec === s.id }"
              @click="pick(s.id)"
            >
              <img :src="srAsset(s.img)" alt="" width="40" height="40" loading="lazy" />
              <span>{{ short[s.id] }}</span><i>{{ s.count }}</i>
            </button>
          </div>

          <div class="sr-sheet__search">
            <label class="sr-sheet__field">
              <SrIcon name="search" />
              <input v-model="q" type="search" placeholder="Найти в прайсе: минтай, креветка, икра кеты…" aria-label="Поиск по прайсу" />
              <button v-if="q" type="button" aria-label="Очистить" @click="q = ''"><SrIcon name="close" /></button>
            </label>
            <div class="sr-sheet__hints">
              <button v-for="h in hints" :key="h" type="button" @click="q = h">{{ h }}</button>
            </div>
          </div>

          <div class="sr-sheet__rows sr-rows">
            <p class="sr-sheet__cap">
              <template v-if="q.trim()">Нашлось {{ found.length }} — «{{ q.trim() }}»</template>
              <template v-else>{{ secNow.name }} · {{ srPos(secNow.count) }}</template>
            </p>
            <SrRow v-for="it in shown" :key="it.id" :item="it" :show-section="!!q.trim()" />
            <div v-if="!found.length" class="sr-sheet__empty">
              Такой позиции в выборке концепта нет. Позвоните — подскажем по всему прайсу:
              <a :href="`tel:${srContacts.phones[0].tel}`">{{ srContacts.phones[0].text }}</a>
            </div>
          </div>

          <div class="sr-sheet__foot">
            <NuxtLink v-if="found.length > shown.length" :to="moreLink" class="sr-link">
              {{ q.trim() ? `Все ${found.length} в прайсе` : `Весь раздел — ${srPos(secNow.count)}` }}<SrIcon name="right" />
            </NuxtLink>
            <span v-else />
            <div v-if="list.count.value" class="sr-sheet__total">
              <span>В списке {{ list.count.value }} · {{ list.total.value.approx ? '≈ ' : '' }}<b>{{ srRub0(list.total.value.sum) }}</b></span>
              <NuxtLink :to="srPath('/spisok/')" class="sr-btn">Отправить список</NuxtLink>
            </div>
            <p v-else class="sr-sheet__tip">Нажмите «В список» — соберём заявку для менеджера в MAX, Telegram или на почту</p>
          </div>
        </div>
      </div>
    </section>

    <!-- факты их словами -->
    <section class="sr-wrap">
      <ul class="sr-facts">
        <li v-for="f in facts" :key="f.b"><b>{{ f.b }}</b><span>{{ f.t }}</span></li>
      </ul>
    </section>

    <!-- Рыбопродукция -->
    <section id="fish-production" class="sr-sec sr-wrap">
      <div class="sr-sec__head">
        <div>
          <h2>Наша продукция</h2>
          <p>Восемь разделов прайса. В каждом — цена за килограмм или штуку, вес коробки и её стоимость.</p>
        </div>
        <NuxtLink :to="srPath('/price/')" class="sr-link">Каталог цен<SrIcon name="right" /></NuxtLink>
      </div>
      <div class="sr-cats">
        <NuxtLink v-for="s in srSections" :key="s.id" :to="{ path: srPath('/price/'), query: { r: s.id } }" class="sr-cat">
          <span class="sr-cat__img"><img :src="srAsset(s.img)" :alt="s.name" width="360" height="240" loading="lazy" /></span>
          <span class="sr-cat__body">
            <b>{{ s.name }}</b>
            <span class="sr-cat__ex">{{ srItems.filter((i) => i.s === s.id).slice(0, 2).map((i) => i.n.replace(/\s*\(.*$/, '')).join(' · ') }}</span>
            <span class="sr-cat__go">{{ srPos(s.count) }}<SrIcon name="right" /></span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- О компании -->
    <section id="aboutus" class="sr-sec sr-wrap">
      <div class="sr-about">
        <div class="sr-about__text">
          <h2>О компании</h2>
          <p v-for="(p, i) in srAbout.slice(0, more ? srAbout.length : 2)" :key="i">{{ p }}</p>
          <button type="button" class="sr-link sr-about__more" :aria-expanded="more" @click="more = !more">
            {{ more ? 'Свернуть' : 'Смотреть больше' }}<SrIcon :name="more ? 'up' : 'down'" />
          </button>
        </div>
        <aside class="sr-store">
          <p class="sr-store__k">Склад в Смоленске</p>
          <p class="sr-store__addr">{{ srContacts.address }}</p>
          <p class="sr-store__st" :class="{ 'is-open': status.open }"><SrIcon name="clock" />{{ status.text || 'Пн–Пт 8–17, Сб 9–13' }}</p>
          <dl class="sr-store__hours">
            <template v-for="h in srContacts.hours" :key="h.d"><dt>{{ h.d }}</dt><dd>{{ h.t }}</dd></template>
          </dl>
          <div class="sr-store__btns">
            <a class="sr-btn" :href="`tel:${srContacts.phones[0].tel}`"><SrIcon name="phone" />Позвонить</a>
            <a class="sr-btn sr-btn--line" :href="srContacts.map" target="_blank" rel="noopener"><SrIcon name="pin" />Маршрут</a>
          </div>
        </aside>
      </div>
    </section>

    <!-- Почему именно мы? -->
    <section id="advantages" class="sr-sec sr-wrap">
      <div class="sr-sec__head"><h2>Почему именно мы?</h2></div>
      <ul class="sr-adv">
        <li v-for="a in srAdvantages" :key="a.icon">
          <span class="sr-adv__ico"><span class="sr-mask" :style="{ '--m': `url(${srAsset(`icons/${a.icon}.svg`)})` }" /></span>
          <span>{{ a.text }}</span>
        </li>
      </ul>
    </section>

    <!-- Новости -->
    <section id="news" class="sr-sec sr-wrap">
      <div class="sr-sec__head"><h2>Новости</h2></div>
      <div class="sr-news">
        <article class="sr-news__card">
          <time datetime="2026-11-10">{{ SR_DATE }}</time>
          <h3>Обновлён каталог цен</h3>
          <p>{{ SR_TOTAL }} позиций в восьми разделах: икра, свежемороженая рыба, стейки и филе, морепродукты, полуфабрикаты «POLAR» и «ЭКСПРОД», копчёная и вяленая рыба, консервы.</p>
          <div class="sr-news__btns">
            <NuxtLink :to="srPath('/price/')" class="sr-link">Смотреть прайс<SrIcon name="right" /></NuxtLink>
            <a :href="SR_XLSX" download class="sr-link"><SrIcon name="download" />.xlsx</a>
          </div>
        </article>
        <a class="sr-news__tg" :href="srContacts.tg" target="_blank" rel="noopener">
          <span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/tg.svg')})` }" />
          <b>Поступления и новые цены — в нашем Telegram</b>
          <span class="sr-link">t.me/smolryba<SrIcon name="right" /></span>
        </a>
      </div>
    </section>

    <!-- Как нас найти -->
    <section id="how-to-find-us" class="sr-sec sr-wrap">
      <div class="sr-sec__head"><h2>Как нас найти</h2></div>
      <div class="sr-find">
        <div class="sr-find__info">
          <dl class="sr-find__dl">
            <div><dt>Режим работы</dt><dd>Пн–Пт с 8 до 17<br />Сб с 9 до 13</dd></div>
            <div><dt>Адрес</dt><dd>г. Смоленск,<br />ул. Ново-Ленинградская, д. 15</dd></div>
            <div class="sr-find__wide">
              <dt>Контакты</dt>
              <dd>
                <a v-for="p in srContacts.phones" :key="p.tel" :href="`tel:${p.tel}`">{{ p.text }}</a>
                <a :href="`mailto:${srContacts.email}`">{{ srContacts.email }}</a>
              </dd>
            </div>
          </dl>
          <div class="sr-find__msg">
            <a class="sr-btn sr-btn--line" :href="srContacts.max" target="_blank" rel="noopener"><span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/max.svg')})` }" />Написать в MAX</a>
            <a class="sr-btn sr-btn--line" :href="srContacts.tg" target="_blank" rel="noopener"><span class="sr-mask" :style="{ '--m': `url(${srAsset('icons/tg.svg')})` }" />Telegram</a>
          </div>
          <div class="sr-consult">
            <template v-if="!consult.done">
              <h3>Получить консультацию</h3>
              <form class="sr-consult__form" @submit.prevent="sendConsult">
                <label class="sr-field"><span>Имя</span><input v-model="consult.name" autocomplete="name" placeholder="Как к вам обращаться" /></label>
                <label class="sr-field"><span>Телефон</span><SrPhone v-model="consult.phone" /></label>
                <button type="submit" class="sr-btn" :disabled="consult.phone.replace(/\D/g, '').length < 11 || !consult.ok">Отправить</button>
                <label class="sr-check sr-consult__ok"><input v-model="consult.ok" type="checkbox" /><span>Я соглашаюсь с политикой обработки персональных данных</span></label>
              </form>
            </template>
            <p v-else class="sr-consult__done"><SrIcon name="check" />Спасибо! Это демо — заявка никуда не ушла. На настоящем сайте менеджер перезвонит в рабочее время.</p>
          </div>
        </div>
        <div class="sr-map">
          <div class="sr-map__pin"><SrIcon name="pin" /><b>Рыбная база</b><span>ул. Ново-Ленинградская, 15</span></div>
          <iframe :src="srContacts.mapWidget" title="Рыбная база на Яндекс Картах" loading="lazy" />
          <a class="sr-map__open" :href="srContacts.map" target="_blank" rel="noopener">Открыть в Яндекс Картах</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
/* ---- AF «Прайс на сегодня» ---- */
.sr-hero { position: relative; padding-bottom: 8px; }
.sr-hero__water { position: absolute; left: 0; right: 0; top: 0; height: 300px; overflow: hidden; background: #0b4a63;
  img, video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  &::after { content: ''; position: absolute; inset: 0; background: rgba(0, 40, 62, .28); }
}
.sr-hero__top { position: relative; padding-top: 40px; padding-bottom: 26px; color: #fff;
  h1 { color: #fff; font-size: clamp(34px, 3.9vw, 56px); line-height: 1.04; text-wrap: balance; }
  p { max-width: 780px; margin-top: 10px; font-size: 17px; color: #e4f3f8; }
}
.sr-sheet { position: relative; padding: 22px 26px 18px; border-radius: var(--sr-R); background: #fff; box-shadow: 0 2px 6px rgba(0, 40, 62, .06), 0 24px 60px rgba(0, 40, 62, .16); }
.sr-sheet__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; padding-bottom: 16px; border-bottom: 1px dashed #c6dbe2; }
.sr-sheet__title { display: flex; align-items: center; gap: 14px; min-width: 0;
  b { display: block; color: var(--sr-ink); font: 700 24px/1.15 var(--sr-head); }
  span { display: block; margin-top: 2px; color: var(--sr-mute); font-size: 14px; }
}
/* три рыбки — из их логотипа, левая часть знака */
.sr-sheet__fish { display: block; width: 46px; height: 46px; flex: none; border-radius: 12px; background: var(--sr-soft); position: relative;
  &::before { content: ''; position: absolute; inset: 9px 7px; background: var(--sr-acc); -webkit-mask: url('/redesign/smolryba/logo.png') 0 50% / auto 100% no-repeat; mask: url('/redesign/smolryba/logo.png') 0 50% / auto 100% no-repeat; }
}
.sr-sheet__btns { display: flex; gap: 8px; }
.sr-sheet__tabs { display: flex; gap: 8px; margin: 16px -26px 0; padding: 0 26px 4px; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #c6dbe2 transparent; }
.sr-sheet__tab, .sr-sheet__tab:focus { display: inline-flex; align-items: center; gap: 8px; flex: none; height: 48px; padding: 0 14px 0 4px; border: 1px solid var(--sr-line); border-radius: 999px; background: #fff; color: var(--sr-navy); font: 500 15px/1 var(--sr-head); white-space: nowrap; transition: background-color .15s, border-color .15s;
  img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
  i { font-style: normal; color: var(--sr-mute); font-size: 13px; font-family: var(--sr-font); }
  &:hover { border-color: var(--sr-sea); }
  &.is-on { background: var(--sr-acc); border-color: var(--sr-acc); color: #fff; i { color: #cdeaf2; } }
}
.sr-sheet__search { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; margin-top: 14px; }
.sr-sheet__field { display: flex; align-items: center; gap: 10px; flex: 1 1 380px; min-width: 0; height: 52px; padding: 0 8px 0 16px; border: 1.5px solid #b9d9e2; border-radius: 14px; background: #fff; box-sizing: border-box; transition: border-color .15s, box-shadow .15s;
  &:focus-within { border-color: var(--sr-acc); box-shadow: 0 0 0 4px rgba(24, 117, 143, .12); }
  > .sr-icon { color: var(--sr-acc); }
  input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; font-size: 16px; color: var(--sr-ink); &::-webkit-search-cancel-button { display: none; } }
  button, button:focus { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; background: var(--sr-surf); color: var(--sr-mute); }
}
.sr-sheet__hints { display: flex; flex-wrap: wrap; gap: 6px;
  button, button:focus { padding: 6px 12px; border: 0; border-radius: 999px; background: var(--sr-surf); color: var(--sr-navy); font-size: 13px; &:hover { background: var(--sr-soft); color: var(--sr-acc-d); } }
}
.sr-sheet__rows { margin-top: 12px; min-height: 380px; }
.sr-sheet__cap { padding: 4px 0 8px; color: var(--sr-mute); font-size: 13px; font-weight: 500; }
.sr-sheet__empty { padding: 20px 0; border-top: 1px solid var(--sr-line); color: var(--sr-mute); a { color: var(--sr-acc); font-weight: 600; white-space: nowrap; } }
.sr-sheet__foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 20px; padding-top: 14px; border-top: 1px solid var(--sr-line); }
.sr-sheet__tip { color: var(--sr-mute); font-size: 14px; }
.sr-sheet__total { display: flex; align-items: center; gap: 16px; font-variant-numeric: tabular-nums; b { color: var(--sr-ink); font-size: 17px; } }

.sr .sr-facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 28px 0 0; padding: 0;
  li { display: grid; gap: 2px; padding: 18px 20px; border-radius: 18px; background: var(--sr-surf); }
  b { color: var(--sr-acc-d); font: 700 26px/1.1 var(--sr-head); }
  span { color: var(--sr-text); font-size: 14px; }
}

/* ---- разделы ---- */
.sr-cats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.sr-cat { display: grid; grid-template-rows: auto 1fr; height: 100%; border: 1px solid var(--sr-line); border-radius: 18px; overflow: hidden; background: #fff; transition: border-color .15s;
  &:hover { border-color: var(--sr-sea); img { transform: scale(1.04); } .sr-cat__go { color: var(--sr-acc-d); } }
}
.sr-cat__img { display: block; aspect-ratio: 3 / 2; overflow: hidden; background: var(--sr-surf);
  img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
}
.sr-cat__body { display: grid; grid-template-rows: auto 1fr auto; gap: 6px; padding: 14px 16px 16px;
  b { color: var(--sr-ink); font: 700 18px/1.2 var(--sr-head); min-height: 2.4em; }
  .sr-cat__ex { color: var(--sr-mute); font-size: 13px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.8em; }
}
.sr-cat__go { display: inline-flex; align-items: center; gap: 4px; color: var(--sr-acc); font-weight: 600; font-size: 14px; .sr-icon { width: 16px; height: 16px; } }

/* ---- о компании ---- */
.sr-about { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 32px 56px; align-items: start; }
.sr-about__text { display: grid; gap: 14px; justify-items: start;
  h2 { font-size: clamp(28px, 3vw, 40px); margin-bottom: 6px; }
  p { max-width: 720px; font-size: 16px; }
}
.sr .sr-about__more { padding: 0; border: 0; background: none; }
.sr-store { display: grid; gap: 10px; padding: 26px; border-radius: var(--sr-R); background: var(--sr-surf); }
.sr-store__k { color: var(--sr-mute); font-size: 13px; font-weight: 600; }
.sr-store__addr { color: var(--sr-ink); font: 700 22px/1.2 var(--sr-head); }
.sr-store__st { display: flex; align-items: center; gap: 6px; color: var(--sr-mute); font-weight: 500; &.is-open { color: var(--sr-green); } .sr-icon { width: 18px; height: 18px; } }
.sr-store__hours { display: grid; grid-template-columns: auto 1fr; gap: 4px 16px; margin: 4px 0 8px; dt { color: var(--sr-mute); } dd { color: var(--sr-ink); font-weight: 500; } }
.sr-store__btns { display: flex; flex-wrap: wrap; gap: 8px; .sr-btn { flex: 1 1 140px; } }

/* ---- преимущества ---- */
.sr .sr-adv { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 0; padding: 0;
  li { display: flex; align-items: center; gap: 16px; padding: 20px 22px; border: 1px solid var(--sr-line); border-radius: 18px; color: var(--sr-ink); font: 600 17px/1.3 var(--sr-head); }
}
.sr-adv__ico { display: grid; place-items: center; width: 60px; height: 60px; flex: none; border-radius: 50%; background: var(--sr-soft); color: var(--sr-acc);
  .sr-mask { width: 34px; height: 34px; }
}

/* ---- новости ---- */
.sr-news { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 16px; }
.sr-news__card { display: grid; gap: 8px; align-content: start; padding: 26px; border: 1px solid var(--sr-line); border-radius: 18px;
  time { color: var(--sr-acc); font-weight: 600; font-size: 14px; }
  h3 { font-size: 24px; }
  p { color: var(--sr-text); max-width: 640px; }
}
.sr-news__btns { display: flex; gap: 24px; margin-top: 6px; }
.sr-news__tg { display: grid; gap: 10px; align-content: start; padding: 26px; border-radius: 18px; background: var(--sr-surf); transition: background-color .15s;
  .sr-mask { width: 36px; height: 36px; color: var(--sr-acc); }
  b { color: var(--sr-ink); font: 700 20px/1.25 var(--sr-head); }
  &:hover { background: var(--sr-soft); }
}

/* ---- как нас найти ---- */
.sr-find { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 20px; align-items: stretch; }
.sr-find__info { display: grid; gap: 18px; align-content: start; }
.sr-find__dl { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 24px; padding: 24px; border-radius: 18px; background: var(--sr-surf);
  dt { color: var(--sr-mute); font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  dd { color: var(--sr-ink); font-weight: 500; }
  a { display: block; color: var(--sr-ink); font-weight: 600; &:hover { color: var(--sr-acc); } }
}
.sr-find__wide dd { display: grid; grid-template-columns: repeat(2, max-content); gap: 4px 24px; }
.sr-find__msg { display: flex; flex-wrap: wrap; gap: 8px; .sr-mask { width: 20px; height: 20px; } }
.sr-consult { padding: 22px 24px; border: 1px solid var(--sr-line); border-radius: 18px;
  h3 { font-size: 22px; margin-bottom: 14px; }
}
.sr-consult__form { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; align-items: end; .sr-btn { grid-column: 1 / -1; } }
.sr-consult__ok { grid-column: 1 / -1; }
.sr-consult__done { display: flex; gap: 10px; align-items: flex-start; color: var(--sr-text); .sr-icon { color: var(--sr-green); } }
.sr-map { position: relative; min-height: 420px; border-radius: 18px; overflow: hidden; background: var(--sr-surf);
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
}
.sr-map__pin { position: absolute; left: 50%; top: 42%; display: grid; justify-items: center; gap: 2px; transform: translate(-50%, -50%); text-align: center; color: var(--sr-mute); font-size: 13px;
  .sr-icon { width: 34px; height: 34px; color: var(--sr-acc); } b { color: var(--sr-ink); }
}
.sr-map__open { position: absolute; left: 12px; bottom: 12px; z-index: 1; padding: 8px 14px; border-radius: 10px; background: #fff; color: var(--sr-acc-d); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0, 40, 62, .15); }

@media (max-width: 1199px) {
  .sr-cats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sr .sr-adv { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sr-find { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 989px) {
  .sr .sr-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sr-cats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sr-about { grid-template-columns: minmax(0, 1fr); }
  .sr-news { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 768px) {
  .sr-hero__water { height: 290px; }
  .sr-hero__top { padding-top: 28px; padding-bottom: 22px; p { font-size: 15px; } }
  .sr-sheet { padding: 16px 16px 14px; border-radius: 20px; }
  .sr-sheet__tabs { margin-left: -16px; margin-right: -16px; padding-left: 16px; padding-right: 16px; scrollbar-width: none; &::-webkit-scrollbar { display: none; } }
  .sr-sheet__title b { font-size: 20px; }
  .sr-sheet__btns { width: 100%; .sr-btn { flex: 1; padding: 0 12px; } }
  .sr-sheet__hints { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-right: -16px; padding-right: 16px; &::-webkit-scrollbar { display: none; } button { flex: none; } }
  .sr-sheet__rows { min-height: 0; }
  .sr-sheet__total { width: 100%; justify-content: space-between; }
  .sr-find__dl { grid-template-columns: minmax(0, 1fr); padding: 20px; }
  .sr-find__wide dd { grid-template-columns: minmax(0, 1fr); }
  .sr-map { min-height: 320px; }
}
@media (max-width: 576px) {
  .sr-cats { grid-template-columns: minmax(0, 1fr); }
  .sr-cat { grid-template-rows: none; grid-template-columns: 120px minmax(0, 1fr); }
  .sr-cat__img { aspect-ratio: auto; height: 100%; min-height: 120px; }
  .sr-cat__body b { min-height: 0; font-size: 17px; }
  .sr .sr-adv { grid-template-columns: minmax(0, 1fr); li { padding: 16px; font-size: 16px; } }
  .sr-adv__ico { width: 52px; height: 52px; .sr-mask { width: 28px; height: 28px; } }
  .sr-consult__form { grid-template-columns: minmax(0, 1fr); }
  .sr-sheet__title span { font-size: 13px; }
  .sr-sheet__btns { display: none; }
  .sr-sheet__head { padding-bottom: 12px; }
  .sr .sr-facts li { padding: 14px 16px; b { font-size: 22px; } }
}
@media (max-width: 375px) {
  .sr .sr-facts { grid-template-columns: minmax(0, 1fr); }
  .sr-sheet__btns { flex-wrap: wrap; }
  .sr-cat { grid-template-columns: 96px minmax(0, 1fr); }
}
</style>
