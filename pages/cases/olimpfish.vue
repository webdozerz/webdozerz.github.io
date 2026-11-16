<script lang="ts" setup>
import '~/assets/scss/home.scss'
import { contacts, siteUrl } from '~/data/profile'

const url = `${siteUrl}/cases/olimpfish/`
const title = 'Редизайн интернет-магазина «Олимп Фиш» — кейс'
const description = 'Бесплатный концепт для холодного предложения → заказ. За 3 дня новый дизайн перенесён на WordPress, WooCommerce и WoodMart без изменения логики магазина: цены, доставка, оплата, формы и письма — те же. Скриншоты до и после.'

useHomeHead()
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'article',
  ogUrl: url,
  ogImage: `${siteUrl}/cases/olimpfish/og.jpg`,
  ogImageAlt: 'Новая главная olimp-fish.ru: «Отрез» с выбором веса ножом',
})
useHead({ link: [{ rel: 'canonical', href: url }] })

const ui = useHomeUi()

// Подсветка пункта содержания: активен последний раздел, чей заголовок прошёл верхнюю треть экрана.
// Раздел «Что сделали» продолжается парами скриншотов, поэтому смотрим на начала разделов, а не на их видимость.
const active = ref('start')

// После клика по пункту держим его подсвеченным, пока идёт плавная прокрутка:
// короткие последние разделы иначе подсветились бы соседним.
let lockUntil = 0

function pick(id: string) {
  active.value = id
  lockUntil = Date.now() + 1000
}

// Восемь замеров на событие — дёшево, считаем прямо в обработчике прокрутки.
function updateActive() {
  if (Date.now() < lockUntil)
    return
  const line = window.innerHeight * 0.3
  let current = toc[0].id
  for (const item of toc) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= line)
      current = item.id
  }
  // У низа страницы последний раздел может не дойти до линии — подсвечиваем его.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4)
    current = toc[toc.length - 1].id
  active.value = current
}

onMounted(() => {
  ui.syncTheme()
  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('resize', updateActive)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
  window.removeEventListener('resize', updateActive)
})

const toc = [
  { id: 'start', label: 'Как всё началось' },
  { id: 'goals', label: 'Что хотелось улучшить' },
  { id: 'rule', label: 'Главное условие' },
  { id: 'screens', label: 'Что сделали' },
  { id: 'fixes', label: 'Что поправили попутно' },
  { id: 'release', label: 'Как выкатывали' },
  { id: 'later', label: 'Что оставили на потом' },
  { id: 'result', label: 'Итог' },
]

const facts = [
  { label: 'Заказчик', value: 'ТК «Олимп», olimp-fish.ru' },
  { label: 'Что продают', value: 'рыбу собственного копчения, икру и морепродукты, доставка по Москве' },
  { label: 'Срок', value: '3 дня, 13–15 ноября 2026' },
  { label: 'Платформа', value: 'WordPress, WooCommerce, тема WoodMart, WPBakery' },
  { label: 'Что делал', value: 'концепт, перенос дизайна на их сайт, план выкатки' },
]
</script>

<template>
  <div class="home post">
    <div class="shell">
      <nav class="post__crumbs mono" aria-label="Навигация">
        <NuxtLink to="/">~</NuxtLink>
        <span>/</span>
        <NuxtLink to="/cases/">cases</NuxtLink>
        <span>/</span>
        <span>olimpfish</span>
      </nav>

      <header class="post__head">
        <span class="post__kicker mono">кейс · ноябрь 2026</span>
        <h1 class="post__title">
          Редизайн интернет-магазина «Олимп Фиш»
        </h1>
        <p class="post__lead">
          Сделал бесплатный концепт для холодного предложения, заказчик откликнулся, и за три дня я перенёс
          новый дизайн на их WordPress и WooCommerce. Логику магазина не трогал: цены, доставка, оплата, формы
          и письма работают как раньше.
        </p>
        <div class="post__actions">
          <a href="https://andryushov.me/redesign/olimpfish/" target="_blank" rel="noopener" class="h-btn h-btn--primary">
            Концепт ↗
          </a>
          <a href="https://olimp-fish.ru" target="_blank" rel="noopener" class="h-btn">
            olimp-fish.ru ↗
          </a>
        </div>
      </header>

      <dl class="facts">
        <div v-for="f in facts" :key="f.label" class="facts__row">
          <dt class="mono">
            {{ f.label }}
          </dt>
          <dd>{{ f.value }}</dd>
        </div>
      </dl>

      <div class="post__layout">
        <aside class="toc" aria-label="Содержание">
          <span class="toc__head mono">Содержание</span>
          <a
            v-for="(item, i) in toc"
            :key="item.id"
            :href="`#${item.id}`"
            class="toc__link"
            :class="{ 'toc__link--active': active === item.id }"
            :aria-current="active === item.id ? 'location' : undefined"
            @click="pick(item.id)"
          >
            <span class="mono">{{ String(i + 1).padStart(2, '0') }}</span>{{ item.label }}
          </a>
        </aside>

        <article class="post__body">
          <section id="start" class="block">
            <h2><span class="mono">01</span>Как всё началось</h2>
            <p>
              Я делаю концепты редизайна для местных магазинов: беру рабочий сайт, его товары и тексты и показываю,
              как он мог бы выглядеть и работать. Бесплатно и без договорённости заранее, просто отправляю ссылку.
            </p>
            <p>
              «Олимп Фиш» — московский магазин рыбы собственного копчения, красной и чёрной икры и морепродуктов,
              с приёмом заказов круглые сутки и доставкой «сегодня на завтра». Для них я собрал
              <a href="https://andryushov.me/redesign/olimpfish/" target="_blank" rel="noopener">интерактивный концепт</a>
              с главной, каталогом, карточкой товара, корзиной и всеми информационными страницами. В компании
              откликнулись и попросили перенести этот дизайн на рабочий сайт.
            </p>
          </section>

          <section id="goals" class="block">
            <h2><span class="mono">02</span>Что хотелось улучшить</h2>
            <p>
              Сайт исправно принимал заказы, поэтому задача была не «переделать»,
              а подчеркнуть продукт и упростить путь к покупке:
            </p>
            <ul class="list">
              <li>
                <b>Вес и цена — сразу.</b> Большая часть ассортимента весовая: осётр, белуга, балыки. Хотелось, чтобы
                покупатель видел цену за нужный вес на первом экране, в карточке товара и в каталоге, без выпадающих
                списков.
              </li>
              <li>
                <b>Разделы — в одно касание.</b> Мега-меню с фото разделов и чипы подразделов в каталоге, чтобы
                икра или копчёная рыба находились за пару кликов.
              </li>
              <li>
                <b>Удобно с телефона.</b> Нижняя панель с корзиной и поиском, крупные кнопки, меню с вкладками
                «Меню / Каталог».
              </li>
              <li>
                <b>Один стиль на весь сайт</b> — от главной до кабинета, вакансий и страницы 404.
              </li>
            </ul>
          </section>

          <section id="rule" class="block">
            <h2><span class="mono">03</span>Главное условие: магазин работает как работал</h2>
            <p>
              Концепт написан на Nuxt, а магазин живёт на WordPress, WooCommerce и теме WoodMart. Переписывать
              магазин с нуля не было смысла: заказы идут каждый день, всё настроено и привычно менеджерам.
              Поэтому я переносил только вид:
            </p>
            <ul class="list">
              <li>весь код — отдельной папкой в дочерней теме, подключается одной строкой;</li>
              <li>
                цены, способы и стоимость доставки, оплата, поля оформления, формы и их получатели, письма, адреса
                страниц и SEO-заголовки остались прежними;
              </li>
              <li>
                базу не меняли: содержимое страниц и формы в админке те же, новый вид выводится поверх них кодом;
              </li>
              <li>товары, цены и тексты заказчик редактирует как раньше.</li>
            </ul>
            <p>
              Работа шла на закрытой копии сайта с выключенными письмами, а каждый экран я сверял с концептом
              на ширине 1440 и 375 px. Всё, что решили сделать иначе, записано в чек-лист вместе с причиной.
            </p>
          </section>

          <section id="screens" class="block">
            <h2><span class="mono">04</span>Что сделали</h2>
            <p>
              Ниже — пары скриншотов: слева сайт до переноса, справа после. Переключатель над парой показывает
              телефон, клик по кадру открывает всю страницу.
            </p>

            <h3>Главная и «Отрез»</h3>
            <p>
              Главная — новая страница из элементов WPBakery, которые я сделал для темы. Заказчик сам меняет на ней
              товары, полки и тексты. Первый экран — интерактивный «Отрез»: нож двигается по фото куска балыка или
              осетра и прилипает к реальным весовым вариантам товара — 300 г, 400 г… 1 кг. Сумма считается по цене
              за килограмм, а «В корзину» и «Быстрая покупка» берут именно выбранный вес.
            </p>
            <p>
              Ниже — разделы с фото, баннер акции с полкой товаров со скидкой, «Выбор покупателей», новинки,
              блок о собственном копчении, условия для оптовиков с формой заявки, отзывы, новости и форма вопроса.
            </p>
          </section>
          <CasesBeforeAfter
            slug="olimpfish"
            shot="home"
            title="Главная"
            before="Первый экран — новости магазина."
            after="Первый экран — «Отрез»: вес выбирается ножом, сумма считается сразу."
          />
          <section class="block block--cont">
            <h3>Шапка и меню</h3>
            <p>
              Шапка светлая. Наверху — приём заказов 24/7, почта, телефоны, ВКонтакте и Telegram, «Заказать звонок»;
              ниже — меню и корзина с суммой. «Продукция» раскрывается мега-меню: фото разделов, число товаров и
              подразделы. Поиск показывает товары с фото и ценой прямо под шапкой. На телефоне — меню с вкладками
              «Меню / Каталог» и нижняя панель: магазин, поиск, избранное, корзина, кабинет.
            </p>

            <h3>Каталог</h3>
            <p>
              У раздела появились заголовок с числом товаров и чипы подразделов. Сайдбар с категориями и фильтром
              «Вес» оформлен блоками. В карточке товара в каталоге вес выбирается чипами, а цена и цена за килограмм
              пересчитываются на месте. «В корзину» превращается в счётчик −1+. Сортировка, фильтры и «Загрузить
              ещё» — штатные, WooCommerce и WoodMart.
            </p>
          </section>
          <CasesBeforeAfter
            slug="olimpfish"
            shot="catalog"
            title="Каталог: раздел «Икра»"
            before="Разделы плитками, фильтры и сортировка темы."
            after="Заголовок с числом товаров, чипы подразделов, вес и цена в карточке."
          />
          <section class="block block--cont">
            <h3>Карточка товара</h3>
            <p>
              Вес выбирается чипами вместо выпадающего списка, сразу видна цена за килограмм и подсказка про
              весовой товар. Под кнопками — коротко о доставке. Состав, пищевая ценность на 100 г, срок и условия
              хранения теперь показаны отдельным блоком с плитками. В админке эти данные записаны свободным текстом,
              поэтому код раскладывает их по подписям при выводе, не трогая базу. Так получилось у 136 из
              155 товаров, у остальных текст выводится как был.
            </p>
          </section>
          <CasesBeforeAfter
            slug="olimpfish"
            shot="product"
            title="Карточка товара: рулет из осетра"
            before="Состав — длинной таблицей, вес — в выпадающем списке под ней."
            after="Вес чипами, цена за кг, доставка рядом с кнопкой, состав отдельным блоком."
          />
          <section class="block block--cont">
            <h3>Корзина и оформление</h3>
            <p>
              В корзине у каждой позиции подписан вес и цена за килограмм. Способы доставки показаны карточками
              с ценой и условием. Справа закреплён «Ваш заказ» с итогом. Оформление собрано так же: доставка,
              покупатель, оплата и итог рядом. При этом всё остаётся внутри штатной формы WooCommerce: отправка
              заказа, расчёт доставки и проверка полей — прежние. Проверял тестовыми заказами на копии.
            </p>
          </section>
          <CasesBeforeAfter
            slug="olimpfish"
            shot="cart"
            title="Корзина"
            before="Таблица товаров, доставка — списком в итоге."
            after="Вес и цена за кг у позиций, доставка карточками, итог закреплён справа."
          />

          <CasesBeforeAfter
            slug="olimpfish"
            shot="checkout"
            title="Оформление заказа"
            before="Поля, доставка и итог — стандартный вид темы."
            after="Те же поля и способы доставки, сгруппированные карточками, итог рядом."
          />
          <section class="block block--cont">
            <h3>Контакты и остальные страницы</h3>
            <p>
              В том же стиле — «Спасибо за заказ», кабинет, вход и регистрация, восстановление пароля, избранное,
              «Оплата и доставка», «Партнёрам и оптовикам» и оптовые разделы с «Запросить цену», «О компании»,
              галерея, декларации, контакты с картой, новости, статьи, рецепты и страница записи, отзывы, вакансии,
              карта привилегий, акции, политика конфиденциальности, поиск, 404 и подвал. Попапы тоже: «Заказать
              звонок», «Быстрая покупка» и боковая корзина.
            </p>
            <p>
              Всё, что есть на рабочем сайте, но чего не было в концепте, я оставил и оформил в новом стиле:
              отзывы со скриншотами из мессенджеров и форму отзыва, условия карты привилегий, реквизиты, декларации,
              оптовый каталог.
            </p>
          </section>
          <CasesBeforeAfter
            slug="olimpfish"
            shot="contacts"
            title="Контакты"
            before="Контакты и реквизиты текстом."
            after="Телефоны, мессенджеры, самовывоз и время работы карточками, карта рядом."
          />
          <section id="fixes" class="block">
            <h2><span class="mono">05</span>Что поправили попутно</h2>
            <p>
              При проверке функций нашлось несколько мест, где сайт вёл себя не так, как задумано. Исправил их
              кодом темы, формы и настройки в базе остались как были:
            </p>
            <ul class="list">
              <li>
                В формах «Заказать звонок», «Запросить цену» и форме на странице галереи кнопка отправки оставалась
                неактивной из-за служебной галочки согласия, которую не было видно. Теперь согласие подписано
                строкой со ссылкой на политику, и кнопка работает.
              </li>
              <li>
                Ссылки на разделы кабинета — заказы, адреса, восстановление пароля — открывали главную кабинета.
                Теперь каждая ведёт в свой раздел.
              </li>
              <li>«Быстрая покупка» показывала диапазон цен, теперь берёт выбранный вес.</li>
              <li>«Поиск» в нижней панели на телефоне теперь открывает строку поиска, а не меню.</li>
              <li>К отклику на вакансию можно приложить резюме в PDF или фото, до 10 МБ.</li>
            </ul>
          </section>

          <section id="release" class="block">
            <h2><span class="mono">06</span>Как выкатывали</h2>
            <p>
              Выкатку спланировал так, чтобы заказы ни на минуту не зависели от редизайна:
            </p>
            <ol class="steps">
              <li><b>Точки отката.</b> Бэкап хостинга и копия дочерней темы до начала работ.</li>
              <li>
                <b>Код — без видимых изменений.</b> Папка темы заливается и подключается одной строкой. Пока включена
                старая шапка, посетители видят прежний сайт.
              </li>
              <li>
                <b>Новая главная и шапка — черновиками.</b> Создаются рядом со старыми, SEO-заголовок и описание
                главной переносятся без изменений.
              </li>
              <li>
                <b>Включение за пару минут.</b> Новая шапка — по умолчанию, новая главная — в настройках чтения,
                кеш сброшен.
              </li>
              <li>
                <b>Проверка на рабочем сайте</b> по списку: шапка, «Отрез», каталог, карточка, корзина, оформление,
                формы, чат, письма, Метрика.
              </li>
            </ol>
            <p>
              Базу с копии на рабочий сайт не переносили, поэтому заказы, пришедшие во время работ, никуда не
              пропадут. Откат — те же два переключателя обратно, старая главная и шапка остаются на месте.
              Запуск назначили на утро, когда заказов меньше всего.
            </p>
          </section>

          <section id="later" class="block">
            <h2><span class="mono">07</span>Что оставили на потом</h2>
            <p>
              В концепте есть то, чего нет на сайте: дополнительные поля в форме опта, фильтр «Только в наличии»,
              выбор вакансии в форме отклика, пробел вместо точки в ценах. До запуска мы ничего такого не
              добавляли: новые поля и функции — это новые записи в базе и лишние шаги при переносе. Семь таких
              пунктов записаны отдельным списком, чтобы обсудить их с заказчиком после запуска.
            </p>
          </section>

          <section id="result" class="block">
            <h2><span class="mono">08</span>Итог</h2>
            <ul class="numbers">
              <li><b>3 дня</b><span>от доступа к сайту до готовой копии с новым дизайном</span></li>
              <li><b>118 пунктов</b><span>в чек-листе сверки с концептом, у каждого отличия записана причина</span></li>
              <li><b>0 изменений</b><span>в логике магазина: цены, доставка, оплата, формы и письма — прежние</span></li>
              <li><b>2 минуты</b><span>на включение и столько же на откат</span></li>
            </ul>
            <p>
              Цифр по продажам пока нет — их честнее показывать, когда накопится статистика после запуска.
            </p>
          </section>

          <aside class="cta">
            <p class="cta__title">
              Хотите посмотреть, как мог бы выглядеть ваш магазин?
            </p>
            <p class="cta__text">
              Сделаю концепт на ваших товарах и текстах, а если понравится — перенесу на ваш сайт, не ломая то,
              что уже работает.
            </p>
            <div class="post__actions">
              <a :href="contacts.telegram" target="_blank" rel="noopener" class="h-btn h-btn--telegram">
                Написать в Telegram
              </a>
              <NuxtLink to="/redesign/" class="h-btn">
                Каталог концептов
              </NuxtLink>
            </div>
          </aside>

          <NuxtLink to="/cases/" class="post__back">
            ← Все кейсы
          </NuxtLink>
        </article>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post {
  padding: 28px 0 96px;

  > .shell {
    max-width: 1280px;
  }

  &__crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    color: var(--h-faint);
    font-size: 13px;

    a {
      color: var(--h-muted);
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: var(--h-accent);
      }
    }
  }

  &__head {
    max-width: 820px;
    margin: 52px 0 36px;
  }

  &__kicker {
    color: var(--h-accent);
    font-size: 12px;
  }

  &__title {
    margin: 12px 0 0;
    font-size: clamp(30px, 5.2vw, 52px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.03em;
    text-wrap: balance;
  }

  &__lead {
    margin: 18px 0 0;
    color: var(--h-text-soft);
    font-size: clamp(16px, 1.6vw, 18px);
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
  }

  // Содержание слева липкое на всю статью; текст и пары скриншотов — в правой колонке.
  &__layout {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 56px;
  }

  &__body {
    min-width: 0;
  }

  &__back {
    display: inline-block;
    margin-top: 40px;
    color: var(--h-muted);
    font-size: 14px;
    text-decoration: none;

    &:hover {
      color: var(--h-text);
    }
  }
}

.facts {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: 0 0 56px;
  border: 1px solid var(--h-line);
  border-radius: 14px;
  background: var(--h-line);
  gap: 1px;
  overflow: hidden;

  &__row {
    padding: 16px 18px;
    background: var(--h-bg);
  }

  dt {
    color: var(--h-faint);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  dd {
    margin: 6px 0 0;
    color: var(--h-text);
    font-size: 14px;
    line-height: 1.45;
  }
}

.toc {
  position: sticky;
  top: 32px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__head {
    margin-bottom: 8px;
    padding-left: 14px;
    color: var(--h-faint);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__link {
    position: relative;
    display: flex;
    gap: 10px;
    padding: 5px 0 5px 14px;
    color: var(--h-muted);
    font-size: 14px;
    line-height: 1.35;
    text-decoration: none;
    transition: color 0.2s;

    .mono {
      flex-shrink: 0;
      color: var(--h-faint);
      font-size: 12px;
      line-height: 1.6;
    }

    &:hover {
      color: var(--h-text);
    }

    // Полоска слева, как подчёркивание активного пункта в шапке.
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 7px;
      bottom: 7px;
      width: 2px;
      border-radius: 1px;
      background: var(--h-accent);
      opacity: 0;
      transform: scaleY(0.4);
      transition: opacity 0.2s, transform 0.2s;
    }

    &--active {
      color: var(--h-text);

      .mono {
        color: var(--h-accent);
      }

      &::before {
        opacity: 1;
        transform: none;
      }
    }
  }
}

.block {
  padding-top: 8px;
  scroll-margin-top: 24px;

  & + & {
    margin-top: 48px;
  }

  &--cont {
    margin-top: 48px;
    padding-top: 0;
  }

  h2 {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin: 0 0 16px;
    font-size: clamp(22px, 2.6vw, 28px);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;

    .mono {
      color: var(--h-accent);
      font-size: 13px;
      font-weight: 400;
    }
  }

  h3 {
    margin: 32px 0 10px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  > h3:first-child {
    margin-top: 0;
  }

  h2,
  h3,
  p,
  .list,
  .steps,
  .numbers {
    max-width: 720px;
  }

  p {
    margin: 0 0 14px;
    color: var(--h-text-soft);
    font-size: 16.5px;
    line-height: 1.7;
  }

  a {
    color: var(--h-text);
    text-decoration-color: var(--h-line-strong);
    text-underline-offset: 3px;

    &:hover {
      color: var(--h-accent);
    }
  }

  b {
    color: var(--h-text);
    font-weight: 600;
  }
}

.list,
.steps {
  display: grid;
  gap: 10px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 22px;
    color: var(--h-text-soft);
    font-size: 16px;
    line-height: 1.65;
  }
}

.list li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0.72em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--h-accent);
}

.steps {
  counter-reset: step;

  li {
    padding-left: 36px;
    counter-increment: step;

    &::before {
      content: counter(step);
      position: absolute;
      left: 0;
      top: 0.15em;
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border: 1px solid var(--h-line-strong);
      border-radius: 50%;
      color: var(--h-accent);
      font-family: var(--h-mono);
      font-size: 12px;
    }
  }
}

.numbers {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0 0 18px;
  padding: 0;
  list-style: none;
  border: 1px solid var(--h-line);
  border-radius: 14px;
  background: var(--h-line);
  overflow: hidden;

  li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 20px;
    background: var(--h-bg);
  }

  b {
    font-size: 26px;
    letter-spacing: -0.02em;
  }

  span {
    color: var(--h-muted);
    font-size: 14px;
    line-height: 1.5;
  }
}

.cta {
  max-width: 720px;
  margin-top: 48px;
  padding: 28px;
  border: 1px solid var(--h-line);
  border-radius: 14px;
  background:
    radial-gradient(120% 120% at 0% 0%, var(--h-accent-glow), transparent 60%),
    var(--h-surface);

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &__text {
    margin: 10px 0 0;
    color: var(--h-text-soft);
    font-size: 15px;
    line-height: 1.6;
  }

  .post__actions {
    margin-top: 20px;
  }
}

// Пары скриншотов идут на всю ширину контейнера, между текстовыми блоками.
.post :deep(.ba) {
  margin: 28px 0 0;
}

@media (max-width: 1100px) {
  .facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .post__layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }

  .toc {
    position: static;
    margin-bottom: 40px;
    padding: 18px 20px;
    border: 1px solid var(--h-line);
    border-radius: 12px;
  }
}

@media (max-width: 760px) {
  .post {
    padding-top: 20px;

    &__head {
      margin: 36px 0 28px;
    }
  }

  .facts {
    grid-template-columns: minmax(0, 1fr);
    margin-bottom: 40px;

    &__row {
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      gap: 12px;
      padding: 12px 16px;
    }

    dd {
      margin: 0;
    }
  }

  .block p {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .numbers {
    grid-template-columns: minmax(0, 1fr);
  }

  .cta {
    padding: 22px 18px;
  }

  .post__actions .h-btn {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
