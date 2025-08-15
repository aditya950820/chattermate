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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base
import os

# Create a FastAPI app with basic configuration
app = FastAPI(
    title="ChatterMate API",
    version="0.1.0",
    description="ChatterMate API - With Database"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "name": "ChatterMate API",
        "version": "0.1.0",
        "description": "Welcome to ChatterMate API - With Database"
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

@app.get("/api/v1/organizations/setup-status")
async def setup_status():
    return {
        "status": "not_setup",
        "message": "Organization setup status endpoint working"
    }

@app.post("/api/v1/organizations")
async def create_organization():
    return {
        "status": "success",
        "message": "Organization creation endpoint working"
    }

# Create upload directories if they don't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")
if not os.path.exists("uploads/agents"):
    os.makedirs("uploads/agents")
