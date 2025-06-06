# План тестирования калькулятора трудозатрат

## 1. Функциональные тесты

### Базовая арифметика:

- [ ] 0 компонентов = 0 часов
- [ ] 1 простой UI компонент + middle разработчик = базовое время
- [ ] Проверить формулу: (baselinePerComponent _ total + additive) _ LEVEL_FACTOR

### Тест коэффициентов:

- [ ] Junior (1.35x) > Middle (1.15x) > Senior (0.9x)
- [ ] Оптимистичная (0.8x) < Реалистичная (1x) < Пессимистичная (1.3x)
- [ ] Базовый компонент есть (0.3) vs нет (1.0)

### Граничные значения:

- [ ] Максимальное количество компонентов (999+)
- [ ] Все опции включены одновременно
- [ ] Минимальная конфигурация

## 2. UI/UX тесты

### Отзывчивость:

- [ ] Мобильные устройства (320px+)
- [ ] Планшеты (768px+)
- [ ] Десктопы (1024px+)

### Интерактивность:

- [ ] Кнопки +/- в NumberInput работают
- [ ] Селекты обновляют результат
- [ ] Кнопка "Сбросить" возвращает к дефолтным значениям

## 3. Тесты производительности

- [ ] Время отклика при изменении параметров < 100ms
- [ ] Без блокировки UI при сложных расчетах

## 4. Тестовые сценарии

### Сценарий 1: Простой проект

```
- 2 UI компонента
- 1 форма
- Статический UI
- Локальное состояние
- Без API
- Middle разработчик
```

**Ожидаемый результат:** ~2-4 часа

### Сценарий 2: Сложный проект

```
- 5 сложных виджетов
- 3 формы
- 2 графика
- Интерактивный UI
- Глобальное состояние
- CRUD API
- SSR + SEO + тесты
- Senior разработчик
```

**Ожидаемый результат:** ~15-25 часов

### Сценарий 3: Junior на простом проекте

```
- 1 UI компонент
- Статический
- Локальное состояние
- Junior разработчик
```

**Проверить:** время значительно больше чем у Senior

## 5. Баги для проверки

- [ ] NaN в результатах при некорректном вводе
- [ ] Отрицательные значения в полях
- [ ] Переполнение при очень больших числах
- [ ] Зависание при быстром изменении параметров

## 6. Кроссбраузерная совместимость

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 7. Accessibility

- [ ] Навигация с клавиатуры
- [ ] Screen reader support
- [ ] Контрастность цветов
