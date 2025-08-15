"""
ChatterMate - Rating
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
import uuid
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
from sqlalchemy.sql import func


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True,default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("session_to_agents.session_id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 star rating
    feedback = Column(Text, nullable=True)  # Optional feedback text
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session_assignments = relationship("SessionToAgent", back_populates="ratings")
    customer = relationship("Customer", back_populates="ratings")
    agent = relationship("Agent", back_populates="ratings") 
    user = relationship("User", back_populates="ratings")