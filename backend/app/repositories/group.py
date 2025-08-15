"""
ChatterMate - Group
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

from sqlalchemy.orm import Session, joinedload
from app.models.user import UserGroup

class GroupRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_group_with_users(self, group_id: str):
        return self.db.query(UserGroup)\
            .options(joinedload(UserGroup.users))\
            .filter(UserGroup.id == group_id)\
            .first() 