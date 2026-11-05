<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

useSeoMeta({ title: 'О компании «Золотые луга» | Концепт редизайна' })
const playing = ref(false)
const main = zlCompany.videos[0]
</script>

<template>
  <div class="zl-wrap zl-page zl-company">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span>О компании</span>
    </nav>
    <h1>О компании</h1>
    <p class="zl-page__lead">{{ zlCompany.lead }}</p>

    <div class="zl-company__nums">
      <div><b>с 1932</b><span>молочный комбинат в Ситниково</span></div>
      <div><b>800 т</b><span>молока в сутки может принять комбинат</span></div>
      <div><b>{{ zlOffices.length }}</b><span>филиалов и складов</span></div>
      <div><b>{{ zlAwardsTotal }}</b><span>наград продукции</span></div>
    </div>

    <div class="zl-company__grid">
      <div class="zl-company__text">
        <p v-for="t in zlCompany.text" :key="t">{{ t }}</p>
      </div>
      <aside class="zl-company__pure">
        <h2>Полезные молочные продукты в нашем понимании</h2>
        <ul>
          <li v-for="w in zlWithout" :key="w"><ZlIcon name="no" :size="22" />{{ w }}</li>
        </ul>
      </aside>
    </div>

    <blockquote class="zl-company__motto">
      <img :src="zlImg('b/clover.png')" alt="" width="150" height="120" />
      <p>{{ zlCompany.motto }}</p>
    </blockquote>

    <section class="zl-section">
      <div class="zl-head"><h2>Видео о компании</h2></div>
      <div class="zl-company__videos">
        <div class="zl-video__frame">
          <iframe
            v-if="playing"
            :src="'https://www.youtube-nocookie.com/embed/' + main.id + '?autoplay=1'"
            :title="main.title"
            allow="autoplay; encrypted-media"
            allowfullscreen
          />
          <button v-else type="button" class="zl-video__poster" :aria-label="main.title" @click="playing = true">
            <img :src="'https://i.ytimg.com/vi/' + main.id + '/hqdefault.jpg'" alt="" width="480" height="360" loading="lazy" />
            <span><ZlIcon name="play" :size="30" /></span>
          </button>
        </div>
        <ul>
          <li v-for="v in zlCompany.videos" :key="v.title">
            <a :href="v.id ? 'https://www.youtube.com/watch?v=' + v.id : zlContacts.social[2].url" target="_blank" rel="noopener">
              <ZlIcon name="play" :size="18" /><span>{{ v.title }}</span>
            </a>
          </li>
          <li>
            <a :href="zlContacts.social[2].url" target="_blank" rel="noopener" class="zl-link">Все видео на YouTube <ZlIcon name="external" :size="16" /></a>
          </li>
        </ul>
      </div>
    </section>

    <section class="zl-section zl-company__links">
      <NuxtLink :to="zlPath('/awards')" class="zl-panel">
        <ZlIcon name="award" :size="28" />
        <b>Награды</b><span>{{ zlAwardsTotal }} медалей и дипломов</span>
      </NuxtLink>
      <NuxtLink :to="zlPath('/vacancies')" class="zl-panel">
        <ZlIcon name="people" :size="28" />
        <b>Вакансии</b><span>{{ zlPlural(zlVacancies.length, 'вакансия', 'вакансии', 'вакансий') }} в 4 городах</span>
      </NuxtLink>
      <NuxtLink :to="zlPath('/info')" class="zl-panel">
        <ZlIcon name="doc" :size="28" />
        <b>Раскрытие информации</b><span>бухгалтерская отчётность</span>
      </NuxtLink>
    </section>
  </div>
</template>

<style lang="scss">
.zl-company {
  &__nums {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-top: 32px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 22px;
      border-radius: var(--zl-R);
      background: var(--zl-surface);
    }
    b {
      font-family: var(--zl-head);
      font-size: 34px;
      line-height: 1;
      color: var(--zl-accent);
    }
    span {
      font-size: 14px;
      color: var(--zl-muted);
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 48px;
    margin-top: 48px;
    align-items: start;
  }
  &__text {
    font-size: 17px;
    line-height: 1.65;
    p + p {
      margin-top: 16px;
    }
  }
  &__pure {
    position: relative;
    padding: 28px;
    border-radius: 24px;
    background: var(--zl-soft);
    overflow: hidden;
    h2 {
      font-size: 22px;
      max-width: 260px;
    }
    ul {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      li {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        color: var(--zl-ink);
        .zl-icon {
          color: var(--zl-accent);
        }
      }
    }
  }
  &__motto {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 48px;
    padding: 28px 32px;
    border-radius: 24px;
    border: 1px solid var(--zl-line);
    img {
      width: 72px;
      flex: none;
    }
    p {
      font-family: var(--zl-head);
      font-weight: 500;
      font-size: clamp(20px, 2.2vw, 28px);
      line-height: 1.3;
      color: var(--zl-ink);
    }
  }
  &__videos {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 32px;
    align-items: start;
    ul {
      display: flex;
      flex-direction: column;
      gap: 6px;
      a {
        display: flex;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--zl-surface);
        color: var(--zl-ink);
        font-weight: 500;
        .zl-icon {
          color: var(--zl-accent);
          margin-top: 2px;
        }
        &:hover {
          color: var(--zl-accent);
        }
        &.zl-link {
          background: none;
          color: var(--zl-accent);
        }
      }
    }
  }
  &__links {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    .zl-panel {
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: background 0.2s;
      .zl-icon {
        color: var(--zl-accent);
        margin-bottom: 6px;
      }
      b {
        font-family: var(--zl-head);
        font-size: 20px;
        color: var(--zl-ink);
      }
      span {
        color: var(--zl-muted);
        font-size: 14px;
      }
      &:hover {
        background: var(--zl-soft);
      }
    }
  }
}
@media (max-width: 1199px) {
  .zl-company__grid {
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 32px;
  }
}
@media (max-width: 989px) {
  .zl-company {
    &__nums {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    &__grid,
    &__videos {
      grid-template-columns: minmax(0, 1fr);
    }
    &__links {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
@media (max-width: 576px) {
  .zl-company {
    &__nums {
      gap: 10px;
      > div {
        padding: 16px;
      }
      b {
        font-size: 26px;
      }
    }
    &__text {
      font-size: 16px;
    }
    &__motto {
      flex-direction: column;
      align-items: flex-start;
      padding: 22px;
    }
  }
}
</style>
