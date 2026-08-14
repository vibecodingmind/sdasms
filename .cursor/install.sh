#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for the sdasms Next.js + Prisma app.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Installing npm dependencies ==="
npm install --legacy-peer-deps

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Syncing SQLite schema (creates prisma/dev.db if missing) ==="
npx prisma db push --skip-generate

echo "=== Seeding database (idempotent upserts) ==="
npx tsx prisma/seed.ts

echo "=== Bootstrap complete ==="
