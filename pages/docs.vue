<template>
  <div class="docs-redirect">
    <div class="container">
      <h1>Документация</h1>
      <p>Переходим к документации проекта...</p>
      <div class="loading">
        <div class="spinner"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Автоматическое перенаправление на документацию
onMounted(() => {
  // В production переходим на папку docs
  if (import.meta.client) {
    setTimeout(() => {
      window.location.href = '/docs/'
    }, 1000)
  }
})

// SEO meta
useHead({
  title: 'Документация - WebDozerz',
  meta: [
    { 
      name: 'description', 
      content: 'Документация проекта WebDozerz' 
    }
  ]
})
</script>

<style scoped>
.docs-redirect {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.container {
  max-width: 600px;
  padding: 2rem;
}

.loading {
  margin-top: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 