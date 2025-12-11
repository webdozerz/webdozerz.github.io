<template>
  <div class="peas-page">
    <div class="peas-background">
      <div class="gradient-orb orb-1"/>
      <div class="gradient-orb orb-2"/>
      <div class="gradient-orb orb-3"/>
    </div>

    <div class="peas-container">
      <div class="peas-header">
        <h1 class="peas-title">💚 20 Горошин 💚</h1>
        <p class="peas-subtitle">Те светлые моменты, которые мы иногда не замечаем</p>
      </div>

      <!-- Музыкальный плеер -->
      <div v-if="musicAvailable" class="music-player">
        <audio
          ref="audioPlayer"
          :src="musicSrc"
          loop
          preload="metadata"
          @loadedmetadata="onAudioLoaded"
          @timeupdate="onTimeUpdate"
          @ended="onAudioEnded"
          @error="onAudioError"
        />
        <button 
          class="music-toggle"
          :aria-label="isPlaying ? 'Остановить музыку' : 'Включить музыку'"
          @click="toggleMusic"
        >
          <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
          </svg>
        </button>
        <div v-if="showMusicControls" class="music-controls">
          <div class="music-info">
            <span class="music-label">🎵</span>
            <input 
              v-model="volume" 
              type="range" 
              min="0" 
              max="100" 
              class="volume-slider"
              aria-label="Громкость"
              @input="onVolumeChange"
            >
          </div>
        </div>
      </div>

      <div class="card-wrapper">
        <Transition name="card-fade" mode="out-in">
          <div 
            :key="currentCardIndex" 
            class="peas-card"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <div class="card-emoji">{{ currentCard.emoji }}</div>
            <h2 class="card-title">{{ currentCard.title }}</h2>
            <p class="card-description">{{ currentCard.description }}</p>
          </div>
        </Transition>

        <div class="card-navigation">
          <button 
            class="nav-button prev-button" 
            :disabled="currentCardIndex === 0"
            aria-label="Предыдущая карточка"
            @click="previousCard"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div class="card-indicator">
            <span class="indicator-text">{{ currentCardIndex + 1 }} / {{ cards.length }}</span>
            <div class="indicator-dots">
              <span 
                v-for="(card, index) in cards" 
                :key="card.id"
                :class="['dot', { active: index === currentCardIndex }]"
                @click="goToCard(index)"
              />
            </div>
          </div>

          <button 
            class="nav-button next-button" 
            :disabled="currentCardIndex === cards.length - 1"
            aria-label="Следующая карточка"
            @click="nextCard"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PeaCard {
  id: number
  title: string
  description: string
  emoji: string
  image?: string
}

const cards: PeaCard[] = [
  {
    id: 1,
    title: 'Кино',
    emoji: '🎬',
    description: 'Вместе смотрели Гарри Поттера и погрузились в магию не только на экране, но и в наших сердцах'
  },
  {
    id: 2,
    title: 'Двери',
    emoji: '🚪',
    description: 'Купили межкомнатные двери, и теперь у нам будет свой уютный уголок для спокойствия и уединения'
  },
  {
    id: 3,
    title: 'Суп',
    emoji: '🍲',
    description: 'Сварила потрясающий сливочный суп, который согрел не только желудок, но и душу'
  },
  {
    id: 4,
    title: 'Подарок',
    emoji: '🎁',
    description: 'Выбрала мне идеальный подарок на день рождения и Новый год - ты всегда знаешь, что мне нужно'
  },
  {
    id: 5,
    title: 'Уроки',
    emoji: '📚',
    description: 'Усердно учишься HTML и CSS, развиваешься и растешь каждый день, и я так горжусь тобой'
  },
  {
    id: 6,
    title: 'Вакансии',
    emoji: '💼',
    description: 'Активно ищешь новые возможности, не боишься перемен и смело смотришь в будущее'
  },
  {
    id: 7,
    title: 'Рисование',
    emoji: '🎨',
    description: 'Рисуешь сложную картину по номерам, проявляешь терпение и творчество - это так тебя характеризует'
  },
  {
    id: 8,
    title: 'Книга',
    emoji: '📖',
    description: 'Читаешь много интересных книг и слушаешь аудиокниги, расширяешь кругозор и становишься еще интереснее'
  },
  {
    id: 9,
    title: 'Цветы',
    emoji: '🌹',
    description: 'Подарил тебе цветы, чтобы напомнить, как ты прекрасна и как я тебя люблю'
  },
  {
    id: 10,
    title: 'Полотенце',
    emoji: '🛁',
    description: 'Купили большое мягкое полотенце, теперь уютнее после душа, и каждая мелочь делает жизнь лучше'
  },
  {
    id: 11,
    title: 'Постельное белье',
    emoji: '🛏️',
    description: 'Выбрали красивое постельное белье, теперь спать еще приятнее, и каждое утро начинается с уюта'
  },
  {
    id: 12,
    title: 'Фильтр под мойкой',
    emoji: '💧',
    description: 'Установили фильтр, теперь у нас всегда чистая и вкусная вода - забота о здоровье важна'
  },
  {
    id: 13,
    title: 'Посудомойка',
    emoji: '🍽️',
    description: 'Купили посудомойку, освободили время для более важных дел и моментов вместе'
  },
  {
    id: 14,
    title: 'Суши',
    emoji: '🍣',
    description: 'Поели классные суши, насладились вкусом и моментом, проведенным вместе'
  },
  {
    id: 15,
    title: 'Томатное гозэ',
    emoji: '🍅',
    description: 'Купили и выпили наш общий любимый напиток - такие маленькие ритуалы делают нас ближе'
  },
  {
    id: 16,
    title: 'Танцы',
    emoji: '💃',
    description: 'Занимаешься восточными танцами, развиваешь грацию и красоту, и я восхищаюсь тобой'
  },
  {
    id: 17,
    title: 'Пуховик',
    emoji: '🧥',
    description: 'Наконец-то нашли и купили подходящий пуховик - теперь тепло и стильно, как и ты'
  },
  {
    id: 18,
    title: 'Платье',
    emoji: '👗',
    description: 'Нашла классное платье на корпоратив - ты всегда выглядишь невероятно красиво'
  },
  {
    id: 19,
    title: 'Водолазка',
    emoji: '👔',
    description: 'Выбрала мне новую водолазку, я оценил твой вкус и заботу обо мне'
  },
  {
    id: 20,
    title: 'Гулять',
    emoji: '🚶‍♀️',
    description: 'Ходишь часто гулять, дышишь свежим воздухом и заботишься о себе - это так важно'
  }
]

const currentCardIndex = ref(0)

const currentCard = computed(() => cards[currentCardIndex.value])

// Музыкальный плеер
const audioPlayer = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const volume = ref(20)
const showMusicControls = ref(false)
const musicAvailable = ref(true)
const musicSrc = ref('/peas/music.mp3') // Путь к музыке - можно изменить на нужный файл

const toggleMusic = async () => {
  if (!audioPlayer.value) return

  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  } else {
    try {
      await audioPlayer.value.play()
      isPlaying.value = true
      showMusicControls.value = true
    } catch (error) {
      console.error('Ошибка воспроизведения музыки:', error)
      // Браузер может блокировать автовоспроизведение
    }
  }
}

const onAudioLoaded = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100
  }
}

const onTimeUpdate = () => {
  // Можно добавить логику отслеживания времени воспроизведения
}

const onAudioEnded = () => {
  // Музыка зациклена, это не должно вызываться
}

const onAudioError = () => {
  // Файл не найден или ошибка загрузки - скрываем плеер
  musicAvailable.value = false
}

const onVolumeChange = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100
  }
}

const nextCard = () => {
  if (currentCardIndex.value < cards.length - 1) {
    currentCardIndex.value++
  }
}

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
  }
}

const goToCard = (index: number) => {
  currentCardIndex.value = index
}

// Клавиатурная навигация
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    previousCard()
  } else if (event.key === 'ArrowRight') {
    nextCard()
  }
}

// Свайп навигация для мобильных
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
}

const handleTouchEnd = (event: TouchEvent) => {
  touchEndX.value = event.changedTouches[0].clientX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeDistance = touchStartX.value - touchEndX.value
  const minSwipeDistance = 50 // минимальное расстояние для свайпа

  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      // Свайп влево - следующая карточка
      nextCard()
    } else {
      // Свайп вправо - предыдущая карточка
      previousCard()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

// SEO мета-теги
useHead({
  title: '20 Горошин - Светлые моменты',
  meta: [
    { name: 'description', content: 'Те светлые моменты, которые ты не замечаешь' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style lang="scss" scoped>
.peas-page {
  min-height: 100vh;
  min-height: 100dvh; /* Поддержка динамического viewport на мобильных */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #ffeef8 0%, #fff0f5 25%, #fef0ff 50%, #fff5f0 75%, #fffef0 100%);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    padding-top: 1.5rem;
  }
}

.peas-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;

  &.orb-1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #ffb3d9 0%, transparent 70%);
    top: 10%;
    left: 5%;
    animation-delay: 0s;

    @media (max-width: 768px) {
      width: 250px;
      height: 250px;
      opacity: 0.3;
    }

    @media (max-width: 480px) {
      width: 180px;
      height: 180px;
      opacity: 0.25;
    }
  }

  &.orb-2 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, #d9b3ff 0%, transparent 70%);
    top: 50%;
    right: 10%;
    animation-delay: 2.5s;

    @media (max-width: 768px) {
      width: 220px;
      height: 220px;
      opacity: 0.3;
    }

    @media (max-width: 480px) {
      width: 160px;
      height: 160px;
      opacity: 0.25;
    }
  }

  &.orb-3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #ffd9b3 0%, transparent 70%);
    bottom: 15%;
    left: 50%;
    animation-delay: 5s;

    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
      opacity: 0.3;
    }

    @media (max-width: 480px) {
      width: 140px;
      height: 140px;
      opacity: 0.25;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-40px) rotate(120deg);
  }
  66% {
    transform: translateY(40px) rotate(240deg);
  }
}

.peas-container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;

  @media (max-width: 480px) {
    max-width: 100%;
  }
}

.peas-header {
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
}

.peas-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff8fab 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
}

.peas-subtitle {
  font-size: 1.25rem;
  color: #8b5a7a;
  margin: 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }
}

.music-player {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  box-shadow: 0 4px 16px rgba(196, 69, 105, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    padding: 0.5rem;
    gap: 0.5rem;
  }
}

.music-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(196, 69, 105, 0.3);
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
  }

  svg {
    width: 24px;
    height: 24px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 480px) {
      width: 18px;
      height: 18px;
    }
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 24px rgba(196, 69, 105, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(196, 69, 105, 0.3);
  }
}

.music-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: fadeIn 0.3s ease;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.music-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
}

.music-label {
  font-size: 1.25rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
}

.volume-slider {
  width: 120px;
  height: 6px;
  border-radius: 3px;
  background: rgba(196, 69, 105, 0.2);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    width: 100px;
    height: 5px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(196, 69, 105, 0.4);
    transition: all 0.3s ease;

    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(196, 69, 105, 0.5);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(196, 69, 105, 0.4);
    transition: all 0.3s ease;

    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(196, 69, 105, 0.5);
  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(196, 69, 105, 0.3);
  }

  &:focus::-moz-range-thumb {
    box-shadow: 0 0 0 3px rgba(196, 69, 105, 0.3);
  }
}

.card-wrapper {
  position: relative;
}

.peas-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 
    0 20px 60px rgba(255, 107, 157, 0.15),
    0 8px 24px rgba(196, 69, 105, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  touch-action: pan-y; /* Разрешаем вертикальный скролл, но обрабатываем горизонтальные свайпы */
  user-select: none; /* Предотвращаем выделение текста при свайпе */

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    min-height: 350px;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    min-height: 320px;
    border-radius: 20px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
    }
  }
}

.card-emoji {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(255, 107, 157, 0.2));

  @media (max-width: 768px) {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 3.5rem;
    margin-bottom: 0.75rem;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.card-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #c44569;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 2px 8px rgba(196, 69, 105, 0.2);

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
}

.card-description {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #6b4c57;
  margin: 0;
  max-width: 600px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.5;
    padding: 0 0.25rem;
  }
}

.card-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.5rem;
  gap: 1.5rem;

  @media (max-width: 768px) {
    margin-top: 2rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    margin-top: 1.5rem;
    gap: 0.75rem;
  }
}

.nav-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #c44569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(196, 69, 105, 0.15);
  flex-shrink: 0;
  touch-action: manipulation; /* Улучшает отзывчивость на мобильных */
  -webkit-tap-highlight-color: transparent; /* Убирает подсветку при тапе на iOS */

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
  }

  svg {
    width: 24px;
    height: 24px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 480px) {
      width: 18px;
      height: 18px;
    }
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    color: white;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 24px rgba(196, 69, 105, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(196, 69, 105, 0.3);
  }
}

.card-indicator {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.indicator-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #8b5a7a;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
}

.indicator-dots {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  padding: 0 0.5rem;

  @media (max-width: 768px) {
    gap: 0.4rem;
    padding: 0 0.25rem;
  }

  @media (max-width: 480px) {
    gap: 0.3rem;
    padding: 0;
    max-width: calc(100vw - 120px); /* Оставляем место для кнопок навигации */
  }
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(196, 69, 105, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }

  @media (max-width: 480px) {
    width: 7px;
    height: 7px;
  }

  @media (hover: hover) {
    &:hover {
      background: rgba(196, 69, 105, 0.5);
      transform: scale(1.2);
    }
  }

  &:active {
    background: rgba(196, 69, 105, 0.6);
    transform: scale(1.1);
  }

  &.active {
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
    width: 12px;
    height: 12px;
    box-shadow: 0 2px 8px rgba(196, 69, 105, 0.4);

    @media (max-width: 768px) {
      width: 10px;
      height: 10px;
    }

    @media (max-width: 480px) {
      width: 9px;
      height: 9px;
    }
  }
}

// Анимации переходов карточек
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);

  @media (max-width: 480px) {
    transform: translateX(20px) scale(0.97);
  }
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);

  @media (max-width: 480px) {
    transform: translateX(-20px) scale(0.97);
  }
}

.card-fade-enter-to,
.card-fade-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>
