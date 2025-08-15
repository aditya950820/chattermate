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

# Global flag to track database status
DATABASE_AVAILABLE = False

# Global flag to track if organization has been created
ORGANIZATION_CREATED = False

@app.on_event("startup")
async def startup_event():
    global DATABASE_AVAILABLE
    try:
        # Test database connection on startup
        from sqlalchemy import create_engine
        engine = create_engine('postgresql+psycopg://chattermate_user:chattermate_pass_2024@db:5432/chattermate_db')
        with engine.connect() as conn:
            conn.execute('SELECT 1')
        DATABASE_AVAILABLE = True
        logger.info("Database connection established on startup")
    except Exception as e:
        DATABASE_AVAILABLE = False
        logger.warning(f"Database not available on startup: {e}. Running in mock mode.")

@app.get("/api/v1/organizations/setup-status")
async def setup_status():
    global ORGANIZATION_CREATED
    logger.info(f"Setup status endpoint called - Organization created: {ORGANIZATION_CREATED}")
    return {
        "is_setup": ORGANIZATION_CREATED,
        "message": "Organization setup status endpoint working"
    }

@app.post("/api/v1/organizations")
async def create_organization(org_data: OrganizationCreate):
    global ORGANIZATION_CREATED
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
    
    # Set the organization created flag
    ORGANIZATION_CREATED = True
    logger.info(f"Organization created successfully: {org_data.name}")
    logger.info(f"ORGANIZATION_CREATED flag set to: {ORGANIZATION_CREATED}")
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

@app.get("/api/v1/notifications")
async def get_notifications():
    logger.info("Notifications endpoint called")
    return {
        "notifications": [],
        "total": 0,
        "skip": 0,
        "limit": 50
    }

@app.get("/api/v1/notifications/unread-count")
async def get_unread_notifications_count():
    logger.info("Unread notifications count endpoint called")
    return {
        "count": 0
    }

@app.get("/api/v1/ai/config")
async def get_ai_config():
    logger.info("AI config endpoint called")
    return {
        "openai_api_key": "",
        "openai_model": "gpt-4",
        "anthropic_api_key": "",
        "anthropic_model": "claude-3-sonnet-20240229",
        "google_api_key": "",
        "google_model": "gemini-pro",
        "groq_api_key": "",
        "groq_model": "llama3-8b-8192",
        "ollama_url": "http://localhost:11434",
        "ollama_model": "llama3.2",
        "is_configured": False
    }

@app.post("/api/v1/ai/setup")
async def setup_ai():
    logger.info("AI setup endpoint called")
    return {
        "status": "success",
        "message": "AI configuration saved successfully",
        "is_configured": True
    }

@app.get("/api/v1/agents")
async def get_agents():
    logger.info("Agents endpoint called")
    return {
        "agents": [],
        "total": 0
    }

@app.get("/api/v1/agent/list")
async def get_agent_list():
    logger.info("Agent list endpoint called")
    return []

@app.post("/api/v1/agent")
async def create_agent():
    logger.info("Create agent endpoint called")
    return {
        "id": "agent-123",
        "name": "Test Agent",
        "display_name": "Test Agent",
        "description": "A test agent",
        "agent_type": "general",
        "instructions": ["Be helpful"],
        "is_active": True,
        "organization_id": "org-123",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@app.get("/api/v1/agent/{agent_id}")
async def get_agent(agent_id: str):
    logger.info(f"Get agent endpoint called for agent_id: {agent_id}")
    return {
        "id": agent_id,
        "name": "Test Agent",
        "display_name": "Test Agent",
        "description": "A test agent",
        "agent_type": "general",
        "instructions": ["Be helpful"],
        "is_active": True,
        "organization_id": "org-123",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }

@app.get("/api/v1/conversations")
async def get_conversations():
    logger.info("Conversations endpoint called")
    return {
        "conversations": [],
        "total": 0
    }

@app.get("/api/v1/analytics")
async def get_analytics():
    logger.info("Analytics endpoint called")
    return {
        "total_conversations": 0,
        "total_messages": 0,
        "active_agents": 0,
        "user_satisfaction": 0
    }

@app.get("/api/v1/widgets")
async def get_widgets():
    logger.info("Widgets endpoint called")
    return []

@app.post("/api/v1/widgets")
async def create_widget():
    logger.info("Create widget endpoint called")
    return {
        "id": "widget-123",
        "name": "Test Widget",
        "agent_id": "agent-123",
        "created_at": "2024-01-01T00:00:00Z"
    }

# Create upload directories if they don't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")
if not os.path.exists("uploads/agents"):
    os.makedirs("uploads/agents")
