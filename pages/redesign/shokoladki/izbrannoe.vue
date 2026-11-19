<script lang="ts" setup>
// Избранное со списками, как /personal/wish-list/ оригинала: «Новый список», перенос между списками, «Очистить», «В корзину».
import { skPath, skProduct, skRub, skPlural } from '~/utils/shokoladki'
import { useSkStore } from '~/composables/useShokoladki'
import SkCard from '~/components/redesign/shokoladki/SkCard.vue'
import SkIcon from '~/components/redesign/shokoladki/SkIcon.vue'

useSeoMeta({ title: 'Избранное — АПРИОРИ | Концепт редизайна' })
const store = useSkStore()
const to = (p: string) => skPath(p)
onMounted(() => store.persist())

const current = ref('main')
const list = computed(() => store.lists.value.find((l) => l.id === current.value) || store.lists.value[0])
const items = computed(() => (list.value?.items || []).map((id) => skProduct(id)).filter((p): p is NonNullable<typeof p> => !!p))
const sum = computed(() => items.value.reduce((a, p) => a + p.p, 0))
const newName = ref('')
const adding = ref(false)
const create = () => {
  current.value = store.newList(newName.value)
  newName.value = ''
  adding.value = false
}
const allToCart = () => {
  items.value.forEach((p) => store.add(p.id, 1, {}, true))
  store.say(`${items.value.length} ${skPlural(items.value.length, 'товар', 'товара', 'товаров')} — в корзине`, skPath('/korzina/'), 'Оформить')
}
</script>

<template>
  <div class="sk-wrap sk-fav">
    <nav class="sk-crumbs" aria-label="Навигация">
      <NuxtLink :to="to('/')">Главная</NuxtLink>
      <span>Избранное</span>
    </nav>
    <div class="sk-fav__head">
      <h1 class="sk-h1">Избранное</h1>
      <div class="sk-chips sk-chips--scroll">
        <button v-for="l in store.lists.value" :key="l.id" type="button" class="sk-chip" :class="{ 'is-on': l.id === list?.id }" @click="current = l.id">
          {{ l.n }} <small>{{ l.items.length }}</small>
        </button>
        <button v-if="!adding" type="button" class="sk-chip" @click="adding = true"><SkIcon name="plus" />Новый список</button>
      </div>
      <form v-if="adding" class="sk-fav__new" @submit.prevent="create">
        <input v-model="newName" class="sk-input" placeholder="Например, «Коллегам на Новый год»" aria-label="Название списка" />
        <button type="submit" class="sk-btn">Создать</button>
        <button type="button" class="sk-btn sk-btn--line" @click="adding = false">Отмена</button>
      </form>
    </div>

    <div v-if="items.length" class="sk-fav__bar">
      <span class="sk-muted">{{ items.length }} {{ skPlural(items.length, 'товар', 'товара', 'товаров') }} на {{ skRub(sum) }}</span>
      <button type="button" class="sk-btn" @click="allToCart"><SkIcon name="cart" />Всё в корзину</button>
      <button type="button" class="sk-link" @click="store.clearList(list!.id)"><SkIcon name="trash" />Очистить</button>
      <button v-if="list && list.id !== 'main'" type="button" class="sk-link" @click="store.dropList(list.id); current = 'main'">Удалить список</button>
    </div>

    <div v-if="items.length" class="sk-grid">
      <div v-for="p in items" :key="p.id" class="sk-fav__item">
        <SkCard :p="p" />
        <label v-if="store.lists.value.length > 1" class="sk-fav__move">
          <span>В список:</span>
          <select :value="list?.id" class="sk-input" @change="store.moveTo(p.id, ($event.target as HTMLSelectElement).value)">
            <option v-for="l in store.lists.value" :key="l.id" :value="l.id">{{ l.n }}</option>
          </select>
        </label>
      </div>
    </div>
    <div v-else class="sk-empty">
      <b class="sk-h2">Список пуст</b>
      <p>Нажмите на сердечко у товара — он появится здесь. Списки удобны, когда подарки нужны разным людям.</p>
      <NuxtLink :to="to('/katalog/')" class="sk-btn">В каталог</NuxtLink>
    </div>
  </div>
</template>
