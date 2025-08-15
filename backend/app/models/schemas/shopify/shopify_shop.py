"""
ChatterMate - Shopify Shop Schemas
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

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class ShopifyShopBase(BaseModel):
    """Base schema for ShopifyShop"""
    shop_domain: str = Field(..., description="Shopify shop domain")
    organization_id: Optional[str] = Field(None, description="ID of the organization this shop belongs to")

class ShopifyShopCreate(ShopifyShopBase):
    """Schema for creating a shopify shop"""
    access_token: Optional[str] = Field(None, description="Shopify access token")
    scope: Optional[str] = Field(None, description="Shopify OAuth scopes")
    is_installed: bool = Field(False, description="Whether the app is installed on this shop")

class ShopifyShopUpdate(BaseModel):
    """Schema for updating a shopify shop"""
    access_token: Optional[str] = None
    scope: Optional[str] = None
    is_installed: Optional[bool] = None
    organization_id: Optional[str] = None

class ShopifyShopInDB(ShopifyShopBase):
    """Schema for shopify shop from database"""
    id: str
    scope: Optional[str] = None
    is_installed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        
        # Add JSON encoders to convert UUID to string
        json_encoders = {
            UUID: str  # Convert UUID to string
        }

class ShopifyShop(ShopifyShopInDB):
    """Schema for shopify shop response"""
    pass 