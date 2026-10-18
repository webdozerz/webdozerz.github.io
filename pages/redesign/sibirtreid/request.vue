<script lang="ts" setup>
import SbIcon from '~/components/redesign/sibirtreid/SbIcon.vue'
import SbQty from '~/components/redesign/sibirtreid/SbQty.vue'

const req = useSibirtreidRequest()

const progress = computed(() => Math.min(1, req.total.value / SB_MIN_ORDER))

const inn = ref('')
const company = ref('')
const name = ref('')
const phone = ref('')
const email = ref('')
const city = ref('Новосибирск')
const way = ref<'pickup' | 'tk' | 'door'>('tk')
const comment = ref('')
const tried = ref(false)
const sent = ref(false)

const innOk = computed(() => /^\d{10}(\d{2})?$/.test(inn.value.replace(/\s/g, '')))
const phoneOk = computed(() => phone.value.replace(/\D/g, '').length >= 10)
const ok = computed(() => innOk.value && phoneOk.value && name.value.trim().length > 1)
const ways = [
  { id: 'pickup', label: 'Самовывоз со склада', note: 'Северный проезд, 33' },
  { id: 'tk', label: 'До транспортной компании', note: 'бесплатно от 100 000 ₽' },
  { id: 'door', label: 'До нашего склада', note: 'по Новосибирску, от 100 000 ₽' },
] as const

const submit = () => {
  tried.value = true
  if (!ok.value || !req.count.value) return
  sent.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Заявка таблицей — для бухгалтерии или чтобы переслать коллеге.
const download = () => {
  const rows = [
    ['Позиция', 'Раздел', 'Объём/вес', 'Упаковок', 'Цена от, ₽/уп.', 'Сумма от, ₽'],
    ...req.rows.value.map((r) => [
      r.item.name,
      sbSection(r.item.sec)?.label ?? '',
      r.vol ? `${r.vol} ${r.item.unit ?? ''}` : 'любой',
      String(r.qty),
      r.item.price.toFixed(2).replace('.', ','),
      r.sum.toFixed(2).replace('.', ','),
    ]),
    ['Итого', '', '', String(req.packs.value), '', req.total.value.toFixed(2).replace('.', ',')],
  ]
  const csv = '﻿' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(';')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  a.download = 'zayavka-sibirtreid.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

const onPhone = (e: Event) => {
  let d = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  const p = d.slice(1, 11)
  let out = '+7'
  if (p.length) out += ` (${p.slice(0, 3)}`
  if (p.length >= 3) out += ')'
  if (p.length > 3) out += ` ${p.slice(3, 6)}`
  if (p.length > 6) out += `-${p.slice(6, 8)}`
  if (p.length > 8) out += `-${p.slice(8, 10)}`
  phone.value = out
}

useSeoMeta({ title: 'Заявка — СибирьТрейд | Концепт редизайна' })
</script>

<template>
  <div class="sb-wrap sb-req">
    <nav class="sb-crumbs" aria-label="Навигация">
      <NuxtLink :to="sbPath()">Главная</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>Заявка</span>
    </nav>

    <div v-if="sent" class="sb-req__sent" role="status">
      <span class="sb-req__sent-mark"><SbIcon name="check" :size="34" /></span>
      <h1 class="sb-page-title">Заявка собрана</h1>
      <p>
        {{ sbPositions(req.count.value) }}, {{ sbPacksWord(req.packs.value) }}, от {{ sbRub(req.total.value) }}.
        Это демо: заявка никуда не отправлена. На рабочем сайте она уйдёт в отдел продаж вместе с ИНН
        {{ inn }}, и менеджер перезвонит на {{ phone }} с точной ценой, наличием и датой погрузки.
      </p>
      <div class="sb-req__sent-actions">
        <button type="button" class="sb-btn sb-btn--lg" @click="download">
          <SbIcon name="download" :size="18" />
          Скачать заявку
        </button>
        <button type="button" class="sb-btn sb-btn--lg sb-btn--line" @click="sent = false">Вернуться к заявке</button>
      </div>
    </div>

    <template v-else>
      <div class="sb-req__head">
        <h1 class="sb-page-title">Заявка</h1>
        <p v-if="req.count.value">{{ sbPositions(req.count.value) }} · {{ sbPacksWord(req.packs.value) }}</p>
      </div>

      <div v-if="!req.count.value" class="sb-req__empty">
        <h2>В заявке пока пусто</h2>
        <p>
          Добавляйте позиции из каталога — сумма «от» и шкала до минимального заказа посчитаются сами.
          Можно и проще: пришлите свой список в Telegram или на почту, менеджер соберёт заявку сам.
        </p>
        <div class="sb-req__empty-actions">
          <NuxtLink :to="sbCatalogPath()" class="sb-btn sb-btn--lg">Открыть каталог</NuxtLink>
          <a :href="sbContacts.telegram" target="_blank" rel="noopener" class="sb-btn sb-btn--lg sb-btn--line">
            <SbIcon name="send" :size="18" />
            Прислать список в Telegram
          </a>
        </div>
      </div>

      <div v-else class="sb-req__layout">
        <div class="sb-req__main">
          <ul class="sb-lines">
            <li v-for="r in req.rows.value" :key="r.key" class="sb-line" :class="`sb-tone--${sbSection(r.item.sec)?.tone}`">
              <NuxtLink :to="sbPath(`/item/${r.item.id}`)" class="sb-line__brand">{{ r.item.brand }}</NuxtLink>
              <div class="sb-line__info">
                <NuxtLink :to="sbPath(`/item/${r.item.id}`)" class="sb-line__name">{{ r.item.name }}</NuxtLink>
                <span class="sb-line__meta">от {{ sbKop(r.item.price) }} / уп.{{ sbPacks(r.item) ? ` · в упаковке ${sbPacks(r.item)}` : '' }}</span>
                <label v-if="(r.item.vols?.length ?? 0) > 1" class="sb-select sb-line__vol">
                  <span class="sb-sr">{{ sbVolLabel(r.item) }}</span>
                  <select :value="r.vol" @change="req.changeVol(r.id, r.vol, ($event.target as HTMLSelectElement).value)">
                    <option value="">{{ sbVolLabel(r.item) }}: любой</option>
                    <option v-for="v in r.item.vols" :key="v" :value="v">{{ v }} {{ r.item.unit }}</option>
                  </select>
                  <SbIcon name="down" :size="16" />
                </label>
              </div>
              <SbQty class="sb-line__qty" :model-value="r.qty" :min="sbMin(r.item)" :name="r.item.name" small @update:model-value="(v: number) => req.set(r.id, r.vol, v)" />
              <strong class="sb-line__sum">{{ sbRub(r.sum) }}</strong>
              <button type="button" class="sb-iconbtn sb-line__del" :aria-label="`Убрать ${r.item.name}`" @click="req.remove(r.id, r.vol)">
                <SbIcon name="trash" :size="18" />
              </button>
            </li>
          </ul>
          <div class="sb-req__tools">
            <NuxtLink :to="sbCatalogPath()" class="sb-link"><SbIcon name="plus" :size="16" /> Добавить позиции</NuxtLink>
            <button type="button" class="sb-link" @click="download"><SbIcon name="download" :size="16" /> Скачать таблицей</button>
            <button type="button" class="sb-link sb-req__clear" @click="req.clear()"><SbIcon name="trash" :size="16" /> Очистить</button>
          </div>

          <form class="sb-reqform" novalidate @submit.prevent="submit">
            <h2>Кому отправить счёт</h2>
            <p>Менеджер проверит наличие, пересчитает цену со скидкой от объёма и перезвонит.</p>
            <div class="sb-reqform__grid">
              <label class="sb-field">
                <span>ИНН *</span>
                <input v-model="inn" inputmode="numeric" maxlength="14" placeholder="10 или 12 цифр" :aria-invalid="tried && !innOk" />
                <small v-if="tried && !innOk">ИНН — 10 цифр у организации или 12 у ИП</small>
              </label>
              <label class="sb-field">
                <span>Компания или магазин</span>
                <input v-model="company" placeholder="ООО «Ромашка», магазин у дома" />
              </label>
              <label class="sb-field">
                <span>Ваше имя *</span>
                <input v-model="name" autocomplete="name" :aria-invalid="tried && name.trim().length < 2" />
              </label>
              <label class="sb-field">
                <span>Телефон *</span>
                <input :value="phone" type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" :aria-invalid="tried && !phoneOk" @input="onPhone" />
                <small v-if="tried && !phoneOk">Нужен телефон, чтобы перезвонить</small>
              </label>
              <label class="sb-field">
                <span>Почта для счёта</span>
                <input v-model="email" type="email" autocomplete="email" />
              </label>
              <label class="sb-field">
                <span>Город доставки</span>
                <span class="sb-select sb-reqform__city">
                  <select v-model="city">
                    <option v-for="c in sbRegions" :key="c">{{ c }}</option>
                  </select>
                  <SbIcon name="down" :size="16" />
                </span>
              </label>
            </div>
            <fieldset class="sb-reqform__ways">
              <legend>Как забрать</legend>
              <label v-for="w in ways" :key="w.id" :class="{ 'is-on': way === w.id }">
                <input v-model="way" type="radio" :value="w.id" name="way" />
                <span>
                  <strong>{{ w.label }}</strong>
                  <small>{{ w.note }}</small>
                </span>
              </label>
            </fieldset>
            <label class="sb-field">
              <span>Комментарий</span>
              <textarea v-model="comment" rows="3" placeholder="Желаемая дата погрузки, транспортная компания, замены" />
            </label>
          </form>
        </div>

        <aside class="sb-req__aside">
          <div class="sb-summary">
            <div class="sb-summary__row"><span>Позиций</span><strong>{{ req.count.value }}</strong></div>
            <div class="sb-summary__row"><span>Упаковок</span><strong>{{ req.packs.value }}</strong></div>
            <div class="sb-summary__total">
              <span>Сумма по ценам «от»</span>
              <strong>{{ sbRub(req.total.value) }}</strong>
            </div>
            <div class="sb-meter" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100" aria-label="До минимального заказа">
              <span :style="{ transform: `scaleX(${progress})` }" />
            </div>
            <p class="sb-summary__left" :class="{ 'is-ok': !req.left.value }">
              <template v-if="req.left.value">До минимального заказа 100 000 ₽ — ещё {{ sbRub(req.left.value) }}</template>
              <template v-else>Минимальный заказ набран, доставка до ТК — бесплатно</template>
            </p>
            <button type="button" class="sb-btn sb-btn--lg sb-btn--wide" :disabled="!!req.left.value" @click="submit">Отправить заявку</button>
            <p v-if="req.left.value" class="sb-summary__note">
              Не хватает до минимума? Отправьте как вопрос — менеджер подскажет, что добавить.
              <button type="button" class="sb-link" @click="req.askPrice('Заявка меньше минимума')">Задать вопрос</button>
            </p>
            <p v-if="tried && !ok" class="sb-summary__err">Заполните ИНН, имя и телефон в форме слева</p>
            <p class="sb-summary__note">Итог — ориентир. Точную цену с учётом скидки и наличие подтвердит менеджер.</p>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.sb .sb-req {
  &__head {
    display: flex;
    align-items: baseline;
    gap: 8px 18px;
    flex-wrap: wrap;
    margin-bottom: 22px;

    p {
      color: var(--sb-muted);
      font-weight: 600;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 28px;
    align-items: start;
  }

  &__main {
    min-width: 0;
  }

  &__aside {
    position: sticky;
    top: 136px;
  }

  &__tools {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 24px;
    margin: 16px 4px 0;
  }

  &__clear {
    color: var(--sb-muted);
    margin-left: auto;
  }

  &__empty {
    padding: clamp(28px, 5vw, 56px);
    border-radius: 32px;
    background: var(--sb-lime-soft);

    h2 {
      font-size: clamp(26px, 3.4vw, 38px);
    }

    p {
      margin-top: 12px;
      max-width: 600px;
      color: var(--sb-muted);
      font-size: 16px;
    }

    &-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
    }
  }

  &__sent {
    max-width: 760px;
    margin: 20px auto 0;
    padding: clamp(28px, 5vw, 56px);
    border-radius: 32px;
    background: var(--sb-lime-soft);
    text-align: center;

    p {
      margin: 14px auto 0;
      max-width: 600px;
      color: var(--sb-muted);
      font-size: 16px;
    }

    &-mark {
      display: inline-grid;
      place-items: center;
      width: 72px;
      height: 72px;
      margin-bottom: 18px;
      border-radius: 50%;
      background: var(--sb-lime);
      color: var(--sb-ink);
    }

    &-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 26px;
    }
  }

  @media (max-width: 1000px) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__aside {
      position: static;
    }
  }
}

.sb .sb-lines {
  display: grid;
  gap: 10px;
}

.sb .sb-line {
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr) 150px 120px 44px;
  align-items: center;
  gap: 16px;
  padding: 10px 10px 10px 10px;
  border-radius: 22px;
  box-shadow: inset 0 0 0 1px var(--sb-line);

  &__brand {
    display: flex;
    align-items: center;
    align-self: stretch;
    min-height: 84px;
    padding: 10px 12px;
    border-radius: 16px;
    background: var(--tone-bg);
    color: var(--tone-ink);
    font-family: var(--sb-display);
    font-weight: 800;
    font-size: 15px;
    line-height: 1.1;
    overflow-wrap: anywhere;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__name {
    font-weight: 700;
    line-height: 1.3;

    &:hover {
      color: var(--sb-green);
    }
  }

  &__meta {
    font-size: 13px;
    color: var(--sb-muted);
  }

  &__vol {
    max-width: 220px;
    margin-top: 4px;

    select {
      height: 36px;
      font-size: 13px;
    }
  }

  &__sum {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__del {
    color: var(--sb-muted);

    &:hover {
      color: var(--sb-orange-d);
      background: var(--sb-peach);
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 84px minmax(0, 1fr) 44px;
    grid-template-areas:
      'brand info del'
      'qty qty sum';
    gap: 10px 12px;

    &__brand {
      grid-area: brand;
      min-height: 72px;
      font-size: 13px;
    }

    &__info {
      grid-area: info;
    }

    &__del {
      grid-area: del;
      align-self: start;
    }

    &__qty {
      grid-area: qty;
      max-width: 200px;
    }

    &__sum {
      grid-area: sum;
    }
  }
}

.sb .sb-reqform {
  display: grid;
  gap: 16px;
  margin-top: 32px;
  padding: clamp(22px, 4vw, 36px);
  border-radius: 32px;
  background: var(--sb-lime);

  h2 {
    font-size: clamp(24px, 3vw, 32px);
  }

  > p {
    margin-top: -8px;
    color: #2f4a1a;
  }

  .sb-field > span {
    color: #2f4a1a;
  }

  .sb-field input,
  .sb-field textarea {
    box-shadow: none;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  &__city select {
    height: 52px;
    border-radius: 16px;
    box-shadow: none;
    font-size: 15px;
    font-weight: 500;
    padding-left: 18px;
  }

  &__ways {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin: 0;
    padding: 0;
    border: 0;

    legend {
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #2f4a1a;
    }

    label {
      display: flex;
      gap: 10px;
      padding: 14px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.55);
      cursor: pointer;
      transition: background-color 0.15s, box-shadow 0.15s;

      &.is-on {
        background: #fff;
        box-shadow: inset 0 0 0 2px var(--sb-green);
      }
    }

    input {
      accent-color: var(--sb-green);
      margin-top: 3px;
    }

    span {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }

    small {
      color: var(--sb-muted);
    }
  }

  @media (max-width: 640px) {
    &__grid,
    &__ways {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

.sb .sb-summary {
  display: grid;
  gap: 12px;
  padding: 24px;
  border-radius: 28px;
  background: #fff;
  box-shadow: inset 0 0 0 1.5px var(--sb-line);

  &__row {
    display: flex;
    justify-content: space-between;
    color: var(--sb-muted);

    strong {
      color: var(--sb-ink);
      font-variant-numeric: tabular-nums;
    }
  }

  &__total {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 12px;
    border-top: 1px solid var(--sb-line);

    span {
      color: var(--sb-muted);
      font-size: 14px;
    }

    strong {
      font-family: var(--sb-display);
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }
  }

  &__left {
    font-size: 14px;
    font-weight: 600;
    color: var(--sb-orange-d);

    &.is-ok {
      color: var(--sb-green);
    }
  }

  &__note {
    font-size: 13px;
    color: var(--sb-muted);

    .sb-link {
      font-size: 13px;
    }
  }

  &__err {
    font-size: 13px;
    font-weight: 600;
    color: var(--sb-orange-d);
  }
}
</style>
