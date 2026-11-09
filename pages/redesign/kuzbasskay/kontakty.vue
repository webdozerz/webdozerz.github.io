<script lang="ts" setup>
import { kzContacts, kzFeedPlant, kzReception, kzSales, kzStaff } from '~/utils/kuzbasskay'
import { useKzUi } from '~/composables/useKuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'
import KzPhone from '~/components/redesign/kuzbasskay/KzPhone.vue'

useSeoMeta({ title: 'Контакты — Кузбасская птицефабрика | Концепт редизайна' })
const ui = useKzUi()

// «Написать нам» — как у оригинала (/mailme): Имя*, E-mail*, Телефон, Сообщение*, вложение. В концепте не отправляется.
const form = reactive({ name: '', email: '', phone: '', message: '' })
const file = ref('')
const tried = ref(false)
const sent = ref(false)
const bad = computed(() => ({
  name: !form.name.trim(),
  email: !/^\S+@\S+\.\S+$/.test(form.email.trim()),
  message: !form.message.trim(),
}))
const onFile = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0]
  file.value = f ? f.name : ''
}
const submit = () => {
  tried.value = true
  if (bad.value.name || bad.value.email || bad.value.message) {
    ui.say('Заполните поля, отмеченные *')
    return
  }
  sent.value = true
}
const again = () => {
  Object.assign(form, { name: '', email: '', phone: '', message: '' })
  file.value = ''
  tried.value = false
  sent.value = false
}
</script>

<template>
  <div>
    <KzHead title="Контакты" :lead="kzContacts.address" />

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-contacts">
        <div class="kz-panel kz-panel--yellow kz-contacts__card">
          <h3>Отдел продаж</h3>
          <a v-for="s in kzSales" :key="s.tel" :href="`tel:${s.tel}`" class="kz-buy__tel"><b>{{ s.phone }}</b><small>{{ s.label.toLowerCase() }}</small></a>
        </div>
        <div class="kz-panel kz-contacts__card">
          <h3>Приёмная</h3>
          <a v-for="s in kzReception" :key="s.tel" :href="`tel:${s.tel}`" class="kz-buy__tel kz-buy__tel--white"><b>{{ s.phone }}</b><small>приёмная</small></a>
          <a :href="`mailto:${kzContacts.email}`" class="kz-buy__tel kz-buy__tel--white"><b>{{ kzContacts.email }}</b><small>почта приёмной</small></a>
          <a :href="`mailto:${kzContacts.email2}`" class="kz-buy__tel kz-buy__tel--white"><b>{{ kzContacts.email2 }}</b><small>вторая почта</small></a>
        </div>
        <div class="kz-panel kz-contacts__card">
          <h3>{{ kzFeedPlant.name }}</h3>
          <p>{{ kzFeedPlant.address }}</p>
          <a v-for="s in kzFeedPlant.phones" :key="s.tel" :href="`tel:${s.tel}`" class="kz-buy__tel kz-buy__tel--white"><b>{{ s.phone }}</b><small>{{ s.label.toLowerCase() }}</small></a>
          <a :href="`mailto:${kzFeedPlant.email}`" class="kz-buy__tel kz-buy__tel--white"><b>{{ kzFeedPlant.email }}</b><small>почта завода</small></a>
        </div>
      </div>
      <div class="kz-wrap">
        <div class="kz-map">
          <KzIcon name="pin" :size="32" />
          <div>
            <b>654241, Кемеровская область, Новокузнецкий район, поселок Степной</b>
            <span>Птицефабрика и магазин «Фирменный»</span>
          </div>
          <a :href="kzContacts.map" target="_blank" rel="noopener" class="kz-btn">Открыть в Яндекс Картах<KzIcon name="ext" :size="18" /></a>
        </div>
      </div>
    </section>

    <section id="personal" class="kz-sec">
      <div class="kz-wrap">
        <div class="kz-h2"><h2>Персонал</h2></div>
        <div class="kz-panel kz-panel--white kz-tablewrap">
          <table class="kz-table kz-staff">
            <tbody>
              <tr v-for="p in kzStaff" :key="p.role"><td>{{ p.role }}</td><td><b>{{ p.name }}</b><small v-if="p.contact">{{ p.contact }}</small></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="napisat" class="kz-sec kz-sec--surface">
      <div class="kz-wrap kz-write">
        <div>
          <h2>Написать нам</h2>
          <p>Вопрос, предложение или запрос цены — письмо придёт в приёмную. Поля со звёздочкой обязательны.</p>
          <p class="kz-write__demo"><KzIcon name="doc" :size="18" />Демо: в концепте форма ничего не отправляет.</p>
        </div>
        <div v-if="sent" class="kz-panel kz-panel--white kz-write__done" role="status">
          <span class="kz-write__ok"><KzIcon name="check" :size="28" /></span>
          <h3>Спасибо, {{ form.name.trim() }}!</h3>
          <p>На настоящем сайте письмо ушло бы в приёмную, а ответ — на {{ form.email.trim() }}. В концепте ничего не отправлено.</p>
          <button type="button" class="kz-btn kz-btn--line" @click="again">Написать ещё</button>
        </div>
        <form v-else class="kz-panel kz-panel--white kz-write__form" novalidate @submit.prevent="submit">
          <label class="kz-field" :class="{ 'is-bad': tried && bad.name }"><span>Имя *</span><input v-model="form.name" type="text" autocomplete="name" /><em v-if="tried && bad.name">Укажите имя</em></label>
          <label class="kz-field" :class="{ 'is-bad': tried && bad.email }"><span>E-mail *</span><input v-model="form.email" type="email" autocomplete="email" /><em v-if="tried && bad.email">Проверьте почту</em></label>
          <label class="kz-field"><span>Телефон</span><KzPhone v-model="form.phone" /></label>
          <label class="kz-field kz-write__file"><span>Файл</span>
            <span class="kz-write__pick"><KzIcon name="doc" :size="18" />{{ file || 'Прикрепить файл' }}<input type="file" @change="onFile" /></span>
          </label>
          <label class="kz-field kz-write__wide" :class="{ 'is-bad': tried && bad.message }"><span>Сообщение *</span><textarea v-model="form.message" rows="5" /><em v-if="tried && bad.message">Напишите сообщение</em></label>
          <div class="kz-write__wide kz-write__foot">
            <button type="submit" class="kz-btn kz-btn--big">Отправить</button>
            <small>Нажимая «Отправить», вы соглашаетесь с политикой конфиденциальности.</small>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-contacts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
  }
  &__card {
    display: grid;
    align-content: start;
    gap: 10px;

    p {
      font-size: 15px;
    }
  }
}
.kz-map {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  margin-top: 16px;
  padding: 22px;
  border: 1px solid var(--kz-line);
  border-radius: var(--kz-R);
  color: var(--kz-accent-ink);

  div {
    display: grid;
  }
  b {
    color: var(--kz-ink);
    font-weight: 800;
  }
  span {
    color: var(--kz-muted);
    font-size: 14px;
  }
  @media (max-width: 768px) {
    grid-template-columns: auto minmax(0, 1fr);

    .kz-btn {
      grid-column: 1 / -1;
    }
  }
}
.kz-staff {
  td:first-child {
    width: 280px;
    color: var(--kz-muted);
    font-weight: 700;
    white-space: normal;

    @media (max-width: 576px) {
      width: 130px;
    }
  }
  td:last-child {
    display: grid;

    b {
      color: var(--kz-ink);
      font-weight: 800;
    }
    small {
      color: var(--kz-muted);
      font-size: 14px;
      overflow-wrap: anywhere;
    }
  }
}
.kz-write {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  align-items: start;
  gap: 40px;

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
  h2 {
    margin-bottom: 10px;
    font-size: clamp(26px, 3vw, 36px);
    font-weight: 900;
  }
  &__demo {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    padding: 6px 12px;
    border-radius: 10px;
    background: var(--kz-strip);
    color: var(--kz-ink);
    font-size: 14px;
    font-weight: 700;
  }
  &__form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 16px;

    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  &__wide {
    grid-column: 1 / -1;
  }
  &__pick {
    position: relative;
    display: flex !important;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 11px 14px;
    border: 1px dashed #d8ccb5;
    border-radius: var(--kz-r);
    background: #fff;
    color: var(--kz-text) !important;
    font-weight: 600 !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;

    input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
  &__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 18px;

    small {
      color: var(--kz-muted);
      font-size: 13px;
    }
  }
  &__done {
    display: grid;
    gap: 12px;
    justify-items: start;
  }
  &__ok {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--kz-green-soft);
    color: var(--kz-green);
  }
}
</style>
