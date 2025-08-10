<template>
  <div class="bio">
    <!-- Аватар -->
    <div class="bio__avatar">
      <div class="avatar-ring">
        <div class="avatar-inner">
          <span class="avatar-text">ИА</span>
        </div>
      </div>
    </div>

    <!-- Основная информация -->
    <div class="bio__content">
      <h1 class="bio__name">
        <span class="name-highlight">Андрюшов</span>
        <span class="name-regular">Илья</span>
      </h1>
      
      <div class="bio__role">
        <span class="role-text">Frontend Developer</span>
        <div class="role-badge">
          <span class="badge-text">Middle+</span>
        </div>
      </div>

      <p class="bio__description">
        Специализируюсь на создании удобных и интуитивно понятных веб-приложений, 
        интерфейсов, а также проектов на основе блокчейн-технологий и других инноваций.
      </p>

      <!-- Контакты -->
      <div class="bio__contacts">
        <a class="contact-link email" href="mailto:webdozerz@gmail.com">
          <i class="icon">✉</i>
          <span>webdozerz@gmail.com</span>
        </a>
        
        <div class="contact-links">
          <a class="contact-link social" href="#" title="GitHub">
            <i class="icon">⚡</i>
            <span>GitHub</span>
          </a>
          <a class="contact-link social" href="#" title="LinkedIn">
            <i class="icon">💼</i>
            <span>LinkedIn</span>
          </a>
          <a class="contact-link social" href="#" title="Telegram">
            <i class="icon">📱</i>
            <span>Telegram</span>
          </a>
        </div>
      </div>

      <!-- Статистика -->
      <div class="bio__stats">
        <div class="stat-item">
          <span class="stat-number">5+</span>
          <span class="stat-label">лет опыта</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">50+</span>
          <span class="stat-label">проектов</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">1M+</span>
          <span class="stat-label">пользователей</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bio {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  padding: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    gap: 3rem;
    align-items: flex-start;
  }
}

// Аватар
.bio__avatar {
  flex-shrink: 0;
}

.avatar-ring {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 50%, var(--green) 100%);
  padding: 4px;
  animation: pulse 3s ease-in-out infinite alternate;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--black-900);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.avatar-text {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 30px rgba(127, 92, 230, 0.3);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 0 50px rgba(127, 92, 230, 0.5);
  }
}

// Основной контент
.bio__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

// Имя
.bio__name {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 0;

  .name-highlight {
    background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .name-regular {
    color: var(--white-1000);
    margin-left: 0.5rem;
  }
}

// Роль
.bio__role {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.role-text {
  font-size: 1.25rem;
  color: var(--white-800);
  font-weight: 500;
}

.role-badge {
  background: linear-gradient(135deg, var(--green) 0%, var(--accent-cyan) 100%);
  color: var(--black-1000);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 15px rgba(92, 230, 115, 0.3);
}

// Описание
.bio__description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--white-800);
  margin: 0;
  max-width: 600px;
}

// Контакты
.bio__contacts {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: center;
  }
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--white-1000);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 500;
  position: relative;
  overflow: hidden;

  .icon {
    font-size: 1.2rem;
  }

  &.email {
    background: rgba(92, 230, 115, 0.1);
    border: 1px solid rgba(92, 230, 115, 0.3);
    
    &:hover {
      background: rgba(92, 230, 115, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(92, 230, 115, 0.3);
    }
  }

  &.social {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
  }
}

.contact-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

// Статистика
.bio__stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: 768px) {
    align-items: flex-start;
    text-align: left;
  }
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--purple) 0%, var(--blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--white-700);
  margin-top: 0.25rem;
}
</style>
