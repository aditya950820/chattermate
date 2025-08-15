"""
ChatterMate - Rating API
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

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import get_current_user, require_permissions
from app.repositories.rating import RatingRepository
from app.repositories.session_to_agent import SessionToAgentRepository
from app.models.user import User
from typing import List, Optional
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

router = APIRouter()

class RatingCreate(BaseModel):
    session_id: UUID
    rating: int = Field(..., ge=1, le=5)
    feedback: Optional[str] = None

    class Config:
        from_attributes = True

class RatingResponse(BaseModel):
    id: UUID
    session_id: UUID
    customer_id: Optional[UUID]
    agent_id: Optional[UUID]
    organization_id: UUID
    rating: int
    feedback: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("", response_model=RatingResponse)
async def create_rating(
    rating_data: RatingCreate,
    db: Session = Depends(get_db)
):
    """Create a new rating for a chat session"""
    try:
        # Get session details
        session_repo = SessionToAgentRepository(db)
        session = session_repo.get_session(rating_data.session_id)
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
            
        # Check if rating already exists
        rating_repo = RatingRepository(db)
        existing_rating = rating_repo.get_rating_by_session(rating_data.session_id)
        if existing_rating:
            raise HTTPException(
                status_code=400,
                detail="Rating already exists for this session"
            )

        # Create rating
        rating = rating_repo.create_rating(
            session_id=rating_data.session_id,
            customer_id=session.customer_id,
            user_id=session.user_id,
            agent_id=session.agent_id,
            organization_id=session.organization_id,
            rating=rating_data.rating,
            feedback=rating_data.feedback
        )

        return rating

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agent/{agent_id}", response_model=List[RatingResponse])
async def get_agent_ratings(
    agent_id: UUID,
    current_user: User = Depends(require_permissions("view_all", "manage_agents")),
    db: Session = Depends(get_db)
):
    """Get all ratings for an agent"""
    try:
        rating_repo = RatingRepository(db)
        ratings = rating_repo.get_ratings_by_agent(agent_id)
        return ratings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agent/{agent_id}/average")
async def get_agent_average_rating(
    agent_id: UUID,
    current_user: User = Depends(require_permissions("view_all", "manage_agents")),
    db: Session = Depends(get_db)
):
    """Get average rating for an agent"""
    try:
        rating_repo = RatingRepository(db)
        average = rating_repo.get_average_rating_by_agent(agent_id)
        return {"average_rating": average}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/organization", response_model=List[RatingResponse])
async def get_organization_ratings(
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(require_permissions("view_all", "manage_agents")),
    db: Session = Depends(get_db)
):
    """Get all ratings for the organization with pagination"""
    try:
        rating_repo = RatingRepository(db)
        ratings = rating_repo.get_organization_ratings(
            current_user.organization_id,
            limit=limit,
            offset=offset
        )
        return ratings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/organization/average")
async def get_organization_average_rating(
    current_user: User = Depends(require_permissions("view_all", "manage_agents")),
    db: Session = Depends(get_db)
):
    """Get average rating for the organization"""
    try:
        rating_repo = RatingRepository(db)
        average = rating_repo.get_organization_average_rating(current_user.organization_id)
        return {"average_rating": average}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 