<script lang="ts" setup>
import RkIcon from '~/components/redesign/rkdon/RkIcon.vue'

useSeoMeta({ title: 'Контакты — Рыбокомбинат Донской, Новошахтинск | Концепт редизайна' })

const ui = useRkdonUi()
const rows = [
  { icon: 'phone', title: rkContacts.sales, sub: 'отдел продаж: цены, фасовка, отгрузка', href: 'tel:' + rkContacts.salesTel, main: true },
  { icon: 'phone', title: rkContacts.secretary, sub: 'секретарь', href: 'tel:' + rkContacts.secretaryTel },
  { icon: 'phone', title: rkContacts.office, sub: 'приёмная в Новошахтинске', href: 'tel:' + rkContacts.officeTel },
  { icon: 'mail', title: rkContacts.email, sub: 'общая почта', href: 'mailto:' + rkContacts.email },
  { icon: 'people', title: rkContacts.hrPhones, sub: 'отдел кадров, ' + rkContacts.hrHours, href: 'tel:' + rkContacts.hrTel },
]
const mapSrc = 'https://yandex.ru/map-widget/v1/?text=' + encodeURIComponent('Новошахтинск, Газопроводная улица, 21') + '&z=15'
</script>

<template>
  <div class="rk-contacts">
    <div class="rk-wrap rk-pagehead">
      <nav class="rk-crumbs">
        <NuxtLink :to="rkPath('/')">Главная</NuxtLink><span>Контакты</span>
      </nav>
      <h1>Контакты</h1>
    </div>
    <div class="rk-wrap rk-contacts__grid">
      <div class="rk-contacts__info">
        <div class="rk-contacts__addr">
          <RkIcon name="pin" :size="26" />
          <span>
            <b>346905, Ростовская область, г. Новошахтинск, ул. Газопроводная, д. 21</b>
            <small>производство, склад и самовывоз</small>
          </span>
        </div>
        <ul class="rk-contacts__list">
          <li v-for="r in rows" :key="r.title" :class="{ 'is-main': r.main }">
            <a :href="r.href">
              <RkIcon :name="r.icon" />
              <span
                ><b>{{ r.title }}</b><small>{{ r.sub }}</small></span
              >
            </a>
          </li>
          <li>
            <button type="button" @click="ui.openChat()">
              <RkIcon name="chat" />
              <span><b>Онлайн-чат</b><small>менеджер ответит на сайте</small></span>
            </button>
          </li>
        </ul>
        <div class="rk-contacts__social">
          <a :href="rkContacts.vk" target="_blank" rel="noopener" class="rk-btn rk-btn--line"><RkIcon name="vk" :size="20" /> vk.com/tixy_snacks</a>
          <a :href="rkContacts.instagram" target="_blank" rel="noopener" class="rk-btn rk-btn--line"
            ><RkIcon name="instagram" :size="20" /> @tixy_snacks</a
          >
        </div>
      </div>
      <div class="rk-map">
        <div class="rk-map__frame">
          <span class="rk-map__stub"><RkIcon name="pin" :size="32" />Новошахтинск, ул. Газопроводная, 21</span>
          <iframe :src="mapSrc" title="Рыбокомбинат Донской на карте" loading="lazy" />
        </div>
        <a :href="rkContacts.map" target="_blank" rel="noopener" class="rk-link"
          >Открыть в Яндекс Картах <RkIcon name="external" :size="18"
        /></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.rk-contacts {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 40px;
    align-items: start;
  }
  &__info {
    display: grid;
    gap: 20px;
  }
  &__addr {
    display: flex;
    gap: 14px;
    padding: 22px;
    border-radius: var(--rk-R);
    background: var(--rk-soft);
    svg {
      color: var(--rk-accent);
      flex: none;
    }
    span {
      display: grid;
      gap: 4px;
    }
    b {
      font-size: 18px;
      line-height: 1.35;
      color: var(--rk-ink);
    }
    small {
      color: var(--rk-muted);
    }
  }
  ul.rk-contacts__list {
    display: grid;
    gap: 8px;
    a,
    button {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      padding: 14px 18px;
      border-radius: 16px;
      border: 1px solid var(--rk-line);
      text-align: left;
      color: var(--rk-accent);
      transition: border-color 0.2s;
      &:hover {
        border-color: var(--rk-accent);
      }
    }
    span {
      display: grid;
      line-height: 1.3;
      min-width: 0;
    }
    b {
      font-size: 17px;
      color: var(--rk-ink);
      overflow-wrap: anywhere;
    }
    small {
      color: var(--rk-muted);
      font-size: 13px;
    }
    li.is-main a {
      background: var(--rk-accent);
      border-color: var(--rk-accent);
      color: #fff;
      b,
      small {
        color: #fff;
      }
    }
  }
  &__social {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
.rk-map {
  display: grid;
  gap: 12px;
  justify-items: start;
  &__frame {
    position: relative;
    width: 100%;
    aspect-ratio: 1.25;
    border-radius: var(--rk-R);
    overflow: hidden;
    background: var(--rk-surface);
    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  &__stub {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 8px;
    padding: 20px;
    text-align: center;
    font-weight: 700;
    color: var(--rk-ink);
    svg {
      color: var(--rk-accent);
    }
  }
}
@media (max-width: 989px) {
  .rk-contacts__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 576px) {
  .rk-map__frame {
    aspect-ratio: 1;
  }
  .rk-contacts__social {
    display: grid;
  }
}
</style>
