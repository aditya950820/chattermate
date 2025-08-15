"""
ChatterMate - Shopify Agent Configuration Model
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

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class AgentShopifyConfig(Base):
    """Model for storing agent-to-Shopify configuration."""
    __tablename__ = "agent_shopify_configs"

    id = Column(String, primary_key=True)
    agent_id = Column(String, nullable=False, index=True)
    
    # Link to ShopifyShop
    shop_id = Column(String, ForeignKey("shopify_shops.id"), nullable=True)
    shop = relationship("ShopifyShop", backref="agent_configs")
    
    enabled = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now()) 