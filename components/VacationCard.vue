<template>
  <div class="vacation-card">
    <div class="vacation-card__header">
      <div class="vacation-card__employee">
        <div class="vacation-card__avatar">
          {{ getInitials(vacation.employeeName) }}
        </div>
        <h3 class="vacation-card__name">{{ vacation.employeeName }}</h3>
      </div>
      <div class="vacation-card__status" :class="`vacation-card__status--${getStatusColor(vacation.status)}`">
        {{ vacation.status }}
      </div>
    </div>
    
    <div class="vacation-card__dates">
      <div class="vacation-card__date">
        <span class="vacation-card__date-label">Начало:</span>
        <span class="vacation-card__date-value">{{ formatDate(vacation.startDate) }}</span>
      </div>
      <div v-if="vacation.endDate" class="vacation-card__date">
        <span class="vacation-card__date-label">Окончание:</span>
        <span class="vacation-card__date-value">{{ formatDate(vacation.endDate) }}</span>
      </div>
    </div>
    
    <div v-if="vacation.description" class="vacation-card__description">
      <p>{{ vacation.description }}</p>
    </div>
    
    <div v-if="isUpcoming" class="vacation-card__countdown">
      <span class="vacation-card__countdown-label">До отпуска:</span>
      <span class="vacation-card__countdown-value">{{ getDaysUntil(vacation.startDate) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VacationInfo } from '~/types/redmine';

const props = defineProps<{
  vacation: VacationInfo;
}>();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Новая': 'new',
    'В работе': 'in-progress',
    'Выполнена': 'completed',
    'Закрыта': 'closed',
    'Отклонена': 'rejected'
  };
  
  return statusMap[status] || 'default';
};

const isUpcoming = computed((): boolean => {
  const now = new Date();
  const startDate = new Date(props.vacation.startDate);
  return startDate > now;
});

const getDaysUntil = (dateString: string): string => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 день';
  if (diffDays < 5) return `${diffDays} дня`;
  return `${diffDays} дней`;
};
</script>

<style scoped lang="scss">
.vacation-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  &__employee {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 16px;
  }

  &__name {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
  }

  &__status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    
    &--new {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    &--in-progress {
      background: #fff3e0;
      color: #f57c00;
    }
    
    &--completed {
      background: #e8f5e8;
      color: #388e3c;
    }
    
    &--closed {
      background: #f3e5f5;
      color: #7b1fa2;
    }
    
    &--rejected {
      background: #ffebee;
      color: #d32f2f;
    }
    
    &--default {
      background: #f5f5f5;
      color: #757575;
    }
  }

  &__dates {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__date-label {
    font-size: 14px;
    color: #718096;
    min-width: 80px;
  }

  &__date-value {
    font-size: 14px;
    color: #2d3748;
    font-weight: 500;
  }

  &__description {
    margin-bottom: 16px;
    
    p {
      font-size: 14px;
      color: #4a5568;
      line-height: 1.5;
      margin: 0;
    }
  }

  &__countdown {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #3182ce;
  }

  &__countdown-label {
    font-size: 14px;
    color: #4a5568;
  }

  &__countdown-value {
    font-size: 14px;
    color: #3182ce;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .vacation-card {
    padding: 16px;
    
    &__header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    
    &__dates {
      gap: 6px;
    }
    
    &__date {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    
    &__date-label {
      min-width: auto;
    }
  }
}
</style> 