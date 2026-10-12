<script setup lang="ts">
// Пиксель — кот, который гуляет по шапке между навигацией и кнопками.
// На некоторые клики появляется предмет: клубок, баг, рыбка или коробка.

type Mode = 'walk' | 'sit' | 'sleep' | 'box'
type ItemKind = 'yarn' | 'bug' | 'fish' | 'box'

type Item = {
  kind: ItemKind
  x: number
  y: number
  vx: number
  vy: number
  landed: boolean
}

// Спрайты кота 16×10, смотрит вправо. x — шерсть, e — глаза, n — нос, z — закрытые глаза.
const SPRITES: Record<string, string[]> = {
  walk1: [
    '..........x...x.',
    '..........xx.xx.',
    'x.........xxxxx.',
    'x.........xexex.',
    '.x........xxnxx.',
    '.x.xxxxxxxxxxx..',
    '..xxxxxxxxxxxx..',
    '..xxxxxxxxxxx...',
    '..x.x.....x.x...',
    '..x.x.....x.x...',
  ],
  walk2: [
    '..........x...x.',
    '..........xx.xx.',
    '.x........xxxxx.',
    'x.........xexex.',
    'x.........xxnxx.',
    '.x.xxxxxxxxxxx..',
    '..xxxxxxxxxxxx..',
    '..xxxxxxxxxxx...',
    '...xx.....xx....',
    '...xx.....xx....',
  ],
  sit: [
    '..........x...x.',
    '..........xx.xx.',
    '..........xxxxx.',
    '..........xexex.',
    '..........xxnxx.',
    '.........xxxxxx.',
    '........xxxxxxx.',
    '.x......xxxxxxx.',
    '.x.....xxxxxxxx.',
    '..xxxxxxxxx.xx..',
  ],
  sleep: [
    '................',
    '................',
    '................',
    '................',
    '................',
    '...........x.x..',
    '....xxxxxx.xxx..',
    '..xxxxxxxxxxxxx.',
    '.xxxxxxxxxxzxzx.',
    'xxxxxxxxxxxxxxx.',
  ],
  box: [
    '......x...x.....',
    '......xx.xx.....',
    '......xxxxx.....',
    '......xexex.....',
    '.bb...xxnxx...bb',
    '..bbbbbbbbbbbbb.',
    '..bbbbbbdbbbbbb.',
    '..bbbbbbdbbbbbb.',
    '..bbbbbbdbbbbbb.',
    '..bbbbbbbbbbbbb.',
  ],
}

// Предметы. y — светлая нить клубка, a — клубок, r — панцирь жука, k — тёмные детали,
// f — рыбка, b/d — картон и скотч коробки.
const ITEMS: Record<ItemKind, string[]> = {
  yarn: [
    '..aaa..',
    '.ayaaa.',
    'aayayaa',
    'ayaaaya',
    'aaayaaa',
    '.aaaya.',
    '..aaa..',
  ],
  bug: [
    '.k...k.',
    '..kkk..',
    '.rrkrr.',
    'krrkrrk',
    '.rrkrr.',
    'k.rrr.k',
  ],
  fish: [
    '..ffff..f',
    '.ffffffff',
    'fkffffff.',
    '.ffffffff',
    '..ffff..f',
  ],
  box: [
    '.bb.........bb',
    '..bbbbbbbbbbb.',
    '..bbbbbdbbbbb.',
    '..bbbbbdbbbbb.',
    '..bbbbbdbbbbb.',
    '..bbbbbbbbbbb.',
  ],
}

const PHRASES = [
  'Мяу. Я тут отвечаю за UI.',
  'Нажми ⌘K — там всё самое нужное.',
  'Попробуй клавишу ~. Только никому.',
  'Код-ревью пройдено: мур.',
  'Не деплой в пятницу. Это я как кот говорю.',
  'У меня 9 жизней и 0 упавших тестов.',
  'Мяу — значит «напиши Илье в Telegram».',
  '3 000 коммитов за год. Я видел каждый.',
  'Я пиксельный, но ловлю баги по-настоящему.',
  'TypeScript strict? Мур, одобряю.',
  'any в коде? Шшш!',
  'Я сплю 16 часов в сутки. Остальное — код-ревью.',
  'Стакан обновляется по WebSocket. Я проверял лапой.',
  'Прод упал? Не я. Я лежал на клавиатуре.',
  'Мяу в 4K. Ну, почти в 16×10.',
  'Сначала тесты, потом кормить кота. Или наоборот.',
  'Я тоже Middle+. Middle+ по мурчанию.',
  'Шёл по шапке, нашёл баг. Шучу, его тут нет.',
  'Сломал вёрстку? Нет, это я тут прилёг.',
  'Конами-код знаешь? ↑↑↓↓←→←→BA.',
  'Тёмная тема — лучшая тема. Как ночь для охоты.',
  'console.log(\'мяу\')',
  'git push --force? Только через мой труп. Пиксельный.',
  'Мурлычу на частоте 60 fps.',
  'Илья написал UI-кит из 31 компонента. Я бы сделал 32.',
  'Покорми меня звёздочкой на GitHub.',
  'Vue или React? Мяу. Вопрос закрыт.',
  'Я не ленюсь. Я жду, пока резолвится промис.',
  'Работаю удалённо: с подоконника.',
  'Если долго смотреть в шапку, шапка посмотрит на тебя.',
  'Это не баг, это кот.',
  'Мой любимый хук — onMounted. Сразу видно, кто пришёл.',
  'Зачем мышь, если есть я?',
  'Задача оценена в 3 сторипоинта и 2 вкусняшки.',
  'В консоли есть команда sudo hire-me. Намёк понял?',
]

const EVENT_LINES: Record<ItemKind, { start: string, done: string[] }> = {
  yarn: {
    start: 'Клубок!',
    done: ['Поймал! Клубок мой.', 'Распутаю к следующему спринту.', 'Нитки — это просто очень длинные строки.'],
  },
  bug: {
    start: 'Ой, баг!',
    done: ['Баг пойман. Закрываю задачу в Jira.', 'Минус один баг. Осталось… не скажу.', 'Пойман и покрыт тестом.'],
  },
  fish: {
    start: 'Рыбка?!',
    done: ['Ням. Лучше любого бонуса.', 'Рыбка! Код-ревью одобрено.', 'Спасибо. Теперь могу работать до вечера.'],
  },
  box: {
    start: 'Коробка!',
    done: ['If I fits, I sits.', 'Коробка — лучший деплой-таргет.', 'Я в контейнере. Почти Docker.'],
  },
}

const { petVisible, toast } = useHomeUi()

const SCALE = 3
const WIDTH = 16 * SCALE
const HEIGHT = 10 * SCALE
const SPEED = 32 // px в секунду
const CHASE_SPEED = 110
const MIN_TRACK = WIDTH + 24
const EVENT_CHANCE = 0.35

const x = ref(80)
const dir = ref<1 | -1>(1)
const mode = ref<Mode>('walk')
const frame = ref<'walk1' | 'walk2'>('walk1')
const jumping = ref(false)
const bubble = ref('')
const hearts = ref<number[]>([])
const ready = ref(false)
const root = ref<HTMLElement>()
const trackWidth = ref(0)
const item = ref<Item | null>(null)

let clicks = 0
let queue: string[] = []
let raf = 0
let lastTime = 0
let modeUntil = 0
let frameTime = 0
let awakeUntil = 0
let bugTurnAt = 0
let bubbleTimer: ReturnType<typeof setTimeout> | undefined
let reducedMotion = false
let resizeObserver: ResizeObserver | undefined

function toPixels(rows: string[]) {
  const list: { x: number, y: number, c: string }[] = []
  rows.forEach((row, y) => {
    ;[...row].forEach((c, x) => {
      if (c !== '.')
        list.push({ x, y, c })
    })
  })
  return list
}

const catPixels = computed(() => toPixels(SPRITES[mode.value === 'walk' ? frame.value : mode.value]!))

const itemSprite = computed(() => {
  const current = item.value
  if (!current || (current.kind === 'box' && mode.value === 'box'))
    return null
  const rows = ITEMS[current.kind]
  return { rows, w: rows[0]!.length, h: rows.length, pixels: toPixels(rows) }
})

const itemWidth = (kind: ItemKind) => ITEMS[kind][0]!.length * SCALE
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]!
const maxX = () => Math.max(0, trackWidth.value - WIDTH)

function isNightInTomsk() {
  const hour = Number(new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Tomsk',
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date()))
  return hour >= 23 || hour < 7
}

function nextPhrase() {
  if (!queue.length)
    queue = [...PHRASES].sort(() => Math.random() - 0.5)
  return queue.pop()!
}

function say(text: string, ms = 2600) {
  bubble.value = text
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => (bubble.value = ''), ms)
}

function pickMode(now: number) {
  if (now < awakeUntil || !isNightInTomsk())
    mode.value = Math.random() < 0.72 ? 'walk' : 'sit'
  else
    mode.value = 'sleep'

  if (mode.value === 'walk' && Math.random() < 0.3)
    dir.value = dir.value === 1 ? -1 : 1
  modeUntil = now + (mode.value === 'walk' ? 4000 + Math.random() * 6000 : 2500 + Math.random() * 3500)
}

// --- События с предметами ---

function startEvent(kind: ItemKind) {
  const catCenter = x.value + WIDTH / 2
  const w = itemWidth(kind)
  const limit = Math.max(0, trackWidth.value - w)
  let itemX: number

  if (kind === 'fish' || kind === 'box') {
    // Появляются рядом с котом, но не прямо под ним.
    const side = catCenter > trackWidth.value / 2 ? -1 : 1
    itemX = catCenter + side * (40 + Math.random() * 60) - w / 2
  }
  else {
    // Клубок и баг появляются подальше, чтобы было за чем бегать.
    itemX = catCenter > trackWidth.value / 2 ? Math.random() * limit * 0.3 : limit - Math.random() * limit * 0.3
  }
  itemX = Math.min(Math.max(itemX, 0), limit)

  item.value = {
    kind,
    x: itemX,
    y: kind === 'fish' ? -44 : 0,
    vx: kind === 'yarn' ? (itemX > catCenter ? 1 : -1) * 45 : kind === 'bug' ? 50 : 0,
    vy: 0,
    landed: kind !== 'fish',
  }
  bugTurnAt = performance.now() + 400
  mode.value = 'walk'
  say(EVENT_LINES[kind].start, 1400)
}

function finishEvent(kind: ItemKind) {
  item.value = null
  hearts.value.push(Date.now())
  const id = hearts.value.at(-1)!
  setTimeout(() => (hearts.value = hearts.value.filter(h => h !== id)), 900)
  say(pick(EVENT_LINES[kind].done), 3000)
  mode.value = 'sit'
  modeUntil = performance.now() + 2500
}

function updateItem(now: number, dt: number) {
  const current = item.value!
  const limit = Math.max(0, trackWidth.value - itemWidth(current.kind))

  if (!current.landed) {
    current.vy += 900 * dt
    current.y = Math.min(0, current.y + current.vy * dt)
    if (current.y === 0)
      current.landed = true
    return
  }

  if (current.kind === 'yarn') {
    current.x += current.vx * dt
    // Клубок понемногу замедляется: за секунду теряет четверть скорости.
    current.vx *= 0.75 ** dt
    if (current.x <= 0 || current.x >= limit)
      current.vx = -current.vx
  }
  else if (current.kind === 'bug') {
    if (now > bugTurnAt) {
      const catCenter = x.value + WIDTH / 2
      const away = current.x + 10 > catCenter ? 1 : -1
      // Баг чаще убегает от кота, иногда мечется.
      current.vx = (Math.random() < 0.7 ? away : -away) * (40 + Math.random() * 40)
      bugTurnAt = now + 300 + Math.random() * 500
    }
    current.x += current.vx * dt
  }
  current.x = Math.min(Math.max(current.x, 0), limit)
}

function chase(now: number, dt: number) {
  const current = item.value!
  if (mode.value === 'box') {
    if (now > modeUntil)
      finishEvent('box')
    return
  }
  if (!current.landed)
    return

  const catCenter = x.value + WIDTH / 2
  const target = current.x + itemWidth(current.kind) / 2
  const distance = target - catCenter

  if (Math.abs(distance) < 8) {
    if (current.kind === 'box') {
      x.value = current.x + itemWidth('box') / 2 - WIDTH / 2
      mode.value = 'box'
      modeUntil = now + 4000
      return
    }
    finishEvent(current.kind)
    return
  }

  mode.value = 'walk'
  dir.value = distance > 0 ? 1 : -1
  x.value = Math.min(Math.max(x.value + dir.value * CHASE_SPEED * dt, 0), maxX())
  if (now - frameTime > 110) {
    frame.value = frame.value === 'walk1' ? 'walk2' : 'walk1'
    frameTime = now
  }
}

// --- Главный цикл ---

function step(now: number) {
  const dt = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now

  if (item.value) {
    updateItem(now, dt)
    if (item.value)
      chase(now, dt)
  }
  else {
    if (now > modeUntil && !jumping.value)
      pickMode(now)

    if (mode.value === 'walk' && !jumping.value) {
      x.value += dir.value * SPEED * dt
      if (x.value > maxX()) {
        x.value = maxX()
        dir.value = -1
      }
      else if (x.value < 0) {
        x.value = 0
        dir.value = 1
      }
      if (now - frameTime > 180) {
        frame.value = frame.value === 'walk1' ? 'walk2' : 'walk1'
        frameTime = now
      }
    }
  }

  raf = requestAnimationFrame(step)
}

function onClick() {
  clicks += 1

  if (mode.value === 'sleep') {
    awakeUntil = performance.now() + 15_000
    mode.value = 'sit'
    modeUntil = performance.now() + 2500
    say('Мрр… ещё пять минут.')
    return
  }

  if (!reducedMotion) {
    jumping.value = true
    setTimeout(() => (jumping.value = false), 450)
  }

  const id = Date.now()
  hearts.value.push(id)
  setTimeout(() => (hearts.value = hearts.value.filter(h => h !== id)), 900)

  if (clicks === 7) {
    say('Ладно, ты мне нравишься.', 3200)
    toast('Достижение: погладить кота 7 раз')
    return
  }

  const canPlay = !item.value && !reducedMotion && trackWidth.value > WIDTH * 3
  if (canPlay && Math.random() < EVENT_CHANCE) {
    startEvent(pick<ItemKind>(['yarn', 'bug', 'fish', 'box']))
    return
  }

  if (!item.value)
    say(nextPhrase())
}

function measure() {
  trackWidth.value = root.value?.clientWidth ?? 0
  x.value = Math.min(x.value, maxX())
}

function start() {
  reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  ready.value = true
  measure()
  if (root.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(root.value)
  }
  x.value = Math.random() * maxX()
  dir.value = Math.random() < 0.5 ? 1 : -1

  if (reducedMotion) {
    mode.value = isNightInTomsk() ? 'sleep' : 'sit'
    return
  }

  lastTime = performance.now()
  pickMode(lastTime)
  raf = requestAnimationFrame(step)
}

onMounted(start)

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(bubbleTimer)
  resizeObserver?.disconnect()
})

const bubbleOnLeft = computed(() => x.value > trackWidth.value / 2)
const fits = computed(() => trackWidth.value >= MIN_TRACK)
</script>

<template>
  <div
    ref="root"
    class="pet-layer"
    :class="{ 'pet-layer--hidden': !ready || !petVisible || !fits }"
  >
    <div
      v-if="item && itemSprite"
      class="pet-item"
      :class="`pet-item--${item.kind}`"
      :style="{ transform: `translate(${item.x}px, ${item.y}px)` }"
      aria-hidden="true"
    >
      <svg
        :width="itemSprite.w * SCALE"
        :height="itemSprite.h * SCALE"
        :viewBox="`0 0 ${itemSprite.w} ${itemSprite.h}`"
        shape-rendering="crispEdges"
        :style="item.kind === 'yarn' ? { transform: `rotate(${Math.round(item.x / 6) * 90}deg)` } : item.kind === 'bug' && item.vx < 0 ? { transform: 'scaleX(-1)' } : undefined"
      >
        <rect
          v-for="p in itemSprite.pixels"
          :key="`${p.x}-${p.y}`"
          :x="p.x"
          :y="p.y"
          width="1"
          height="1"
          :class="`px-${p.c}`"
        />
      </svg>
    </div>

    <div class="pet" :style="{ transform: `translateX(${x}px)` }">
      <Transition name="bubble">
        <p v-if="bubble" class="pet__bubble mono" :class="{ 'pet__bubble--left': bubbleOnLeft }" role="status">
          {{ bubble }}
        </p>
      </Transition>

      <span v-for="h in hearts" :key="h" class="pet__heart" aria-hidden="true">
        <svg viewBox="0 0 7 6" shape-rendering="crispEdges">
          <path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" />
        </svg>
      </span>

      <span v-if="mode === 'sleep'" class="pet__zzz mono" aria-hidden="true">z</span>

      <button
        type="button"
        class="pet__body"
        :class="{ 'pet__body--jump': jumping }"
        aria-label="Кот Пиксель. Погладить"
        @click="onClick"
      >
        <svg
          :width="WIDTH"
          :height="HEIGHT"
          viewBox="0 0 16 10"
          shape-rendering="crispEdges"
          :style="{ transform: dir === -1 && mode !== 'box' ? 'scaleX(-1)' : undefined }"
        >
          <rect
            v-for="p in catPixels"
            :key="`${p.x}-${p.y}`"
            :x="p.x"
            :y="p.y"
            width="1"
            height="1"
            :class="`px-${p.c}`"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pet-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;

  &--hidden {
    visibility: hidden;

    * {
      pointer-events: none !important;
    }
  }
}

.pet-item {
  position: absolute;
  left: 0;
  bottom: 0;

  svg {
    display: block;
    transition: transform 0.12s linear;
  }
}

.pet {
  position: absolute;
  left: 0;
  bottom: 0;
  will-change: transform;

  &__body {
    display: block;
    padding: 4px 0 0;
    border: 0;
    background: none;
    cursor: pointer;
    pointer-events: auto;

    svg {
      display: block;
    }

    &--jump {
      animation: pet-jump 0.45s ease-out;
    }

    &:focus-visible {
      outline-offset: 0;
      border-radius: 4px;
    }
  }

  &__bubble {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 1;
    width: max-content;
    max-width: 240px;
    margin: 0;
    padding: 7px 10px;
    border: 1px solid var(--h-line-strong);
    border-radius: 8px;
    background: var(--h-raised);
    box-shadow: var(--h-shadow);
    color: var(--h-text);
    font-size: 12px;
    line-height: 1.45;

    &--left {
      left: auto;
      right: 0;
    }
  }

  &__heart {
    position: absolute;
    left: 50%;
    bottom: 32px;
    width: 14px;
    margin-left: -7px;
    animation: pet-heart 0.9s ease-out forwards;
    pointer-events: none;

    svg {
      display: block;
      fill: var(--h-down);
    }
  }

  &__zzz {
    position: absolute;
    left: 50%;
    bottom: 20px;
    color: var(--h-muted);
    font-size: 12px;
    animation: pet-zzz 2.4s ease-in-out infinite;
    pointer-events: none;
  }
}

.px-x {
  fill: var(--h-text-soft);
}

.px-e,
.px-a {
  fill: var(--h-accent);
}

.px-n,
.px-r {
  fill: var(--h-down);
}

.px-z,
.px-y {
  fill: var(--h-bg);
}

.px-k {
  fill: var(--h-text);
}

.px-f {
  fill: var(--h-muted);
}

.px-b {
  fill: #b98a52;
}

.px-d {
  fill: #8a6438;
}

@keyframes pet-jump {
  0%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-12px);
  }
}

@keyframes pet-heart {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-22px);
  }
}

@keyframes pet-zzz {
  0% {
    opacity: 0;
    transform: translate(0, 0);
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(10px, -16px);
  }
}

.bubble-enter-active,
.bubble-leave-active {
  transition: opacity 0.15s;
}

.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
}
</style>
