<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Настройка коэффициентов</h2>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- Базовые коэффициенты -->
        <div class="coeff-section">
          <h3>Базовые факторы</h3>
          <div class="coeff-grid">
            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Экономия от готовой базы</label>
                <span class="coeff-description">Во сколько раз меньше времени занимает доработка готового компонента</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.baseExists.true" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Интерактивный UI</label>
                <span class="coeff-description">Дополнительное время на события, анимации, сложную логику взаимодействия</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.uiComplex.interactive" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Глобальное состояние</label>
                <span class="coeff-description">Время на интеграцию с Pinia/Vuex, реактивность, синхронизацию</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.stateLayer.global" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Простой API</label>
                <span class="coeff-description">GET запросы, простая обработка ответов, базовая обработка ошибок</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.apiType.simple" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">CRUD API</label>
                <span class="coeff-description">Полный набор операций, валидация, оптимистичные обновления, конфликты</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.apiType.crud" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="3" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">SSR</label>
                <span class="coeff-description">Server-Side Rendering, изоморфный код, SEO оптимизация, гидратация</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.ssr" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Расширенный SEO</label>
                <span class="coeff-description">Мета-теги, структурированные данные, Open Graph, Twitter Cards</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.seoAdvanced" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Простая i18n</label>
                <span class="coeff-description">Перевод строк, подключение локалей, базовая локализация</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.i18n.simple" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Продвинутая i18n</label>
                <span class="coeff-description">Множественные формы, RTL, форматирование дат/чисел, контекстуальные переводы</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.i18n.advanced" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1.5" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Unit-тесты</label>
                <span class="coeff-description">Юнит-тесты компонентов, моки, покрытие основных сценариев</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.tests.unit" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">E2E-тесты</label>
                <span class="coeff-description">Интеграционные тесты, автоматизация UI, тестирование пользовательских сценариев</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.tests.e2e" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Адаптивный дизайн</label>
                <span class="coeff-description">Мобильная версия, медиа-запросы, тестирование на разных экранах</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.responsive" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Доступность (a11y)</label>
                <span class="coeff-description">ARIA атрибуты, семантика, навигация с клавиатуры, поддержка скрин-ридеров</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.accessibility" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Код-ревью</label>
                <span class="coeff-description">Время на ревью, исправления, дополнительные итерации</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.codeReview" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="0.5" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Документация</label>
                <span class="coeff-description">JSDoc, README, Storybook, примеры использования</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.documentation" 
                  type="number" 
                  step="0.05" 
                  min="0" 
                  max="0.5" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Деплой и CI/CD</label>
                <span class="coeff-description">Настройка пайплайнов, Docker, конфигурация окружений</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.deployment" 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Коэффициенты типов компонентов -->
        <div class="coeff-section">
          <h3>Сложность типов компонентов</h3>
          <div class="coeff-grid">
            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Макет/Контейнер</label>
                <span class="coeff-description">Header, Footer, Sidebar, Layout компоненты с простой структурой</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.componentTypes.layout" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">UI-элемент</label>
                <span class="coeff-description">Кнопки, инпуты, чекбоксы, базовые интерактивные элементы</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.componentTypes.ui" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="1" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Форма</label>
                <span class="coeff-description">Формы с валидацией, обработкой ошибок, отправкой данных</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.componentTypes.form" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">График</label>
                <span class="coeff-description">Визуализация данных, Chart.js, D3.js, интерактивные графики</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.componentTypes.chart" 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Сложный виджет</label>
                <span class="coeff-description">Календари, таблицы с фильтрами, drag&drop, мультиселекты</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Коэффициент:</span>
                <input 
                  v-model.number="localCoeffs.componentTypes.complex" 
                  type="number" 
                  step="0.1" 
                  min="0.5" 
                  max="3" 
                  class="coeff-input"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Множители уровней -->
        <div class="coeff-section">
          <h3>Множители по уровню разработчика</h3>
          <div class="coeff-grid">
            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Junior</label>
                <span class="coeff-description">Меньше опыта, больше времени на изучение и отладку</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Множитель:</span>
                <input 
                  v-model.number="localCoeffs.levelFactor.junior" 
                  type="number" 
                  step="0.05" 
                  min="1" 
                  max="2" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Middle</label>
                <span class="coeff-description">Средний уровень, базовая оценка времени</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Множитель:</span>
                <input 
                  v-model.number="localCoeffs.levelFactor.middle" 
                  type="number" 
                  step="0.05" 
                  min="0.8" 
                  max="1.5" 
                  class="coeff-input"
                >
              </div>
            </div>

            <div class="coeff-item">
              <div class="coeff-header">
                <label class="coeff-label">Senior</label>
                <span class="coeff-description">Высокий уровень, меньше времени благодаря опыту</span>
              </div>
              <div class="coeff-input-group">
                <span class="input-label">Множитель:</span>
                <input 
                  v-model.number="localCoeffs.levelFactor.senior" 
                  type="number" 
                  step="0.05" 
                  min="0.5" 
                  max="1.2" 
                  class="coeff-input"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Информация о расчетах -->
        <div class="info-section">
          <h4>Как работают коэффициенты:</h4>
          <ul class="info-list">
            <li><strong>Базовые факторы</strong> — добавляются к базовому времени разработки каждого компонента</li>
            <li><strong>Типы компонентов</strong> — умножают общее количество компонентов каждого типа</li>
            <li><strong>Множители уровня</strong> — применяются к итоговому времени для корректировки под команду</li>
            <li><strong>Готовая база</strong> — коэффициент 0.5 означает экономию 50% времени</li>
          </ul>
        </div>
      </div>
      
      <div class="modal-footer">
        <div class="footer-buttons">
          <button class="btn btn-secondary" @click="resetToDefaults">Сбросить к умолчанию</button>
          <div class="main-buttons">
            <button class="btn btn-secondary" @click="$emit('close')">Отмена</button>
            <button class="btn btn-primary" @click="saveChanges">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ComponentTypeCoeffs {
  layout: number
  ui: number
  form: number
  chart: number
  complex: number
}

interface LevelFactor {
  junior: number
  middle: number
  senior: number
}

interface AllCoeffs {
  baseExists: { true: number; false: number }
  uiComplex: { static: number; interactive: number }
  stateLayer: { local: number; global: number }
  apiType: { none: number; simple: number; crud: number }
  ssr: number
  seoAdvanced: number
  i18n: { none: number; simple: number; advanced: number }
  tests: { unit: number; e2e: number }
  responsive: number
  accessibility: number
  codeReview: number
  documentation: number
  deployment: number
  componentTypes: ComponentTypeCoeffs
  levelFactor: LevelFactor
}

const props = defineProps<{
  isVisible: boolean
  coefficients: AllCoeffs
  defaultCoefficients: AllCoeffs
}>()

const emit = defineEmits<{
  close: []
  save: [coefficients: AllCoeffs]
}>()

// Локальная копия коэффициентов для редактирования
const localCoeffs = ref<AllCoeffs>({ ...props.coefficients })

// Обновляем локальные коэффициенты при изменении входных props
watch(() => props.coefficients, (newCoeffs) => {
  localCoeffs.value = { ...newCoeffs }
}, { deep: true })

// Сброс к дефолтным значениям
function resetToDefaults() {
  if (confirm('Сбросить все коэффициенты к значениям по умолчанию?')) {
    // Создаем полностью новую копию дефолтных значений через JSON
    localCoeffs.value = JSON.parse(JSON.stringify(props.defaultCoefficients))
  }
}

// Сохранение изменений
function saveChanges() {
  emit('save', { ...localCoeffs.value })
  emit('close')
}
</script>

<style scoped>
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
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
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
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 0 1.5rem;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Webkit scrollbar styling */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.footer-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.main-buttons {
  display: flex;
  gap: 0.75rem;
}

.coeff-section {
  margin-bottom: 2.5rem;
}

.coeff-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.coeff-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .coeff-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .coeff-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.coeff-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.coeff-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.coeff-label {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.coeff-description {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.coeff-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
  min-width: fit-content;
}

.coeff-input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: #111827;
  transition: border-color 0.2s;
  text-align: center;
  font-weight: 600;
}

.coeff-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.info-section {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1.5rem;
}

.info-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
}

.info-list {
  font-size: 0.8125rem;
  color: #374151;
  line-height: 1.5;
  margin: 0;
  padding-left: 1rem;
}

.info-list li {
  margin-bottom: 0.5rem;
}

.info-list li:last-child {
  margin-bottom: 0;
}

.btn {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

@media (max-width: 640px) {
  .footer-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .main-buttons {
    justify-content: center;
  }
  
  .coeff-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
}
</style> 