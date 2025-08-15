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

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for request/response
class OrganizationCreate(BaseModel):
    name: str
    domain: str
    timezone: str
    business_hours: Dict[str, Any]
    admin_email: str
    admin_name: str
    admin_password: str
    settings: Optional[Dict[str, Any]] = {}

class User(BaseModel):
    id: str
    email: str
    full_name: str
    organization_id: str
    role_id: str
    is_active: bool

class OrganizationCreateResponse(BaseModel):
    organization: Dict[str, Any]
    user: User
    message: str

# Create a FastAPI app with basic configuration
app = FastAPI(
    title="ChatterMate API",
    version="0.1.0",
    description="ChatterMate API - Simple Working Version"
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
        "description": "Welcome to ChatterMate API - Simple Working Version"
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

@app.get("/api/debug")
async def debug_info():
    logger.info("Debug endpoint called")
    return {
        "status": "success",
        "message": "Debug endpoint working",
        "backend_url": "http://backend:8000",
        "frontend_url": "http://frontend:80",
        "api_base": "/api/v1"
    }

@app.get("/api/v1/organizations/setup-status")
async def setup_status():
    logger.info("Setup status endpoint called")
    return {
        "is_setup": False,
        "message": "Organization setup status endpoint working"
    }

@app.post("/api/v1/organizations")
async def create_organization(org_data: OrganizationCreate):
    logger.info(f"=== CREATE ORGANIZATION CALLED ===")
    logger.info(f"Organization name: {org_data.name}")
    logger.info(f"Domain: {org_data.domain}")
    logger.info(f"Admin email: {org_data.admin_email}")
    logger.info(f"Admin name: {org_data.admin_name}")
    logger.info(f"Timezone: {org_data.timezone}")
    logger.info(f"Business hours: {org_data.business_hours}")
    logger.info(f"Settings: {org_data.settings}")
    
    # Validate required fields
    if not org_data.name or not org_data.domain or not org_data.admin_email:
        logger.error("Missing required fields")
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    # Mock successful organization creation
    mock_organization = {
        "id": "org-123",
        "name": org_data.name,
        "domain": org_data.domain,
        "timezone": org_data.timezone,
        "business_hours": org_data.business_hours,
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z"
    }
    
    mock_user = User(
        id="user-123",
        email=org_data.admin_email,
        full_name=org_data.admin_name,
        organization_id="org-123",
        role_id="role-admin",
        is_active=True
    )
    
    logger.info(f"Organization created successfully: {org_data.name}")
    logger.info(f"=== CREATE ORGANIZATION COMPLETED ===")
    
    return OrganizationCreateResponse(
        organization=mock_organization,
        user=mock_user,
        message="Organization created successfully"
    )

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
        "message": "Database connection disabled - running in simple mode",
        "mode": "simple"
    }

@app.get("/api/test-form")
async def test_form():
    logger.info("Test form endpoint called")
    return {
        "status": "success",
        "message": "Form submission test working!",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.post("/api/test-form")
async def test_form_post():
    logger.info("Test form POST endpoint called")
    return {
        "status": "success",
        "message": "POST request working!",
        "timestamp": "2024-01-01T00:00:00Z"
    }

# Create upload directories if they don't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")
if not os.path.exists("uploads/agents"):
    os.makedirs("uploads/agents")
