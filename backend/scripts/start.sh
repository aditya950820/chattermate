#!/bin/bash
set -e

echo "Starting ChatterMate Backend - Minimal Version..."

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