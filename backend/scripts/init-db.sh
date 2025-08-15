#!/bin/bash

echo "Initializing database..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 2
  echo "Still waiting for PostgreSQL..."
done
echo "PostgreSQL is ready!"

# Create database and user with correct permissions
echo "Setting up database..."
psql -h db -U postgres -c "CREATE DATABASE chattermate_db;" || echo "Database might already exist"
psql -h db -U postgres -c "CREATE USER chattermate_user WITH PASSWORD 'chattermate_pass_2024';" || echo "User might already exist"
psql -h db -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE chattermate_db TO chattermate_user;" || echo "Privileges might already be granted"
psql -h db -U postgres -c "ALTER USER chattermate_user CREATEDB;" || echo "User might already have CREATEDB"

echo "Database initialization complete!" 