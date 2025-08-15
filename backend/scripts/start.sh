#!/bin/bash

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

# Test database connection
echo "Testing database connection..."
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
except Exception as e:
    print(f'Database connection failed: {e}')
    sys.exit(1)
"

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting ChatterMate backend..."
exec gunicorn app.main:app --bind 0.0.0.0:8000 --workers 1 --worker-class uvicorn.workers.UvicornWorker --timeout 120 