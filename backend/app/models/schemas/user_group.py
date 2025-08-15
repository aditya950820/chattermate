"""
ChatterMate - User Group
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
from typing import Optional, List
from uuid import UUID
from app.models.schemas.user import UserResponse

class UserGroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class UserGroupCreate(UserGroupBase):
    pass

class UserGroupUpdate(UserGroupBase):
    name: Optional[str] = None

class UserGroupResponse(UserGroupBase):
    id: UUID
    organization_id: UUID

    class Config:
        from_attributes = True

class UserGroupWithUsers(UserGroupResponse):
    users: List[UserResponse] 