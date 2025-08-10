<template>
  <div class="tech">
    <div class="section-header">
      <h3 class="section-title">
        <i class="title-icon">⚡</i>
        Технологии и навыки
      </h3>
      <div class="section-subtitle">Современный стек разработки</div>
    </div>

    <div class="tech-categories">
      <!-- Языки программирования -->
      <div class="tech-category">
        <div class="category-header">
          <h4 class="category-title">
            <i class="category-icon">💻</i>
            Языки программирования
          </h4>
        </div>
        <div class="tech-grid">
          <div class="tech-item expert">
            <div class="tech-icon">JS</div>
            <div class="tech-info">
              <div class="tech-name">JavaScript</div>
              <div class="tech-level expert">Эксперт</div>
            </div>
          </div>
          
          <div class="tech-item expert">
            <div class="tech-icon">TS</div>
            <div class="tech-info">
              <div class="tech-name">TypeScript</div>
              <div class="tech-level expert">Эксперт</div>
            </div>
          </div>
          
          <div class="tech-item intermediate">
            <div class="tech-icon python">Py</div>
            <div class="tech-info">
              <div class="tech-name">Python</div>
              <div class="tech-level intermediate">Средний</div>
            </div>
          </div>
          
          <div class="tech-item basic">
            <div class="tech-icon csharp">C#</div>
            <div class="tech-info">
              <div class="tech-name">C#</div>
              <div class="tech-level basic">Базовый</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Frontend фреймворки -->
      <div class="tech-category">
        <div class="category-header">
          <h4 class="category-title">
            <i class="category-icon">⚛️</i>
            Frontend фреймворки
          </h4>
        </div>
        <div class="tech-grid">
          <div class="tech-item expert">
            <div class="tech-icon vue">Vue</div>
            <div class="tech-info">
              <div class="tech-name">Vue.js</div>
              <div class="tech-level expert">Эксперт</div>
            </div>
          </div>
          
          <div class="tech-item expert">
            <div class="tech-icon nuxt">Nuxt</div>
            <div class="tech-info">
              <div class="tech-name">Nuxt.js</div>
              <div class="tech-level expert">Эксперт</div>
            </div>
          </div>
          
          <div class="tech-item basic">
            <div class="tech-icon react">React</div>
            <div class="tech-info">
              <div class="tech-name">React.js</div>
              <div class="tech-level basic">Базовый</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Инструменты и технологии -->
      <div class="tech-category">
        <div class="category-header">
          <h4 class="category-title">
            <i class="category-icon">🛠️</i>
            Инструменты и DevOps
          </h4>
        </div>
        <div class="tech-grid">
          <div class="tech-item expert">
            <div class="tech-icon git">Git</div>
            <div class="tech-info">
              <div class="tech-name">Git</div>
              <div class="tech-level expert">Эксперт</div>
            </div>
          </div>
          
          <div class="tech-item intermediate">
            <div class="tech-icon cicd">CI</div>
            <div class="tech-info">
              <div class="tech-name">CI/CD</div>
              <div class="tech-level intermediate">Средний</div>
            </div>
          </div>
          
          <div class="tech-item intermediate">
            <div class="tech-icon deploy">Deploy</div>
            <div class="tech-info">
              <div class="tech-name">Развертывание</div>
              <div class="tech-level intermediate">Средний</div>
            </div>
          </div>
          
          <div class="tech-item intermediate">
            <div class="tech-icon sentry">Sentry</div>
            <div class="tech-info">
              <div class="tech-name">Sentry</div>
              <div class="tech-level intermediate">Средний</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Дополнительные навыки -->
      <div class="tech-category">
        <div class="category-header">
          <h4 class="category-title">
            <i class="category-icon">🌟</i>
            Специализация
          </h4>
        </div>
        <div class="specialization-grid">
          <div class="specialization-item">
            <div class="spec-icon">🎨</div>
            <div class="spec-text">UI/UX Дизайн</div>
          </div>
          
          <div class="specialization-item">
            <div class="spec-icon">⚡</div>
            <div class="spec-text">Оптимизация производительности</div>
          </div>
          
          <div class="specialization-item">
            <div class="spec-icon">📱</div>
            <div class="spec-text">Адаптивный дизайн</div>
          </div>
          
          <div class="specialization-item">
            <div class="spec-icon">🔗</div>
            <div class="spec-text">Блокчейн интеграция</div>
          </div>
          
          <div class="specialization-item">
            <div class="spec-icon">📈</div>
            <div class="spec-text">Руководство командой</div>
          </div>
          
          <div class="specialization-item">
            <div class="spec-icon">🧪</div>
            <div class="spec-text">Тестирование и контроль качества</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.tech {
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

// Категории технологий
.tech-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tech-category {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(127, 92, 230, 0.3);
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.category-header {
  margin-bottom: 1.5rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--white-1000);
  margin: 0;

  .category-icon {
    font-size: 1.1em;
  }
}

// Сетка технологий
.tech-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  &.expert {
    border-color: rgba(92, 230, 115, 0.4);
    &:hover {
      background: rgba(92, 230, 115, 0.1);
      box-shadow: 0 8px 25px rgba(92, 230, 115, 0.3);
    }
  }

  &.intermediate {
    border-color: rgba(230, 195, 92, 0.4);
    &:hover {
      background: rgba(230, 195, 92, 0.1);
      box-shadow: 0 8px 25px rgba(230, 195, 92, 0.3);
    }
  }

  &.basic {
    border-color: rgba(230, 92, 168, 0.4);
    &:hover {
      background: rgba(230, 92, 168, 0.1);
      box-shadow: 0 8px 25px rgba(230, 92, 168, 0.3);
    }
  }
}

.tech-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  background: var(--black-800);
  color: var(--white-1000);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &.vue {
    background: linear-gradient(135deg, #2d7a57, #1e5d42);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  }

  &.nuxt {
    background: linear-gradient(135deg, #00a85f, #008a4f);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  }

  &.react {
    background: linear-gradient(135deg, #1e5f7a, #164a5e);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  }

  &.git {
    background: linear-gradient(135deg, #c73e1d, #a0321a);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  }

  &.csharp {
    background: linear-gradient(135deg, #5d2d91, #4a2374);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  }

  &.python {
    background: linear-gradient(135deg, #2b5b84, #1f4764);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  }

  &.cicd {
    background: linear-gradient(135deg, #6b46c1, #553c9a);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    font-size: 0.75rem;
  }

  &.deploy {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    font-size: 0.7rem;
  }

  &.sentry {
    background: linear-gradient(135deg, #362d59, #2a1f42);
    color: #ffffff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
    font-size: 0.7rem;
  }
}

.tech-info {
  flex: 1;
  min-width: 0;
}

.tech-name {
  font-weight: 600;
  color: var(--white-1000);
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.tech-level {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;

  &.expert {
    background: rgba(92, 230, 115, 0.2);
    color: var(--green);
  }

  &.intermediate {
    background: rgba(230, 195, 92, 0.2);
    color: var(--accent-yellow);
  }

  &.basic {
    background: rgba(230, 92, 168, 0.2);
    color: var(--accent-pink);
  }
}

// Специализация
.specialization-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.specialization-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
  }
}

.spec-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.spec-text {
  color: var(--white-800);
  font-size: 0.9rem;
  font-weight: 500;
}

// Адаптивность
@media (max-width: 767px) {
  .tech-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .tech-icon {
    width: 35px;
    height: 35px;
    font-size: 0.75rem;
  }

  .tech-name {
    font-size: 0.9rem;
  }

  .specialization-item {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .spec-text {
    font-size: 0.85rem;
  }
}
</style>