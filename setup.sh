#!/usr/bin/env bash
set -euo pipefail

echo "==> Checking prerequisites..."

if ! command -v node &>/dev/null; then
  echo "Error: Node.js is not installed. Install Node 22+ and try again."
  exit 1
fi

if ! command -v pnpm &>/dev/null; then
  echo "pnpm not found, installing via corepack..."
  corepack enable
  corepack prepare pnpm@latest --activate
fi

if ! command -v docker &>/dev/null; then
  echo "Error: Docker is not installed. Install Docker and try again."
  exit 1
fi

echo "==> Installing dependencies..."
pnpm install

echo "==> Copying .env if needed..."
if [ ! -f packages/backend/.env ]; then
  cp packages/backend/.env.example packages/backend/.env
  echo "    Created packages/backend/.env from .env.example"
fi

echo "==> Starting infrastructure (PostgreSQL + Nginx)..."
docker compose up -d

echo "==> Waiting for PostgreSQL to be ready..."
until docker exec url-shortener-db pg_isready -U postgres &>/dev/null; do
  sleep 1
done

echo "==> Running database migrations..."
pnpm db:migrate

echo ""
echo "Setup complete! Run 'pnpm dev' to start developing."
echo "The app will be available at http://localhost:8080"
