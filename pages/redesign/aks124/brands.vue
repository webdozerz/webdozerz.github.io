<script lang="ts" setup>
useSeoMeta({ title: 'Бренды А–Я | ИП Аксюченко — концепт редизайна' })

// Алфавитный указатель брендов: у оригинала каталог устроен по маркам, а не по категориям
const sorted = [...akBrands].sort((a, b) => a.title.localeCompare(b.title, 'ru'))
const groups = computed(() => {
  const m = new Map<string, AkBrand[]>()
  for (const b of sorted) {
    const ch = b.title[0].toUpperCase()
    const key = /[A-Z]/.test(ch) ? 'A–Z' : /\d/.test(ch) ? '0–9' : ch
    if (!m.has(key)) m.set(key, [])
    m.get(key)!.push(b)
  }
  return [...m.entries()]
})
</script>

<template>
  <div class="ak-wrap ak-page">
    <nav class="ak-crumbs" aria-label="Навигация">
      <NuxtLink :to="akPath()">Главная</NuxtLink>
      <span>/</span>
      <span>Бренды</span>
    </nav>
    <h1>Бренды от А до Я</h1>
    <p class="ak-page__lead">{{ akBrands.length }} марок и линеек в концепте. Нажмите на марку — откроется её лист с ценами.</p>

    <nav class="ak-az" aria-label="Буквы">
      <a v-for="[k] in groups" :key="k" :href="`#az-${k}`">{{ k }}</a>
    </nav>

    <section v-for="[k, bs] in groups" :id="`az-${k}`" :key="k" class="ak-az__group">
      <h2>{{ k }}</h2>
      <div class="ak-az__list">
        <NuxtLink v-for="b in bs" :key="b.id" :to="akBrandPath(b)" class="ak-az__brand">
          <span>
            <b>{{ b.title }}</b>
            <small>{{ akSection(b.section)?.title }} · {{ b.count }}</small>
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.ak-az {
  position: sticky;
  z-index: 5;
  top: 76px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 20px 0 8px;
  padding: 8px 0;
  background: #fff;

  a {
    display: grid;
    place-items: center;
    min-width: 38px;
    height: 38px;
    padding: 0 8px;
    border-radius: 10px;
    background: var(--ak-surface);
    color: var(--ak-ink);
    font-weight: 700;

    &:hover {
      background: var(--ak-soft);
      color: var(--ak-accent-dark);
    }
  }
  &__group {
    padding-top: 22px;

    h2 {
      font-size: 26px;
      margin-bottom: 12px;
      color: var(--ak-accent-dark);
    }
  }
  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px;
  }
  &__brand {
    display: block;
    padding: 12px 16px;
    border: 1px solid var(--ak-line);
    border-radius: 16px;

    img {
      width: 56px;
      height: 56px;
      object-fit: contain;
      border-radius: 10px;
    }
    .ak-search__letter {
      width: 56px;
      height: 56px;
      font-size: 22px;
    }
    b {
      display: block;
      color: var(--ak-ink);
      line-height: 1.25;
    }
    small {
      color: var(--ak-muted);
      font-size: 13px;
    }
    &:hover {
      border-color: var(--ak-accent);
    }
  }
  @media (max-width: 768px) {
    top: 120px;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;

    a {
      flex: none;
    }
  }
}
</style>
