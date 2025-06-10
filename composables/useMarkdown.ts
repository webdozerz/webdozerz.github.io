export const useMarkdown = () => {
  // Простой парсер markdown без внешних зависимостей
  const parseMarkdown = (text: string): string => {
    let html = text
    
    // Экранируем HTML теги для безопасности
    html = html.replace(/&/g, '&amp;')
    html = html.replace(/</g, '&lt;')
    html = html.replace(/>/g, '&gt;')
    
    // Заголовки
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')  
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
    
    // Жирный и курсив
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Код
    html = html.replace(/`(.+?)`/g, '<code>$1</code>')
    
    // Блоки кода
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    
    // Ссылки
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    
    // TODO чекбоксы
    html = html.replace(/^- \[ \] (.+)$/gm, '<div class="todo-item"><input type="checkbox" disabled> $1</div>')
    html = html.replace(/^- \[x\] (.+)$/gm, '<div class="todo-item checked"><input type="checkbox" checked disabled> $1</div>')
    
    // Обычные списки
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    
    // Оборачиваем списки в ul
    html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')
    
    // Параграфы
    html = html.replace(/\n\n/g, '</p><p>')
    html = html.replace(/\n/g, '<br>')
    html = '<p>' + html + '</p>'
    
    // Убираем пустые параграфы
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p><br><\/p>/g, '')
    html = html.replace(/<p><br>/g, '<p>')
    html = html.replace(/<br><\/p>/g, '</p>')
    
    return html
  }

  // Загружаем markdown файл
  const loadMarkdownFile = async (filePath: string): Promise<string> => {
    try {
      const response = await fetch(`/${filePath}`)
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить файл: ${response.status}`)
      }
      
      const text = await response.text()
      return parseMarkdown(text)
    } catch (error) {
      throw new Error(`Ошибка загрузки файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    }
  }

  return {
    parseMarkdown,
    loadMarkdownFile
  }
} 