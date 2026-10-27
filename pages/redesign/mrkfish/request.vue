<script lang="ts" setup>
import MfIcon from '~/components/redesign/mrkfish/MfIcon.vue'
import MfLetter from '~/components/redesign/mrkfish/MfLetter.vue'

const req = useMrkfishRequest()
const ui = useMrkfishUi()
const regions = [...mfRegions, 'Другой регион России']
const onQty = (id: string, e: Event) => req.setQty(id, Number((e.target as HTMLInputElement).value))

useSeoMeta({ title: 'Заявка на прайс — Миякинская Рыбная Компания | Концепт редизайна' })
</script>

<template>
  <div class="mf-wrap">
    <nav class="mf-crumbs" aria-label="Навигация">
      <NuxtLink :to="mfPath()">Главная</NuxtLink>
      <MfIcon name="arrow" :size="14" />
      <span>Заявка</span>
    </nav>

    <div class="mf-rq-top">
      <h1>Заявка на прайс</h1>
      <p>Корзины и цен на сайте нет — производитель считает цену под объём и регион. Отметьте позиции, и заявка уйдёт в отдел продаж готовым текстом.</p>
    </div>

    <div v-if="!req.count.value" class="mf-rq-empty">
      <span><MfIcon name="list" :size="28" /></span>
      <div>
        <h2>Заявка пока пустая</h2>
        <p>Нажмите «В заявку» у нужных позиций каталога или попросите весь прайс-лист.</p>
      </div>
      <div class="mf-rq-empty__btns">
        <NuxtLink :to="mfSectionPath()" class="mf-btn">Перейти в каталог</NuxtLink>
        <button type="button" class="mf-btn mf-btn--line" @click="ui.modal.value = 'price'">Весь прайс на почту</button>
      </div>
    </div>

    <div v-else class="mf-rq">
      <div class="mf-rq__main">
        <section v-for="g in req.groups.value" :key="g.section.id" class="mf-rq__group">
          <h2>
            {{ g.section.title }} <small>{{ mfPositions(g.lines.length) }}</small>
          </h2>
          <article v-for="l in g.lines" :key="l.product.id" class="mf-rq-line">
            <NuxtLink :to="mfProductPath(l.product)" class="mf-rq-line__photo">
              <img :src="mfImg(l.product.img)" :alt="mfTitle(l.product)" width="760" height="507" loading="lazy" />
            </NuxtLink>
            <div class="mf-rq-line__name">
              <NuxtLink :to="mfProductPath(l.product)">{{ l.product.name }}</NuxtLink>
              <small v-if="l.product.note">{{ l.product.note }}</small>
              <div v-if="l.product.packs.length > 1" class="mf-packs">
                <button
                  v-for="pk in l.product.packs"
                  :key="pk"
                  type="button"
                  class="mf-packs__item"
                  :class="{ 'is-on': l.pack === pk }"
                  @click="req.setPack(l.product.id, pk)"
                >
                  {{ pk }}
                </button>
              </div>
              <span v-else-if="l.pack" class="mf-packs"><span class="mf-packs__item is-static">{{ l.pack }}</span></span>
            </div>
            <div class="mf-qty mf-rq-line__qty">
              <button type="button" class="mf-qty__btn" aria-label="Меньше" @click="req.remove(l.product.id)"><MfIcon name="minus" :size="18" /></button>
              <label class="mf-qty__val">
                <input type="number" inputmode="numeric" min="0" :value="l.qty" :aria-label="`Количество, ${l.unit}`" @change="onQty(l.product.id, $event)" />
                <span>{{ l.unit }}</span>
              </label>
              <button type="button" class="mf-qty__btn" aria-label="Больше" @click="req.add(l.product.id)"><MfIcon name="plus" :size="18" /></button>
            </div>
            <button type="button" class="mf-iconbtn mf-rq-line__del" aria-label="Убрать из заявки" @click="req.setQty(l.product.id, 0)">
              <MfIcon name="trash" :size="20" />
            </button>
          </article>
        </section>
        <div class="mf-rq__tools">
          <NuxtLink :to="mfSectionPath()" class="mf-btn mf-btn--line"><MfIcon name="plus" :size="20" /> Добавить позиции</NuxtLink>
          <button type="button" class="mf-btn mf-btn--line" @click="req.clear()"><MfIcon name="trash" :size="20" /> Очистить</button>
        </div>

        <section class="mf-rq__form">
          <h2>Кому и куда</h2>
          <div class="mf-form mf-rq__fields">
            <label class="mf-field">
              <span>Организация или ИП</span>
              <input v-model="req.form.value.company" placeholder="Магазин, сеть, кафе" />
            </label>
            <label class="mf-field">
              <span>Контактное лицо</span>
              <input v-model="req.form.value.name" autocomplete="name" />
            </label>
            <label class="mf-field">
              <span>Телефон</span>
              <input v-model="req.form.value.phone" type="tel" autocomplete="tel" placeholder="+7" />
            </label>
            <label class="mf-field">
              <span>Почта для прайса</span>
              <input v-model="req.form.value.email" type="email" autocomplete="email" />
            </label>
            <label class="mf-field">
              <span>Регион</span>
              <select v-model="req.form.value.region">
                <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
              </select>
            </label>
            <label class="mf-field">
              <span>Город или посёлок</span>
              <input v-model="req.form.value.city" placeholder="Куда везти" />
            </label>
            <label class="mf-field mf-rq__wide">
              <span>Комментарий</span>
              <textarea v-model="req.form.value.comment" placeholder="Удобный день доставки, другие позиции" />
            </label>
            <label class="mf-check mf-rq__wide">
              <input v-model="req.form.value.fullPrice" type="checkbox" />
              <span>Прислать полный прайс-лист — на сайте {{ mfProducts.length }} позиций из 200+</span>
            </label>
          </div>
          <p v-if="req.form.value.region === 'Другой регион России'" class="mf-rq__note">
            <MfIcon name="truck" :size="20" /> Своим транспортом возим по Башкортостану, Оренбургской области и Татарстану. Про другие регионы
            договоримся отдельно.
          </p>
        </section>
      </div>

      <aside class="mf-rq__side">
        <MfLetter actions />
        <p class="mf-rq__hint">Ответ в среднем за {{ mfContacts.answer }} Удобнее голосом — <a :href="mfContacts.phone.href">{{ mfContacts.phone.label }}</a></p>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.mf-rq-top {
  margin-top: 16px;

  h1 {
    font-size: clamp(32px, 4vw, 48px);
  }

  p {
    max-width: 720px;
    margin-top: 10px !important;
    color: var(--mf-muted);
  }
}

.mf-rq-empty {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px 24px;
  margin-top: 32px;
  padding: 28px;
  border-radius: var(--mf-r-lg);
  background: var(--mf-surface);

  > span {
    display: grid;
    place-items: center;
    width: 60px;
    height: 60px;
    border-radius: 14px;
    background: #fff;
    color: var(--mf-red);
  }

  h2 {
    font-size: 22px;
  }

  p {
    margin-top: 4px !important;
    color: var(--mf-muted);
  }

  &__btns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  @media (max-width: 989px) {
    grid-template-columns: auto minmax(0, 1fr);

    &__btns {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 576px) {
    padding: 20px;

    &__btns .mf-btn {
      flex: 1 1 100%;
    }
  }
}

.mf-rq {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
  align-items: start;
  gap: 32px;
  margin-top: 28px;

  &__group {
    & + & {
      margin-top: 28px;
    }

    h2 {
      margin-bottom: 12px;
      font-size: 22px;

      small {
        color: var(--mf-muted);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        white-space: nowrap;
      }
    }
  }

  &__tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  &__form {
    margin-top: 40px;

    h2 {
      margin-bottom: 16px;
      font-size: 24px;
    }
  }

  &__fields {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  &__wide {
    grid-column: 1 / -1;
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 14px !important;
    padding: 14px 16px;
    border-radius: var(--mf-r);
    background: var(--mf-sun-soft);
    font-size: 14px;

    svg {
      flex: none;
      color: #8a6400;
    }
  }

  &__side {
    position: sticky;
    top: 96px;
  }

  &__hint {
    margin-top: 12px !important;
    color: var(--mf-muted);
    font-size: 14px;

    a {
      color: var(--mf-ink);
      font-weight: 700;
      white-space: nowrap;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  }

  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__side {
      position: static;
    }
  }

  @media (max-width: 576px) {
    &__fields {
      grid-template-columns: minmax(0, 1fr);
    }

    &__tools .mf-btn {
      flex: 1 1 0;
      padding: 0 12px;
    }
  }
}

.mf-rq-line {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 160px 44px;
  grid-template-areas: 'photo name qty del';
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--mf-line);

  &__photo {
    grid-area: photo;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--mf-r);
    background: var(--mf-surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

  }

  &__name {
    display: grid;
    grid-area: name;
    gap: 4px;
    min-width: 0;

    > a {
      color: var(--mf-ink);
      font-weight: 800;

      &:hover {
        color: var(--mf-red);
      }
    }

    small {
      color: var(--mf-muted);
      font-size: 14px;
      line-height: 1.35;
    }

    .mf-packs {
      margin-top: 2px;
    }
  }

  &__qty {
    grid-area: qty;
  }

  &__del {
    grid-area: del;
    color: var(--mf-muted);

    &:hover {
      color: var(--mf-red);
    }
  }

  @media (max-width: 576px) {
    grid-template-columns: 76px minmax(0, 1fr) 44px;
    grid-template-areas:
      'photo name del'
      'photo qty qty';
    gap: 8px 12px;
    align-items: start;
  }
}
</style>
