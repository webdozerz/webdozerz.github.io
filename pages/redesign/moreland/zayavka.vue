<script lang="ts" setup>
// Заявка: коробки по каталогу → готовый текст в их форму «Написать нам» или на sale@moreland.ru. Никуда не отправляется.
import { mlByBox, mlContacts, mlLineSum, mlPath, mlRub, mlRub0, mlSubName, mlUnitShort } from '~/utils/moreland'
import { useMlList, useMlUi } from '~/composables/useMoreland'
import MlBuy from '~/components/redesign/moreland/MlBuy.vue'
import MlIcon from '~/components/redesign/moreland/MlIcon.vue'

useSeoMeta({ title: 'Заявка — Морелэнд | Концепт редизайна' })
const list = useMlList()
const ui = useMlUi()
const copied = ref(false)
const text = computed(() => list.message())
const mailto = computed(() => `mailto:${mlContacts.email}?subject=${encodeURIComponent('Заявка на отгрузку')}&body=${encodeURIComponent(text.value)}`)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(text.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
const write = () => (ui.write.value = { open: true, text: text.value })
const weight = computed(() => list.rows.value.reduce((s, r) => s + (mlByBox(r.p) ? r.p.box! * r.q : 0), 0))
</script>

<template>
  <div class="ml-wrap ml-order">
    <nav class="ml-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mlPath('/')">Главная</NuxtLink></span>
      <span>Заявка</span>
    </nav>
    <div class="ml-pagehead">
      <h1>Заявка</h1>
      <p>Соберите позиции коробками — отправим текст заявки менеджеру через «Написать нам» или на почту {{ mlContacts.email }}.</p>
    </div>

    <div v-if="list.count.value" class="ml-order__grid">
      <div class="ml-order__rows">
        <div v-for="r in list.rows.value" :key="r.p.id" class="ml-orow">
          <NuxtLink :to="mlPath(`/tovar/${r.p.slug}/`)" class="ml-orow__ph"><img :src="r.p.thumb" :alt="r.p.n" width="96" height="72" /></NuxtLink>
          <div class="ml-orow__name">
            <NuxtLink :to="mlPath(`/tovar/${r.p.slug}/`)">{{ r.p.n }}</NuxtLink>
            <span>{{ mlSubName(r.p.sec) }}<template v-if="r.p.price"> · {{ mlRub(r.p.price) }} за {{ mlUnitShort(r.p) }}</template><template v-if="mlByBox(r.p)"> · коробка {{ r.p.box }} кг</template></span>
          </div>
          <div class="ml-orow__qty"><MlBuy :p="r.p" /></div>
          <div class="ml-orow__sum">
            <b v-if="r.p.price">{{ mlRub0(mlLineSum(r.p, r.q)) }}</b>
            <span v-else>цену уточнить</span>
            <small v-if="mlByBox(r.p)">{{ r.p.box! * r.q }} кг</small>
          </div>
          <button type="button" class="ml-iconbtn ml-orow__del" :aria-label="`Убрать: ${r.p.n}`" @click="list.set(r.p.id, 0)"><MlIcon name="trash" /></button>
        </div>
        <div class="ml-order__under">
          <NuxtLink :to="mlPath('/produkcija/')" class="ml-sechead__link"><MlIcon name="left" />Добавить ещё</NuxtLink>
          <button type="button" class="ml-order__clear" @click="list.clear()">Очистить заявку</button>
        </div>
      </div>

      <aside class="ml-order__side">
        <div class="ml-panel ml-total">
          <h2>Итого</h2>
          <dl>
            <div><dt>Позиций</dt><dd>{{ list.count.value }}</dd></div>
            <div v-if="weight"><dt>Весовая рыба</dt><dd>{{ weight.toLocaleString('ru-RU') }} кг</dd></div>
            <div class="ml-total__sum"><dt>По ценам сайта</dt><dd>{{ mlRub0(list.total.value) }}</dd></div>
          </dl>
          <p v-if="list.unpriced.value" class="ml-total__note">+ {{ list.unpriced.value }} поз. без цены — менеджер назовёт.</p>
          <p class="ml-total__note">Опт от коробки, юр. лица и ИП. Бесплатная доставка по Омску. Цены не публичная оферта — подтвердим при отгрузке.</p>
          <button type="button" class="ml-btn ml-btn--wide" @click="write"><MlIcon name="mail" />Отправить заявку</button>
          <a :href="mailto" class="ml-btn ml-btn--line ml-btn--wide"><MlIcon name="mail" />Письмом на {{ mlContacts.email }}</a>
          <button type="button" class="ml-total__copy" @click="copy"><MlIcon :name="copied ? 'check' : 'copy'" />{{ copied ? 'Текст скопирован' : 'Скопировать текст заявки' }}</button>
        </div>
        <details class="ml-total__preview">
          <summary>Как будет выглядеть заявка</summary>
          <pre>{{ text }}</pre>
        </details>
      </aside>
    </div>

    <div v-else class="ml-panel ml-empty ml-order__empty">
      <MlIcon name="list" />
      <h2>Заявка пока пустая</h2>
      <p>Нажмите «В заявку» у нужных позиций — посчитаем сумму за коробки и подготовим текст для менеджера.</p>
      <NuxtLink :to="mlPath('/produkcija/')" class="ml-btn">Перейти к продукции</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.ml-order {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 28px;
    align-items: start;
  }
  &__rows {
    display: grid;
    gap: 10px;
  }
  &__under {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }
  &__clear {
    padding: 0;
    border: 0;
    background: none;
    color: var(--ml-mute);
    font-weight: 700;
    &:hover {
      color: #c8372d;
    }
  }
  &__side {
    position: sticky;
    top: calc(var(--ml-head) + 16px);
    display: grid;
    gap: 12px;
  }
  &__empty {
    justify-items: center;
    text-align: center;
    padding: 48px 20px;
    > .ml-icon {
      width: 44px;
      height: 44px;
      color: var(--ml-acc);
    }
  }
  @media (max-width: 989px) {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__side {
      position: static;
    }
  }
}
.ml-orow {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 170px 120px 42px;
  grid-template-areas: 'ph name qty sum del';
  gap: 16px;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--ml-line);
  border-radius: var(--ml-R);
  &__ph {
    grid-area: ph;
    position: relative;
    width: 96px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__name {
    grid-area: name;
    display: grid;
    gap: 2px;
    min-width: 0;
    a {
      font-weight: 800;
      color: var(--ml-ink);
      &:hover {
        color: var(--ml-acc);
      }
    }
    span {
      font-size: 13px;
      color: var(--ml-mute);
    }
  }
  &__qty {
    grid-area: qty;
  }
  &__sum {
    grid-area: sum;
    display: grid;
    justify-items: end;
    text-align: right;
    b {
      color: var(--ml-ink);
      font-size: 17px;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    span,
    small {
      font-size: 13px;
      color: var(--ml-mute);
    }
  }
  &__del {
    grid-area: del;
  }
  @media (max-width: 1199px) {
    grid-template-columns: 80px minmax(0, 1fr) 150px 42px;
    grid-template-areas: 'ph name name del' 'ph qty sum sum';
    row-gap: 10px;
    &__ph {
      width: 80px;
      height: 80px;
      align-self: start;
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: 64px minmax(0, 1fr) minmax(0, 1fr) 42px;
    grid-template-areas: 'ph name name del' 'qty qty sum sum';
    gap: 10px;
    &__ph {
      width: 64px;
      height: 64px;
    }
  }
}
.ml-total {
  display: grid;
  gap: 10px;
  h2 {
    font-size: 22px;
  }
  dl {
    display: grid;
    gap: 6px;
    margin: 4px 0;
    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    dt {
      color: var(--ml-mute);
    }
    dd {
      margin: 0;
      font-weight: 800;
      color: var(--ml-ink);
    }
  }
  &__sum {
    padding-top: 8px;
    border-top: 1px solid var(--ml-line);
    dd {
      font-size: 22px;
    }
  }
  &__note {
    font-size: 13px;
    color: var(--ml-mute);
  }
  &__copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 0;
    border: 0;
    background: none;
    color: var(--ml-acc);
    font-weight: 700;
    font-size: 14px;
    .ml-icon {
      width: 16px;
      height: 16px;
    }
  }
  .ml-btn {
    white-space: normal;
    text-align: center;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  &__preview {
    padding: 14px 16px;
    border: 1px solid var(--ml-line);
    border-radius: var(--ml-R);
    summary {
      cursor: pointer;
      font-weight: 700;
      color: var(--ml-ink);
    }
    pre {
      margin: 10px 0 0;
      white-space: pre-wrap;
      font: 13px/1.5 ui-monospace, Menlo, monospace;
      color: var(--ml-text);
    }
  }
}
</style>
