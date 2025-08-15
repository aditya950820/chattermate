"""
ChatterMate - Role
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

from uuid import UUID
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PermissionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_default: Optional[bool] = False

class RoleCreate(RoleBase):
    permissions: List["PermissionResponse"]

class RoleUpdate(RoleBase):
    permissions: Optional[List["PermissionResponse"]] = None

class SimpleRoleResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class RoleResponse(RoleBase):
    id: int
    organization_id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    permissions: Optional[List["PermissionResponse"]] = None

    class Config:
        from_attributes = True



RoleResponse.update_forward_refs()
