<template>
  <div class="vacations-page">
    <div class="container">
      <div class="vacations-header">
        <h1 class="vacations-title">🏖️ Отпуска Crypton</h1>
        <p class="vacations-subtitle">Информация об отпусках сотрудников из системы Redmine</p>
      </div>

      <div v-if="pending" class="loading">
        <div class="loading-spinner"/>
        <p>Загружаем данные об отпусках...</p>
      </div>

      <div v-else-if="error" class="error">
        <div class="error-icon">❌</div>
        <h3>Ошибка при загрузке данных</h3>
        <p>{{ error.message }}</p>
        <button class="retry-btn" @click="refresh()">Попробовать снова</button>
      </div>

      <div v-else-if="!allVacations || allVacations.length === 0" class="empty">
        <div class="empty-icon">📭</div>
        <h3>Нет данных об отпусках</h3>
        <p>Проверьте настройки подключения к Redmine</p>
      </div>

      <div v-else class="vacations-list">
        <div 
          v-for="vacation in allVacations"
          :key="`${vacation.employeeName}-${vacation.startDate}`"
          class="vacation-item"
        >
          <div class="vacation-parsed">
            <div class="vacation-field">
              <span class="field-label">Сотрудник:</span>
              <span class="field-value">{{ parseVacationDescription(vacation.description).employee }}</span>
            </div>
            <div class="vacation-field">
              <span class="field-label">С:</span>
              <span class="field-value">{{ parseVacationDescription(vacation.description).startDate }}</span>
            </div>
            <div class="vacation-field">
              <span class="field-label">По:</span>
              <span class="field-value">{{ parseVacationDescription(vacation.description).endDate }}</span>
            </div>
            <div class="vacation-field">
              <span class="field-label">Тип:</span>
              <span class="field-value">{{ parseVacationDescription(vacation.description).type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VacationInfo } from '~/types/redmine';

// Получаем данные об отпусках во время сборки (SSG)
const { data: allVacations, pending, error, refresh } = await useAsyncData(
  'vacations',
  async () => {
    const { getVacations } = useRedmine();
    return await getVacations();
  },
  {
    default: () => [] as VacationInfo[]
  }
);

// Функция для парсинга описания отпуска
const parseVacationDescription = (description: string | undefined) => {
  if (!description) {
    return {
      employee: 'Неизвестно',
      startDate: 'Неизвестно',
      endDate: 'Неизвестно',
      type: 'Неизвестно'
    };
  }

  // Регулярное выражение для поиска дат в разных форматах:
  // дд.мм.гггг, д.мм.гггг, дд.мм.гг, д.мм.гг
  const dateRegex = /(\d{1,2}\.\d{1,2}\.(?:\d{4}|\d{2}))/g;
  const dates = description.match(dateRegex);
  
  if (!dates || dates.length < 2) {
    // Если нет двух дат, возвращаем исходную строку
    return {
      employee: description,
      startDate: 'Не удалось распарсить',
      endDate: 'Не удалось распарсить',
      type: 'Не удалось распарсить'
    };
  }

  // Нормализуем даты (добавляем 20 к году если он двузначный)
  const normalizeDate = (date: string): string => {
    const parts = date.split('.');
    if (parts.length === 3 && parts[2].length === 2) {
      // Если год двузначный, добавляем 20
      parts[2] = '20' + parts[2];
      return parts.join('.');
    }
    return date;
  };

  const startDate = normalizeDate(dates[0]);
  const endDate = normalizeDate(dates[1]);

  // Извлекаем имя сотрудника (все до первой даты)
  const beforeFirstDate = description.split(dates[0])[0].trim();
  // Убираем последнее слово если это предлог "с"
  const employee = beforeFirstDate.replace(/\s+с\s*$/, '').trim();

  // Извлекаем тип отпуска (все после второй даты)
  const afterSecondDate = description.split(dates[1])[1];
  let type = 'Не указан';
  
  if (afterSecondDate) {
    // Убираем различные предлоги и знаки в начале
    type = afterSecondDate
      .replace(/^\s*[-–—]\s*/, '') // убираем тире в начале
      .replace(/^\s*по\s*/, '') // убираем "по" в начале
      .replace(/^\s*\(включительно\)\s*/, '') // убираем "(включительно)"
      .trim();
    
    if (!type) {
      type = 'Не указан';
    }
  }

  return {
    employee,
    startDate,
    endDate,
    type
  };
};

// SEO мета-теги
useHead({
  title: 'Отпуска Crypton - Система учета отпусков',
  meta: [
    { name: 'description', content: 'Система учета и мониторинга отпусков сотрудников Crypton на базе Redmine' },
    { name: 'keywords', content: 'отпуска, crypton, redmine, сотрудники, HR' }
  ]
});
</script>

<style scoped lang="scss">
.vacations-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.vacations-header {
  text-align: center;
  margin-bottom: 40px;
}

.vacations-title {
  font-size: 48px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.vacations-subtitle {
  font-size: 18px;
  color: #718096;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error, .empty {
  text-align: center;
  padding: 60px 20px;
}

.error-icon, .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error h3, .empty h3 {
  font-size: 24px;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.error p, .empty p {
  font-size: 16px;
  color: #718096;
  margin: 0 0 24px 0;
}

.retry-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.vacations-list {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vacation-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  font-size: 16px;
  color: #2d3748;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
}

.vacation-parsed {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vacation-field {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-label {
  font-weight: 600;
  color: #4a5568;
  min-width: 100px;
  font-size: 14px;
}

.field-value {
  color: #2d3748;
  font-weight: 500;
}

@media (max-width: 768px) {
  .vacations-page {
    padding: 16px 0;
  }
  
  .vacations-title {
    font-size: 32px;
  }
  
  .vacations-subtitle {
    font-size: 16px;
  }

  .vacations-list {
    padding: 16px;
  }
  
  .vacation-item {
    font-size: 14px;
    padding: 12px 0;
  }
}
</style> 