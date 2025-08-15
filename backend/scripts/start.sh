#!/bin/bash

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

# Test database connection with retries
echo "Testing database connection..."
max_retries=10
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    python -c "
import os
import sys
sys.path.insert(0, '/app')
from sqlalchemy import create_engine
try:
    engine = create_engine('postgresql+psycopg://chattermate_user:chattermate_pass_2024@db:5432/chattermate_db')
    with engine.connect() as conn:
        result = conn.execute('SELECT 1')
        print('Database connection successful!')
        sys.exit(0)
except Exception as e:
    print(f'Database connection attempt {retry_count + 1} failed: {e}')
    sys.exit(1)
"
    
    if [ $? -eq 0 ]; then
        echo "Database connection successful!"
        break
    else
        retry_count=$((retry_count + 1))
        echo "Database connection failed, retrying in 5 seconds... (attempt $retry_count/$max_retries)"
        sleep 5
    fi
done

if [ $retry_count -eq $max_retries ]; then
    echo "Failed to connect to database after $max_retries attempts. Starting anyway..."
fi

# Run migrations
echo "Running database migrations..."
alembic upgrade head || echo "Migrations failed, continuing anyway..."

# Start the application
echo "Starting ChatterMate backend..."
exec gunicorn app.main:app --bind 0.0.0.0:8000 --workers 1 --worker-class uvicorn.workers.UvicornWorker --timeout 120 