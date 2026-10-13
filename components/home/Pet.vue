<script setup lang="ts">
// Пиксель — кот, который гуляет по шапке между навигацией и кнопками.

const props = withDefaults(defineProps<{
  intro?: string // фраза, которую кот скажет сразу после появления
  scale?: number // размер «пикселя» спрайта: 3 — для шапки, больше — для крупного кота
  bubblePlacement?: 'below' | 'above' // где показывать реплику относительно дорожки
}>(), {
  intro: '',
  scale: 3,
  bubblePlacement: 'below',
})
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

// Спрайты кота 16×10, смотрит вправо. Срисован с настоящего Пикселя: серый табби с белой грудью и лапками.
// g — серая шерсть, s — тёмные полоски, w — белая шерсть, p — розовые уши, n — нос, e — глаза, z — закрытые глаза.
const SPRITES: Record<string, string[]> = {
  // Цикл шага из 4 кадров. Задние и передние лапы работают в противофазе:
  // одна пара расходится, другая сходится. Между кадрами двигаются все четыре лапы, хвост качается.
  walk1: [
    '..........g...g.',
    '..........gp.pg.',
    's.........ggsgg.',
    'g.........gegeg.',
    '.s........gwnwg.',
    '.g.gsggsggswwg..',
    '..ggsggsggswwg..',
    '..ggwwwwwwwww...',
    '..g.g.....w.w...',
    '..w.w.....w.w...',
  ],
  walk2: [
    '..........g...g.',
    '..........gp.pg.',
    '.s........ggsgg.',
    'g.........gegeg.',
    's.........gwnwg.',
    '.g.gsggsggswwg..',
    '..ggsggsggswwg..',
    '..ggwwwwwwwww...',
    '..g.g.....w.w...',
    '.w...w.....w....',
  ],
  walk3: [
    '..........g...g.',
    '..........gp.pg.',
    's.........ggsgg.',
    'g.........gegeg.',
    '.s........gwnwg.',
    '.g.gsggsggswwg..',
    '..ggsggsggswwg..',
    '..ggwwwwwwwww...',
    '..g.g.....w.w...',
    '..w.w.....w.w...',
  ],
  walk4: [
    '..........g...g.',
    '..........gp.pg.',
    '.s........ggsgg.',
    'g.........gegeg.',
    's.........gwnwg.',
    '.g.gsggsggswwg..',
    '..ggsggsggswwg..',
    '..ggwwwwwwwww...',
    '..g.g.....w.w...',
    '...w.....w...w..',
  ],
  sit: [
    '..........g...g.',
    '..........gp.pg.',
    '..........ggsgg.',
    '..........gegeg.',
    '..........gwnwg.',
    '.........gswwwg.',
    '........gsgwwwg.',
    '.s......sgswwwg.',
    '.g.....gsgswwwg.',
    '..sgsgsgggg.ww..',
  ],
  // Спит клубком, как на любимом кресле.
  sleep: [
    '................',
    '................',
    '................',
    '................',
    '................',
    '...........g.g..',
    '....gsgsgs.gsg..',
    '..gsgsgsgsggggg.',
    '.gsgsgsgsggzgzg.',
    'sgsgwwwwwwwwnww.',
  ],
  box: [
    '......g...g.....',
    '......gp.pg.....',
    '......ggsgg.....',
    '......gegeg.....',
    '.bb...gwnwg...bb',
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
  'Прод упал? Не я. Я лежал на клавиатуре.',
  'Сначала тесты, потом кормить кота. Или наоборот.',
  'Я тоже Middle+. Middle+ по мурчанию.',
  'Шёл по шапке, нашёл баг. Шучу, его тут нет.',
  'Сломал вёрстку? Нет, это я тут прилёг.',
  'Конами-код знаешь? ↑↑↓↓←→←→BA.',
  'Тёмная тема — лучшая тема. Как ночь для охоты.',
  'console.log(\'мяу\')',
  'git push --force? Только через мой труп. Пиксельный.',
  'Мурлычу на частоте 60 fps.',
  'Покорми меня звёздочкой на GitHub.',
  'Vue или React? Мяу. Вопрос закрыт.',
  'Я не ленюсь. Я жду, пока резолвится промис.',
  'Работаю удалённо: с подоконника.',
  'Если долго смотреть в шапку, шапка посмотрит на тебя.',
  'Это не баг, это кот.',
  'Мой любимый хук — onMeownted.',
  'Зачем мышь, если есть я?',
  'Задача оценена в 3 сторипоинта и 2 вкусняшки.',
  'В консоли есть команда sudo hire-me. Намёк понял?',
  'Я срисован с настоящего кота. Его тоже зовут Пиксель.',
  'Настоящий Пиксель сейчас, скорее всего, спит в кресле.',
  'Полоски — это не баг, это дизайн-система.',
  'Белые лапки — чтобы не оставлять следов в коде.',
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

const { petVisible, toast, theme } = useHomeUi()

const SCALE = props.scale
const WIDTH = 16 * SCALE
const HEIGHT = 10 * SCALE
const SPEED = (32 * SCALE) / 3 // px в секунду, крупный кот шагает шире
const CHASE_SPEED = (110 * SCALE) / 3
const MIN_TRACK = WIDTH + 24
const EVENT_CHANCE = 0.35

const x = ref(80)
const dir = ref<1 | -1>(1)
const mode = ref<Mode>('walk')
const WALK_FRAMES = ['walk1', 'walk2', 'walk3', 'walk4'] as const
const frameIndex = ref(0)
const jumping = ref(false)
const bubble = ref('')
const bubbleEl = ref<HTMLElement>()
const bubbleWidth = ref(0)
const layerLeft = ref(0)
const viewportWidth = ref(0)
const hearts = ref<number[]>([])
const ready = ref(false)
const squint = ref(false)
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

const catPixels = computed(() => {
  const rows = SPRITES[mode.value === 'walk' ? WALK_FRAMES[frameIndex.value]! : mode.value]!
  // Щурится — глаза превращаются в закрытые.
  return toPixels(squint.value ? rows.map(row => row.replaceAll('e', 'z')) : rows)
})

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

async function say(text: string, ms = 2600) {
  // Пока новое облачко не измерено, оно скрыто и прижато к левому краю экрана,
  // чтобы даже на мгновение не расширить страницу.
  bubbleWidth.value = 0
  bubble.value = text
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => (bubble.value = ''), ms)
  await nextTick()
  bubbleWidth.value = bubbleEl.value?.offsetWidth ?? 0
  measure()
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
    y: kind === 'fish' ? (-44 * SCALE) / 3 : 0,
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
    current.vy += ((900 * SCALE) / 3) * dt
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
  if (now - frameTime > 85) {
    frameIndex.value = (frameIndex.value + 1) % WALK_FRAMES.length
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
      if (now - frameTime > 140) {
        frameIndex.value = (frameIndex.value + 1) % WALK_FRAMES.length
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
  layerLeft.value = root.value?.getBoundingClientRect().left ?? 0
  viewportWidth.value = document.documentElement.clientWidth
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
  if (props.intro)
    setTimeout(() => say(props.intro!, 4000), 600)
}

onMounted(start)

// Кот реагирует на смену темы. При загрузке тема подтягивается из localStorage — эту смену пропускаем.
const THEME_LINES = {
  light: ['Ярко! Дайте прищуриться.', 'Кто включил солнце?', 'Светлая тема? Смело.'],
  dark: ['Вот, другое дело.', 'Глаза отдыхают. Мур.', 'Тёмная тема — моя стихия.'],
}
let themeTimer: ReturnType<typeof setTimeout> | undefined
let themeArmed = false
onMounted(() => setTimeout(() => (themeArmed = true), 1000))
watch(theme, (next, prev) => {
  if (!themeArmed || !prev || mode.value === 'sleep')
    return
  say(pick(THEME_LINES[next]), 2400)
  if (next === 'light') {
    squint.value = true
    clearTimeout(themeTimer)
    themeTimer = setTimeout(() => (squint.value = false), 1800)
  }
  else {
    squint.value = false
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(bubbleTimer)
  resizeObserver?.disconnect()
})

// Облачко держится над котом, но никогда не выходит за края экрана (отступ 16px).
const BUBBLE_GAP = 16
const bubbleX = computed(() => {
  if (!bubbleWidth.value)
    return Math.round(BUBBLE_GAP - layerLeft.value)
  const desired = x.value + WIDTH / 2 - bubbleWidth.value / 2
  const min = BUBBLE_GAP - layerLeft.value
  const max = viewportWidth.value - BUBBLE_GAP - bubbleWidth.value - layerLeft.value
  return Math.round(Math.max(min, Math.min(desired, max)))
})
const fits = computed(() => trackWidth.value >= MIN_TRACK)
</script>

<template>
  <div
    ref="root"
    class="pet-layer"
    :class="{ 'pet-layer--hidden': !ready || !petVisible || !fits, 'pet-layer--bubble-above': bubblePlacement === 'above' }"
    :style="{ '--pet-h': `${HEIGHT}px` }"
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

    <Transition name="bubble">
      <p
        v-if="bubble"
        ref="bubbleEl"
        class="pet-bubble mono"
        :style="{ transform: `translateX(${bubbleX}px)`, visibility: bubbleWidth ? undefined : 'hidden' }"
        role="status"
      >
        {{ bubble }}
      </p>
    </Transition>

    <div class="pet" :style="{ transform: `translateX(${x}px)` }">

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
  --pet-grey: #a3a9b2;
  --pet-stripe: #575d67;
  --pet-white: #eceef1;
  --pet-pink: #f0a3b4;

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

.pet-bubble {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1;

  .pet-layer--bubble-above & {
    top: auto;
    bottom: calc(var(--pet-h) + 20px);
  }

  width: max-content;
  max-width: min(240px, calc(100vw - 32px));
  margin: 0;
  padding: 7px 10px;
  border: 1px solid var(--h-line-strong);
  border-radius: 8px;
  background: var(--h-raised);
  box-shadow: var(--h-shadow);
  color: var(--h-text);
  font-size: 12px;
  line-height: 1.45;
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
  // Кот появляется последним, когда первый экран уже собрался.
  animation: pet-appear 0.6s ease-out 1.6s both;

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

  &__heart {
    position: absolute;
    left: 50%;
    --heart-w: max(14px, calc(var(--pet-h) * 0.3));

    bottom: calc(var(--pet-h) + 2px);
    width: var(--heart-w);
    margin-left: calc(var(--heart-w) / -2);
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
    bottom: calc(var(--pet-h) * 0.66);
    color: var(--h-muted);
    font-size: max(12px, calc(var(--pet-h) * 0.3));
    animation: pet-zzz 2.4s ease-in-out infinite;
    pointer-events: none;
  }
}

.px-g {
  fill: var(--pet-grey);
}

.px-s,
.px-z {
  fill: var(--pet-stripe);
}

.px-w {
  fill: var(--pet-white);
}

.px-p,
.px-n {
  fill: var(--pet-pink);
}

.px-e,
.px-a {
  fill: var(--h-accent);
}

.px-r {
  fill: var(--h-down);
}

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

@keyframes pet-appear {
  from {
    opacity: 0;
  }
}

@keyframes pet-jump {
  0%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(calc(var(--pet-h) * -0.4));
  }
}

@keyframes pet-heart {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(calc(var(--pet-h) * -0.7));
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

<style lang="scss">
// В светлой теме белая шерсть чуть темнее, иначе лапки сливаются с фоном.
// Не scoped: в scoped-стилях Vue обрезает всё после :global(...).
html.home-root[data-theme='light'] .pet-layer {
  --pet-grey: #8f96a0;
  --pet-stripe: #4a5059;
  --pet-white: #cdd2da;
  --pet-pink: #e8899e;
}
</style>
