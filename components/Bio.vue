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
          <svg class="icon email-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>webdozerz@gmail.com</span>
        </a>
        
        <div class="contact-links">
          <a class="contact-link social" href="https://github.com/webdozerz" title="GitHub" target="_blank">
            <svg class="icon github-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5C0 17.92 3.44 22.49 8.2 24.09C8.8 24.2 9 23.83 9 23.51V21.32C5.73 22.05 5.02 19.85 5.02 19.85C4.48 18.5 3.68 18.13 3.68 18.13C2.55 17.37 3.77 17.39 3.77 17.39C5.04 17.48 5.68 18.66 5.68 18.66C6.79 20.58 8.57 20.04 9.05 19.8C9.16 19.01 9.48 18.47 9.84 18.24C7.17 18 4.38 16.93 4.38 12.14C4.38 10.85 4.84 9.8 5.7 8.99C5.57 8.75 5.15 7.49 5.82 5.78C5.82 5.78 6.87 5.45 8.98 6.85C9.98 6.6 11.02 6.47 12.05 6.47C13.08 6.47 14.12 6.6 15.12 6.85C17.23 5.45 18.28 5.78 18.28 5.78C18.95 7.49 18.53 8.75 18.4 8.99C19.26 9.8 19.72 10.85 19.72 12.14C19.72 16.94 16.92 17.99 14.24 18.22C14.69 18.59 15.1 19.32 15.1 20.43V23.51C15.1 23.84 15.3 24.21 15.91 24.08C20.66 22.48 24.1 17.91 24.1 12.5C24.1 5.87 18.73 0.5 12 0.5Z" fill="currentColor"/>
            </svg>
            <span>GitHub</span>
          </a>
          <a class="contact-link social" href="https://www.linkedin.com/in/web-dev-ill/" title="LinkedIn" target="_blank">
            <svg class="icon linkedin-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8C18.5 8 20.5 10 20.5 12.5V21H17V12.5C17 11.5 16 10.5 15 10.5C14 10.5 13 11.5 13 12.5V21H9.5V8H13V9.5C13.5 8.5 14.5 8 16 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="2" y="8" width="4" height="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>LinkedIn</span>
          </a>
          <a class="contact-link social" href="https://t.me/web_dev_ill" title="Telegram" target="_blank">
            <svg class="icon telegram-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 3L3 10.5L11 13.5L14 21.5L21 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11 13.5L16 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
          <span class="stat-number">10+</span>
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
    
    &.email-icon,
    &.github-icon,
    &.linkedin-icon,
    &.telegram-icon {
      width: 1.2rem;
      height: 1.2rem;
      flex-shrink: 0;
    }
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
