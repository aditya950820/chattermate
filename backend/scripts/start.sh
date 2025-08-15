#!/bin/bash

echo "Starting ChatterMate Backend - Simple Mode..."

# Start the application immediately
echo "Starting FastAPI application with Gunicorn..."
exec gunicorn app.main:app --bind 0.0.0.0:8000 --workers 1 --worker-class uvicorn.workers.UvicornWorker --timeout 120 