#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load nvm if available (needed when Node/npm installed via nvm)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
  nvm use 16 >/dev/null 2>&1 || true
fi

echo "==> Fetching latest code"
cd "$ROOT_DIR"
git pull --ff-only

echo "==> Building backend"
cd "$ROOT_DIR/backend"
npm install
npm run build

if command -v pm2 >/dev/null 2>&1; then
  if pm2 list | grep -q "rivers-api"; then
    echo "==> Restarting existing pm2 process rivers-api"
    pm2 restart rivers-api
  else
    echo "==> Starting backend via pm2 (rivers-api)"
    pm2 start dist/main.js --name rivers-api
  fi
else
  echo "!! pm2 not found. Start backend manually with: node dist/main.js"
fi

echo "==> Building frontend"
cd "$ROOT_DIR/frontend"
npm install
npm run build
echo "Frontend build ready at $ROOT_DIR/frontend/dist (sync or serve via Nginx)."
