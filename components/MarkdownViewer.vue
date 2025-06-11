<template>
  <div class="markdown-viewer" :class="{ 'dark-theme': true }">
    <div v-if="loading" class="loading">
      Загрузка...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="content" v-html="parsedContent"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/github-dark.css'

// Импортируем только нужные языки для оптимизации
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import sql from 'highlight.js/lib/languages/sql'

// Регистрируем языки
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)
hljs.registerLanguage('sql', sql)

const props = defineProps({
  filePath: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const error = ref('')
const parsedContent = ref('')

// Простой парсер
function parseMarkdown(text) {
  let html = text
  
  // Сначала сохраняем блоки кода чтобы защитить их от других замен
  const codeBlocks = []
  html = html.replace(/```(\w+)?\s*([\s\S]*?)```/g, (match, lang, code) => {
    const index = codeBlocks.length
    // Используем highlight.js для подсветки
    let highlightedCode
    const cleanCode = code.trim()
    
    try {
      if (lang && hljs.getLanguage(lang)) {
        highlightedCode = hljs.highlight(cleanCode, { language: lang }).value
      } else {
        // Автоопределение языка
        const result = hljs.highlightAuto(cleanCode)
        highlightedCode = result.value
        // Если язык не был указан, но автоопределение сработало
        if (!lang && result.language) {
          lang = result.language
        }
      }
    } catch (err) {
      // Если подсветка не удалась, экранируем HTML и показываем как обычный текст
      console.warn('Highlight.js error:', err)
      highlightedCode = cleanCode
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
    
    codeBlocks.push({ code: highlightedCode, lang: lang || 'text' })
    return `__CODE_BLOCK_${index}__`
  })
  
  // Сохраняем inline код
  const inlineCodes = []
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const index = inlineCodes.length
    // Экранируем HTML внутри inline кода
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    inlineCodes.push(escapedCode)
    return `__INLINE_CODE_${index}__`
  })
  
  // Сохраняем ASCII диаграммы файловых структур
  const asciiDiagrams = []
  html = html.replace(/((?:^[├│└─┐┘┌┬┴┼\s]*[├│└─┐┘┌┬┴┼]\s*[^\n]*\n)+)/gm, (match) => {
    // Проверяем, что это действительно файловая структура
    if (match.match(/[├│└─]/)) {
      const index = asciiDiagrams.length
      asciiDiagrams.push(match.trim())
      return `__ASCII_DIAGRAM_${index}__`
    }
    return match
  })
  
  // Альтернативный паттерн для структур с символами ├── └── │
  html = html.replace(/((?:^[\s]*[├└│]\s*[─]*\s*[^\n]*\n)+)/gm, (match) => {
    if (match.match(/[├└│]/)) {
      const index = asciiDiagrams.length
      asciiDiagrams.push(match.trim())
      return `__ASCII_DIAGRAM_${index}__`
    }
    return match
  })
  
  // Обрабатываем таблицы и сохраняем их HTML
  const tables = []
  html = parseTableMarkdown(html, tables)
  
  // Экранируем только оставшийся HTML (не в блоках кода и не в таблицах)
  html = html.replace(/&(?!amp;|lt;|gt;|#)/g, '&amp;')
  
  // ПОТОМ обрабатываем markdown элементы
  
  // Жирный текст и курсив
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // Ссылки
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
  
  // Заголовки (обрабатываем от самых длинных к самым коротким)
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // TODO списки
  html = html.replace(/^- \[ \] (.+)$/gm, '<div class="todo"><input type="checkbox" disabled> <span class="todo-text">$1</span></div>')
  html = html.replace(/^- \[x\] (.+)$/gm, '<div class="todo done"><input type="checkbox" checked disabled> <span class="todo-text">$1</span></div>')
  html = html.replace(/^- ✅ (.+)$/gm, '<div class="todo done"><span class="check">✅</span> <span class="todo-text">$1</span></div>')
  
  // Обычные списки
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
  
  // Группируем списки
  html = html.replace(/(<li>.*?<\/li>\s*)+/gs, '<ul>$&</ul>')
  
  // Горизонтальные линии
  html = html.replace(/^---+$/gm, '<hr>')
  
  // Параграфы
  html = html.replace(/\n\n+/g, '</p><p>')
  html = html.replace(/\n/g, '<br>')
  html = '<p>' + html + '</p>'
  
  // Убираем лишние <br> вокруг TODO элементов
  html = html.replace(/<br>\s*<div class="todo">/g, '<div class="todo">')
  html = html.replace(/<\/div>\s*<br>/g, '</div>')
  html = html.replace(/<br>\s*<\/div>/g, '</div>')
  
  // Убираем лишние p вокруг блочных элементов
  html = html.replace(/<p>(<h[1-6]>)/g, '$1')
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  html = html.replace(/<p>(<div)/g, '<div')
  html = html.replace(/(<\/div>)<\/p>/g, '</div>')
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1')
  html = html.replace(/<p>(__TABLE_\d+__)<\/p>/g, '$1')
  html = html.replace(/<p><\/p>/g, '')
  
  // Специально для TODO элементов - убираем p теги и br вокруг них
  html = html.replace(/<p>\s*(<div class="todo")/g, '$1')
  html = html.replace(/(<\/div>)\s*<\/p>/g, '$1')
  
  // Восстанавливаем таблицы
  tables.forEach((tableHtml, index) => {
    html = html.replace(`__TABLE_${index}__`, tableHtml)
  })
  
  // Восстанавливаем inline код
  inlineCodes.forEach((code, index) => {
    html = html.replace(`__INLINE_CODE_${index}__`, `<code>${code}</code>`)
  })
  
  // Восстанавливаем ASCII диаграммы
  asciiDiagrams.forEach((diagram, index) => {
    html = html.replace(`__ASCII_DIAGRAM_${index}__`, `<pre class="ascii-diagram"><code>${diagram}</code></pre>`)
  })
  
  // Восстанавливаем блоки кода с highlight.js подсветкой
  codeBlocks.forEach((block, index) => {
    const langLabel = block.lang !== 'auto' ? ` data-lang="${block.lang}"` : ''
    html = html.replace(`__CODE_BLOCK_${index}__`, `<pre class="hljs"${langLabel}><code>${block.code}</code></pre>`)
  })
  
  return html
}

// Функция для обработки таблиц
function parseTableMarkdown(text, tables) {
  const lines = text.split('\n')
  const result = []
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i]
    
    // Проверяем, начинается ли таблица
    if (line.trim().includes('|') && line.trim().split('|').length >= 3) {
      const tableLines = []
      let j = i
      
      // Собираем все строки таблицы
      while (j < lines.length && lines[j].trim().includes('|') && lines[j].trim().split('|').length >= 3) {
        tableLines.push(lines[j])
        j++
      }
      
      // Преобразуем таблицу в HTML
      const tableHtml = convertTableToHtml(tableLines)
      const tableIndex = tables.length
      tables.push(tableHtml)
      result.push(`__TABLE_${tableIndex}__`)
      
      i = j
    } else {
      result.push(line)
      i++
    }
  }
  
  return result.join('\n')
}

// Преобразование таблицы в HTML
function convertTableToHtml(tableLines) {
  let html = '<table>'
  let inHeader = true
  
  for (let i = 0; i < tableLines.length; i++) {
    const line = tableLines[i].trim()
    
    // Пропускаем строки-разделители
    if (line.match(/^\|[\s\-\|:]+\|$/)) {
      if (inHeader) {
        html += '</thead><tbody>'
        inHeader = false
      }
      continue
    }
    
    // Разбиваем строку на ячейки
    const cells = line.split('|')
      .slice(1, -1) // Убираем первый и последний пустые элементы
      .map(cell => {
        let processedCell = cell.trim()
        // Обрабатываем markdown внутри ячейки
        processedCell = processedCell.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        processedCell = processedCell.replace(/\*(.+?)\*/g, '<em>$1</em>')
        processedCell = processedCell.replace(/`(.+?)`/g, '<code>$1</code>')
        return processedCell
      })
    
    if (cells.length > 0) {
      if (inHeader) {
        if (i === 0) html += '<thead>'
        html += '<tr>'
        cells.forEach(cell => {
          html += `<th>${cell}</th>`
        })
        html += '</tr>'
      } else {
        html += '<tr>'
        cells.forEach(cell => {
          html += `<td>${cell}</td>`
        })
        html += '</tr>'
      }
    }
  }
  
  if (inHeader) html += '</thead>'
  html += '</tbody></table>'
  return html
}

// Загружаем файл
onMounted(async () => {
  try {
    const response = await fetch('/' + props.filePath)
    if (!response.ok) throw new Error('Ошибка загрузки')
    const text = await response.text()
    parsedContent.value = parseMarkdown(text)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.markdown-viewer {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
}

.dark-theme {
  background: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #888;
}

.error {
  color: #ff5252;
  background: #2d1b1b;
  padding: 20px;
  border-radius: 8px;
}

.content {
  background: #1e1e1e;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

:deep(h1) {
  color: #4fc3f7;
  border-bottom: 3px solid #4fc3f7;
  padding-bottom: 10px;
  margin: 40px 0 25px 0;
}

:deep(h2) {
  color: #81c784;
  border-bottom: 2px solid #424242;
  padding-bottom: 8px;
  margin: 35px 0 20px 0;
}

:deep(h3) {
  color: #ffb74d;
  margin: 30px 0 18px 0;
}

:deep(h4) {
  color: #ff8a65;
  font-size: 1.1rem;
  margin: 25px 0 15px 0;
}

:deep(h5) {
  color: #ba68c8;
  font-size: 1rem;
  margin: 20px 0 12px 0;
}

:deep(h6) {
  color: #90a4ae;
  font-size: 0.9rem;
  margin: 18px 0 10px 0;
}

:deep(p) {
  color: #e0e0e0;
  margin: 10px 0;
}

:deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
  list-style: none;
}

:deep(ul:has(.todo)) {
  padding-left: 0;
  margin: 12px 0;
}

:deep(ul ul:has(.todo)) {
  margin-left: 24px;
  padding-left: 0;
  border-left: 2px solid #404040;
  padding-left: 16px;
}

:deep(ul ul .todo) {
  margin: 6px 0;
  padding: 8px 12px;
  font-size: 0.9rem;
}

:deep(li) {
  color: #e0e0e0;
  margin: 4px 0;
}

:deep(.todo) {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  padding: 10px 14px;
  background: linear-gradient(135deg, #2d2d2d, #343434);
  border-radius: 8px;
  border-left: 4px solid #4fc3f7;
  color: #e0e0e0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
}

:deep(.todo::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 49%, rgba(79, 195, 247, 0.05) 50%, transparent 51%);
  z-index: 0;
}

:deep(.todo > *) {
  position: relative;
  z-index: 1;
}

:deep(.todo:hover) {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(79, 195, 247, 0.2);
  border-left-color: #64b5f6;
}

:deep(.todo.done) {
  background: linear-gradient(135deg, #2d4a2d, #3a5a3a);
  border-left-color: #81c784;
  color: #a5d6a7;
}

:deep(.todo.done::before) {
  background: linear-gradient(45deg, transparent 49%, rgba(129, 199, 132, 0.1) 50%, transparent 51%);
}

:deep(.todo.done:hover) {
  border-left-color: #a5d6a7;
  box-shadow: 0 4px 16px rgba(129, 199, 132, 0.2);
}

:deep(.todo input[type="checkbox"]) {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #4fc3f7;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

:deep(.todo input[type="checkbox"]:checked) {
  background: #81c784;
  border-color: #81c784;
}

:deep(.todo input[type="checkbox"]:checked::before) {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

:deep(.todo input[type="checkbox"]:hover) {
  border-color: #64b5f6;
  box-shadow: 0 0 8px rgba(79, 195, 247, 0.3);
}

:deep(.todo .check) {
  font-size: 18px;
  animation: bounce 0.6s ease;
}

:deep(.todo-text) {
  flex: 1;
  line-height: 1.4;
  font-weight: 500;
}

:deep(.todo:not(.done) .todo-text) {
  font-weight: 400;
}

/* Приоритет задач по цветам левой границы */
:deep(.todo:contains("🔴")) {
  border-left-color: #f44336;
}

:deep(.todo:contains("🟡")) {
  border-left-color: #ff9800;
}

:deep(.todo:contains("🟢")) {
  border-left-color: #4caf50;
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  80% {
    transform: translateY(-2px);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

:deep(.todo) {
  animation: slideIn 0.4s ease-out;
}

:deep(code) {
  background: #2d2d2d;
  color: #ff7043;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

:deep(pre) {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 20px 0;
  position: relative;
}

:deep(pre.hljs) {
  background: #0d1117 !important;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 20px 0;
  position: relative;
}

:deep(pre::before) {
  content: attr(data-lang);
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 12px;
  color: #7d8590;
  text-transform: uppercase;
  font-weight: 600;
  z-index: 10;
}

:deep(pre code) {
  background: none !important;
  padding: 0;
  white-space: pre;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #e6edf3;
}

/* Дополнительная настройка для highlight.js тем */
:deep(.hljs) {
  background: #0d1117 !important;
  color: #e6edf3 !important;
}

/* Переопределяем некоторые цвета для лучшей читаемости */
:deep(.hljs-comment),
:deep(.hljs-quote) {
  color: #7d8590 !important;
  font-style: italic;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag),
:deep(.hljs-literal),
:deep(.hljs-type) {
  color: #ff7b72 !important;
}

:deep(.hljs-string),
:deep(.hljs-title) {
  color: #a5d6ff !important;
}

:deep(.hljs-number),
:deep(.hljs-symbol),
:deep(.hljs-bullet) {
  color: #79c0ff !important;
}

:deep(.hljs-function),
:deep(.hljs-title.function_) {
  color: #d2a8ff !important;
}

:deep(.hljs-variable),
:deep(.hljs-attr) {
  color: #ffa657 !important;
}

:deep(a) {
  color: #64b5f6;
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}

:deep(strong) {
  color: #ffffff;
  font-weight: 600;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

:deep(thead) {
  background: linear-gradient(135deg, #2d2d2d, #3a3a3a);
}

:deep(th) {
  color: #4fc3f7;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #4fc3f7;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(td) {
  padding: 14px 20px;
  border-bottom: 1px solid #404040;
  color: #e0e0e0;
  vertical-align: top;
  font-size: 14px;
  line-height: 1.5;
}

:deep(tbody tr) {
  transition: background-color 0.2s ease;
}

:deep(tbody tr:nth-child(even)) {
  background: #252525;
}

:deep(tbody tr:hover) {
  background: #2a2a2a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(79, 195, 247, 0.1);
}

:deep(tbody tr:last-child td) {
  border-bottom: none;
}

/* ASCII диаграммы файловых структур */
:deep(.ascii-diagram) {
  background: #1a1a1a !important;
  border: 2px solid #333 !important;
  border-radius: 8px !important;
  padding: 20px !important;
  font-family: 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace !important;
  font-size: 13px !important;
  line-height: 1.4 !important;
  color: #4fc3f7 !important;
  overflow-x: auto;
  margin: 20px 0 !important;
  position: relative;
}

:deep(.ascii-diagram::before) {
  content: "📁 Структура файлов";
  position: absolute;
  top: -12px;
  left: 15px;
  background: #1a1a1a;
  color: #ffb74d;
  padding: 0 8px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.ascii-diagram code) {
  background: none !important;
  padding: 0 !important;
  color: inherit !important;
  font-family: inherit !important;
  font-size: inherit !important;
  white-space: pre !important;
}
</style> 