<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'

useSeoMeta({ title: 'Контакты — Маккавеевский пищекомбинат | Концепт редизайна' })
const ui = useMpkchitaUi()
</script>

<template>
  <div class="mk-wrap mk-contacts">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
    </nav>
    <h1 class="mk-page-title">Контакты</h1>
    <div class="mk-contacts__grid">
      <div class="mk-contacts__card">
        <h2>{{ mkContacts.legal }}</h2>
        <ul class="mk-contacts__list">
          <li>
            <MkIcon name="pin" />
            <span>{{ mkContacts.address }}<a :href="mkMapUrl('Чита, пос. КСК, ул. Космонавтов, 20')" target="_blank" rel="noopener">Открыть в Яндекс Картах</a></span>
          </li>
          <li>
            <MkIcon name="phone" />
            <span
              ><a :href="'tel:' + mkContacts.phoneTel" class="is-big">{{ mkContacts.phone }}</a
              ><a :href="'tel:' + mkContacts.phone2Tel">{{ mkContacts.phone2 }}</a><small>факс {{ mkContacts.fax }}</small></span
            >
          </li>
          <li>
            <MkIcon name="mail" />
            <span><a :href="'mailto:' + mkContacts.email">{{ mkContacts.email }}</a></span>
          </li>
          <li>
            <MkIcon name="user" />
            <span>{{ mkContacts.director }}<small>{{ mkContacts.directorRole }}</small></span>
          </li>
        </ul>
        <div class="mk-contacts__btns">
          <button type="button" class="mk-btn mk-btn--main" @click="ui.callback.value = true"><MkIcon name="phone" :size="18" /> Обратный звонок</button>
          <button type="button" class="mk-btn mk-btn--line" @click="ui.chat.value = true"><MkIcon name="chat" :size="18" /> Консультант онлайн</button>
        </div>
      </div>
      <div class="mk-contacts__side">
        <NuxtLink :to="mkPath('/gde-kupit')" class="mk-contacts__tile">
          <MkIcon name="store" :size="28" />
          <b>Магазины «Маккавеевский»</b>
          <span>{{ mkStores.length }} адресов по районам Читы и края, режим работы и статус «открыто сейчас»</span>
        </NuxtLink>
        <div class="mk-contacts__tile">
          <MkIcon name="truck" :size="28" />
          <b>Опт</b>
          <span v-for="o in mkOpt" :key="o.address">{{ o.address.split(',').slice(0, 2).join(',') }} — <a :href="'tel:' + o.phone.split(', ')[0].replace(/[^\d+]/g, '')">{{ o.phone.split(', ')[0] }}</a></span>
        </div>
        <NuxtLink :to="mkPath('/faq')" class="mk-contacts__tile">
          <MkIcon name="question" :size="28" />
          <b>Вопрос-ответ</b>
          <span>Вакансии, режим работы магазинов — ответы и форма вопроса</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mk-contacts {
  padding-bottom: 72px;
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 24px;
    margin-top: 28px;
  }
  &__card {
    padding: 28px;
    border-radius: var(--mk-R);
    border: 1px solid var(--mk-line);
    h2 {
      font-size: 26px;
    }
  }
  & ul.mk-contacts__list {
    display: grid;
    gap: 18px;
    margin-top: 20px;
    li {
      display: flex;
      gap: 14px;
      > .mk-icon {
        color: var(--mk-red);
        margin-top: 2px;
      }
    }
    span {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    a {
      color: var(--mk-ink);
      font-weight: 600;
      &:hover {
        color: var(--mk-red);
      }
    }
    .is-big {
      font-size: 20px;
    }
    small {
      color: var(--mk-muted);
      font-size: 13.5px;
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 26px;
  }
  &__side {
    display: grid;
    gap: 16px;
    align-content: start;
  }
  &__tile {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 20px;
    border-radius: var(--mk-R);
    background: var(--mk-surface);
    .mk-icon {
      color: var(--mk-red);
      margin-bottom: 4px;
    }
    b {
      font: 700 21px/1.2 var(--mk-head);
      color: var(--mk-ink);
    }
    span {
      font-size: 14px;
      color: var(--mk-muted);
    }
    a {
      color: var(--mk-red);
      font-weight: 600;
      white-space: nowrap;
    }
  }
}
@media (max-width: 989px) {
  .mk-contacts__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 576px) {
  .mk-contacts__card {
    padding: 20px;
  }
  .mk-contacts__btns .mk-btn {
    flex: 1 0 100%;
  }
}
</style>
