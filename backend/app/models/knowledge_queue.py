"""
ChatterMate - Knowledge Queue
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

from sqlalchemy import Column, Integer, String, JSON, DateTime, Enum, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum
from sqlalchemy.dialects.postgresql import UUID

class QueueStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class ProcessingStage(str, enum.Enum):
    NOT_STARTED = "not_started"
    CRAWLING = "crawling"
    EMBEDDING = "embedding"
    COMPLETED = "completed"


class KnowledgeQueue(Base):
    __tablename__ = "knowledge_queue"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(UUID(as_uuid=True), nullable=False)
    agent_id = Column(UUID(as_uuid=True), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    # 'pdf_file', 'pdf_url', 'website'
    source_type = Column(String, nullable=False)
    source = Column(String, nullable=False)  # File path or URL
    status = Column(String, default=QueueStatus.PENDING)
    error = Column(String, nullable=True)
    # Renamed from metadata to queue_metadata
    queue_metadata = Column(JSON, nullable=True)
    # Progress tracking
    processing_stage = Column(String, default=ProcessingStage.NOT_STARTED)
    progress_percentage = Column(Float, default=0.0)
    total_items = Column(Integer, default=0)
    processed_items = Column(Integer, default=0)
    crawled_urls = Column(JSON, default=lambda: [])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Add relationship
    user = relationship("User", back_populates="knowledge_queue_items")