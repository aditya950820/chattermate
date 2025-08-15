#!/bin/bash
set -e

echo "Starting ChatterMate Backend..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 2
  echo "Still waiting for PostgreSQL..."
done
echo "PostgreSQL is ready!"

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 2
  echo "Still waiting for Redis..."
done
echo "Redis is ready!"

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application with Gunicorn
echo "Starting FastAPI application with Gunicorn..."
exec gunicorn app.main:app \
    --workers 1 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --keep-alive 5 \
    --log-level debug \
    --access-logfile - \
    --error-logfile - 