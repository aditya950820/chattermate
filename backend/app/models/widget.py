"""
ChatterMate - Widget
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

from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from uuid import  uuid4
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Widget(Base):
    __tablename__ = "widgets"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey(
        "organizations.id"), nullable=False)

    # Agent relationship
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    agent = relationship("Agent", back_populates="widgets")

    # Relationships
    organization = relationship("Organization", back_populates="widgets")
