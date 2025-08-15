#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "Redis is ready!"

# Check if Firebase credentials exist, but don't create them if missing
if [ ! -z "$FIREBASE_CREDENTIALS" ] && [ ! -f "$FIREBASE_CREDENTIALS" ]; then
    echo "Warning: Firebase credentials file not found at $FIREBASE_CREDENTIALS. Continuing without Firebase credentials..."
fi

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application with Gunicorn
echo "Starting FastAPI application with Gunicorn..."
gunicorn app.main:app \
    --workers 1 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --keep-alive 5 \
    --log-level info \
    --access-logfile - \
    --error-logfile - \
    --preload 