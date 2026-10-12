<script setup lang="ts">
import { contacts } from '~/data/profile'

type Command = {
  id: string
  group: string
  label: string
  hint?: string
  run: () => void
}

const ui = useHomeUi()
const { paletteOpen, terminalOpen } = ui
const router = useRouter()

const query = ref('')
const cursor = ref(0)
const input = ref<HTMLInputElement>()

const open = (href: string) => window.open(href, '_blank', 'noopener')

const commands = computed<Command[]>(() => [
  { id: 'experience', group: 'Разделы', label: 'Опыт работы', run: () => ui.scrollTo('experience') },
  { id: 'projects', group: 'Разделы', label: 'Проекты', run: () => ui.scrollTo('projects') },
  { id: 'skills', group: 'Разделы', label: 'Навыки и образование', run: () => ui.scrollTo('skills') },
  { id: 'contact', group: 'Разделы', label: 'Контакты', run: () => ui.scrollTo('contact') },
  { id: 'email', group: 'Связаться', label: 'Скопировать email', hint: contacts.email, run: ui.copyEmail },
  { id: 'tg', group: 'Связаться', label: 'Написать в Telegram', hint: contacts.telegramHandle, run: () => open(contacts.telegram) },
  { id: 'gh', group: 'Связаться', label: 'Открыть GitHub', run: () => open(contacts.github) },
  { id: 'effort', group: 'Инструменты', label: 'Калькулятор трудозатрат', run: () => router.push('/effort') },
  { id: 'ipr', group: 'Инструменты', label: 'План развития фронтендера', run: () => router.push('/ipr') },
  { id: 'peas', group: 'Инструменты', label: '20 горошин', hint: 'техника от тревоги', run: () => router.push('/peas') },
  {
    id: 'theme',
    group: 'Настройки',
    label: ui.theme.value === 'dark' ? 'Светлая тема' : 'Тёмная тема',
    run: ui.toggleTheme,
  },
  { id: 'terminal', group: 'Настройки', label: 'Открыть консоль', hint: '~', run: () => (terminalOpen.value = true) },
  { id: 'blueprint', group: 'Настройки', label: 'Режим чертежа', hint: '↑↑↓↓←→←→BA', run: ui.toggleBlueprint },
  {
    id: 'pet',
    group: 'Настройки',
    label: ui.petVisible.value ? 'Спрятать кота' : 'Позвать кота',
    hint: 'Пиксель',
    run: ui.togglePet,
  },
])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q)
    return commands.value
  return commands.value.filter(c =>
    `${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase().includes(q),
  )
})

const groups = computed(() => {
  const map = new Map<string, Command[]>()
  for (const command of filtered.value) {
    if (!map.has(command.group))
      map.set(command.group, [])
    map.get(command.group)!.push(command)
  }
  return [...map.entries()]
})

watch(query, () => (cursor.value = 0))

watch(paletteOpen, async (value) => {
  if (!value)
    return
  query.value = ''
  cursor.value = 0
  await nextTick()
  input.value?.focus()
})

function close() {
  paletteOpen.value = false
}

function execute(command?: Command) {
  if (!command)
    return
  close()
  command.run()
}

function onKeydown(event: KeyboardEvent) {
  const total = filtered.value.length
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    cursor.value = total ? (cursor.value + 1) % total : 0
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    cursor.value = total ? (cursor.value - 1 + total) % total : 0
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    execute(filtered.value[cursor.value])
  }
  else if (event.key === 'Escape') {
    close()
  }
}

function indexOf(command: Command) {
  return filtered.value.indexOf(command)
}
</script>

<template>
  <Transition name="palette">
    <div v-if="paletteOpen" class="overlay" @click.self="close">
      <div class="palette" role="dialog" aria-label="Палитра команд" @keydown="onKeydown">
        <div class="palette__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            ref="input"
            v-model="query"
            class="palette__input"
            placeholder="Куда перейти или что сделать?"
            aria-label="Поиск команды"
          >
          <kbd class="palette__esc mono">Esc</kbd>
        </div>

        <div class="palette__list">
          <div v-for="[group, items] in groups" :key="group" class="palette__group">
            <p class="palette__group-title mono">
              {{ group }}
            </p>
            <button
              v-for="command in items"
              :key="command.id"
              type="button"
              class="item"
              :class="{ 'item--active': indexOf(command) === cursor }"
              @mousemove="cursor = indexOf(command)"
              @click="execute(command)"
            >
              <span>{{ command.label }}</span>
              <span class="item__meta">
                <span v-if="command.hint" class="item__hint mono">{{ command.hint }}</span>
                <kbd class="item__enter mono" aria-hidden="true">↵</kbd>
              </span>
            </button>
          </div>
          <p v-if="!filtered.length" class="palette__empty">
            Ничего не нашлось. Попробуйте «sudo» в консоли.
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 14vh 16px 16px;
  background: var(--h-overlay);
  backdrop-filter: blur(2px);
}

.palette {
  width: 100%;
  max-width: 560px;
  border: 1px solid var(--h-line-strong);
  border-radius: 14px;
  background: var(--h-raised);
  box-shadow: var(--h-shadow);
  overflow: hidden;

  &__search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    border-bottom: 1px solid var(--h-line);

    svg {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      fill: none;
      stroke: var(--h-muted);
      stroke-width: 1.6;
      stroke-linecap: round;
    }
  }

  &__input {
    &:focus-visible {
      outline: none;
    }

    flex-grow: 1;
    height: 52px;
    border: 0;
    outline: 0;
    background: none;
    color: var(--h-text);
    font: inherit;
    font-size: 16px;

    &::placeholder {
      color: var(--h-faint);
    }
  }

  &__esc {
    padding: 2px 6px;
    border: 1px solid var(--h-line);
    border-radius: 5px;
    color: var(--h-faint);
    font-size: 11px;
  }

  &__list {
    max-height: min(420px, 60vh);
    padding: 6px;
    overflow-y: auto;
  }

  &__group-title {
    margin: 10px 10px 4px;
    color: var(--h-faint);
    font-size: 11px;
  }

  &__empty {
    margin: 0;
    padding: 24px 10px;
    color: var(--h-muted);
    font-size: 14px;
    text-align: center;
  }
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: none;
  color: var(--h-muted);
  font: inherit;
  font-size: 14.5px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.12s, color 0.12s, border-color 0.12s;

  &--active {
    border-color: color-mix(in srgb, var(--h-text) 9%, transparent);
    background: color-mix(in srgb, var(--h-text) 7%, transparent);
    color: var(--h-text);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__hint {
    color: var(--h-faint);
    font-size: 12px;
  }

  &__enter {
    display: grid;
    place-items: center;
    width: 22px;
    height: 20px;
    border: 1px solid var(--h-line-strong);
    border-radius: 5px;
    color: var(--h-accent);
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.12s;
  }

  &--active &__enter {
    opacity: 1;
  }
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.15s;

  .palette {
    transition: transform 0.15s;
  }
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;

  .palette {
    transform: scale(0.98);
  }
}
</style>
