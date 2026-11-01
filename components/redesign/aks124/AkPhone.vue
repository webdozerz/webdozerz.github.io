<script lang="ts" setup>
// Поле телефона: при фокусе сразу «+7 », дальше только цифры по маске +7 (XXX) XXX-XX-XX; «8…» и «7…» приводятся к +7.
const model = defineModel<string>({ default: '' })
const props = withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: '+7 (___) ___-__-__' })

const format = (raw: string) => {
  let d = raw.replace(/\D/g, '')
  // «+7 » уже стоит — его семёрку отрезаем; номер, вставленный целиком с 8 или 7, тоже
  if (raw.trim().startsWith('+7')) d = d.slice(1)
  else if (d.length === 11 && /^[78]/.test(d)) d = d.slice(1)
  d = d.slice(0, 10)
  let out = '+7 '
  if (d.length) out += `(${d.slice(0, 3)}`
  if (d.length >= 3) out += ') '
  if (d.length > 3) out += d.slice(3, 6)
  if (d.length > 6) out += `-${d.slice(6, 8)}`
  if (d.length > 8) out += `-${d.slice(8, 10)}`
  return out
}
const onFocus = (e: FocusEvent) => {
  if (!model.value) model.value = '+7 '
  const el = e.target as HTMLInputElement
  requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length))
}
const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  model.value = format(el.value)
  el.value = model.value
}
const onBlur = () => {
  if (model.value.replace(/\D/g, '').length <= 1) model.value = ''
}
</script>

<template>
  <input
    :value="model"
    type="tel"
    inputmode="tel"
    autocomplete="tel"
    :placeholder="props.placeholder"
    @focus="onFocus"
    @input="onInput"
    @blur="onBlur"
  />
</template>
