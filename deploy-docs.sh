#!/bin/bash

echo "🚀 Деплой документации WebDozerz"

# Собираем основной сайт
echo "📦 Сборка основного сайта..."
npm run generate

# Собираем документацию
echo "📚 Сборка документации..."
cd docs
NODE_ENV=production npm run build
cd ..

# Копируем документацию в dist
echo "📋 Копирование файлов..."
mkdir -p dist/docs
cp -r docs/build/* dist/docs/

# Деплой на GitHub Pages
echo "🚢 Деплой на GitHub Pages..."
git add .
git commit -m "Deploy site and docs"
git push origin main

echo "✅ Деплой завершен!"
echo "🌐 Основной сайт: https://webdozerz.github.io/"
echo "📖 Документация: https://webdozerz.github.io/docs/" 