#!/usr/bin/env bash
# Собирает public/resume.pdf из страницы /resume через headless Chrome.
# Перед запуском поднимите dev-сервер (npm run dev) или передайте адрес первым аргументом.
set -euo pipefail

URL="${1:-http://localhost:3000/resume}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/resume.pdf"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=5000 --print-to-pdf="$OUT" "$URL" 2>/dev/null

echo "Готово: $OUT"
