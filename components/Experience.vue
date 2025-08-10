<template>
  <div class="experience">
    <div class="section-header">
      <h3 class="section-title">
        <i class="title-icon">💼</i>
        Опыт работы
      </h3>
      <div class="section-subtitle">Профессиональный путь развития</div>
    </div>

    <div class="timeline">
      <!-- Текущая работа -->
      <div class="timeline-item current">
        <div class="timeline-marker">
          <div class="marker-dot active"/>
          <div class="marker-line"/>
        </div>
        
        <div class="timeline-content">
          <div class="job-header">
            <div class="job-main">
              <h4 class="job-title">Frontend-разработчик (Middle+)</h4>
              <div class="company-name">Crypton Studio</div>
            </div>
            <div class="job-period">
              <span class="period-badge current">01.2022 - Настоящее время</span>
            </div>
          </div>
          
          <div class="achievements">
            <div class="achievement-item highlight">
              <div class="achievement-icon">🚀</div>
              <div class="achievement-text">
                Создание TMA (Telegram Mini Apps) с аудиторией <strong>более 1 миллиона пользователей</strong>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">💱</div>
              <div class="achievement-text">
                Разработка и участие в создании <strong>более 5 криптовалютных биржах</strong>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">⚡</div>
              <div class="achievement-text">
                Оптимизация производительности - <strong>сокращение времени загрузки на 40%</strong>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🎨</div>
              <div class="achievement-text">
                Создание и поддержка Starter Kit компании с UI/UX дизайном и архитектурой
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🔄</div>
              <div class="achievement-text">
                Миграция проекта с Vue 2 на <strong>Nuxt + TypeScript</strong>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">👥</div>
              <div class="achievement-text">
                Менторинг и обучение новых сотрудников современным технологиям
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">📋</div>
              <div class="achievement-text">
                Руководство проектными циклами: планирование, распределение задач, контроль
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Вторая работа -->
      <div class="timeline-item">
        <div class="timeline-marker">
          <div class="marker-dot"/>
          <div class="marker-line"/>
        </div>
        
        <div class="timeline-content">
          <div class="job-header">
            <div class="job-main">
              <h4 class="job-title">Frontend-разработчик (Junior)</h4>
              <div class="company-name">Astana Prom Design</div>
            </div>
            <div class="job-period">
              <span class="period-badge">2020 - 2022</span>
            </div>
          </div>
          
          <div class="achievements">
            <div class="achievement-item">
              <div class="achievement-icon">🌐</div>
              <div class="achievement-text">
                Разработка веб-приложений по запросам для партнеров и агенств
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🔗</div>
              <div class="achievement-text">
                Тесное сотрудничество с backend-разработчиками для создания и интеграции API
              </div>
            </div>
            
            <div class="achievement-item highlight">
              <div class="achievement-icon">📱</div>
              <div class="achievement-text">
                Адаптивный дизайн корпоративного сайта - <strong>повышение посещаемости на 30%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Фриланс -->
      <div class="timeline-item">
        <div class="timeline-marker">
          <div class="marker-dot"/>
        </div>
        
        <div class="timeline-content">
          <div class="job-header">
            <div class="job-main">
              <h4 class="job-title">Frontend-разработчик</h4>
              <div class="company-name freelance">Фриланс</div>
            </div>
            <div class="job-period">
              <span class="period-badge">2017 - 2020</span>
            </div>
          </div>
          
          <div class="achievements">
            <div class="achievement-item">
              <div class="achievement-icon">⚛️</div>
              <div class="achievement-text">
                Разработка интерактивных интерфейсов на <strong>Vue.js</strong>, улучшение UX
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🎨</div>
              <div class="achievement-text">
                Создание кастомизированных тем для <strong>WordPress</strong>
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🚀</div>
              <div class="achievement-text">
                Оптимизация производительности и <strong>SEO</strong>, рост органического трафика
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🧪</div>
              <div class="achievement-text">
                Внедрение автоматического тестирования (<strong>Jest</strong>)
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">📄</div>
              <div class="achievement-text">
                Создание и поддержка <strong>SPA</strong> с высокой производительностью
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🔌</div>
              <div class="achievement-text">
                Интеграция сторонних API (платежные системы, карты)
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon">🌍</div>
              <div class="achievement-text">
                Обеспечение кроссбраузерной совместимости и доступности
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
<style lang="scss" scoped>
.experience {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// Заголовок секции
.section-header {
  text-align: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    text-align: left;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--white-1000);
  margin: 0 0 0.5rem 0;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }

  .title-icon {
    font-size: 1.2em;
  }
}

.section-subtitle {
  color: var(--white-700);
  font-size: 1rem;
  font-weight: 400;
}

// Таймлайн
.timeline {
  position: relative;
  padding-left: 0;

  @media (min-width: 768px) {
    padding-left: 2rem;
  }
}

.timeline-item {
  position: relative;
  padding-bottom: 3rem;

  &:last-child {
    padding-bottom: 0;
  }

  @media (min-width: 768px) {
    padding-left: 2rem;
  }
}

// Маркеры таймлайна
.timeline-marker {
  position: absolute;
  left: 0;
  top: 1rem;
  display: none;

  @media (min-width: 768px) {
    display: block;
    left: -2rem;
  }
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--white-700);
  border: 3px solid var(--black-900);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;

  &.active {
    background: var(--green);
    box-shadow: 0 0 20px rgba(92, 230, 115, 0.5);
    animation: pulse-green 2s infinite;
  }
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 0 20px rgba(92, 230, 115, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(92, 230, 115, 0.8);
  }
}

.marker-line {
  position: absolute;
  left: 50%;
  top: 16px;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% + 2rem);
  background: linear-gradient(
    to bottom,
    var(--white-700) 0%,
    var(--white-700) 50%,
    transparent 100%
  );
}

// Контент работы
.timeline-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(127, 92, 230, 0.3);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

// Заголовок работы
.job-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.job-main {
  flex: 1;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--white-1000);
  margin: 0 0 0.5rem 0;
}

.company-name {
  font-size: 1rem;
  color: var(--purple);
  font-weight: 500;

  &.freelance {
    color: var(--accent-cyan);
  }
}

.job-period {
  flex-shrink: 0;
}

.period-badge {
  background: rgba(255, 255, 255, 0.1);
  color: var(--white-800);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;

  &.current {
    background: linear-gradient(135deg, var(--green) 0%, var(--accent-cyan) 100%);
    color: var(--black-1000);
    font-weight: 600;
  }
}

// Достижения
.achievements {
  display: grid;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }

  &.highlight {
    background: rgba(92, 230, 115, 0.1);
    border-color: rgba(92, 230, 115, 0.3);

    &:hover {
      background: rgba(92, 230, 115, 0.15);
    }
  }
}

.achievement-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.achievement-text {
  color: var(--white-800);
  line-height: 1.5;
  font-size: 0.95rem;

  strong {
    color: var(--white-1000);
    font-weight: 600;
  }
}

// Адаптивность
@media (max-width: 767px) {
  .timeline-item {
    border-left: 2px solid var(--white-700);
    padding-left: 1.5rem;
    margin-left: 1rem;
    
    &.current {
      border-left-color: var(--green);
    }
  }
  
  .timeline-content {
    padding: 1.25rem;
  }
  
  .achievement-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .achievement-text {
    font-size: 0.9rem;
  }
}
</style>
