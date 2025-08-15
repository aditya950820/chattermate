"""
ChatterMate - Notification
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

from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum
from sqlalchemy.dialects.postgresql import UUID

class NotificationType(str, enum.Enum):
    KNOWLEDGE_PROCESSED = "knowledge_processed"
    KNOWLEDGE_FAILED = "knowledge_failed"
    SYSTEM = "system"
    CHAT = "chat"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(SQLEnum(NotificationType), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    # For additional data like queue_id, knowledge_id etc
    notification_metadata = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")
