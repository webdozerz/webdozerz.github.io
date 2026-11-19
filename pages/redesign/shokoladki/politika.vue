<script lang="ts" setup>
import { skPath } from '~/utils/shokoladki'

useSeoMeta({ title: 'Политика конфиденциальности и cookies — АПРИОРИ | Концепт редизайна' })
const to = (p: string) => skPath(p)
</script>

<template>
  <div class="sk-wrap sk-page">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Политика конфиденциальности</span>
    </nav>
    <div class="sk-text">
      <h1 class="sk-h1">Согласие на обработку персональных данных и cookies</h1>
      <p>Оператор персональных данных — ООО «Шоколатье» (ИНН 5075026911). Отправляя формы на сайте, вы соглашаетесь на обработку имени, телефона, e-mail и адреса доставки для выполнения заказа и ответа на обращение.</p>
      <p>Продолжая работу на сайте, вы соглашаетесь на автоматизированную обработку данных: файлы cookie, сведения о действиях на сайте, дата и время сессии — в том числе с помощью Яндекс.Метрики.</p>
      <p>Полные тексты документов — на сайте фабрики: <a href="https://www.shokoladki.ru/privacy-policy/" target="_blank" rel="noopener">согласие на обработку персональных данных</a> и <a href="https://www.shokoladki.ru/cookies_agreement/" target="_blank" rel="noopener">согласие на использование cookies</a>. В концепте они переносятся без изменений.</p>
    </div>
  </div>
</template>
