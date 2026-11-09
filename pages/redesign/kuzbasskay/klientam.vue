<script lang="ts" setup>
import { kzCerts, kzDetails, kzGosts, kzImg, kzOrig } from '~/utils/kuzbasskay'
import { useKzUi } from '~/composables/useKuzbasskay'
import KzHead from '~/components/redesign/kuzbasskay/KzHead.vue'
import KzIcon from '~/components/redesign/kuzbasskay/KzIcon.vue'

useSeoMeta({ title: 'Клиентам — Кузбасская птицефабрика | Концепт редизайна' })
const ui = useKzUi()
const certs = kzCerts.map((c) => ({ img: c.img, cap: c.title }))
const copy = async () => {
  const text = kzDetails.map(([k, v]) => `${k}: ${v}`).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    ui.say('Реквизиты скопированы')
  } catch {
    ui.say('Не удалось скопировать — выделите текст вручную')
  }
}
const sections = [
  { id: 'rekvizity', t: 'Реквизиты' },
  { id: 'sertifikaty', t: 'Сертификаты' },
  { id: 'gosty', t: 'ГОСТы' },
  { id: 'sout', t: 'Специальная оценка условий труда' },
  { id: 'tarify', t: 'Тарифы водоотведение' },
]
</script>

<template>
  <div>
    <KzHead title="Клиентам" lead="Реквизиты для договора, сертификаты соответствия, стандарты и документы, которые предприятие раскрывает публично.">
      <nav class="kz-chips kz-secnav" aria-label="Разделы">
        <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="kz-chip">{{ s.t }}</a>
      </nav>
    </KzHead>

    <section id="rekvizity" class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-h2">
          <h2>Реквизиты</h2>
          <button type="button" class="kz-btn kz-btn--line kz-btn--sm" @click="copy"><KzIcon name="copy" :size="18" />Скопировать</button>
        </div>
        <div class="kz-panel kz-panel--white kz-tablewrap">
          <table class="kz-table kz-table--kv">
            <tbody>
              <tr v-for="d in kzDetails" :key="d[0]"><td>{{ d[0] }}</td><td>{{ d[1] }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="sertifikaty" class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-h2"><h2>Сертификаты</h2></div>
        <div class="kz-gallery kz-gallery--doc kz-certs">
          <button v-for="(c, i) in certs" :key="c.img" type="button" :aria-label="`Увеличить: ${c.cap}`" @click="ui.open('Сертификаты', certs, i)">
            <img :src="kzImg(c.img)" :alt="c.cap" width="1100" height="1555" loading="lazy" />
          </button>
        </div>
        <ul class="kz-certs__caps">
          <li v-for="c in certs" :key="c.img">{{ c.cap }}</li>
        </ul>
      </div>
    </section>

    <section id="gosty" class="kz-sec kz-sec--tight">
      <div class="kz-wrap">
        <div class="kz-h2"><h2>ГОСТы</h2></div>
        <div class="kz-docs">
          <div v-for="g in kzGosts" :key="g.code" class="kz-doc"><KzIcon name="shield" /><span><b>{{ g.code }}</b><small>{{ g.title }}</small></span></div>
        </div>
      </div>
    </section>

    <section class="kz-sec kz-sec--tight">
      <div class="kz-wrap kz-docs">
        <a id="sout" :href="kzOrig('/clients/sout/')" target="_blank" rel="noopener" class="kz-doc kz-doc--link">
          <KzIcon name="doc" /><span><b>Специальная оценка условий труда</b><small>сводные данные СОУТ, PDF — на сайте оригинала</small></span><KzIcon name="ext" :size="18" />
        </a>
        <a id="tarify" :href="kzOrig('/clients/tarif/')" target="_blank" rel="noopener" class="kz-doc kz-doc--link">
          <KzIcon name="doc" /><span><b>Тарифы водоотведение</b><small>документы DOCX и PDF — на сайте оригинала</small></span><KzIcon name="ext" :size="18" />
        </a>
      </div>
    </section>
    <div class="kz-sec kz-sec--tight" />
  </div>
</template>

<style lang="scss">
.kz-table--kv td:first-child {
  width: 200px;
  color: var(--kz-muted);
  font-weight: 700;

  @media (max-width: 576px) {
    width: 120px;
    white-space: normal;
  }
}
.kz-table--kv td:last-child {
  color: var(--kz-ink);
  font-weight: 700;
  overflow-wrap: anywhere;
}
.kz-certs {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 720px;
}
ol.kz-certs__caps,
ul.kz-certs__caps {
  display: grid;
  gap: 4px;
  margin-top: 12px;
  color: var(--kz-muted);
  font-size: 14px;
}
.kz-docs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;

  @media (max-width: 375px) {
    grid-template-columns: minmax(0, 1fr);
  }
}
.kz-doc {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: var(--kz-surface);
  color: var(--kz-green);

  span {
    display: grid;
    line-height: 1.3;
  }
  b {
    color: var(--kz-ink);
    font-weight: 800;
  }
  small {
    color: var(--kz-muted);
    font-size: 14px;
  }
  &--link:hover b {
    color: var(--kz-accent-ink);
  }
}
</style>
