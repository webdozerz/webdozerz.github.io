<script lang="ts" setup>
import { zdContacts, zdDelivery, zdItems, zdMoney, zdPath, zdPayment, zdSorts, zdSteps, zdTk } from '~/utils/zdrava22'
import { useZdNote, useZdUi } from '~/composables/useZdrava22'
import ZdIcon from '~/components/redesign/zdrava22/ZdIcon.vue'
import ZdPhone from '~/components/redesign/zdrava22/ZdPhone.vue'
import ZdQty from '~/components/redesign/zdrava22/ZdQty.vue'

useSeoMeta({ title: 'Контакты и порядок заказа — пасека «Ширяев и сыновья» | Концепт редизайна' })

const route = useRoute()
const router = useRouter()
const note = useZdNote()
const ui = useZdUi()

// «Оформить заказ» у товара подставляет его в форму (у оригинала все кнопки ведут на одну /contact/ без товара)
const takeQuery = () => {
  note.persist()
  const z = route.query.z
  if (typeof z === 'string' && /^(r|o|i):/.test(z)) {
    note.add(z)
    router.replace({ query: {}, hash: '#zakaz' })
  }
}
onMounted(takeQuery)
watch(() => route.query.z, takeQuery)

const has = (k: string) => note.qtyOf(k) > 0
const phoneOk = computed(() => note.form.value.phone.replace(/\D/g, '').length === 11)
const nameOk = computed(() => note.form.value.name.trim().length > 1)
const canSend = computed(() => phoneOk.value && nameOk.value && (note.count.value > 0 || note.form.value.message.trim().length > 3))
const tried = ref(false)
const send = () => {
  tried.value = true
  if (!canSend.value) return
  note.submit()
  tried.value = false
}
const smsText = computed(() => [note.text.value, note.form.value.name.trim()].filter(Boolean).join('. '))
const copy = async () => {
  try {
    await navigator.clipboard.writeText(smsText.value)
    ui.say('Текст заказа скопирован — вставьте его в СМС или письмо.')
  } catch {
    ui.say('Не получилось скопировать — выделите текст вручную.')
  }
}
const again = () => {
  note.done.value = null
}
</script>

<template>
  <div class="zd-wrap">
    <nav class="zd-crumbs"><NuxtLink :to="zdPath()">Главная</NuxtLink><span>Контакты</span></nav>
    <header class="zd-pagehead">
      <h1>Контакты и порядок заказа</h1>
      <p>{{ zdContacts.city }}</p>
    </header>

    <section class="zd-sec zd-sec--first zd-cnt">
      <div class="zd-cnt__card">
        <a :href="`tel:${zdContacts.tel}`" class="zd-cnt__phone">
          <small>Просто позвоните мне:</small>
          <b>{{ zdContacts.phone }}</b>
          <span>{{ zdContacts.owner }}</span>
        </a>
        <a :href="`tel:${zdContacts.tel2}`" class="zd-cnt__line"><ZdIcon name="phone" :size="18" /><span><b>{{ zdContacts.phone2 }}</b>{{ zdContacts.owner2 }}</span></a>
        <a :href="`sms:${zdContacts.tel}`" class="zd-cnt__line"><ZdIcon name="sms" :size="18" /><span><b>СМС на {{ zdContacts.phone }}</b>или оставьте номер — перезвоним</span></a>
        <a :href="`mailto:${zdContacts.email}`" class="zd-cnt__line"><ZdIcon name="mail" :size="18" /><span><b>{{ zdContacts.email }}</b>заказы и вопросы</span></a>
        <a :href="zdContacts.map" target="_blank" rel="noopener" class="zd-cnt__line"><ZdIcon name="pin" :size="18" /><span><b>Главная усадьба пасеки</b>{{ zdContacts.address }}</span></a>
        <p class="zd-cnt__season">{{ zdContacts.season }}</p>
        <p class="zd-cnt__sorry">{{ zdContacts.sorry }}</p>
      </div>
      <div>
        <h2 class="zd-cnt__h">Порядок заказа</h2>
        <ul class="zd-steps">
          <li v-for="s in zdSteps" :key="s.title">
            <i><ZdIcon :name="s.icon" /></i>
            <div><b>{{ s.title }}</b><span>{{ s.text }}</span></div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Форма оригинала (имя, телефон, город, почта, сообщение) + «Что заказать»: текст заказа собирается сам -->
    <section id="zakaz" class="zd-sec">
      <div class="zd-head">
        <div>
          <h2>Форма заказа</h2>
          <p>Отметьте, что хотите заказать, — текст заказа и примерная сумма соберутся сами. Мы перезвоним и пришлём реквизиты.</p>
        </div>
      </div>

      <div v-if="note.done.value" class="zd-done">
        <ZdIcon name="check" :size="34" />
        <div>
          <h3>Заказ №{{ note.done.value.id }} принят{{ note.done.value.name ? `, ${note.done.value.name}` : '' }}</h3>
          <p>Алексей Васильевич перезвонит, уточнит доставку и пришлёт реквизиты для оплаты.<template v-if="note.done.value.sum"> Ориентировочно — {{ zdMoney(note.done.value.sum) }} без доставки.</template></p>
          <p class="zd-done__demo">Демо: в настоящем сайте заказ ушёл бы на {{ zdContacts.email }}. Здесь он никуда не отправлен.</p>
          <button type="button" class="zd-btn zd-btn--line" @click="again">Новый заказ</button>
        </div>
      </div>

      <div v-else class="zd-form">
        <div class="zd-pick">
          <h3>Что заказать</h3>
          <div class="zd-pick__group">
            <b class="zd-pick__label">Мёд</b>
            <div v-for="s in zdSorts" :key="s.id" class="zd-pick__row">
              <span class="zd-pick__name"><i :style="{ background: s.tone }" />{{ s.name }}</span>
              <button type="button" class="zd-chip" :class="{ 'is-on': has(`r:${s.id}`) }" @click="has(`r:${s.id}`) ? note.remove(`r:${s.id}`) : note.add(`r:${s.id}`)">
                <ZdIcon :name="has(`r:${s.id}`) ? 'check' : 'plus'" :size="16" />коробка 12 кг
              </button>
              <button type="button" class="zd-chip" :class="{ 'is-on': has(`o:${s.id}`) }" @click="has(`o:${s.id}`) ? note.remove(`o:${s.id}`) : note.add(`o:${s.id}`)">
                <ZdIcon :name="has(`o:${s.id}`) ? 'check' : 'plus'" :size="16" />куботейнер 34 кг
              </button>
            </div>
          </div>
          <div class="zd-pick__group">
            <b class="zd-pick__label">Продукты пчеловодства</b>
            <div class="zd-pick__chips">
              <button v-for="i in zdItems" :key="i.id" type="button" class="zd-chip" :class="{ 'is-on': has(`i:${i.id}`) }" @click="has(`i:${i.id}`) ? note.remove(`i:${i.id}`) : note.add(`i:${i.id}`)">
                <ZdIcon :name="has(`i:${i.id}`) ? 'check' : 'plus'" :size="16" />{{ i.name }}
              </button>
            </div>
          </div>

          <ul v-if="note.lines.value.length" class="zd-lines">
            <li v-for="l in note.lines.value" :key="l.key" class="zd-line">
              <div class="zd-line__name">
                <i v-if="l.tone" :style="{ background: l.tone }" />
                <img v-else-if="l.img" :src="l.img" alt="" width="48" height="36" />
                <span><NuxtLink :to="l.to">{{ l.title }}</NuxtLink><small><span class="zd-nw">{{ l.perText }}</span><template v-if="l.hint"> · {{ l.hint }}</template></small></span>
              </div>
              <ZdQty :k="l.key" :text="l.qtyText" />
              <b class="zd-line__sum">{{ zdMoney(l.sum) }}</b>
              <button type="button" class="zd-line__x" aria-label="Убрать" @click="note.remove(l.key)"><ZdIcon name="close" :size="18" /></button>
            </li>
          </ul>
          <p v-else class="zd-pick__empty">Пока ничего не выбрано. Можно и без этого — просто напишите в сообщении, что нужно.</p>

          <div v-if="note.lines.value.length" class="zd-total">
            <span>Ориентировочно, без доставки</span>
            <b>{{ zdMoney(note.total.value) }}</b>
            <small>Доставку оплачиваете транспортной компании при получении.</small>
          </div>
        </div>

        <form class="zd-fields" novalidate @submit.prevent="send">
          <label class="zd-field">
            <span>Имя</span>
            <input v-model="note.form.value.name" type="text" autocomplete="name" placeholder="Как к вам обращаться" />
            <small v-if="tried && !nameOk" class="zd-err">Напишите имя</small>
          </label>
          <label class="zd-field">
            <span>Телефон</span>
            <ZdPhone v-model="note.form.value.phone" />
            <small v-if="tried && !phoneOk" class="zd-err">Нужен номер полностью — перезвоним по нему</small>
          </label>
          <label class="zd-field">
            <span>Город</span>
            <input v-model="note.form.value.city" type="text" autocomplete="address-level2" placeholder="Например, Москва" />
            <small>Чтобы мы не позвонили вам ночью — мы на Алтае, это Москва +4 часа.</small>
          </label>
          <label class="zd-field">
            <span>Почта</span>
            <input v-model="note.form.value.email" type="email" autocomplete="email" placeholder="Необязательно" />
          </label>
          <label class="zd-field zd-fields__wide">
            <span>Сообщение</span>
            <textarea v-model="note.form.value.message" rows="3" placeholder="Вопрос, адрес для Почты России или удобное время для звонка" />
          </label>

          <div v-if="note.text.value" class="zd-fields__wide zd-text">
            <span>Текст заказа</span>
            <p>{{ note.text.value }}</p>
            <div class="zd-text__btns">
              <button type="button" class="zd-link" @click="copy"><ZdIcon name="copy" :size="16" />Скопировать</button>
              <a :href="`sms:${zdContacts.tel}?body=${encodeURIComponent(smsText)}`" class="zd-link"><ZdIcon name="sms" :size="16" />Отправить СМС</a>
            </div>
          </div>

          <div class="zd-fields__wide zd-fields__send">
            <button type="submit" class="zd-btn zd-btn--big">Отправить заказ</button>
            <small>Отправляя форму, вы соглашаетесь с политикой обработки персональных данных.</small>
            <small v-if="tried && !canSend && nameOk && phoneOk" class="zd-err">Отметьте товар или напишите сообщение.</small>
          </div>
        </form>
      </div>
    </section>

    <section class="zd-sec zd-terms">
      <div>
        <h2>Доставка</h2>
        <ul class="zd-terms__list">
          <li v-for="d in zdDelivery" :key="d"><ZdIcon name="truck" :size="18" />{{ d }}</li>
        </ul>
        <div class="zd-terms__tk">
          <span v-for="t in zdTk" :key="t">{{ t }}</span>
        </div>
      </div>
      <div>
        <h2>Оплата</h2>
        <ul class="zd-terms__list">
          <li v-for="p in zdPayment" :key="p"><ZdIcon name="card" :size="18" />{{ p }}</li>
          <li><ZdIcon name="doc" :size="18" />{{ zdContacts.legal }}</li>
        </ul>
        <p class="zd-terms__pass">
          Для транспортной компании нужны ФИО получателя, паспортные данные и телефон — без них груз не выдадут. Получить за другого человека можно по нотариальной доверенности.
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.zd-cnt {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 40px;
  align-items: start;

  &__card {
    display: grid;
    gap: 4px;
    padding: 28px;
    border-radius: var(--zd-R);
    background: var(--zd-surface);
  }
  &__phone {
    display: grid;
    margin-bottom: 10px;

    small {
      color: var(--zd-muted);
    }
    b {
      font-family: 'Roboto Slab', serif;
      font-size: 36px;
      line-height: 1.2;
      color: var(--zd-accent);
      white-space: nowrap;
    }
    span {
      font-weight: 600;
      color: var(--zd-ink);
    }
  }
  &__line {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-top: 1px solid var(--zd-line);
    font-size: 14px;
    color: var(--zd-muted);

    svg {
      flex: none;
      margin-top: 2px;
      color: var(--zd-accent);
    }
    span {
      display: grid;
      min-width: 0;
    }
    b {
      font-size: 15px;
      color: var(--zd-ink);
      overflow-wrap: anywhere;
    }
    &:hover b {
      color: var(--zd-accent);
    }
  }
  &__season {
    margin-top: 8px;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--zd-yellow-soft);
    color: var(--zd-ink);
    font-size: 14px;
  }
  &__sorry {
    margin-top: 6px;
    font-size: 13px;
    color: var(--zd-muted);
  }
  &__h {
    margin-bottom: 16px;
    font-size: 28px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
  @media (max-width: 576px) {
    &__card {
      padding: 20px 18px;
    }
    &__phone b {
      font-size: 28px;
    }
    &__h {
      font-size: 24px;
    }
  }
}

.zd-form {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.zd-pick {
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: var(--zd-R);
  border: 1px solid var(--zd-line);

  h3 {
    font-size: 22px;
  }
  &__group {
    display: grid;
    gap: 8px;
  }
  &__label {
    font-size: 13px;
    color: var(--zd-muted);
  }
  &__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
  }
  &__name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: var(--zd-ink);

    i {
      flex: none;
      width: 20px;
      height: 20px;
      border-radius: 7px;
    }
  }
  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  &__empty {
    padding: 14px 16px;
    border-radius: 14px;
    background: var(--zd-surface);
    color: var(--zd-muted);
    font-size: 14px;
  }

  @media (max-width: 576px) {
    padding: 18px 16px;

    &__row {
      grid-template-columns: 1fr 1fr;

      .zd-pick__name {
        grid-column: 1 / -1;
      }
    }
  }
  @media (max-width: 375px) {
    &__row {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
.zd-chip,
.zd-chip:focus {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 38px;
  padding: 6px 12px;
  border-radius: 11px;
  border: 1px solid #cfd3e2;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--zd-ink);
}
.zd-chip:hover {
  border-color: var(--zd-accent);
  color: var(--zd-accent);
}
.zd-chip.is-on {
  border-color: var(--zd-yellow);
  background: var(--zd-yellow-soft);
  color: var(--zd-ink);
}
.zd-lines {
  display: grid;
  border-top: 1px solid var(--zd-line);
}
.zd-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas: 'name x' 'qty sum';
  align-items: center;
  gap: 10px 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--zd-line);

  &__name {
    grid-area: name;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;

    i,
    img {
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      object-fit: cover;
    }
    > span {
      display: grid;
      min-width: 0;
    }
    a {
      font-weight: 600;
      color: var(--zd-ink);

      &:hover {
        color: var(--zd-accent);
      }
    }
    small {
      font-size: 12px;
      color: var(--zd-muted);
      line-height: 1.4;
    }
  }
  .zd-nw {
    white-space: nowrap;
  }
  .zd-qty {
    grid-area: qty;
    justify-self: start;
    margin-left: 52px;
  }
  &__sum {
    grid-area: sum;
    text-align: right;
    color: var(--zd-ink);
    white-space: nowrap;
  }
  &__x {
    grid-area: x;
    justify-self: end;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    color: var(--zd-muted);

    &:hover {
      background: var(--zd-surface);
      color: var(--zd-ink);
    }
  }

  @media (max-width: 375px) {
    .zd-qty {
      margin-left: 0;
    }
  }
}
.zd-total {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2px 12px;
  padding: 16px 18px;
  border-radius: 16px;
  background: var(--zd-surface);

  span {
    color: var(--zd-ink);
    font-weight: 600;
  }
  b {
    font-size: 24px;
    color: var(--zd-ink);
    white-space: nowrap;
  }
  small {
    grid-column: 1 / -1;
    font-size: 13px;
    color: var(--zd-muted);
  }
}
.zd-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: 14px;
  padding: 24px;
  border-radius: var(--zd-R);
  background: var(--zd-surface);

  &__wide {
    grid-column: 1 / -1;
  }
  &__send {
    display: grid;
    gap: 8px;

    small {
      font-size: 12px;
      color: var(--zd-muted);
    }
  }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 18px 16px;
  }
}
.zd-err {
  color: #b42318 !important;
}
.zd-text {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff;
  border: 1px dashed #c7cbe0;

  > span {
    font-size: 13px;
    font-weight: 600;
    color: var(--zd-ink);
  }
  p {
    font-size: 14px;
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
  }
}
.zd-done {
  display: flex;
  gap: 18px;
  padding: 28px;
  border-radius: var(--zd-R);
  background: var(--zd-surface);

  > svg {
    flex: none;
    color: var(--zd-accent);
  }
  > div {
    display: grid;
    gap: 10px;
    justify-items: start;
  }
  h3 {
    font-size: 24px;
  }
  &__demo {
    font-size: 13px;
    color: var(--zd-muted);
  }

  @media (max-width: 576px) {
    flex-direction: column;
    padding: 20px 18px;
  }
}
.zd-terms {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 40px;

  h2 {
    margin-bottom: 14px;
    font-size: 28px;
  }
  ul.zd-terms__list {
    display: grid;
    gap: 12px;

    li {
      display: flex;
      gap: 12px;
    }
    svg {
      flex: none;
      margin-top: 3px;
      color: var(--zd-accent);
    }
  }
  &__tk {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;

    span {
      padding: 6px 12px;
      border-radius: 10px;
      background: var(--zd-surface);
      font-size: 13px;
      font-weight: 600;
      color: var(--zd-ink);
    }
  }
  &__pass {
    margin-top: 16px;
    padding: 14px 16px;
    border-radius: 14px;
    background: var(--zd-yellow-soft);
    color: var(--zd-ink);
    font-size: 14px;
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
  @media (max-width: 768px) {
    h2 {
      font-size: 24px;
    }
  }
}
</style>
