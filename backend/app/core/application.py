"""
ChatterMate - Application
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
from app.core.logger import get_logger

logger = get_logger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title="ChatterMate API",
    description="AI-Powered Customer Support Platform",
    version="1.0.0"
)

def initialize_cors_listener():
    """
    Initialize the CORS listener for multi-worker environments
    This function is called during application startup
    """
    try:
        from app.core.cors import start_cors_listener
        start_cors_listener(app)
        logger.info("CORS listener initialized")
    except Exception as e:
        logger.error(f"Failed to initialize CORS listener: {str(e)}") 