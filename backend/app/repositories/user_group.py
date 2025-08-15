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

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.user import UserGroup, User
from uuid import UUID
from app.core.logger import get_logger

logger = get_logger(__name__)

class UserGroupRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_groups_by_organization(self, organization_id: UUID) -> List[UserGroup]:
        """Get all groups in an organization"""
        return self.db.query(UserGroup)\
            .filter(UserGroup.organization_id == organization_id)\
            .order_by(UserGroup.name)\
            .all()

    def get_group(self, group_id: UUID) -> Optional[UserGroup]:
        """Get group by ID"""
        return self.db.query(UserGroup).filter(UserGroup.id == group_id).first()

    def create_group(self, name: str, description: str, organization_id: UUID) -> UserGroup:
        """Create a new group"""
        group = UserGroup(
            name=name,
            description=description,
            organization_id=organization_id
        )
        self.db.add(group)
        self.db.commit()
        self.db.refresh(group)
        return group

    def update_group(self, group_id: UUID, **kwargs) -> Optional[UserGroup]:
        """Update group"""
        group = self.get_group(group_id)
        if group:
            for key, value in kwargs.items():
                setattr(group, key, value)
            self.db.commit()
            self.db.refresh(group)
        return group

    def delete_group(self, group_id: UUID) -> bool:
        """Delete group"""
        group = self.get_group(group_id)
        if group:
            self.db.delete(group)
            self.db.commit()
            return True
        return False

    def add_user(self, group_id: UUID, user_id: UUID) -> bool:
        """Add user to group"""
        group = self.get_group(group_id)
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not group or not user:
            return False
            
        if user not in group.users:
            group.users.append(user)
            self.db.commit()
        return True

    def remove_user(self, group_id: UUID, user_id: UUID) -> bool:
        """Remove user from group"""
        group = self.get_group(group_id)
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not group or not user:
            return False
            
        if user in group.users:
            group.users.remove(user)
            self.db.commit()
        return True

    def get_user_groups(self, user_id: UUID) -> List[UserGroup]:
        """Get all groups a user belongs to"""
        user = self.db.query(User).filter(User.id == user_id).first()
        return user.groups if user else [] 