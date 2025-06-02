<template>
  <div v-if="isVisible" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Детали расчета трудозатрат</h2>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- Общая информация -->
        <div class="detail-section">
          <h3>Общая информация</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Всего компонентов:</span>
              <span class="detail-value">{{ calculationDetails.totalComponents }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">С готовой базой:</span>
              <span class="detail-value">{{ calculationDetails.totalWithBase }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Грейд разработчика:</span>
              <span class="detail-value">{{ 
                formState.devLevel === 'junior' ? 'Junior' : 
                formState.devLevel === 'middle' ? 'Middle' : 'Senior' 
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Множитель грейда:</span>
              <span class="detail-value">{{ levelFactor[formState.devLevel] }}x</span>
            </div>
          </div>
        </div>

        <!-- Базовые коэффициенты -->
        <div class="detail-section">
          <h3>Базовые коэффициенты (часы на компонент)</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Сложность UI:</span>
              <span class="detail-value">{{ baseCoeffs.uiComplex[formState.uiComplex] }}ч</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Управление состоянием:</span>
              <span class="detail-value">{{ baseCoeffs.stateLayer[formState.stateLayer] }}ч</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">API интеграция:</span>
              <span class="detail-value">{{ baseCoeffs.apiType[formState.apiType] }}ч</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Интернационализация:</span>
              <span class="detail-value">{{ baseCoeffs.i18n[formState.i18n] }}ч</span>
            </div>
          </div>
        </div>

        <!-- Дополнительные факторы -->
        <div class="detail-section">
          <h3>Дополнительные факторы</h3>
          <div class="detail-grid">
            <div v-if="formState.ssr" class="detail-item">
              <span class="detail-label">SSR:</span>
              <span class="detail-value">+{{ baseCoeffs.ssr }}ч</span>
            </div>
            <div v-if="formState.seoAdvanced" class="detail-item">
              <span class="detail-label">Расширенный SEO:</span>
              <span class="detail-value">+{{ baseCoeffs.seoAdvanced }}ч</span>
            </div>
            <div v-if="formState.testsUnit" class="detail-item">
              <span class="detail-label">Unit-тесты:</span>
              <span class="detail-value">+{{ baseCoeffs.tests.unit }}ч</span>
            </div>
            <div v-if="formState.testsE2E" class="detail-item">
              <span class="detail-label">E2E-тесты:</span>
              <span class="detail-value">+{{ baseCoeffs.tests.e2e }}ч</span>
            </div>
            <div v-if="formState.responsive" class="detail-item">
              <span class="detail-label">Адаптивный дизайн:</span>
              <span class="detail-value">+{{ baseCoeffs.responsive }}ч</span>
            </div>
            <div v-if="formState.accessibility" class="detail-item">
              <span class="detail-label">Доступность (a11y):</span>
              <span class="detail-value">+{{ baseCoeffs.accessibility }}ч</span>
            </div>
            <div v-if="formState.codeReview" class="detail-item">
              <span class="detail-label">Код-ревью:</span>
              <span class="detail-value">+{{ baseCoeffs.codeReview }}ч</span>
            </div>
            <div v-if="formState.documentation" class="detail-item">
              <span class="detail-label">Документация:</span>
              <span class="detail-value">+{{ baseCoeffs.documentation }}ч</span>
            </div>
            <div v-if="formState.deployment" class="detail-item">
              <span class="detail-label">Настройка деплоя:</span>
              <span class="detail-value">+{{ baseCoeffs.deployment }}ч</span>
            </div>
          </div>
        </div>

        <!-- Разбивка по типам компонентов -->
        <div v-if="calculationDetails.componentBreakdown.length > 0" class="detail-section">
          <h3>Разбивка по типам компонентов</h3>
          <div class="component-breakdown">
            <div v-for="item in calculationDetails.componentBreakdown" :key="item.type" class="breakdown-item">
              <div class="breakdown-header">
                <span class="breakdown-type">{{ item.label }}</span>
                <span class="breakdown-count">{{ item.count }} шт.</span>
              </div>
              <div class="breakdown-details">
                <div class="breakdown-line">
                  <span>Базовое время на компонент:</span>
                  <span>{{ item.baseTimePerComponent.toFixed(2) }}ч</span>
                </div>
                <div class="breakdown-line">
                  <span>Коэффициент типа:</span>
                  <span>{{ item.typeCoeff }}x</span>
                </div>
                <div class="breakdown-line">
                  <span>Время на тип компонента:</span>
                  <span>{{ item.typeTime.toFixed(2) }}ч</span>
                </div>
                <div v-if="item.withBase > 0" class="breakdown-line">
                  <span>С готовой базой ({{ item.withBase }} шт.):</span>
                  <span>-{{ item.baseSavings.toFixed(2) }}ч</span>
                </div>
                <div v-if="item.propsTime > 0" class="breakdown-line">
                  <span>Новые props ({{ item.newProps }} на компонент):</span>
                  <span>+{{ item.propsTime.toFixed(2) }}ч</span>
                </div>
                <div class="breakdown-line total">
                  <span>Итого для этого типа:</span>
                  <span>{{ item.totalTime.toFixed(2) }}ч</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Итоговые расчеты -->
        <div class="detail-section">
          <h3>Итоговые расчеты</h3>
          <div class="calculation-summary">
            <div class="calc-line">
              <span>Базовое время:</span>
              <span>{{ calculationDetails.baseTime.toFixed(2) }}ч</span>
            </div>
            <div class="calc-line">
              <span>С учетом грейда ({{ levelFactor[formState.devLevel] }}x):</span>
              <span>{{ calculationDetails.withLevelFactor.toFixed(2) }}ч</span>
            </div>
            <div class="calc-line separator">
              <span>Оптимистичная (-20%):</span>
              <span>{{ hours.optimistic }}ч</span>
            </div>
            <div class="calc-line">
              <span>Реалистичная (базовая):</span>
              <span>{{ hours.realistic }}ч</span>
            </div>
            <div class="calc-line">
              <span>Пессимистичная (+30%):</span>
              <span>{{ hours.pessimistic }}ч</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CalculationDetails {
  totalComponents: number
  totalWithBase: number
  componentBreakdown: Array<{
    type: string
    label: string
    count: number
    withBase: number
    newProps: number
    baseTimePerComponent: number
    typeCoeff: number
    typeTime: number
    baseSavings: number
    propsTime: number
    totalTime: number
  }>
  baseTime: number
  withLevelFactor: number
}

interface Hours {
  optimistic: number
  realistic: number
  pessimistic: number
}

interface FormState {
  devLevel: 'junior' | 'middle' | 'senior'
  uiComplex: 'static' | 'interactive'
  stateLayer: 'local' | 'global'
  apiType: 'none' | 'simple' | 'crud'
  i18n: 'none' | 'simple' | 'advanced'
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

interface BaseCoeffs {
  uiComplex: { static: number; interactive: number }
  stateLayer: { local: number; global: number }
  apiType: { none: number; simple: number; crud: number }
  i18n: { none: number; simple: number; advanced: number }
  ssr: number
  seoAdvanced: number
  tests: { unit: number; e2e: number }
  responsive: number
  accessibility: number
  codeReview: number
  documentation: number
  deployment: number
}

interface LevelFactor {
  junior: number
  middle: number
  senior: number
}

defineProps<{
  isVisible: boolean
  calculationDetails: CalculationDetails
  hours: Hours
  formState: FormState
  baseCoeffs: BaseCoeffs
  levelFactor: LevelFactor
}>()

defineEmits<{
  close: []
}>()
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

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.detail-label {
  font-weight: 500;
  color: #374151;
}

.detail-value {
  font-weight: 600;
  color: #111827;
}

/* Component breakdown */
.component-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.breakdown-type {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
}

.breakdown-count {
  font-weight: 500;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.breakdown-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: #374151;
}

.breakdown-line span:first-child {
  color: #4b5563;
}

.breakdown-line span:last-child {
  font-weight: 600;
  color: #111827;
}

.breakdown-line.total {
  border-top: 1px solid #d1d5db;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  font-weight: 600;
  color: #111827;
}

.breakdown-line.total span:first-child {
  color: #111827;
}

/* Calculation summary */
.calculation-summary {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
}

.calc-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0f2fe;
}

.calc-line:last-child {
  border-bottom: none;
}

.calc-line.separator {
  border-top: 2px solid #0ea5e9;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
}

.calc-line span:first-child {
  color: #111827;
  font-weight: 500;
}

.calc-line span:last-child {
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

.btn-secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style> 