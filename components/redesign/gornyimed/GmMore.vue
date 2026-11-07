<script lang="ts" setup>
// «Ещё с пасеки»: 20 пунктов меню оригинала, у которых нет карточек. Наличие — вопросом Сергею
// (WhatsApp с готовым текстом) или звонком, как пишет сам сайт: «ват сап, max, смс».
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'

const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const [sergey] = gmContacts.people
const open = ref('')
const wa = (t: string) => `https://wa.me/${sergey.wa}?text=${encodeURIComponent(`Здравствуйте! Есть ли сейчас в наличии «${t}»? Сколько стоит?`)}`
const toggle = (t: string) => {
  open.value = open.value === t ? '' : t
}
</script>

<template>
  <div class="gm-more" :class="{ 'gm-more--compact': props.compact }">
    <section v-for="g in gmMore" :key="g.group" class="gm-more__group">
      <h3>{{ g.group }}</h3>
      <ul class="gm-more__list">
        <li v-for="it in g.items" :key="it.title" :class="{ 'is-open': open === it.title }">
          <button type="button" class="gm-more__item" :aria-expanded="open === it.title" @click="toggle(it.title)">
            <span>{{ it.title }}</span>
            <small v-if="it.note">{{ it.note }}</small>
            <GmIcon name="right" :size="16" class="gm-more__chev" />
          </button>
          <div v-if="open === it.title" class="gm-more__ask">
            <p>Наличие и цену подскажет Сергей Владимирович.</p>
            <div>
              <a :href="wa(it.title)" target="_blank" rel="noopener" class="gm-btn gm-btn--main gm-btn--small"><GmIcon name="chat" :size="17" />Спросить в WhatsApp</a>
              <a :href="`tel:${sergey.tel}`" class="gm-btn gm-btn--line gm-btn--small"><GmIcon name="phone" :size="17" />Позвонить</a>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.gm-more {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  align-items: start;

  &__group h3 {
    margin-bottom: 10px;
    font-family: 'Commissioner', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--gm-muted);
  }
  ul.gm-more__list {
    display: grid;
    gap: 6px;
  }
  &__item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 8px;
    width: 100%;
    min-height: 46px;
    padding: 9px 12px 9px 14px;
    border-radius: var(--gm-r);
    background: var(--gm-surface);
    text-align: left;
    line-height: 1.3;

    span {
      font-weight: 600;
      color: var(--gm-ink);
    }
    small {
      grid-row: 2;
      font-size: 12.5px;
      color: var(--gm-green);
    }
    &:hover {
      background: #e8ebe4;
    }
  }
  &__chev {
    grid-row: 1 / span 2;
    grid-column: 2;
    color: var(--gm-muted);
    transition: transform 0.2s;
  }
  li.is-open &__item {
    background: var(--gm-soft);
  }
  li.is-open &__chev {
    transform: rotate(90deg);
    color: var(--gm-accent);
  }
  &__ask {
    display: grid;
    gap: 10px;
    padding: 12px 4px 8px;

    p {
      font-size: 13.5px;
      color: var(--gm-muted);
    }
    div {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  &--compact {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    &--compact {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
