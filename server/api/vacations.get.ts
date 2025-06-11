import axios from 'axios';

interface RedmineIssue {
  id: number;
  subject: string;
  assigned_to?: { name: string };
  author?: { name: string };
  start_date?: string;
  created_on: string;
  due_date?: string;
  status: { name: string };
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  
  try {
    // Создаем клиент для запросов к Redmine
    const client = axios.create({
      baseURL: config.public.redmineUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Настраиваем авторизацию
    if (config.redmineApiKey) {
      client.defaults.headers.common['X-Redmine-API-Key'] = config.redmineApiKey;
    } else if (config.redmineUsername && config.redminePassword) {
      client.defaults.auth = {
        username: config.redmineUsername,
        password: config.redminePassword,
      };
    }

    // Делаем запрос к Redmine API
    const response = await client.get(`/projects/${config.public.redmineProjectId}/issues.json`, {
      params: {
        limit: 100,
        status_id: '*', // Все статусы
      },
    });

    const issues: RedmineIssue[] = response.data.issues || [];

    // Дедупликация и маппинг (копируем логику из composable)
    const groupedVacations = new Map<string, RedmineIssue[]>();
    
    issues.forEach((issue: RedmineIssue) => {
      const normalizedSubject = issue.subject
        .replace(/\s+/g, ' ')
        .trim();
      
      if (!groupedVacations.has(normalizedSubject)) {
        groupedVacations.set(normalizedSubject, []);
      }
      groupedVacations.get(normalizedSubject)!.push(issue);
    });

    const uniqueIssues = Array.from(groupedVacations.values()).map(group => group[0]);

    // Маппим в VacationInfo формат
    const vacations = uniqueIssues.map((issue: RedmineIssue) => ({
      employeeName: issue.assigned_to?.name || issue.author?.name || 'Неизвестно',
      startDate: issue.start_date || issue.created_on,
      endDate: issue.due_date,
      status: issue.status.name,
      description: issue.subject,
    }));

    return vacations;

  } catch (error: unknown) {
    console.error('Ошибка при получении данных из Redmine:', error);
    const axiosError = error as { response?: { status?: number }; message?: string };
    throw createError({
      statusCode: axiosError.response?.status || 500,
      statusMessage: axiosError.message || 'Не удалось получить данные об отпусках'
    });
  }
}); 