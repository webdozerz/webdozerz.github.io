import axios, { type AxiosInstance } from 'axios';
import type { RedmineConfig, RedmineIssue, RedmineResponse, VacationInfo } from '~/types/redmine';

export const useRedmine = () => {
  const config = useRuntimeConfig();
  
  const getRedmineConfig = (): RedmineConfig => {
    const redmineConfig: RedmineConfig = {
      url: config.public.redmineUrl as string || 'https://redmine.crypton.studio',
      projectId: config.public.redmineProjectId as string || 'vacation',
    };

    // Приоритет API ключу
    if (config.redmineApiKey) {
      redmineConfig.apiKey = config.redmineApiKey as string;
    } else if (config.redmineUsername && config.redminePassword) {
      redmineConfig.username = config.redmineUsername as string;
      redmineConfig.password = config.redminePassword as string;
    }

    return redmineConfig;
  };

  const createClient = (config: RedmineConfig): AxiosInstance => {
    const client = axios.create({
      baseURL: config.url,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (config.apiKey) {
      client.defaults.headers.common['X-Redmine-API-Key'] = config.apiKey;
    } else if (config.username && config.password) {
      client.defaults.auth = {
        username: config.username,
        password: config.password,
      };
    }

    return client;
  };

  const getVacationIssues = async (): Promise<RedmineIssue[]> => {
    const redmineConfig = getRedmineConfig();
    const client = createClient(redmineConfig);

    console.log(`🔧 Делаем запрос к: ${redmineConfig.url}/projects/${redmineConfig.projectId}/issues.json`);
    console.log('🔧 Конфигурация авторизации:', {
      hasApiKey: !!redmineConfig.apiKey,
      hasUsername: !!redmineConfig.username,
      hasPassword: !!redmineConfig.password,
    });

    try {
      const response = await client.get<RedmineResponse<RedmineIssue>>(
        `/projects/${redmineConfig.projectId}/issues.json`,
        {
          params: {
            limit: 100,
            status_id: '*', // Все статусы
          },
        }
      );

      console.log(`✅ Успешный ответ от Redmine, статус: ${response.status}`);
      console.log(`✅ Количество задач в ответе: ${response.data.issues?.length || 0}`);
      
      return response.data.issues || [];
    } catch (error) {
      console.error('❌ Детальная ошибка при получении данных из Redmine:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        response: error && typeof error === 'object' && 'response' in error ? {
          status: (error as { response?: { status?: number } }).response?.status,
          statusText: (error as { response?: { statusText?: string } }).response?.statusText,
          data: (error as { response?: { data?: unknown } }).response?.data
        } : null
      });
      throw new Error('Не удалось получить данные об отпусках');
    }
  };

  const deduplicateVacations = (issues: RedmineIssue[]): RedmineIssue[] => {
    const groupedVacations = new Map<string, RedmineIssue[]>();
    
    issues.forEach(issue => {
      // Нормализуем текст: убираем переносы строк и лишние пробелы
      const normalizedSubject = issue.subject
        .replace(/\s+/g, ' ') // Заменяем любые пробельные символы (включая \n) на один пробел
        .trim(); // Убираем пробелы в начале и конце
      
      if (!groupedVacations.has(normalizedSubject)) {
        groupedVacations.set(normalizedSubject, []);
      }
      groupedVacations.get(normalizedSubject)!.push(issue);
    });

    return Array.from(groupedVacations.values()).map(group => group[0]);
  };

  const mapIssueToVacationInfo = (issue: RedmineIssue): VacationInfo => {
    return {
      employeeName: issue.assigned_to?.name || issue.author?.name || 'Неизвестно',
      startDate: issue.start_date || issue.created_on,
      endDate: issue.due_date,
      status: issue.status.name,
      description: issue.subject,
    };
  };

  const getVacations = async (): Promise<VacationInfo[]> => {
    try {
      console.log('🔧 Начинаем загрузку данных из Redmine...');
      console.log('🔧 Runtime config:', {
        redmineUrl: config.public.redmineUrl,
        projectId: config.public.redmineProjectId,
        hasApiKey: !!config.redmineApiKey,
        hasUsername: !!config.redmineUsername,
        hasPassword: !!config.redminePassword,
      });
      
      // Делаем прямой запрос к Redmine API
      const issues = await getVacationIssues();
      console.log(`✅ Получено ${issues.length} задач из Redmine`);
      
      const vacations = deduplicateVacations(issues).map(issue => mapIssueToVacationInfo(issue));
      console.log(`✅ Обработано ${vacations.length} отпусков после дедупликации`);
      
      return vacations;
    } catch (error) {
      console.error('❌ Ошибка при получении данных:', error);
      
      // Если ошибка CORS, возвращаем пустой массив вместо ошибки
      if (error instanceof Error && error.message.includes('CORS')) {
        console.log('⚠️ CORS ошибка - возвращаем пустой массив');
        return [];
      }
      
      throw error;
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