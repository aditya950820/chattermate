"""
ChatterMate - Workflow
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

from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum
import uuid
from datetime import datetime


class WorkflowStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(Enum(WorkflowStatus), default=WorkflowStatus.DRAFT)
    version = Column(Integer, default=1)
    is_template = Column(Boolean, default=False)
    default_language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    canvas_data = Column(JSON, default={})  # Stores canvas view state (zoom, position)
    settings = Column(JSON, default={})  # General workflow settings

    # Relationships
    organization = relationship("Organization", back_populates="workflows")
    agent = relationship("Agent", foreign_keys=[agent_id], back_populates="workflows")
    user = relationship("User")
    nodes = relationship("WorkflowNode", back_populates="workflow", cascade="all, delete-orphan")
    connections = relationship("WorkflowConnection", back_populates="workflow", cascade="all, delete-orphan")

    sessions = relationship("SessionToAgent", back_populates="workflow")

    class Config:
        orm_mode = True 