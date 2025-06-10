#!/bin/bash

echo "🧪 Тестовый деплой документации WebDozerz"

# Собираем основной сайт
echo "📦 Сборка основного сайта..."
npm run generate

# Собираем документацию
echo "📚 Сборка документации..."
cd docs
NODE_ENV=production npm run build
cd ..

# Создаем финальную структуру для деплоя
echo "📋 Создание структуры деплоя..."
rm -rf dist
mkdir -p dist

# Копируем основной сайт
cp -r .output/public/* dist/

# Копируем документацию в dist/docs
mkdir -p dist/docs
cp -r docs/build/* dist/docs/

echo "✅ Тестовая сборка завершена!"
echo "📁 Структура деплоя:"
echo "🌐 Основной сайт: dist/"
echo "📖 Документация: dist/docs/"

echo ""
echo "📋 Содержимое dist/:"
ls -la dist/

echo ""
echo "📋 Содержимое dist/docs/:"
ls -la dist/docs/ 