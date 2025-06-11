export type RedmineIssue = {
  id: number;
  subject: string;
  description: string;
  status: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  created_on: string;
  updated_on: string;
  start_date?: string;
  due_date?: string;
  custom_fields?: CustomField[];
};

export type CustomField = {
  id: number;
  name: string;
  value: string | string[];
};

export type RedmineResponse<T> = {
  issues?: T[];
  total_count: number;
  offset: number;
  limit: number;
};

export type VacationInfo = {
  employeeName: string;
  startDate: string;
  endDate?: string;
  status: string;
  description?: string;
};

export type RedmineConfig = {
  url: string;
  apiKey?: string;
  username?: string;
  password?: string;
  projectId: string;
}; 