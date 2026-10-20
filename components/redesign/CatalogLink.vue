<script lang="ts" setup>
// Ссылка на концепт из каталога. Статичные концепты рисуем только в браузере,
// чтобы краулер Nuxt не пытался их prerender-ить; на сервере вместо ссылки — span.
defineOptions({ inheritAttrs: false })
defineProps<{ to: string, plain?: boolean }>()
</script>

<template>
  <ClientOnly v-if="plain">
    <a :href="to" v-bind="$attrs"><slot /></a>
    <template #fallback>
      <span v-bind="$attrs"><slot /></span>
    </template>
  </ClientOnly>
  <NuxtLink v-else :to="to" v-bind="$attrs">
    <slot />
  </NuxtLink>
</template>
