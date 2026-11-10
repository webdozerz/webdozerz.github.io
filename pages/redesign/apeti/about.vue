<script lang="ts" setup>
import { apAsset, apFarmers, apNumbers, apPath } from '~/utils/apeti'

useSeoMeta({ title: 'О компании — Apeti, концепт редизайна' })
const values = [
  { t: 'Экологически чистый район', d: 'Загрязнённый воздух может содержать токсичные вещества, которые накапливаются в организме животных и негативно влияют на их здоровье.' },
  { t: 'Чистая почва', d: 'Мы выбираем фермы, где почва не содержит тяжёлых металлов, пестицидов и других вредных веществ.' },
  { t: 'Натуральные корма', d: 'Химия, содержащаяся в кормах, накапливается в мясе и, попадая в организм человека, вызывает различные заболевания.' },
  { t: 'Чистая вода', d: 'Чистая вода снижает риск заболеваний, улучшает метаболизм и влияет на качество и сочность мяса.' },
  { t: 'Халяльный забой', d: 'Забой без стресса для животного с соблюдением всех норм халяль: мясо сохраняет мягкость, сочность и насыщенный вкус.' },
  { t: 'Свободный выгул', d: 'Животные, выращенные в условиях свободного выгула, не испытывают стресса и много двигаются — это сказывается на структуре мяса.' },
]
</script>

<template>
  <div class="ap-wrap ap-page">
    <nav class="ap-crumbs" aria-label="Хлебные крошки"><NuxtLink :to="apPath('/')">Главная</NuxtLink><span>О компании</span></nav>

    <section class="ap-about__top">
      <div>
        <h1>Апети — сервис доставки натуральных фермерских продуктов</h1>
        <p>Выращенных и произведённых только в экологически чистых районах. Мы создали Апети, чтобы упростить поиск продуктов, которым можно доверять.</p>
        <p>Мы — обычные люди, у которых есть дети, семьи и много работы. Но мы знаем точно: еда — это основа жизни. Это здоровье, энергия, настроение и состояние.</p>
      </div>
      <ul class="ap-about__nums">
        <li v-for="x in apNumbers" :key="x.t"><b>{{ x.n }}</b><span>{{ x.t }}</span></li>
      </ul>
    </section>

    <section class="ap-sec">
      <div class="ap-head"><div><h2>Наши фермеры</h2><p>Работаем только с фермами, которые с заботой выращивают и производят продукты в экологически чистых условиях.</p></div></div>
      <ul class="ap-about__people">
        <li v-for="f in apFarmers" :key="f.name">
          <img :src="apAsset(f.img)" :alt="f.name" loading="lazy" width="448" height="640" />
          <b>{{ f.name }}</b>
        </li>
      </ul>
    </section>

    <section class="ap-sec">
      <div class="ap-head"><div><h2>Наши главные ценности</h2><p>Да, такие хозяйства — редкость. Но мы не идём на компромисс, потому что иначе теряется смысл и миссия нашей компании.</p></div></div>
      <ul class="ap-about__values">
        <li v-for="v in values" :key="v.t"><b>{{ v.t }}</b><p>{{ v.d }}</p></li>
      </ul>
    </section>

    <section class="ap-sec">
      <div class="ap-about__check">
        <img :src="apAsset('label.svg')" alt="Зелёный стикер" width="140" height="140" loading="lazy" />
        <div class="ap-prose">
          <h2>Каждую партию овощей и фруктов проверяем дважды</h2>
          <p>Сначала — на этапе закупки, затем у себя на складе, с помощью нитратомера. Если показатели превышены, продукция не попадает на наш склад.</p>
          <p>Продукты, соответствующие нашим стандартам качества, мы отмечаем зелёным стикером, чтобы покупатели знали: это безопасно.</p>
          <p><b>Апети — это безопасные продукты, которым можно доверять. Без легенд и громких слов.</b></p>
          <p><NuxtLink :to="apPath('/catalog')" class="ap-btn">В каталог</NuxtLink></p>
        </div>
      </div>
    </section>

    <section id="suppliers" class="ap-sec ap-about__sup">
      <div class="ap-panel ap-prose">
        <h2>Поставщикам</h2>
        <p>Мы сотрудничаем более чем с 700 поставщиками, и их количество постоянно увеличивается. Мы ищем новые товары, чтобы удовлетворить все потребности клиентов, которые к нам обращаются.</p>
        <p>Если вы считаете, что ваш товар отменного качества, имеет уникальные свойства и отвечает политике компании, будем рады сотрудничеству. За дополнительной информацией обращайтесь: <a href="mailto:zakupki@apeti.ru">zakupki@apeti.ru</a></p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ap .ap-about__top { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 40px; align-items: center; margin-top: 20px; padding: 40px; border-radius: 28px; background: var(--ap-sur);
  > div { display: grid; gap: 14px; }
  h1 { font-size: clamp(28px, 3.2vw, 44px); }
  p { font-size: 16px; color: var(--ap-mute); max-width: 640px; }
}
.ap ul.ap-about__nums { display: grid; gap: 12px; margin: 0; padding: 0;
  li { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 16px; align-items: center; padding: 16px 20px; border-radius: var(--ap-R); background: #fff; }
  b { font-family: var(--ap-head); font-size: 36px; font-weight: 600; line-height: 1; color: var(--ap-acc); white-space: nowrap; }
  span { font-size: 14px; color: var(--ap-mute); line-height: 1.35; }
}
.ap ul.ap-about__people { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 0;
  li { display: grid; gap: 10px; }
  img { display: block; width: 100%; height: auto; aspect-ratio: 448 / 640; object-fit: cover; border-radius: var(--ap-R); }
  b { font-family: var(--ap-head); font-size: 19px; font-weight: 600; }
}
.ap ul.ap-about__values { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 0;
  li { display: grid; gap: 8px; align-content: start; padding: 20px; border: 1px solid var(--ap-line); border-radius: var(--ap-R); }
  b { font-family: var(--ap-head); font-size: 20px; font-weight: 600; line-height: 1.2; }
  p { font-size: 14.5px; color: var(--ap-mute); }
}
.ap .ap-about__check { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: 32px; align-items: start; img { width: 140px; height: 140px; } }
.ap .ap-about__sup { scroll-margin-top: 110px; .ap-prose { max-width: none; p { max-width: 780px; } } }
@media (max-width: 989px) {
  .ap .ap-about__top { grid-template-columns: minmax(0, 1fr); padding: 28px; gap: 24px; }
  .ap ul.ap-about__values { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .ap .ap-about__top { padding: 20px 16px; border-radius: 22px; }
  .ap ul.ap-about__people { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; b { font-size: 16px; } }
  .ap .ap-about__check { grid-template-columns: minmax(0, 1fr); gap: 16px; img { width: 96px; height: 96px; } }
}
@media (max-width: 576px) {
  .ap ul.ap-about__values { grid-template-columns: minmax(0, 1fr); }
  .ap ul.ap-about__nums li { grid-template-columns: 112px minmax(0, 1fr); gap: 12px; padding: 14px; b { font-size: 28px; } }
}
</style>
