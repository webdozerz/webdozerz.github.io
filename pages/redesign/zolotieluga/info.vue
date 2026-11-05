<script lang="ts" setup>
import ZlIcon from '~/components/redesign/zolotieluga/ZlIcon.vue'

useSeoMeta({ title: 'Раскрытие информации — АО «Золотые луга» | Концепт редизайна' })
const email = ref('')
const agree = ref(false)
const done = ref(false)
const submit = () => {
  if (!email.value.trim() || !agree.value) return
  done.value = true
}
</script>

<template>
  <div class="zl-wrap zl-page zl-info">
    <nav class="zl-crumbs" aria-label="Навигация">
      <span><NuxtLink :to="zlPath('/')">Главная</NuxtLink></span>
      <span><NuxtLink :to="zlPath('/company')">О компании</NuxtLink></span>
      <span>Раскрытие информации</span>
    </nav>
    <h1>Раскрытие информации</h1>
    <p class="zl-page__lead">В этом разделе АО «Золотые луга» предоставляет информацию о своей деятельности.</p>

    <div class="zl-info__grid">
      <ul class="zl-info__docs">
        <li v-for="d in zlInfoDocs" :key="d"><ZlIcon name="doc" :size="22" /><span>{{ d }}</span><ZlIcon name="lock" :size="18" /></li>
      </ul>
      <div class="zl-panel zl-info__access">
        <h2>Доступ к документам</h2>
        <p>Информация распространяется на платной основе. Стоимость получения доступа — <b>100 рублей</b>.</p>
        <form v-if="!done" @submit.prevent="submit">
          <label class="zl-field">Ваш email<input v-model="email" type="email" required autocomplete="email" /></label>
          <label class="zl-info__agree"><input v-model="agree" type="checkbox" required /> Подтверждаю согласие с условиями оказания услуг</label>
          <button type="submit" class="zl-btn zl-btn--main" :disabled="!agree">Получить доступ</button>
        </form>
        <div v-else class="zl-info__done">
          <ZlIcon name="check" :size="24" />
          <p>На сайте здесь откроется оплата картой, а ссылка на документы придёт на {{ email }}. В концепте оплата не проводится.</p>
        </div>
        <span class="zl-demo"><ZlIcon name="lock" :size="14" /> Демо: оплата не подключена</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.zl-info {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 40px;
    margin-top: 32px;
    align-items: start;
  }
  ul.zl-info__docs {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--zl-line);
    border-radius: var(--zl-R);
    li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      font-weight: 500;
      color: var(--zl-ink);
      span {
        flex: 1;
      }
      .zl-icon:first-child {
        color: var(--zl-accent);
      }
      .zl-icon:last-child {
        color: var(--zl-muted);
      }
      & + li {
        border-top: 1px solid var(--zl-line);
      }
    }
  }
  &__access {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    h2 {
      font-size: 24px;
    }
    form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .zl-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  &__agree {
    display: flex;
    gap: 10px;
    font-size: 14px;
    input {
      width: 18px;
      height: 18px;
      accent-color: var(--zl-accent);
      flex: none;
      margin-top: 2px;
    }
  }
  &__done {
    display: flex;
    gap: 10px;
    .zl-icon {
      color: var(--zl-grass);
    }
  }
}
@media (max-width: 989px) {
  .zl-info__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
