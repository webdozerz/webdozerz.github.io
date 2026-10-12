<script setup lang="ts">
import { contacts, jobs, petProjects, profile, skills } from '~/data/profile'

type Line = { kind: 'in' | 'out' | 'err' | 'accent', text: string, href?: string }

const ui = useHomeUi()
const { terminalOpen } = ui
const router = useRouter()

const PROMPT = 'guest@andryushov:~$'
const pages: Record<string, string> = {
  effort: '/effort',
  ipr: '/ipr',
  peas: '/peas',
  redesign: '/redesign',
}

const lines = ref<Line[]>([])
const value = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)
const input = ref<HTMLInputElement>()
const screen = ref<HTMLElement>()

const out = (text: string, kind: Line['kind'] = 'out', href?: string) => lines.value.push({ kind, text, href })

function greet() {
  lines.value = []
  out('andryushov.sh — интерактивное резюме', 'accent')
  out('Введите help, чтобы увидеть команды. Tab дополняет, ↑ листает историю, Esc закрывает.')
}

function tomskTime() {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Tomsk',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date())
}

const commands: Record<string, { help?: string, run: (args: string[]) => void }> = {
  help: {
    help: 'список команд',
    run: () => {
      for (const [name, cmd] of Object.entries(commands)) {
        if (cmd.help)
          out(`  ${name.padEnd(12)} ${cmd.help}`)
      }
      out('  …и несколько команд без описания.', 'accent')
    },
  },
  whoami: {
    help: 'кто я',
    run: () => out(`${profile.firstName} ${profile.lastName} — ${profile.role.toLowerCase()} (${profile.grade}), ${profile.city}. ${profile.stackLine}.`),
  },
  about: {
    help: 'коротко о работе',
    run: () => {
      out(profile.lead)
      out(profile.about)
    },
  },
  experience: {
    help: 'опыт работы',
    run: () => {
      for (const job of jobs) {
        out(`${job.period.padEnd(20)} ${job.company} — ${job.role}`, 'accent')
        for (const project of job.projects ?? [])
          out(`  · ${project.title}`)
      }
    },
  },
  projects: {
    help: 'пет-проекты',
    run: () => {
      for (const project of petProjects) {
        const link = project.links[0]
        out(`  ${project.title.padEnd(26)} ${project.kind}`, 'out', link && !link.internal ? link.href : undefined)
      }
    },
  },
  skills: {
    help: 'навыки',
    run: () => {
      for (const row of skills)
        out(`  ${row.area.padEnd(18)} ${row.items}`)
    },
  },
  contact: {
    help: 'как связаться',
    run: () => {
      out(`  email     ${contacts.email}`, 'out', `mailto:${contacts.email}`)
      out(`  telegram  ${contacts.telegramHandle}`, 'out', contacts.telegram)
      out(`  github    ${contacts.github}`, 'out', contacts.github)
    },
  },
  ls: {
    help: 'файлы и страницы',
    run: (args) => {
      if (args.includes('-a') || args.includes('-la'))
        out('.  ..  .secrets  resume.txt  effort/  ipr/  peas/  redesign/')
      else
        out('resume.txt  effort/  ipr/  peas/  redesign/')
    },
  },
  cat: {
    help: 'показать файл',
    run: ([file]) => {
      if (file === 'resume.txt') {
        commands.whoami.run([])
        out('Полная версия — прокрутите страницу вниз или введите experience.')
      }
      else if (file === '.secrets') {
        out('1. Первый коммит в этот репозиторий — сентябрь 2018.')
        out('2. В /peas можно правда успокоиться за 20 горошин.')
        out('3. Попробуйте Konami-код на странице: ↑↑↓↓←→←→BA.')
      }
      else {
        out(`cat: ${file ?? ''}: нет такого файла`, 'err')
      }
    },
  },
  open: {
    help: 'открыть страницу: open effort',
    run: ([name]) => {
      const path = pages[(name ?? '').replace(/\/$/, '')]
      if (!path)
        return out(`open: страница не найдена. Есть: ${Object.keys(pages).join(', ')}`, 'err')
      terminalOpen.value = false
      router.push(path)
    },
  },
  theme: {
    help: 'theme light | dark',
    run: ([mode]) => {
      if (mode === 'light' || mode === 'dark')
        ui.setTheme(mode)
      else
        ui.toggleTheme()
      out(`Тема: ${ui.theme.value === 'dark' ? 'тёмная' : 'светлая'}`)
    },
  },
  date: {
    help: 'время в Томске',
    run: () => out(tomskTime()),
  },
  echo: { run: args => out(args.join(' ')) },
  clear: { help: 'очистить экран', run: () => (lines.value = []) },
  history: { run: () => history.value.forEach((cmd, i) => out(`  ${String(i + 1).padStart(3)}  ${cmd}`)) },
  exit: { help: 'закрыть консоль', run: () => (terminalOpen.value = false) },
  sudo: {
    run: (args) => {
      const rest = args.join(' ')
      if (/rm\s+-rf/.test(rest))
        return out('Отказано. Это продакшен, тут так не принято.', 'err')
      if (rest.startsWith('hire')) {
        out('[sudo] пароль для guest: ********')
        out('Доступ разрешён. Осталось написать в Telegram:', 'accent')
        out(`  ${contacts.telegram}`, 'out', contacts.telegram)
        return
      }
      out('guest не входит в группу sudoers. Попробуйте sudo hire-me.', 'err')
    },
  },
  blueprint: { run: () => ui.toggleBlueprint() },
  vim: { run: () => out('Не надо. Выйти отсюда проще: exit.') },
  nano: { run: () => commands.vim.run([]) },
  npm: {
    run: ([sub]) => {
      if (sub === 'i' || sub === 'install')
        out('added 1 frontend developer, 0 vulnerabilities')
      else
        out('npm: попробуйте npm install', 'err')
    },
  },
  git: {
    run: ([sub]) => {
      if (sub !== 'log')
        return out('git: доступна только команда log', 'err')
      out('a1f3c9e feat(terminal): pro-терминал на dockview')
      out('7b20d4e feat(admin): автообновление таблиц с учётом видимости вкладки')
      out('c94e1aa ci: тесты в 3 параллельных шардах')
      out('e05b7f2 chore(starter-kit): скиллы для AI-агентов')
      out('…ещё около 3 000 коммитов за год')
    },
  },
  coffee: {
    run: () => {
      out('   ( (')
      out('    ) )')
      out('  ........')
      out('  |      |]')
      out('  \\      /')
      out('   `----\'   Перерыв на кофе засчитан.')
    },
  },
}

function execute() {
  const raw = value.value.trim()
  value.value = ''
  historyIndex.value = -1
  out(`${PROMPT} ${raw}`, 'in')
  if (!raw)
    return
  history.value.push(raw)
  const [name, ...args] = raw.split(/\s+/)
  const command = commands[name!.toLowerCase()]
  if (command)
    command.run(args)
  else
    out(`команда не найдена: ${name}. Введите help.`, 'err')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    execute()
  }
  else if (event.key === 'Escape') {
    terminalOpen.value = false
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!history.value.length)
      return
    historyIndex.value = historyIndex.value < 0 ? history.value.length - 1 : Math.max(0, historyIndex.value - 1)
    value.value = history.value[historyIndex.value] ?? ''
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (historyIndex.value < 0)
      return
    historyIndex.value += 1
    if (historyIndex.value >= history.value.length) {
      historyIndex.value = -1
      value.value = ''
    }
    else {
      value.value = history.value[historyIndex.value] ?? ''
    }
  }
  else if (event.key === 'Tab') {
    event.preventDefault()
    const matches = Object.keys(commands).filter(name => name.startsWith(value.value.trim()))
    if (matches.length === 1)
      value.value = `${matches[0]} `
    else if (matches.length > 1)
      out(matches.join('  '))
  }
  else if (event.key === 'l' && event.ctrlKey) {
    event.preventDefault()
    lines.value = []
  }
}

watch(lines, async () => {
  await nextTick()
  screen.value?.scrollTo({ top: screen.value.scrollHeight })
}, { deep: true })

watch(terminalOpen, async (open) => {
  if (!open)
    return
  if (!lines.value.length)
    greet()
  await nextTick()
  input.value?.focus()
})
</script>

<template>
  <Transition name="terminal">
    <div v-if="terminalOpen" class="overlay" @click.self="terminalOpen = false">
      <div class="terminal mono" role="dialog" aria-label="Консоль" @click="input?.focus()">
        <div class="terminal__bar">
          <span>andryushov.sh</span>
          <button type="button" class="terminal__close" aria-label="Закрыть консоль" @click.stop="terminalOpen = false">
            esc
          </button>
        </div>
        <div ref="screen" class="terminal__screen">
          <p v-for="(line, i) in lines" :key="i" class="line" :class="`line--${line.kind}`">
            <a v-if="line.href" :href="line.href" target="_blank" rel="noopener">{{ line.text }}</a>
            <template v-else>
              {{ line.text }}
            </template>
          </p>
          <label class="prompt">
            <span class="prompt__label">{{ PROMPT }}</span>
            <input
              ref="input"
              v-model="value"
              class="prompt__input"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              aria-label="Команда"
              @keydown="onKeydown"
            >
          </label>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: var(--h-overlay);
}

.terminal {
  display: flex;
  flex-direction: column;
  height: min(460px, 70vh);
  border-bottom: 1px solid var(--h-line-strong);
  background: var(--h-term-bg);
  color: var(--h-term-text);
  font-size: 13px;
  box-shadow: var(--h-shadow);

  &__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid var(--h-term-line);
    color: var(--h-term-dim);
    font-size: 12px;
  }

  &__close {
    padding: 2px 6px;
    border: 1px solid var(--h-term-line);
    border-radius: 4px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:hover {
      color: var(--h-term-text);
    }
  }

  &__screen {
    flex-grow: 1;
    padding: 12px 16px 16px;
    overflow-y: auto;
  }
}

.line {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;

  &--in {
    color: var(--h-term-dim);
  }

  &--err {
    color: var(--h-down);
  }

  &--accent {
    color: var(--h-term-accent);
  }

  a {
    color: inherit;
    text-underline-offset: 3px;

    &:hover {
      color: var(--h-term-accent);
    }
  }
}

.prompt {
  display: flex;
  gap: 8px;
  line-height: 1.6;

  &__label {
    flex-shrink: 0;
    color: var(--h-term-accent);
  }

  &__input {
    &:focus-visible {
      outline: none;
    }

    flex-grow: 1;
    min-width: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: none;
    color: inherit;
    font: inherit;
    caret-color: var(--h-term-accent);
  }
}

.terminal-enter-active,
.terminal-leave-active {
  transition: opacity 0.18s;

  .terminal {
    transition: transform 0.18s ease-out;
  }
}

.terminal-enter-from,
.terminal-leave-to {
  opacity: 0;

  .terminal {
    transform: translateY(-24px);
  }
}

@media (max-width: 600px) {
  .prompt__label {
    display: none;
  }
}
</style>
