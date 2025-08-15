"""
ChatterMate - Knowledge To Agent
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

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID

class KnowledgeToAgent(Base):
    __tablename__ = "knowledge_to_agents"

    id = Column(Integer, primary_key=True, index=True)
    knowledge_id = Column(Integer, ForeignKey(
        "knowledge.id", ondelete="CASCADE"), nullable=False)
    agent_id = Column(UUID(as_uuid=True), ForeignKey(
        "agents.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(),
                        onupdate=func.now())

    # Relationships
    knowledge = relationship("Knowledge", back_populates="agent_links")
    agent = relationship("Agent", back_populates="knowledge_links")
