<template>
  <div class="ipr-page">
    <header class="page-header">
      <h1>🚀 Индивидуальный План Развития (ИПР)</h1>
      <p class="subtitle">Структурированный путь развития Frontend разработчика</p>
    </header>

    <!-- Переключатель между уровнями -->
    <div class="level-switcher">
      <button 
        @click="currentLevel = 'junior'" 
        :class="{ active: currentLevel === 'junior' }"
        class="level-btn"
      >
        📚 Junior Level
      </button>
      <button 
        @click="currentLevel = 'middle'" 
        :class="{ active: currentLevel === 'middle' }"
        class="level-btn"
      >
        💎 Middle Level
      </button>
    </div>

    <!-- Контент для Junior -->
    <div v-if="currentLevel === 'junior'" class="level-content">
      <div class="level-header">
        <h2>📚 Junior Frontend Developer</h2>
        <p>Базовый уровень: от основ HTML/CSS до создания полноценных Vue.js приложений</p>
        <div class="stats">
          <div class="stat-item">
            <span class="label">Этапов:</span>
            <span class="value">10</span>
          </div>
          <div class="stat-item">
            <span class="label">Время:</span>
            <span class="value">22 недели</span>
          </div>
          <div class="stat-item">
            <span class="label">Максимум баллов:</span>
            <span class="value">1000</span>
          </div>
        </div>
      </div>

      <!-- Этапы Junior -->
      <div class="stages-grid">
        <div 
          v-for="stage in juniorStages" 
          :key="stage.id"
          @click="selectStage(stage)"
          :class="{ active: selectedStage?.id === stage.id }"
          class="stage-card"
        >
          <div class="stage-number">{{ stage.number }}</div>
          <div class="stage-info">
            <h3>{{ stage.title }}</h3>
            <p class="duration">{{ stage.duration }}</p>
            <div class="technologies">
              <span v-for="tech in stage.technologies" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Контент для Middle -->
    <div v-if="currentLevel === 'middle'" class="level-content">
      <div class="level-header">
        <h2>💎 Middle Frontend Developer</h2>
        <p>Продвинутый уровень: архитектурное мышление, блокчейн интеграция, техническое лидерство</p>
        <div class="stats">
          <div class="stat-item">
            <span class="label">Этапов:</span>
            <span class="value">12</span>
          </div>
          <div class="stat-item">
            <span class="label">Время:</span>
            <span class="value">38 недель</span>
          </div>
          <div class="stat-item">
            <span class="label">Максимум баллов:</span>
            <span class="value">1800</span>
          </div>
        </div>
      </div>

      <!-- Этапы Middle -->
      <div class="stages-grid">
        <div 
          v-for="stage in middleStages" 
          :key="stage.id"
          @click="selectStage(stage)"
          :class="{ active: selectedStage?.id === stage.id }"
          class="stage-card"
        >
          <div class="stage-number">{{ stage.number }}</div>
          <div class="stage-info">
            <h3>{{ stage.title }}</h3>
            <p class="duration">{{ stage.duration }}</p>
            <div class="technologies">
              <span v-for="tech in stage.technologies" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Детальный просмотр этапа -->
    <div v-if="selectedStage" class="stage-detail">
      <div class="detail-header">
        <h2>{{ selectedStage.title }}</h2>
        <button @click="selectedStage = null" class="close-btn">✕</button>
      </div>
      <MarkdownViewer :file-path="selectedStage.filePath" :key="selectedStage.filePath" />
    </div>

    <!-- Общие материалы -->
    <div class="general-materials">
      <h2>📄 Общие материалы</h2>
      <div class="materials-grid">
        <div 
          v-for="material in generalMaterials" 
          :key="material.id"
          @click="selectMaterial(material)"
          class="material-card"
        >
          <div class="material-icon">{{ material.icon }}</div>
          <div class="material-info">
            <h3>{{ material.title }}</h3>
            <p>{{ material.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Просмотр общих материалов -->
    <div v-if="selectedMaterial" class="material-detail">
      <div class="detail-header">
        <h2>{{ selectedMaterial.title }}</h2>
        <button @click="selectedMaterial = null" class="close-btn">✕</button>
      </div>
      <MarkdownViewer :file-path="selectedMaterial.filePath" :key="selectedMaterial.filePath" />
    </div>
  </div>
</template>

<script setup>
const currentLevel = ref('junior')
const selectedStage = ref(null)
const selectedMaterial = ref(null)

// Этапы для Junior
const juniorStages = ref([
  {
    id: 'stage-1',
    number: 1,
    title: 'HTML/CSS Основы',
    duration: '2 недели',
    technologies: ['HTML5', 'CSS3', 'SCSS', 'BEM'],
    filePath: 'ipr/juniour/stage-1-html-css.md'
  },
  {
    id: 'stage-2',
    number: 2,
    title: 'JavaScript Базовый',
    duration: '3 недели',
    technologies: ['ES6+', 'DOM API', 'Fetch'],
    filePath: 'ipr/juniour/stage-2-javascript-basic.md'
  },
  {
    id: 'stage-3',
    number: 3,
    title: 'TypeScript',
    duration: '2 недели',
    technologies: ['TypeScript', 'ООП', 'Типизация'],
    filePath: 'ipr/juniour/stage-3-typescript.md'
  },
  {
    id: 'stage-4',
    number: 4,
    title: 'Vue.js Компоненты',
    duration: '3 недели',
    technologies: ['Vue 3', 'Composition API', 'Компоненты'],
    filePath: 'ipr/juniour/stage-4-vue-components.md'
  },
  {
    id: 'stage-5',
    number: 5,
    title: 'Nuxt.js Роутинг',
    duration: '2 недели',
    technologies: ['Nuxt.js', 'SSR', 'Роутинг'],
    filePath: 'ipr/juniour/stage-5-nuxt-routing.md'
  },
  {
    id: 'stage-6',
    number: 6,
    title: 'API & HTTP',
    duration: '2 недели',
    technologies: ['REST API', 'Repository', 'HTTP'],
    filePath: 'ipr/juniour/stage-6-api-http.md'
  },
  {
    id: 'stage-7-10',
    number: '7-10',
    title: 'Продвинутые этапы',
    duration: '8 недель',
    technologies: ['Auth', 'Web3', 'Testing', 'SEO'],
    filePath: 'ipr/juniour/stage-7-8-9-10.md'
  }
])

// Этапы для Middle
const middleStages = ref([
  {
    id: 'stage-11',
    number: 11,
    title: 'Advanced TypeScript',
    duration: '3 недели',
    technologies: ['Generics', 'Utility Types', 'Decorators'],
    filePath: 'ipr/middle/stage-11-advanced-typescript.md'
  },
  {
    id: 'stage-12',
    number: 12,
    title: 'Architecture Setup',
    duration: '3 недели',
    technologies: ['Monorepo', 'Vite', 'ESLint'],
    filePath: 'ipr/middle/stage-12-architecture-setup.md'
  },
  {
    id: 'stage-13',
    number: 13,
    title: 'Advanced Frameworks',
    duration: '4 недели',
    technologies: ['Vue 3 Advanced', 'Pinia', 'Patterns'],
    filePath: 'ipr/middle/stage-13-advanced-frameworks.md'
  },
  {
    id: 'stage-14',
    number: 14,
    title: 'SSR & Performance',
    duration: '3 недели',
    technologies: ['Nuxt SSR', 'Web Vitals', 'Optimization'],
    filePath: 'ipr/middle/stage-14-ssr-performance.md'
  },
  {
    id: 'stage-15',
    number: 15,
    title: 'Blockchain Integration',
    duration: '4 недели',
    technologies: ['Web3', 'Ethers.js', 'MetaMask'],
    filePath: 'ipr/middle/stage-15-blockchain-integration.md'
  },
  {
    id: 'stage-16',
    number: 16,
    title: 'DeFi Protocols',
    duration: '4 недели',
    technologies: ['Uniswap', 'Compound', 'Staking'],
    filePath: 'ipr/middle/stage-16-defi-protocols.md'
  },
  {
    id: 'stage-17',
    number: 17,
    title: 'Security & Cryptography',
    duration: '3 недели',
    technologies: ['JWT', 'OAuth', 'Encryption'],
    filePath: 'ipr/middle/stage-17-security-cryptography.md'
  },
  {
    id: 'stage-18',
    number: 18,
    title: 'Testing & Automation',
    duration: '3 недели',
    technologies: ['Vitest', 'Playwright', 'CI/CD'],
    filePath: 'ipr/middle/stage-18-testing-automation.md'
  },
  {
    id: 'stage-19',
    number: 19,
    title: 'DevOps & Deployment',
    duration: '4 недели',
    technologies: ['Docker', 'Kubernetes', 'Deployment'],
    filePath: 'ipr/middle/stage-19-devops-deployment.md'
  },
  {
    id: 'stage-20',
    number: 20,
    title: 'Monitoring & Analytics',
    duration: '3 недели',
    technologies: ['Sentry', 'Analytics', 'Monitoring'],
    filePath: 'ipr/middle/stage-20-monitoring-analytics.md'
  },
  {
    id: 'stage-21',
    number: 21,
    title: 'PWA & Extensions',
    duration: '3 недели',
    technologies: ['PWA', 'Service Workers', 'Extensions'],
    filePath: 'ipr/middle/stage-21-pwa-extensions.md'
  },
  {
    id: 'stage-22',
    number: 22,
    title: 'Team Leadership',
    duration: '2 недели',
    technologies: ['Code Review', 'Mentoring', 'Leadership'],
    filePath: 'ipr/middle/stage-22-team-leadership.md'
  }
])

// Общие материалы
const generalMaterials = ref([
  {
    id: 'junior-readme',
    title: 'Junior README',
    description: 'Общая информация о Junior треке',
    icon: '📚',
    filePath: 'ipr/juniour/README.md'
  },
  {
    id: 'middle-readme',
    title: 'Middle README',
    description: 'Общая информация о Middle треке',
    icon: '💎',
    filePath: 'ipr/middle/README.md'
  },
  {
    id: 'junior-concept',
    title: 'Концепция Junior проекта',
    description: 'Crypto Learning Hub - концепция проекта',
    icon: '💡',
    filePath: 'ipr/juniour/crypto-learning-hub-concept.md'
  },
  {
    id: 'middle-concept',
    title: 'Концепция Middle проекта',
    description: 'Advanced концепция для Middle разработчиков',
    icon: '🔬',
    filePath: 'ipr/middle/crypto-learning-hub-advanced-concept.md'
  },
  {
    id: 'junior-log',
    title: 'Шаблон дневника Junior',
    description: 'Шаблон для ведения дневника обучения',
    icon: '📝',
    filePath: 'ipr/juniour/learning-log-template.md'
  },
  {
    id: 'middle-log',
    title: 'Шаблон дневника Middle',
    description: 'Продвинутый шаблон дневника обучения',
    icon: '📋',
    filePath: 'ipr/middle/learning-log-template.md'
  }
])

function selectStage(stage) {
  selectedStage.value = stage
  selectedMaterial.value = null
}

function selectMaterial(material) {
  selectedMaterial.value = material
  selectedStage.value = null
}
</script>

<style scoped>
/* Глобальные стили для темного скроллбара */
:global(*) {
  /* Темный скроллбар для WebKit браузеров */
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #333, #555);
    border-radius: 6px;
    border: 1px solid #1a1a1a;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  }

  &::-webkit-scrollbar-corner {
    background: #1a1a1a;
  }
}

/* Поддержка для Firefox */
:global(html) {
  scrollbar-width: thin;
  scrollbar-color: #333 #1a1a1a;
}

.ipr-page {
  background: #0f0f0f;
  min-height: 100vh;
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.page-header h1 {
  color: #4fc3f7;
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #b0b0b0;
  font-size: 1.1rem;
  margin: 0;
}

.level-switcher {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  padding: 0 20px;
}

.level-btn {
  background: #1e1e1e;
  color: #e0e0e0;
  border: 2px solid #333;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.level-btn:hover {
  background: #2a2a2a;
  border-color: #4fc3f7;
  transform: translateY(-2px);
}

.level-btn.active {
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: #fff;
  border-color: #4fc3f7;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
}

.level-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.level-header {
  background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
  border: 1px solid #333;
}

.level-header h2 {
  color: #4fc3f7;
  margin: 0 0 10px 0;
  font-size: 2rem;
}

.level-header p {
  color: #b0b0b0;
  margin: 0 0 20px 0;
  font-size: 1.1rem;
}

.stats {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-item .label {
  color: #888;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-item .value {
  color: #4fc3f7;
  font-size: 1.5rem;
  font-weight: 700;
}

.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stage-card {
  background: linear-gradient(135deg, #1a1a1a, #252525);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.stage-card:hover {
  background: linear-gradient(135deg, #252525, #2a2a2a);
  border-color: #4fc3f7;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.2);
}

.stage-card.active {
  border-color: #4fc3f7;
  background: linear-gradient(135deg, #1a2631, #2a3c4a);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
}

.stage-number {
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.stage-info h3 {
  color: #e0e0e0;
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}

.duration {
  color: #81c784;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  background: #333;
  color: #4fc3f7;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.general-materials {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 0 20px;
}

.general-materials h2 {
  color: #4fc3f7;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.material-card {
  background: linear-gradient(135deg, #1a1a1a, #252525);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 15px;
  align-items: center;
}

.material-card:hover {
  background: linear-gradient(135deg, #252525, #2a2a2a);
  border-color: #81c784;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(129, 199, 132, 0.2);
}

.material-icon {
  font-size: 2rem;
  width: 60px;
  text-align: center;
}

.material-info h3 {
  color: #e0e0e0;
  margin: 0 0 5px 0;
  font-size: 1.1rem;
}

.material-info p {
  color: #b0b0b0;
  margin: 0;
  font-size: 0.9rem;
}

.stage-detail,
.material-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0f0f0f;
  z-index: 1000;
  overflow-y: auto;
  
  /* Темный скроллбар для WebKit браузеров */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4fc3f7, #29b6f6);
    border-radius: 6px;
    border: 2px solid #1a1a1a;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #29b6f6, #1976d2);
  }

  &::-webkit-scrollbar-corner {
    background: #1a1a1a;
  }
  
  /* Поддержка для Firefox */
  scrollbar-width: thin;
  scrollbar-color: #4fc3f7 #1a1a1a;
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #0f0f0f;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #333;
  max-width: 900px;
  margin: 0 auto 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.detail-header h2 {
  color: #4fc3f7;
  margin: 0;
  font-size: 1.8rem;
}

.close-btn {
  background: linear-gradient(135deg, #ff5252, #ff1744);
  color: #fff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 82, 82, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-btn:hover {
  background: linear-gradient(135deg, #ff1744, #d50000);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 82, 82, 0.4);
}

.close-btn:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .level-switcher {
    flex-direction: column;
    align-items: center;
  }

  .level-btn {
    width: 100%;
    max-width: 300px;
  }

  .stats {
    justify-content: center;
    text-align: center;
  }

  .stages-grid,
  .materials-grid {
    grid-template-columns: 1fr;
  }

  .stage-card,
  .material-card {
    flex-direction: column;
    text-align: center;
  }

  .detail-header {
    padding: 15px;
    margin-bottom: 15px;
  }

  .detail-header h2 {
    font-size: 1.4rem;
  }

  .close-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
}
</style> 