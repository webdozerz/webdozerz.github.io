<script lang="ts" setup>
import { kzAboutText, kzAwards, kzDate, kzDivisions, kzEvents, kzImg, kzNumbers, kzPath } from '~/utils/kuzbasskay'
import { useKzUi } from '~/composables/useKuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'О фабрике — Кузбасская птицефабрика | Концепт редизайна' })
const ui = useKzUi()

// Архив событий: у оригинала 4 страницы с номерами; здесь — фильтр и постраничный вывод на выборке
const kind = ref<'all' | 'дело' | 'праздник'>('all')
const page = ref(1)
const PER = 4
const list = computed(() => kzEvents.filter((e) => kind.value === 'all' || e.kind === kind.value))
const pages = computed(() => Math.max(1, Math.ceil(list.value.length / PER)))
const shown = computed(() => list.value.slice((page.value - 1) * PER, page.value * PER))
watch(kind, () => (page.value = 1))
const awards = kzAwards.map((img, i) => ({ img, cap: `Награда ${i + 1}` }))
</script>

<template>
  <div>
    <KzHead title="О фабрике" lead="Предприятие яичного и мясного направления на юге Кемеровской области, в посёлке Степной Новокузнецкого района." />

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-intro">
        <div class="kz-prose">
          <p v-for="t in kzAboutText" :key="t">{{ t }}</p>
          <h3 class="kz-about2__h">Структура предприятия</h3>
          <ul class="kz-checks">
            <li v-for="d in kzDivisions" :key="d"><KzIcon name="check" :size="18" /><span>{{ d }}</span></li>
          </ul>
          <p>Специализируется предприятие на высокопродуктивных кроссах несушек Декалб Уайт и Хайсекс Браун. С 2013 года действует система безопасности пищевой продукции на принципах ХАССП (ГОСТ Р ИСО 22000).</p>
        </div>
        <ul class="kz-nums kz-about2__nums">
          <li v-for="n in kzNumbers" :key="n.n"><b>{{ n.n }}</b><span>{{ n.t }}</span></li>
        </ul>
      </div>
    </section>

    <section id="nagrady" class="kz-sec kz-sec--surface">
      <div class="kz-wrap">
        <div class="kz-h2">
          <div>
            <h2>Награды</h2>
            <p>Дипломы и медали выставок с 2001 года. Нажмите, чтобы рассмотреть.</p>
          </div>
        </div>
        <div class="kz-gallery kz-gallery--doc">
          <button v-for="(a, i) in awards" :key="a.img" type="button" :aria-label="`Увеличить: ${a.cap}`" @click="ui.open('Награды', awards, i)">
            <img :src="kzImg(a.img)" :alt="a.cap" width="500" height="683" loading="lazy" />
          </button>
        </div>
      </div>
    </section>

    <section id="sobytiya" class="kz-sec">
      <div class="kz-wrap">
        <div class="kz-h2">
          <h2>Архив событий</h2>
          <div class="kz-seg kz-seg--soft" role="group" aria-label="Показать">
            <button type="button" :class="{ 'is-on': kind === 'all' }" @click="kind = 'all'">Все</button>
            <button type="button" :class="{ 'is-on': kind === 'дело' }" @click="kind = 'дело'">Новости</button>
            <button type="button" :class="{ 'is-on': kind === 'праздник' }" @click="kind = 'праздник'">Поздравления</button>
          </div>
        </div>
        <ul class="kz-events">
          <li v-for="e in shown" :key="e.date">
            <time :datetime="e.date">{{ kzDate(e.date) }}</time>
            <b>{{ e.title }}</b>
            <span class="kz-events__kind" :class="{ 'is-news': e.kind === 'дело' }">{{ e.kind === 'дело' ? 'Новость' : 'Поздравление' }}</span>
          </li>
        </ul>
        <nav v-if="pages > 1" class="kz-pager" aria-label="Страницы">
          <button type="button" :disabled="page === 1" aria-label="Назад" @click="page--"><KzIcon name="left" :size="18" /></button>
          <button v-for="n in pages" :key="n" type="button" :class="{ 'is-on': n === page }" @click="page = n">{{ n }}</button>
          <button type="button" :disabled="page === pages" aria-label="Вперёд" @click="page++"><KzIcon name="right" :size="18" /></button>
        </nav>
        <p class="kz-note">В концепте — выборка из архива оригинала (около 22 записей на 4 страницах). <NuxtLink :to="kzPath('/proizvodstvo')">Производство →</NuxtLink></p>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.kz-about2__h {
  margin: 24px 0 12px;
  font-size: 20px;
  font-weight: 900;
}
.kz-about2__nums {
  position: sticky;
  top: 80px;
}
ul.kz-events {
  display: grid;
  border: 1px solid var(--kz-line);
  border-radius: var(--kz-R);

  li {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--kz-line);

    &:last-child {
      border-bottom: 0;
    }
    @media (max-width: 576px) {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 4px 12px;

      b {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }
  }
  time {
    color: var(--kz-muted);
    font-size: 14px;
    font-weight: 700;
  }
  b {
    color: var(--kz-ink);
    font-weight: 800;
    line-height: 1.35;
  }
}
.kz-events__kind {
  padding: 3px 10px;
  border-radius: 8px;
  background: var(--kz-surface);
  color: var(--kz-muted);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;

  &.is-news {
    background: var(--kz-green-soft);
    color: var(--kz-green);
  }
}
</style>
