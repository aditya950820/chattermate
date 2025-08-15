"""
ChatterMate - Shopify Agent Configuration Schemas
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

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AgentShopifyConfigBase(BaseModel):
    """Base Shopify agent configuration schema."""
    enabled: bool
    shop_id: Optional[str] = None


class AgentShopifyConfigCreate(AgentShopifyConfigBase):
    """Schema for creating a new Shopify agent configuration."""
    agent_id: str


class AgentShopifyConfigUpdate(AgentShopifyConfigBase):
    """Schema for updating a Shopify agent configuration."""
    pass


class ShopifyShopInfo(BaseModel):
    """Basic info about a Shopify shop."""
    id: str
    shop_domain: str
    
    class Config:
        orm_mode = True


class AgentShopifyConfigInDB(AgentShopifyConfigBase):
    """Schema for Shopify agent configuration stored in the database."""
    id: str
    agent_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class AgentShopifyConfig(AgentShopifyConfigInDB):
    """Schema for API response."""
    shop: Optional[ShopifyShopInfo] = None 