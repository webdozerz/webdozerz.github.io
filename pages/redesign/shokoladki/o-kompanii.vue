<script lang="ts" setup>
import { skPath, skContacts, skShops } from '~/utils/shokoladki'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'О компании — кондитерская фабрика «Верность качеству» | Концепт редизайна' })
const to = (p: string) => skPath(p)
const facts = [
  { b: '2001', s: 'год основания фабрики' },
  { b: 'Касимов', s: 'производство в Рязанской области' },
  { b: String(skShops.length), s: 'фирменных бутиков' },
  { b: '219', s: 'товаров в каталоге' },
]
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>О компании</span>
    </nav>
    <div class="sk-about">
      <div class="sk-text">
        <h1 class="sk-h1">Кондитерская фабрика «Верность качеству»</h1>
        <p>Мы производим шоколадные изделия премиум-класса на любой вкус. Фабрика соответствует мировым производственным и профессиональным стандартам и строит работу на открытости новому: новым идеям, технологиям и вкусам.</p>
        <h2>Наша миссия</h2>
        <p>Мы провели совместные исследования с ведущими мировыми производителями какао-продуктов и сравнивали только дорогие элитные сорта какао. Так выбрали действительно первоклассное сырьё и объединили современные технологии с лучшими традициями шоколадного производства.</p>
        <p>Для шоколада используем какао-продукты из Бельгии, Франции, Швейцарии, Шри-Ланки и Южной Америки — например, бельгийский шоколад Barry Callebaut. Шоколад «Априори» ручной работы делаем при более низких температурах.</p>
        <h2>Шоколад для компаний</h2>
        <p>Для многих компаний продукция «Верность качеству» стала частью корпоративной культуры и рекламы: шоколад с логотипом — оригинальный носитель и приятный подарок клиентам и сотрудникам.</p>
        <p>Хотите стать партнёром и лично познакомиться с ассортиментом, ценами и условиями — будем рады видеть вас в офисе: {{ skContacts.office }}.</p>
      </div>
      <aside class="sk-about__side">
        <ul class="sk-about__facts">
          <li v-for="f in facts" :key="f.s"><b>{{ f.b }}</b><span>{{ f.s }}</span></li>
        </ul>
        <NuxtLink :to="to('/butiki/')" class="sk-btn sk-btn--line"><SkIcon name="store" />Бутики</NuxtLink>
        <NuxtLink :to="to('/korporativnym/')" class="sk-btn sk-btn--line"><SkIcon name="percent" />Корпоративным клиентам</NuxtLink>
        <NuxtLink :to="{ path: to('/blog/'), query: { tab: 'news' } }" class="sk-btn sk-btn--line"><SkIcon name="doc" />Новости компании</NuxtLink>
      </aside>
    </div>
  </div>
</template>
