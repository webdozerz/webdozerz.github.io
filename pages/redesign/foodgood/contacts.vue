<script lang="ts" setup>
import PageHead from '~/components/redesign/foodgood/PageHead.vue'
import Messengers from '~/components/redesign/foodgood/Messengers.vue'

useSeoMeta({ title: 'Контакты | FoodGood Tomsk' })
</script>

<template>
  <div>
    <PageHead
      title="Контакты"
      lead="Магазин здоровой еды в центре Томска. Приезжайте за покупками или пишите в мессенджер."
    />

    <div class="fg-container layout">
      <section class="panel">
        <h2>Как нас найти</h2>
        <dl class="rows">
          <div>
            <dt>Адрес</dt>
            <dd>
              {{ fgContacts.address }}
              <small>({{ fgContacts.addressNote }})</small>
            </dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd>
              <a :href="fgContacts.phoneHref">{{ fgContacts.phone }}</a>
            </dd>
          </div>
          <div>
            <dt>Часы работы</dt>
            <dd>
              Ежедневно, 11:00–20:00
              <NuxtLink :to="fgPath('/schedule')" class="inline-link">Подробнее</NuxtLink>
            </dd>
          </div>
          <div>
            <dt>Продавец</dt>
            <dd>{{ fgContacts.owner }}</dd>
          </div>
        </dl>
        <a :href="fgContacts.mapHref" target="_blank" rel="noopener" class="map-btn">
          Открыть на Яндекс Картах
        </a>
      </section>

      <section class="panel panel--leaf">
        <h2>Мессенджеры и соцсети</h2>
        <p>Напишите нам в любой удобный мессенджер, мы ответим и поможем собрать заказ.</p>
        <Messengers />
        <p class="hint">
          В WhatsApp можно попросить добавить вас в группу для заказа продукции.
        </p>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 36px;
  border-radius: 28px;
  background: var(--fg-paper);
  border: 1px solid var(--fg-line);

  h2 {
    font-size: 30px;
  }

  p {
    color: var(--fg-muted);
  }

  &--leaf {
    background: var(--fg-leaf-soft);
    border-color: transparent;
  }
}

.rows {
  width: 100%;
  margin: 0;

  > div {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid var(--fg-line);
  }

  dt {
    color: var(--fg-muted);
  }

  dd {
    margin: 0;
    font-weight: 700;

    small {
      display: block;
      font-weight: 500;
      color: var(--fg-muted);
    }

    a:hover {
      color: var(--fg-leaf);
    }
  }
}

.inline-link {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--fg-leaf);
  text-decoration: underline;
}

.map-btn {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  background: var(--fg-forest);
  color: #fff;
  font-weight: 700;

  &:hover {
    background: var(--fg-forest-2);
  }
}

.hint {
  font-size: 14px;
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .panel {
    padding: 24px;
  }
}

@media (max-width: 520px) {
  .rows > div {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
