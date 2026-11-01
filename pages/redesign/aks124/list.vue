<script lang="ts" setup>
import AkIcon from '~/components/redesign/aks124/AkIcon.vue'
import AkPhone from '~/components/redesign/aks124/AkPhone.vue'

useSeoMeta({ title: 'Список заказа | ИП Аксюченко — концепт редизайна' })

const list = useAks124List()
const ui = useAks124Ui()
const f = list.form

const mailto = computed(
  () => `mailto:${akContacts.email}?subject=${encodeURIComponent('Заказ с сайта')}&body=${encodeURIComponent(list.text.value)}`,
)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(list.text.value)
    ui.say('Текст заказа скопирован')
  } catch {
    ui.say('Не получилось скопировать — выделите текст вручную')
  }
}
const onQty = (id: string, e: Event) => list.setQty(id, Number((e.target as HTMLInputElement).value))
</script>

<template>
  <div class="ak-wrap ak-page">
    <nav class="ak-crumbs" aria-label="Навигация">
      <NuxtLink :to="akPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Список заказа</span>
    </nav>
    <h1>Список заказа</h1>

    <div v-if="!list.count.value" class="ak-empty">
      <h3>Список пуст</h3>
      <p>Откройте каталог и нажмите «Упаковку» у нужных позиций — здесь соберётся заказ с суммой и готовым письмом.</p>
      <NuxtLink :to="akSectionPath()" class="ak-btn" style="margin-top: 16px">Перейти в каталог</NuxtLink>
    </div>

    <div v-else class="ak-list">
      <div class="ak-list__main">
        <div class="ak-list__lines">
          <div v-for="l in list.lines.value" :key="l.item.id" class="ak-line">
            <div class="ak-line__name">
              <b>{{ l.item.name }}</b>
              <small>
                {{ akBrand(l.item.brand)?.title }}<template v-if="l.item.price"> · {{ akMoney(l.item.price) }}/{{ l.item.per }}</template
                ><template v-if="l.item.pack"> · {{ l.item.pack }} {{ l.item.per }} в уп.</template>
              </small>
            </div>
            <div class="ak-line__qty">
              <div class="ak-qty">
                <button type="button" aria-label="Меньше на упаковку" @click="list.sub(l.item)"><AkIcon name="minus" :size="18" /></button>
                <label>
                  <input
                    :value="l.packs"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    :style="{ width: `${String(l.packs).length + 0.6}ch` }"
                    aria-label="Упаковок"
                    @change="onQty(l.item.id, $event)"
                  />
                  <span>{{ l.item.pack ? 'уп.' : l.item.per }}</span>
                </label>
                <button type="button" aria-label="Больше на упаковку" @click="list.add(l.item)"><AkIcon name="plus" :size="18" /></button>
              </div>
              <small v-if="l.item.pack">{{ l.pcs }} {{ l.item.per }}</small>
            </div>
            <div class="ak-line__sum">
              <b v-if="l.item.price">{{ akMoney(l.sum) }}</b>
              <small v-else>цену уточнят</small>
            </div>
            <button type="button" class="ak-iconbtn ak-line__del" :aria-label="`Убрать: ${l.item.name}`" @click="list.setQty(l.item.id, 0)">
              <AkIcon name="trash" :size="20" />
            </button>
          </div>
        </div>
        <div class="ak-list__under">
          <NuxtLink :to="akSectionPath()" class="ak-more"><AkIcon name="plus" :size="18" />Добавить из каталога</NuxtLink>
          <button type="button" class="ak-list__clear" @click="list.clear()">Очистить список</button>
        </div>

        <form class="ak-form ak-list__form" @submit.prevent>
          <h2>Кто заказывает</h2>
          <div class="ak-list__grid">
            <label class="ak-field ak-field--select">
              <span>Вид деятельности</span>
              <select v-model="f.kind">
                <option v-for="k in akKinds" :key="k">{{ k }}</option>
              </select>
            </label>
            <label class="ak-field"><span>Имя или организация</span><input v-model="f.name" autocomplete="organization" /></label>
            <label class="ak-field"><span>Телефон</span><AkPhone v-model="f.phone" /></label>
            <label class="ak-field"><span>E-mail</span><input v-model="f.email" type="email" autocomplete="email" /></label>
          </div>
          <div class="ak-tabs" role="tablist" aria-label="Получение">
            <button type="button" role="tab" :aria-selected="f.way === 'delivery'" :class="{ 'is-on': f.way === 'delivery' }" @click="f.way = 'delivery'">
              Доставка
            </button>
            <button type="button" role="tab" :aria-selected="f.way === 'pickup'" :class="{ 'is-on': f.way === 'pickup' }" @click="f.way = 'pickup'">
              Самовывоз
            </button>
          </div>
          <label v-if="f.way === 'delivery'" class="ak-field"><span>Адрес</span><input v-model="f.address" autocomplete="street-address" /></label>
          <p v-else class="ak-list__pickup"><AkIcon name="pin" :size="20" />{{ akContacts.address }}, {{ akContacts.hours }}</p>
          <label class="ak-field"><span>Комментарий</span><textarea v-model="f.comment" rows="2" placeholder="Например, нужна часть упаковки" /></label>
        </form>
      </div>

      <aside class="ak-list__side">
        <div class="ak-sum">
          <p class="ak-sum__row">
            <span>{{ list.count.value }} поз.</span><b>{{ akMoney(list.total.value) }}</b>
          </p>
          <p v-if="list.unknown.value" class="ak-sum__note">Без цены: {{ list.unknown.value }} — менеджер назовёт цену.</p>
          <div class="ak-free">
            <div class="ak-free__bar"><span :style="{ width: `${Math.min(100, (list.total.value / akFreeFrom) * 100)}%` }" /></div>
            <p v-if="list.toFree.value > 0">До бесплатной доставки <b>{{ akMoney0(list.toFree.value) }}</b></p>
            <p v-else><b>Доставка по Красноярску бесплатно</b></p>
          </div>
          <p class="ak-sum__note">Цены базовые. Конечная зависит от объёма, постоянным клиентам — скидки.</p>
        </div>

        <div class="ak-letter">
          <p class="ak-letter__label">Готовое письмо</p>
          <pre>{{ list.text.value }}</pre>
          <div class="ak-letter__btns">
            <a :href="mailto" class="ak-btn"><AkIcon name="mail" :size="20" />Отправить на почту</a>
            <button type="button" class="ak-btn ak-btn--line" @click="copy"><AkIcon name="copy" :size="20" />Скопировать</button>
            <a :href="akContacts.phones[0].href" class="ak-btn ak-btn--line"><AkIcon name="phone" :size="20" />Продиктовать</a>
          </div>
          <p class="ak-sum__note">Письмо уйдёт на {{ akContacts.email }} из вашей почты. В концепте ничего не отправляется само.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.ak-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 28px;
  align-items: start;

  &__lines {
    border: 1px solid var(--ak-line);
    border-radius: var(--ak-R);
    padding: 6px 18px;
  }
  &__under {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 14px;
  }
  &__clear {
    color: var(--ak-muted);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  &__form {
    margin-top: 28px;
    padding: 24px;
    border-radius: var(--ak-R);
    background: var(--ak-surface);

    h2 {
      font-size: 22px;
    }
    .ak-tabs {
      background: #fff;
    }
    .ak-tabs button.is-on {
      background: var(--ak-soft);
      box-shadow: none;
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  &__pickup {
    display: flex;
    gap: 8px;
    color: var(--ak-ink);

    svg {
      flex: none;
      color: var(--ak-accent);
    }
  }
  &__side {
    position: sticky;
    top: 96px;
    display: grid;
    gap: 16px;
  }

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr) 340px;
  }
  @media (max-width: 989px) {
    grid-template-columns: minmax(0, 1fr);

    &__side {
      position: static;
    }
  }
  @media (max-width: 576px) {
    &__lines {
      padding: 4px 12px;
    }
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
    &__form {
      padding: 18px 14px;
    }
  }
}
.ak-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 120px 44px;
  align-items: start;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--ak-line);

  &:last-child {
    border-bottom: 0;
  }
  &__name {
    b {
      display: block;
      color: var(--ak-ink);
      font-weight: 600;
      line-height: 1.35;
    }
    small {
      color: var(--ak-muted);
    }
  }
  &__qty {
    display: grid;
    justify-items: center;
    gap: 2px;

    small {
      color: var(--ak-muted);
      font-size: 13px;
    }
  }
  &__sum {
    display: grid;
    align-content: center;
    min-height: 40px;
    text-align: right;

    b {
      color: var(--ak-ink);
      font-size: 16px;
      white-space: nowrap;
    }
    small {
      color: var(--ak-muted);
    }
  }
  &__del {
    height: 40px;
    color: var(--ak-muted);
  }
  @media (max-width: 576px) {
    grid-template-columns: auto minmax(0, 1fr) 44px;
    grid-template-areas:
      'name name del'
      'qty sum sum';
    gap: 10px;

    &__name {
      grid-area: name;
    }
    &__qty {
      grid-area: qty;
    }
    &__sum {
      grid-area: sum;
    }
    &__del {
      grid-area: del;
    }
  }
}
.ak-sum {
  display: grid;
  gap: 12px;
  padding: 22px;
  border-radius: var(--ak-R);
  background: var(--ak-surface);

  &__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;

    span {
      color: var(--ak-muted);
    }
    b {
      font-size: 28px;
      color: var(--ak-ink);
    }
  }
  &__note {
    font-size: 13.5px;
    color: var(--ak-muted);
  }
  .ak-free__bar {
    background: #fff;
  }
}
.ak-letter {
  display: grid;
  gap: 12px;
  padding: 22px;
  border: 1px solid var(--ak-line);
  border-radius: var(--ak-R);

  &__label {
    font-weight: 700;
    color: var(--ak-ink);
  }
  pre {
    max-height: 260px;
    overflow: auto;
    margin: 0;
    padding: 14px;
    border-radius: 12px;
    background: var(--ak-surface);
    font: 13.5px/1.5 'Exo 2', sans-serif;
    white-space: pre-wrap;
    color: var(--ak-ink);
  }
  &__btns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    .ak-btn:first-child {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 375px) {
    &__btns {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
