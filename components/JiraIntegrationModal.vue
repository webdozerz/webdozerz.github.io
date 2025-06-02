<template>
  <div v-if="isVisible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Интеграция с Jira</h2>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <form class="jira-form" @submit.prevent="handleExport">
          <!-- Настройки подключения -->
          <div class="detail-section">
            <h3>Настройки подключения</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="label">URL Jira (например: https://company.atlassian.net)</label>
                <input
                  v-model="jiraSettings.url"
                  class="input"
                  placeholder="https://company.atlassian.net"
                  required
                >
              </div>
              <div class="form-group">
                <label class="label">Email пользователя</label>
                <input
                  v-model="jiraSettings.email"
                  class="input"
                  type="email"
                  placeholder="user@company.com"
                  required
                >
              </div>
              <div class="form-group">
                <label class="label">API Token</label>
                <input
                  v-model="jiraSettings.apiToken"
                  class="input"
                  type="password"
                  placeholder="Ваш API токен из Jira"
                  required
                >
              </div>
              <div class="form-group">
                <label class="label">Ключ проекта</label>
                <input
                  v-model="jiraSettings.projectKey"
                  class="input"
                  placeholder="PROJ"
                  required
                >
              </div>
            </div>
          </div>

          <!-- Настройки задачи -->
          <div class="detail-section">
            <h3>Настройки задачи</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="label">Название задачи</label>
                <input
                  v-model="jiraTask.summary"
                  class="input"
                  placeholder="Разработка компонентов"
                  required
                >
              </div>
              <div class="form-group">
                <label class="label">Тип задачи</label>
                <select v-model="jiraTask.issueType" class="select">
                  <option value="Task">Task</option>
                  <option value="Story">Story</option>
                  <option value="Epic">Epic</option>
                </select>
              </div>
              <div class="form-group">
                <label class="label">Исполнитель (email)</label>
                <input
                  v-model="jiraTask.assignee"
                  class="input"
                  type="email"
                  placeholder="developer@company.com"
                >
              </div>
            </div>
            
            <div class="form-group full-width">
              <label class="label">Описание задачи</label>
              <textarea 
                v-model="jiraTask.description"
                class="textarea"
                rows="4"
                placeholder="Описание задачи с деталями расчета"
              />
            </div>
          </div>

          <!-- Предпросмотр -->
          <div class="detail-section">
            <h3>Предпросмотр оценок</h3>
            <div class="jira-preview">
              <div class="estimate-item">
                <span>Оптимистичная оценка:</span>
                <span>{{ hours.optimistic }}ч ({{ Math.round(hours.optimistic / 8 * 10) / 10 }} дней)</span>
              </div>
              <div class="estimate-item">
                <span>Реалистичная оценка:</span>
                <span>{{ hours.realistic }}ч ({{ Math.round(hours.realistic / 8 * 10) / 10 }} дней)</span>
              </div>
              <div class="estimate-item">
                <span>Пессимистичная оценка:</span>
                <span>{{ hours.pessimistic }}ч ({{ Math.round(hours.pessimistic / 8 * 10) / 10 }} дней)</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <div class="flex gap-3">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Отмена
          </button>
          <button 
            type="button" 
            class="btn btn-success" 
            :disabled="!canExport"
            @click="handleExport"
          >
            {{ isExporting ? 'Создаем задачу...' : 'Создать задачу' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue'

interface Hours {
  optimistic: number
  realistic: number
  pessimistic: number
}

interface FormState {
  counts: Record<string, number>
  countsWithBase: Record<string, number>
  countsNewProps: Record<string, number>
  uiComplex: 'static' | 'interactive'
  stateLayer: 'local' | 'global'
  apiType: 'none' | 'simple' | 'crud'
  i18n: 'none' | 'simple' | 'advanced'
  devLevel: 'junior' | 'middle' | 'senior'
  ssr: boolean
  seoAdvanced: boolean
  testsUnit: boolean
  testsE2E: boolean
  responsive: boolean
  accessibility: boolean
  codeReview: boolean
  documentation: boolean
  deployment: boolean
}

interface ComponentLabels {
  [key: string]: string
}

const props = defineProps<{
  isVisible: boolean
  hours: Hours
  formState: FormState
  componentTypes: string[]
  labels: ComponentLabels
}>()

const emit = defineEmits<{
  close: []
  success: [result: { key: string; url: string }]
}>()

// Настройки Jira
const jiraSettings = reactive({
  url: '',
  email: '',
  apiToken: '',
  projectKey: ''
})

// Данные задачи Jira
const jiraTask = reactive({
  summary: 'Разработка компонентов',
  description: '',
  issueType: 'Task',
  assignee: ''
})

const isExporting = ref(false)

// Загружаем сохраненные настройки из localStorage
onMounted(() => {
  const savedJiraSettings = localStorage.getItem('jiraSettings')
  if (savedJiraSettings) {
    try {
      const parsed = JSON.parse(savedJiraSettings)
      Object.assign(jiraSettings, parsed)
    } catch (e) {
      console.warn('Не удалось загрузить настройки Jira:', e)
    }
  }
})

// Проверка возможности экспорта в Jira
const canExport = computed(() => {
  return jiraSettings.url && 
         jiraSettings.email && 
         jiraSettings.apiToken && 
         jiraSettings.projectKey && 
         jiraTask.summary && 
         !isExporting.value
})

// Функция создания описания задачи
function generateJiraDescription() {
  const components = props.componentTypes
    .filter(type => (props.formState.counts[type] || 0) > 0)
    .map(type => `• ${props.labels[type]}: ${props.formState.counts[type]} шт.`)
    .join('\n')
  
  const settings = []
  if (props.formState.uiComplex !== 'static') settings.push(`• UI: Интерактивная`)
  if (props.formState.stateLayer !== 'local') settings.push(`• Состояние: Глобальное`)
  if (props.formState.apiType !== 'none') settings.push(`• API: ${props.formState.apiType === 'simple' ? 'Простой GET' : 'Полный CRUD'}`)
  if (props.formState.i18n !== 'none') settings.push(`• i18n: ${props.formState.i18n === 'simple' ? 'Строки' : 'Склонения / RTL'}`)
  if (props.formState.devLevel !== 'middle') settings.push(`• Грейд: ${props.formState.devLevel === 'junior' ? 'Junior' : 'Senior'}`)
  
  const features = []
  if (props.formState.ssr) features.push('• SSR')
  if (props.formState.seoAdvanced) features.push('• Расширенный SEO')
  if (props.formState.testsUnit) features.push('• Unit-тесты')
  if (props.formState.testsE2E) features.push('• E2E-тесты')
  if (props.formState.responsive) features.push('• Адаптивный дизайн')
  if (props.formState.accessibility) features.push('• Доступность (a11y)')
  if (props.formState.codeReview) features.push('• Код-ревью')
  if (props.formState.documentation) features.push('• Документация')
  if (props.formState.deployment) features.push('• Настройка деплоя')
  
  let description = jiraTask.description || 'Разработка компонентов с расчетом трудозатрат'
  description += '\n\n*Компоненты:*\n' + components
  
  if (settings.length > 0) {
    description += '\n\n*Настройки проекта:*\n' + settings.join('\n')
  }
  
  if (features.length > 0) {
    description += '\n\n*Дополнительные требования:*\n' + features.join('\n')
  }
  
  description += `\n\n*Оценки времени:*
• Оптимистичная: ${props.hours.optimistic}ч (${Math.round(props.hours.optimistic / 8 * 10) / 10} дней)
• Реалистичная: ${props.hours.realistic}ч (${Math.round(props.hours.realistic / 8 * 10) / 10} дней)
• Пессимистичная: ${props.hours.pessimistic}ч (${Math.round(props.hours.pessimistic / 8 * 10) / 10} дней)

_Расчет выполнен калькулятором трудозатрат_`
  
  return description
}

// Функция экспорта в Jira
async function handleExport() {
  if (!canExport.value) return
  
  isExporting.value = true
  
  try {
    // Сохраняем настройки в localStorage (без API токена)
    const settingsToSave = {
      url: jiraSettings.url,
      email: jiraSettings.email,
      projectKey: jiraSettings.projectKey
    }
    localStorage.setItem('jiraSettings', JSON.stringify(settingsToSave))
    
    // Подготавливаем данные для API
    const auth = btoa(`${jiraSettings.email}:${jiraSettings.apiToken}`)
    const apiUrl = `${jiraSettings.url.replace(/\/$/, '')}/rest/api/3/issue`
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const issueData: any = {
      fields: {
        project: { key: jiraSettings.projectKey },
        summary: jiraTask.summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: generateJiraDescription()
                }
              ]
            }
          ]
        },
        issuetype: { name: jiraTask.issueType },
        // Добавляем оценку времени (в секундах)
        timetracking: {
          originalEstimate: `${props.hours.realistic}h`
        }
      }
    }
    
    // Добавляем исполнителя если указан
    if (jiraTask.assignee) {
      issueData.fields.assignee = { emailAddress: jiraTask.assignee }
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(issueData)
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Ошибка создания задачи: ${response.status} ${response.statusText}\n${errorData}`)
    }
    
    const result = await response.json()
    const issueUrl = `${jiraSettings.url}/browse/${result.key}`
    
    // Уведомляем родительский компонент об успехе
    emit('success', { key: result.key, url: issueUrl })
    
    // Закрываем модальное окно
    emit('close')
    
  } catch (error) {
    console.error('Ошибка при создании задачи в Jira:', error)
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
    alert(`Ошибка при создании задачи в Jira:\n${errorMessage}`)
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 0 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

/* Detail sections */
.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

/* Jira form styles */
.jira-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #111827;
}

.input,
.select {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: #111827;
  transition: border-color 0.2s;
  width: 100%;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  background: white;
  color: #111827;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.jira-preview {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.estimate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dcfce7;
  color: #111827;
}

.estimate-item:last-child {
  border-bottom: none;
}

.estimate-item span:first-child {
  font-weight: 500;
  color: #374151;
}

.estimate-item span:last-child {
  font-weight: 600;
  color: #111827;
}

/* Button styles */
.btn {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-success {
  background-color: #059669;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #047857;
}

/* Utility classes */
.flex {
  display: flex;
}

.gap-3 {
  gap: 0.75rem;
}
</style> 