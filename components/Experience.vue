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
        <div class="timeline-track">
          <div class="track-icon current">
            <div class="icon-inner">
              <span class="icon-emoji">💼</span>
            </div>
            <div class="icon-pulse"/>
          </div>
          <div class="track-line"/>
        </div>
        
        <div class="timeline-content">
          <div class="timeline-badge current">
            <span class="badge-text">Текущая работа</span>
            <div class="badge-glow"/>
          </div>
          
          <div class="job-card current">
            <div class="card-header">
              <div class="job-info">
                <h4 class="job-title">Frontend-разработчик (Middle+)</h4>
                <div class="company-name">Crypton Studio</div>
                <div class="job-duration">01.2022 - Настоящее время • 3+ года</div>
              </div>
              <div class="company-logo">
                <img class="logo-image" src="/landing/cr-logo.png" alt="Crypton Studio">
              </div>
            </div>
            
            <div class="achievements">
              <div class="achievement-item star">
                <div class="achievement-icon">🚀</div>
                <div class="achievement-text">
                  Создание TMA (Telegram Mini Apps) с аудиторией <strong>более 1 миллиона пользователей</strong>
                </div>
              </div>
              
              <div class="achievement-item">
                <div class="achievement-icon" style="filter: brightness(3);">💱</div>
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
                  Руководство проектными циклами: планирование, распределение задач, контроль и отчетность
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Вторая работа -->
      <div class="timeline-item">
        <div class="timeline-track">
          <div class="track-icon">
            <div class="icon-inner">
              <span class="icon-emoji">🏢</span>
            </div>
          </div>
          <div class="track-line"/>
        </div>
        
        <div class="timeline-content">
          <div class="timeline-badge">
            <span class="badge-text">Средний уровень</span>
          </div>
          
          <div class="job-card">
            <div class="card-header">
              <div class="job-info">
                <h4 class="job-title">Frontend-разработчик (Junior)</h4>
                <div class="company-name">Astana Prom Design</div>
                <div class="job-duration">2020 - 2022 • 2 года</div>
              </div>
              <div class="company-logo">
                <span class="logo-text">APD</span>
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
              
              <div class="achievement-item star">
                <div class="achievement-icon">📱</div>
                <div class="achievement-text">
                  Адаптивный дизайн корпоративного сайта - <strong>повышение посещаемости на 30%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Фриланс -->
      <div class="timeline-item">
        <div class="timeline-track">
          <div class="track-icon freelance">
            <div class="icon-inner">
              <span class="icon-emoji">🚀</span>
            </div>
          </div>
        </div>
        
        <div class="timeline-content">
          <div class="timeline-badge freelance">
            <span class="badge-text">Начало пути</span>
          </div>
          
          <div class="job-card">
            <div class="card-header">
              <div class="job-info">
                <h4 class="job-title">Frontend-разработчик</h4>
                <div class="company-name freelance">Фриланс</div>
                <div class="job-duration">2017 - 2020 • 3 года</div>
              </div>
              <div class="company-logo freelance">
                <span class="logo-text">FL</span>
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
  margin-bottom: 2rem;

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

// Timeline
.timeline {
  position: relative;
  padding: 1rem 0;
}

.timeline-item {
  position: relative;
  display: flex;
  margin-bottom: 4rem;
  opacity: 0;
  animation: slideInLeft 0.8s ease forwards;

  &:nth-child(1) { animation-delay: 0.2s; }
  &:nth-child(2) { animation-delay: 0.4s; }
  &:nth-child(3) { animation-delay: 0.6s; }

  &:last-child {
    margin-bottom: 0;
    
    .track-line {
      display: none;
    }
  }

  @media (max-width: 767px) {
    flex-direction: column;
    margin-bottom: 3rem;
  }
}

// Timeline Track
.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-right: 2rem;

  @media (max-width: 767px) {
    flex-direction: row;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

.track-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border: 4px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 767px) {
    width: 60px;
    height: 60px;
  }

  &.current {
    background: linear-gradient(135deg, var(--green) 0%, #059669 100%);
    border-color: rgba(16, 185, 129, 0.6);
    box-shadow: 
      0 0 30px rgba(16, 185, 129, 0.4),
      0 8px 25px rgba(0, 0, 0, 0.3);

    .icon-inner {
      transform: scale(1.1);
    }
  }

  &.freelance {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-color: rgba(245, 158, 11, 0.6);
    box-shadow: 
      0 0 30px rgba(245, 158, 11, 0.4),
      0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
      0 0 40px rgba(127, 92, 230, 0.5),
      0 12px 30px rgba(0, 0, 0, 0.4);
  }
}

.icon-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.icon-emoji {
  font-size: 2rem;
  
  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
}

.icon-pulse {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--green) 0%, #059669 100%);
  opacity: 0.3;
  animation: pulse 2s infinite;
}

.track-line {
  width: 3px;
  height: 120px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  margin-top: 1rem;
  border-radius: 2px;

  @media (max-width: 767px) {
    width: 100px;
    height: 3px;
    margin-top: 0;
    margin-left: 1rem;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
  }
}

// Timeline Content
.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  &.current {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
    border-color: rgba(16, 185, 129, 0.3);
    color: var(--green);
  }

  &.freelance {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
    border-color: rgba(245, 158, 11, 0.3);
    color: #f59e0b;
  }

  .badge-text {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    z-index: 2;
  }

  .badge-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%);
    border-radius: inherit;
    animation: shimmer 3s infinite;
  }
}

// Job Card
.job-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(127, 92, 230, 0.5) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(127, 92, 230, 0.2);
    border-color: rgba(127, 92, 230, 0.3);

    &::before {
      transform: translateX(100%);
    }
  }

  &.current {
    border-color: rgba(16, 185, 129, 0.2);
    
    &:hover {
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 
        0 25px 50px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(16, 185, 129, 0.3);
    }
  }

  @media (max-width: 767px) {
    padding: 1.5rem;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    align-items: center;
  }
}

.job-info {
  flex: 1;
  min-width: 0;
}

.job-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white-1000);
  margin: 0 0 0.5rem 0;
  line-height: 1.2;

  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
}

.company-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--purple);
  margin-bottom: 0.5rem;

  &.freelance {
    color: #f59e0b;
  }
}

.job-duration {
  font-size: 0.875rem;
  color: var(--white-600);
  font-weight: 500;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(127, 92, 230, 0.3);

  &.freelance {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
  }

  @media (max-width: 767px) {
    width: 50px;
    height: 50px;
  }

  .logo-text {
    color: var(--white-1000);
    font-weight: 700;
    font-size: 1rem;

    @media (max-width: 767px) {
      font-size: 0.875rem;
    }
  }

  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;

    overflow: hidden;
  }
}

// Achievements
.achievements {
  display: grid;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateX(8px);

    &::before {
      left: 100%;
    }
  }

  &.star {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
    border-color: rgba(255, 215, 0, 0.2);

    &:hover {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.1) 100%);
      border-color: rgba(255, 215, 0, 0.3);
      transform: translateX(8px) scale(1.02);
    }

    .achievement-icon {
      position: relative;
      
      &::after {
        content: '⭐';
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 0.75rem;
        animation: sparkle 2s infinite;
      }
    }
  }
}

.achievement-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
  transition: transform 0.3s ease;
}

.achievement-text {
  color: var(--white-800);
  line-height: 1.6;
  font-size: 0.95rem;

  strong {
    color: var(--white-1000);
    font-weight: 600;
    background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

// Animations
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0%, 100% {
    opacity: 0;
    transform: translateX(-100%);
  }
  50% {
    opacity: 1;
    transform: translateX(100%);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.8) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
}

// Mobile Timeline
@media (max-width: 767px) {
  .timeline {
    padding: 0.5rem 0;
  }

  .timeline-item {
    margin-bottom: 2rem;
  }

  .achievement-item {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .achievement-text {
    font-size: 0.9rem;
  }
}
</style>

