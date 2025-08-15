"""
ChatterMate - Jira Schemas
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
from typing import Optional, List, Any
from app.models.schemas.agent import AgentResponse

class AgentWithJiraConfig(AgentResponse):
    """Model for agent data with Jira configuration."""
    jira_enabled: bool = False
    jira_project_key: Optional[str] = None
    jira_issue_type_id: Optional[str] = None
    groups: List[Any] = []
    organization: Optional[Any] = None
    
    class Config:
        arbitrary_types_allowed = True 