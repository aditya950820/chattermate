"""
ChatterMate - Main Application
Copyright (C) 2024 ChatterMate

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a FastAPI app with basic configuration
app = FastAPI(
    title="ChatterMate API",
    version="0.1.0",
    description="ChatterMate API - Working Version"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

@app.get("/")
async def root():
    return {
        "name": "ChatterMate API",
        "version": "0.1.0",
        "description": "Welcome to ChatterMate API - Working Version"
    }

@app.get("/test")
async def test():
    return {
        "status": "ok",
        "message": "Backend is working!"
    }

@app.get("/ping")
async def ping():
    return {
        "status": "pong",
        "message": "Service is alive!"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "version": "0.1.0"
    }

@app.get("/api/test")
async def api_test():
    logger.info("API test endpoint called")
    return {
        "status": "success",
        "message": "API communication working!",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.get("/api/v1/organizations/setup-status")
async def setup_status():
    logger.info("Setup status endpoint called")
    return {
        "status": "not_setup",
        "message": "Organization setup status endpoint working"
    }

@app.post("/api/v1/organizations")
async def create_organization():
    logger.info("Create organization endpoint called")
    return {
        "status": "success",
        "message": "Organization creation endpoint working",
        "organization_id": "test-org-123"
    }

@app.get("/api/v1/users")
async def get_users():
    return {
        "status": "success",
        "message": "Users endpoint working",
        "users": []
    }

@app.post("/api/v1/users")
async def create_user():
    return {
        "status": "success",
        "message": "User creation endpoint working",
        "user_id": "test-user-123"
    }

@app.get("/test-db")
async def test_db():
    return {
        "status": "info",
        "message": "Database connection temporarily disabled for testing"
    }

# Create upload directories if they don't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")
if not os.path.exists("uploads/agents"):
    os.makedirs("uploads/agents")
