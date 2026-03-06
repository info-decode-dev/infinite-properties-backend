#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed, but continuing startup..."
  echo "This might be due to database connection issues."
  echo "The server will start but database operations may fail."
}

echo "Starting server..."
node dist/index.js
