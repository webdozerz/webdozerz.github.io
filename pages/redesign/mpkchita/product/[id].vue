<script lang="ts" setup>
import MkIcon from '~/components/redesign/mpkchita/MkIcon.vue'
import MkCard from '~/components/redesign/mpkchita/MkCard.vue'

// У оригинала страницы товара нет — по клику открывается окно с составом. Здесь та же информация на своей странице,
// которой можно поделиться, плюс «где купить сейчас».
const route = useRoute()
const ui = useMpkchitaUi()
const p = computed(() => mkProduct(String(route.params.id)))
if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Продукт не найден' })
const sub = computed(() => mkSub(p.value!.sub)!)
const top = computed(() => mkTops.find((t) => t.slug === sub.value.top)!)
useSeoMeta({ title: () => p.value!.name + ' — Маккавеевский пищекомбинат | Концепт редизайна' })

const related = computed(() => mkProducts.filter((x) => x.sub === p.value!.sub && x.id !== p.value!.id).slice(0, 8))
const openStores = computed(() => mkStores.filter((s) => mkStatus(s, ui.now.value).open))
const shown = computed(() => (openStores.value.length ? openStores.value : mkStores).slice(0, 3))

const share = async () => {
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: p.value!.name, url })
      return
    }
    await navigator.clipboard.writeText(url)
    ui.say('Ссылка скопирована')
  } catch {
    ui.say('Ссылка: ' + url)
  }
}
</script>

<template>
  <div v-if="p" class="mk-wrap mk-product">
    <nav class="mk-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="mkPath('/')">Главная</NuxtLink></span>
      <span
        ><NuxtLink :to="mkPath('/catalog/' + top.slug)">{{ top.title }}</NuxtLink></span
      >
      <span
        ><NuxtLink :to="mkPath('/catalog/' + sub.slug)">{{ sub.title }}</NuxtLink></span
      >
    </nav>

    <div class="mk-product__grid">
      <figure class="mk-product__pic">
        <img :src="mkProductImg(p.id)" :alt="p.name" width="480" height="480" />
        <span v-if="p.isNew" class="mk-flag">Новинка</span>
      </figure>

      <div class="mk-product__info">
        <NuxtLink :to="mkPath('/catalog/' + sub.slug)" class="mk-product__sub">{{ sub.title }}</NuxtLink>
        <h1>{{ p.name }}</h1>

        <dl class="mk-facts">
          <div v-if="p.comp">
            <dt>Состав</dt>
            <dd>{{ p.comp }}</dd>
          </div>
          <div v-if="p.shelf">
            <dt>Срок годности</dt>
            <dd>{{ p.shelf }}</dd>
          </div>
          <div v-if="p.pack">
            <dt>Фасовка</dt>
            <dd>{{ p.pack }}</dd>
          </div>
          <div>
            <dt>Производитель</dt>
            <dd>{{ mkContacts.legal }}, Чита</dd>
          </div>
        </dl>

        <p class="mk-product__price"><MkIcon name="tag" :size="18" /> Цена — в магазинах «Маккавеевский». Акции недели уточняйте у продавцов.</p>

        <div class="mk-product__btns">
          <NuxtLink :to="mkPath('/gde-kupit')" class="mk-btn mk-btn--main"><MkIcon name="pin" :size="18" /> Где купить</NuxtLink>
          <button type="button" class="mk-btn mk-btn--line" :class="{ 'is-on': ui.inCompare(p.id) }" @click="ui.toggleCompare(p.id)">
            <MkIcon :name="ui.inCompare(p.id) ? 'check' : 'compare'" :size="18" />
            {{ ui.inCompare(p.id) ? 'В сравнении' : 'Сравнить' }}
          </button>
          <button type="button" class="mk-btn mk-btn--line" aria-label="Поделиться" @click="share"><MkIcon name="share" :size="18" /> Поделиться</button>
        </div>

        <div class="mk-product__stores">
          <p>
            <i class="mk-dot" :class="{ 'is-off': !openStores.length }" />
            {{ openStores.length ? 'Сейчас открыты, например:' : 'Магазины закрыты, откроются утром:' }}
          </p>
          <ul>
            <li v-for="s in shown" :key="s.id">
              <span>{{ s.address.replace(/^г\. Чита, /, '') }}</span>
              <small>{{ mkStatus(s, ui.now.value).text }}</small>
            </li>
          </ul>
          <NuxtLink :to="mkPath('/gde-kupit')">Все {{ mkStores.length }} магазинов по районам <MkIcon name="arrow" :size="16" /></NuxtLink>
        </div>
      </div>
    </div>

    <section v-if="related.length" class="mk-product__related">
      <div class="mk-head">
        <h2>Ещё из раздела «{{ sub.short }}»</h2>
        <NuxtLink :to="mkPath('/catalog/' + sub.slug)" class="mk-head__more">Вернуться к разделу <MkIcon name="arrow" :size="16" /></NuxtLink>
      </div>
      <div class="mk-grid">
        <MkCard v-for="x in related" :key="x.id" :p="x" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.mk-product {
  padding-bottom: 72px;
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;
    margin-top: 22px;
  }
  &__pic {
    position: relative;
    align-self: start;
    aspect-ratio: 1;
    border: 1px solid var(--mk-line);
    border-radius: 22px;
    background: #fff;
    img {
      position: absolute;
      inset: 5%;
      width: 90%;
      height: 90%;
      object-fit: contain;
    }
    .mk-flag {
      position: absolute;
      top: 16px;
      left: 16px;
      height: 28px;
      font-size: 14px;
    }
  }
  &__sub {
    font-size: 14px;
    font-weight: 600;
    color: var(--mk-red);
  }
  h1 {
    margin-top: 6px;
    font-size: clamp(30px, 3.4vw, 44px);
  }
  &__price {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 20px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--mk-yellow-bg);
    font-size: 14px;
    color: var(--mk-text);
    .mk-icon {
      margin-top: 2px;
      color: var(--mk-red);
    }
  }
  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    .mk-btn.is-on,
    .mk-btn.is-on:focus {
      background: var(--mk-soft);
      border-color: var(--mk-soft);
      color: var(--mk-red);
    }
  }
  &__stores {
    margin-top: 28px;
    padding: 18px 20px;
    border-radius: 16px;
    background: var(--mk-surface);
    > p {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: var(--mk-ink);
    }
    ul {
      margin: 10px 0 12px;
    }
    li {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2px 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--mk-line);
      small {
        color: var(--mk-green);
        font-weight: 600;
      }
    }
    > a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: var(--mk-red);
    }
  }
  &__related {
    margin-top: 64px;
    .mk-head h2 {
      font-size: clamp(24px, 2.6vw, 32px);
    }
  }
}
.mk-facts {
  margin-top: 22px;
  border-top: 1px solid var(--mk-line);
  > div {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr);
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--mk-line);
  }
  dt {
    color: var(--mk-muted);
    font-size: 14px;
  }
  dd {
    color: var(--mk-ink);
  }
}
@media (max-width: 989px) {
  .mk-product__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  .mk-product__pic {
    max-width: 520px;
    width: 100%;
  }
}
@media (max-width: 576px) {
  .mk-facts > div {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
  .mk-product__btns .mk-btn--main {
    flex: 1 0 100%;
  }
  .mk-product__btns .mk-btn--line {
    flex: 1 1 0;
    padding: 0 12px;
  }
}
</style>
