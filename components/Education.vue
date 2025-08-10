<template>
  <div class="education">
    <div class="section-header">
      <h3 class="section-title">
        <i class="title-icon">🎓</i>
        Образование
      </h3>
      <div class="section-subtitle">Академический фундамент</div>
    </div>

    <div class="education-content">
      <div class="education-card">
        <!-- Университет -->
        <div class="university-info">
          <div class="university-logo">
            <div class="logo-circle">
              <span class="logo-text">ТПУ</span>
            </div>
          </div>
          
          <div class="university-details">
            <h4 class="university-name">Томский Политехнический Университет</h4>
            <div class="degree-info">
              <div class="degree-title">Прикладная математика и информатика</div>
              <div class="degree-level">Бакалавр</div>
            </div>
          </div>
        </div>

        <!-- Период обучения -->
        <div class="study-period">
          <div class="period-badge">
            <i class="period-icon">📅</i>
            <span>2016 - 2020</span>
          </div>
          <div class="duration">4 года</div>
        </div>

        <!-- Ключевые предметы -->
        <div class="key-subjects">
          <h5 class="subjects-title">Ключевые дисциплины:</h5>
          <div class="subjects-grid">
            <div class="subject-item">
              <i class="subject-icon">💡</i>
              <span>Алгоритмы и структуры данных</span>
            </div>
            <div class="subject-item">
              <i class="subject-icon">📊</i>
              <span>Математическое моделирование</span>
            </div>
            <div class="subject-item">
              <i class="subject-icon">💻</i>
              <span>Программирование</span>
            </div>
            <div class="subject-item">
              <i class="subject-icon">🔢</i>
              <span>Дискретная математика</span>
            </div>
            <div class="subject-item">
              <i class="subject-icon">📈</i>
              <span>Статистика и анализ данных</span>
            </div>
            <div class="subject-item">
              <i class="subject-icon">🌐</i>
              <span>Веб-технологии</span>
            </div>
          </div>
        </div>

        <!-- Достижения -->
        <div class="achievements">
          <h5 class="achievements-title">Достижения:</h5>
          <div class="achievement-list">
            <div class="achievement-item">
              <i class="achievement-icon">🏆</i>
              <span>Успешное завершение программы</span>
            </div>
            <div class="achievement-item">
              <i class="achievement-icon">💼</i>
              <span>Практические проекты в области веб-разработки</span>
            </div>
          </div>
        </div>

        <!-- Фоновая декорация -->
        <div class="card-decoration"/>
      </div>

      <!-- Дополнительное образование -->
      <div class="additional-education">
        <h4 class="additional-title">
          <i class="additional-icon">📚</i>
          Дополнительное образование
        </h4>
        
        <div class="additional-items">
          <div class="additional-item">
            <div class="item-header">
              <div class="item-title">Самообразование в Frontend разработке</div>
              <div class="item-period">2017 - по настоящее время</div>
            </div>
            <div class="item-description">
              Постоянное изучение новых технологий, фреймворков и лучших практик в веб-разработке
            </div>
          </div>
          
          <div class="additional-item">
            <div class="item-header">
              <div class="item-title">Онлайн курсы и сертификации</div>
              <div class="item-period">Ongoing</div>
            </div>
            <div class="item-description">
              Прохождение специализированных курсов по Vue.js, TypeScript, современным подходам к разработке
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
.education {
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

// Основной контент
.education-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// Карточка образования
.education-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(127, 92, 230, 0.4);
  }

  @media (max-width: 767px) {
    padding: 1.5rem;
  }
}

// Информация об университете
.university-info {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-start;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
}

.university-logo {
  flex-shrink: 0;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(127, 92, 230, 0.3);

  @media (max-width: 767px) {
    width: 60px;
    height: 60px;
  }
}

.logo-text {
  color: var(--white-1000);
  font-weight: 700;
  font-size: 1.25rem;

  @media (max-width: 767px) {
    font-size: 1rem;
  }
}

.university-details {
  flex: 1;
  min-width: 0;
}

.university-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--white-1000);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;

  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
}

.degree-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
}

.degree-title {
  font-size: 1.1rem;
  color: var(--white-800);
  font-weight: 500;
}

.degree-level {
  background: rgba(92, 230, 115, 0.2);
  color: var(--green);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  width: fit-content;
}

// Период обучения
.study-period {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

.period-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--white-1000);
  font-weight: 500;
}

.period-icon {
  font-size: 1.1rem;
}

.duration {
  color: var(--white-700);
  font-size: 0.9rem;
}

// Ключевые предметы
.key-subjects {
  margin-bottom: 2rem;
}

.subjects-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--white-1000);
  margin: 0 0 1rem 0;
}

.subjects-grid {
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

.subject-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: var(--white-800);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
  }
}

.subject-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

// Достижения
.achievements {
  margin-bottom: 1rem;
}

.achievements-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--white-1000);
  margin: 0 0 1rem 0;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(92, 230, 115, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(92, 230, 115, 0.2);
  font-size: 0.9rem;
  color: var(--white-800);
}

.achievement-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

// Дополнительное образование
.additional-education {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.additional-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--white-1000);
  margin: 0 0 1.5rem 0;
}

.additional-icon {
  font-size: 1.2rem;
}

.additional-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.additional-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-2px);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.5rem;
  }
}

.item-title {
  font-weight: 600;
  color: var(--white-1000);
  line-height: 1.3;
}

.item-period {
  color: var(--white-700);
  font-size: 0.875rem;
  white-space: nowrap;
}

.item-description {
  color: var(--white-800);
  line-height: 1.5;
  font-size: 0.9rem;
}

// Декоративный элемент
.card-decoration {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(127, 92, 230, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}
</style>