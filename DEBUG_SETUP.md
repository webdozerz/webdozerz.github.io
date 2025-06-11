# 🔧 Отладка настроек отпусков

## Проверьте GitHub Secrets

Перейдите в ваш репозиторий на GitHub:

1. **Settings** → **Secrets and variables** → **Actions**
2. Убедитесь, что добавлены следующие секреты:

```
REDMINE_URL = https://redmine.crypton.studio
REDMINE_API_KEY = ваш_api_ключ_здесь
PROJECT_ID = vacation
```

## Проверьте GitHub Actions логи

1. Перейдите во вкладку **Actions** в вашем репозитории
2. Откройте последний запуск workflow
3. Откройте job "build"
4. Найдите step "Static HTML export with Nuxt"
5. Посмотрите логи - должны быть сообщения:
   - 🔧 Начинаем загрузку данных из Redmine...
   - 🔧 Runtime config: {...}
   - ✅ Получено X задач из Redmine

## Возможные проблемы

### 1. API ключ не работает

- Проверьте, что API ключ правильный в Redmine
- В Redmine: Моя учетная запись → API access key

### 2. Проект не найден

- Убедитесь что PROJECT_ID = "vacation" существует
- Проверьте права доступа к проекту

### 3. URL неправильный

- REDMINE_URL должен быть: https://redmine.crypton.studio
- Без слеша в конце!

### 4. Секреты не настроены

- Секреты должны быть в Repository secrets (не Environment)
- Имена точно как указано выше

## Альтернативная авторизация (если нет API ключа)

Вместо REDMINE_API_KEY можете использовать:

```
REDMINE_USERNAME = ваш_логин
REDMINE_PASSWORD = ваш_пароль
```

## Тестирование локально

Создайте `.env` файл в корне проекта:

```env
REDMINE_URL=https://redmine.crypton.studio
REDMINE_API_KEY=ваш_api_ключ
PROJECT_ID=vacation
```

Запустите:

```bash
npm run generate
```

Посмотрите логи в консоли.
