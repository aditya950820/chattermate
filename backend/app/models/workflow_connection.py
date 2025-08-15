"""
ChatterMate - Workflow Connection
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

from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import uuid


class WorkflowConnection(Base):
    __tablename__ = "workflow_connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    source_node_id = Column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id", ondelete="CASCADE"), nullable=False)
    target_node_id = Column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(100))  # Optional label for the connection
    condition = Column(Text)  # Optional condition for conditional routing
    priority = Column(Integer, default=0)  # Priority for multiple outgoing connections
    connection_metadata = Column(JSON, default={})  # Additional connection properties
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    workflow = relationship("Workflow", back_populates="connections")
    source_node = relationship("WorkflowNode", foreign_keys=[source_node_id], back_populates="outgoing_connections")
    target_node = relationship("WorkflowNode", foreign_keys=[target_node_id], back_populates="incoming_connections")

    class Config:
        orm_mode = True 