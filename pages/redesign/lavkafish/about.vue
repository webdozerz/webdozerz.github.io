<script lang="ts" setup>
import LfIcon from '~/components/redesign/lavkafish/LfIcon.vue'

useSeoMeta({ title: 'О нас и контакты | Лавка Fish, концепт редизайна' })
</script>

<template>
  <div class="lf-wrap lf-page">
    <div class="lf-about">
      <img :src="lfImg('owners.jpg')" alt="Андрей и Наталья, владельцы «Лавки Fish»" width="720" height="540" />
      <div class="lf-about__text">
        <h1>Мы — Андрей и Наталья</h1>
        <p>Доставляем свежую рыбу к вашему столу. Рассказываем, как появилась эта идея.</p>
        <p>
          Однажды мы провели день на горнолыжном склоне, а поужинать решили шашлыком из форели. Рядом было форелевое хозяйство — рыбу
          выловили при нас. Шашлык из свежей рыбы был чудесен и не шёл ни в какое сравнение с рыбой из супермаркета, которую замораживают и
          размораживают по несколько раз.
        </p>
        <p>
          В тот вечер мы спросили друг друга: а почему у нас в городе нет такой рыбы? И решили — рыбе быть! По мере развития дела мы по
          очереди уволились с работы и посвятили время доставке свежей рыбы.
        </p>
      </div>
    </div>

    <div class="lf-page__grid">
      <section class="lf-panel">
        <h2><LfIcon name="phone" :size="24" />Контакты</h2>
        <ul class="lf-zones">
          <li>
            <span>Телефон</span
            ><a :href="lfContacts.phoneHref"
              ><b>{{ lfContacts.phone }}</b></a
            >
          </li>
          <li>
            <span>Почта</span
            ><a :href="`mailto:${lfContacts.email}`"
              ><b>{{ lfContacts.email }}</b></a
            >
          </li>
          <li>
            <span>Адрес</span><b>{{ lfContacts.address }}</b>
          </li>
          <li><span>Самовывоз</span><b>нет, только доставка</b></li>
        </ul>
        <div class="lf-panel__links">
          <a :href="lfContacts.channel" target="_blank" rel="noopener" class="lf-btn lf-btn--line">
            <LfIcon name="telegram" :size="20" />Канал @LavkaSP
          </a>
          <a :href="lfContacts.vk" target="_blank" rel="noopener" class="lf-btn lf-btn--line"><LfIcon name="vk" :size="20" />ВКонтакте</a>
        </div>
      </section>
      <section class="lf-panel">
        <h2><LfIcon name="shield" :size="24" />Реквизиты</h2>
        <ul class="lf-zones lf-zones--legal">
          <li>
            <span>Продавец</span><b>{{ lfContacts.legal.name }}</b>
          </li>
          <li>
            <span>ИНН</span><b>{{ lfContacts.legal.inn }}</b>
          </li>
          <li>
            <span>ОГРНИП</span><b>{{ lfContacts.legal.ogrn }}</b>
          </li>
          <li>
            <span>Банк</span><b>{{ lfContacts.legal.bank }}</b>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.lf-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 40px;
  margin-bottom: 32px;

  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--lf-r-lg);
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 14px;

    h1 {
      font-size: clamp(32px, 4vw, 48px);
      line-height: 1.05;
    }

    p {
      color: var(--lf-text);
    }
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}

ul.lf-zones--legal li {
  flex-wrap: wrap;

  b {
    white-space: normal;
    text-align: right;
  }
}
</style>
