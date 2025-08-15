"""
ChatterMate - Customer
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

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint('email', 'organization_id', name='uix_customer_email_org'),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False)
    full_name = Column(String)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(),
                        onupdate=func.now())

    # Define relationships
    organization = relationship("Organization", back_populates="customers")
    chat_histories = relationship("ChatHistory", back_populates="customer")
    session_assignments = relationship("SessionToAgent", back_populates="customer")
    ratings = relationship("Rating", back_populates="customer")