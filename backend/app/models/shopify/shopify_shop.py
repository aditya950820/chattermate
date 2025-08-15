"""
ChatterMate - Shopify Shop Model
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

from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class ShopifyShop(Base):
    """Shopify shop model for storing shop information and credentials"""
    __tablename__ = "shopify_shops"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    shop_domain = Column(String, nullable=False, unique=True, index=True)
    access_token = Column(String, nullable=True)
    scope = Column(String, nullable=True)
    is_installed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Use UUID type to match the database schema from Alembic migration
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    organization = relationship("Organization", back_populates="shopify_shops") 