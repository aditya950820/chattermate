"""
ChatterMate - Rating Repository
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

from sqlalchemy.orm import Session
from app.models.rating import Rating
from typing import Optional, List
from uuid import UUID
from sqlalchemy import func


class RatingRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_rating(self, session_id: UUID, customer_id: UUID, user_id: UUID, agent_id: UUID, 
                     organization_id: UUID, rating: int, feedback: Optional[str] = None) -> Rating:
        """Create a new rating"""
        db_rating = Rating(
            session_id=session_id,
            customer_id=customer_id,
            user_id=user_id,
            agent_id=agent_id,
            organization_id=organization_id,
            rating=rating,
            feedback=feedback
        )
        self.db.add(db_rating)
        self.db.commit()
        self.db.refresh(db_rating)
        return db_rating

    def get_rating_by_session(self, session_id: UUID) -> Optional[Rating]:
        """Get rating by session ID"""
        return self.db.query(Rating).filter(Rating.session_id == session_id).first()

    def get_ratings_by_agent(self, agent_id: UUID) -> List[Rating]:
        """Get all ratings for an agent"""
        return self.db.query(Rating).filter(Rating.agent_id == agent_id).all()

    def get_ratings_by_customer(self, customer_id: UUID) -> List[Rating]:
        """Get all ratings from a customer"""
        return self.db.query(Rating).filter(Rating.customer_id == customer_id).all()

    def get_average_rating_by_agent(self, agent_id: UUID) -> float:
        """Get average rating for an agent"""
        result = self.db.query(func.avg(Rating.rating)).filter(
            Rating.agent_id == agent_id
        ).scalar()
        return float(result) if result else 0.0

    def get_organization_ratings(self, organization_id: UUID, 
                               limit: int = 100, offset: int = 0) -> List[Rating]:
        """Get all ratings for an organization with pagination"""
        return self.db.query(Rating).filter(
            Rating.organization_id == organization_id
        ).order_by(Rating.created_at.desc()).offset(offset).limit(limit).all()

    def get_organization_average_rating(self, organization_id: UUID) -> float:
        """Get average rating for an organization"""
        result = self.db.query(func.avg(Rating.rating)).filter(
            Rating.organization_id == organization_id
        ).scalar()
        return float(result) if result else 0.0 