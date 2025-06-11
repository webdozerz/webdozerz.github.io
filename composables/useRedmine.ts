import type { VacationInfo } from '~/types/redmine';

export const useRedmine = () => {
  const getVacations = async (): Promise<VacationInfo[]> => {
    try {
      // Используем наш серверный API endpoint
      const data = await $fetch<VacationInfo[]>('/api/vacations');
      return data;
    } catch (error) {
      console.error('Ошибка при получении данных об отпусках:', error);
      throw new Error('Не удалось получить данные об отпусках');
    }
  };

  const getActiveVacations = async (): Promise<VacationInfo[]> => {
    const vacations = await getVacations();
    const now = new Date();
    
    return vacations.filter(vacation => {
      if (!vacation.startDate) return false;
      
      const startDate = new Date(vacation.startDate);
      const endDate = vacation.endDate ? new Date(vacation.endDate) : null;
      
      // Активные отпуска: начались, но еще не закончились
      return startDate <= now && (!endDate || endDate >= now);
    });
  };

  const getUpcomingVacations = async (): Promise<VacationInfo[]> => {
    const vacations = await getVacations();
    const now = new Date();
    
    return vacations.filter(vacation => {
      if (!vacation.startDate) return false;
      
      const startDate = new Date(vacation.startDate);
      
      // Предстоящие отпуска: еще не начались
      return startDate > now;
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return {
    getVacations,
    getActiveVacations,
    getUpcomingVacations,
    formatDate
  };
}; 