<script lang="ts" setup>
import GmIcon from '~/components/redesign/gornyimed/GmIcon.vue'

useSeoMeta({ title: 'О пасеке и контакты | Пасеки Соловьёвых, концепт редизайна' })

const ui = useGornyimedUi()
const strip = [gmImg('a1-5.jpg'), gmImg('a3-3.jpg'), gmImg('a2-5.jpg'), gmImg('a4-3.jpg')]
const addresses = [
  { t: 'Пасека', a: gmContacts.apiary },
  { t: 'Фактический адрес', a: gmContacts.apiary2 },
  { t: 'Барнаул', a: gmContacts.office },
]
const reqOpen = ref(false)
</script>

<template>
  <div class="gm-wrap gm-about">
    <nav class="gm-crumbs" aria-label="Навигация">
      <NuxtLink :to="gmPath()">Главная</NuxtLink>
      <span>О пасеке</span>
    </nav>

    <div class="gm-about__intro">
      <div>
        <h1 class="gm-title">Пасеки Соловьёвых</h1>
        <p class="gm-lead">
          Продаём мёд и продукты пчеловодства с личной пасеки и пасеки наших родителей. Всего у нас 800 пчелосемей в экологически чистом районе Алтайских гор —
          Чойском районе Республики Алтай.
        </p>
        <ul class="gm-about__list">
          <li><GmIcon name="bee" :size="22" /><span>Мёд откачиваем вручную, без нагревания, сахар не добавляем.</span></li>
          <li><GmIcon name="mountain" :size="22" /><span>Летом вывозим пасеку на дягиль — он здесь выше человеческого роста.</span></li>
          <li><GmIcon name="ship" :size="22" /><span>С 2015 года экспортируем мёд, аккредитованы в реестре Россельхознадзора.</span></li>
          <li><GmIcon name="award" :size="22" /><span>Роскачество и НТВ в августе 2026 не нашли нарушений только у нашего мёда из 7 брендов на маркетплейсах.</span></li>
        </ul>
        <p class="gm-about__legal">ООО «Пасеки Соловьёвых» и СППСК «Чойский Пчелоцентр»</p>
      </div>
      <figure class="gm-about__photo">
        <img :src="gmImg('a2-1.jpg')" alt="Пчеловоды на кочевой пасеке среди дягиля" loading="lazy" />
        <figcaption>Кочевая пасека на дягиле</figcaption>
      </figure>
    </div>

    <div class="gm-about__strip">
      <NuxtLink v-for="(s, i) in strip" :key="s" :to="gmPath('/gallery')" :aria-label="`Фото пасеки ${i + 1}`"><img :src="s" alt="" loading="lazy" /></NuxtLink>
    </div>

    <section id="kontakty" class="gm-section">
      <div class="gm-head">
        <div>
          <h2>Контакты</h2>
          <p>Заказы принимаем по телефону, в WhatsApp и MAX, по СМС и почте. Мы на Алтае: у нас {{ gmContacts.tz }}, на 4 часа позже Москвы.</p>
        </div>
      </div>
      <div class="gm-about__contacts">
        <div class="gm-people">
          <div v-for="p in gmContacts.people" :key="p.tel" class="gm-person">
            <b>{{ p.phone }}</b>
            <span>{{ p.name }} — {{ p.role }}</span>
            <div class="gm-person__acts">
              <a :href="`tel:${p.tel}`" class="gm-btn gm-btn--main gm-btn--small"><GmIcon name="phone" :size="17" />Позвонить</a>
              <a v-if="p.wa" :href="`https://wa.me/${p.wa}`" target="_blank" rel="noopener" class="gm-btn gm-btn--line gm-btn--small">WhatsApp</a>
            </div>
          </div>
          <div class="gm-person">
            <b>{{ gmContacts.email }}</b>
            <span>заказы, прайс, опт и экспорт</span>
            <div class="gm-person__acts">
              <a :href="`mailto:${gmContacts.email}`" class="gm-btn gm-btn--line gm-btn--small"><GmIcon name="mail" :size="17" />Написать</a>
            </div>
          </div>
          <div class="gm-person gm-person--cb">
            <b>Перезвоним сами</b>
            <span>оставьте имя и телефон</span>
            <div class="gm-person__acts">
              <button type="button" class="gm-btn gm-btn--line gm-btn--small" @click="ui.callback.value = true">Заказать звонок</button>
            </div>
          </div>
        </div>
        <ul class="gm-addr">
          <li v-for="a in addresses" :key="a.t">
            <GmIcon name="pin" :size="20" />
            <span><b>{{ a.t }}</b>{{ a.a }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="gm-section">
      <div class="gm-head">
        <div>
          <h2>Пункты выдачи в регионах</h2>
          <p>Забрать заказ можно в семи городах. В Санкт-Петербурге — терминал ПЭК. Время выдачи уточним при отправке.</p>
        </div>
      </div>
      <ul class="gm-pickups">
        <li v-for="p in gmPickups" :key="p.city">
          <b>{{ p.city }}</b>
          <span>{{ p.addr }}</span>
          <a :href="`tel:${p.phone.replace(/[^\d+]/g, '')}`">{{ p.phone }}</a>
        </li>
      </ul>
    </section>

    <section class="gm-section">
      <div class="gm-req" :class="{ 'is-open': reqOpen }">
        <button type="button" class="gm-req__btn" :aria-expanded="reqOpen" @click="reqOpen = !reqOpen">
          <span><b>Реквизиты</b>ООО «Пасеки Соловьёвых», ИНН 2281006182</span>
          <GmIcon name="right" :size="20" class="gm-req__chev" />
        </button>
        <dl v-if="reqOpen">
          <div v-for="[k, v] in gmRequisites" :key="k">
            <dt>{{ k }}</dt>
            <dd>{{ v }}</dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.gm-about {
  &__intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;
    align-items: center;
    margin-top: 8px;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
  }
  ul.gm-about__list {
    display: grid;
    gap: 12px;
    margin-top: 24px;

    li {
      display: flex;
      gap: 12px;
      color: var(--gm-ink);

      .gm-icon {
        color: var(--gm-accent);
      }
    }
  }
  &__legal {
    margin-top: 20px;
    font-size: 13.5px;
    color: var(--gm-muted);
  }
  &__photo {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: 18px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    figcaption {
      position: absolute;
      left: 14px;
      bottom: 14px;
      padding: 6px 12px;
      border-radius: var(--gm-r);
      background: rgba(255, 255, 255, 0.92);
      font-size: 13.5px;
      font-weight: 600;
      color: var(--gm-ink);
    }
  }
  &__strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 28px;

    a {
      aspect-ratio: 4 / 3;
      border-radius: var(--gm-R);
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    a:hover img {
      transform: scale(1.04);
    }
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
  }
  &__contacts {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 24px;
    align-items: start;

    @media (max-width: 989px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  .gm-person--cb {
    background: var(--gm-surface);
    border-color: transparent;
  }
}
ul.gm-addr {
  display: grid;
  gap: 10px;
  padding: 20px;
  border-radius: var(--gm-R);
  background: var(--gm-surface);

  li {
    display: flex;
    gap: 12px;

    .gm-icon {
      margin-top: 2px;
      color: var(--gm-accent);
    }
    span {
      display: grid;
      font-size: 14.5px;
    }
    b {
      color: var(--gm-ink);
    }
  }
}
ul.gm-pickups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  li {
    display: grid;
    align-content: start;
    gap: 4px;
    padding: 16px;
    border: 1px solid var(--gm-line);
    border-radius: var(--gm-R);

    b {
      font-size: 17px;
      color: var(--gm-ink);
    }
    span {
      font-size: 14px;
      color: var(--gm-muted);
    }
    a {
      margin-top: 4px;
      font-weight: 600;
      color: var(--gm-accent);
    }
  }
  @media (max-width: 1199px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.gm-req {
  border: 1px solid var(--gm-line);
  border-radius: var(--gm-R);

  &__btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 18px 20px;
    text-align: left;

    span {
      display: grid;
      color: var(--gm-muted);
      font-size: 14px;
    }
    b {
      font-family: 'Lora', Georgia, serif;
      font-size: 22px;
      color: var(--gm-ink);
    }
  }
  &__chev {
    transform: rotate(90deg);
    transition: transform 0.2s;
  }
  &.is-open &__chev {
    transform: rotate(-90deg);
  }
  dl {
    display: grid;
    padding: 0 20px 18px;

    div {
      display: grid;
      grid-template-columns: 200px minmax(0, 1fr);
      gap: 16px;
      padding: 9px 0;
      border-top: 1px solid var(--gm-line);
    }
    dt {
      color: var(--gm-muted);
      font-size: 14px;
    }
    dd {
      color: var(--gm-ink);
      overflow-wrap: anywhere;
    }
    @media (max-width: 576px) {
      div {
        grid-template-columns: minmax(0, 1fr);
        gap: 2px;
      }
    }
  }
}
</style>
