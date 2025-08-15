"""
ChatterMate - Workflow Schemas
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

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Union, Literal
from uuid import UUID
from datetime import datetime
from app.models.workflow import WorkflowStatus
from app.models.workflow_node import NodeType, ActionType


# ==============================
# Workflow schemas
# ==============================

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[WorkflowStatus] = WorkflowStatus.DRAFT
    is_template: bool = False
    default_language: str = "en"
    canvas_data: Dict[str, Any] = Field(default_factory=dict)
    settings: Dict[str, Any] = Field(default_factory=dict)


class WorkflowCreate(WorkflowBase):
    agent_id: UUID


# ==============================
# Operation schemas for batch updates
# ==============================

class WorkflowNodeOperation(BaseModel):
    operation: Literal["create", "update", "delete"]
    id: Optional[UUID] = None  # Required for update/delete, optional for create
    node_type: Optional[NodeType] = None
    name: Optional[str] = None
    description: Optional[str] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    config: Optional[Dict[str, Any]] = None
    
    # Landing Page node fields
    landing_page_heading: Optional[str] = None
    landing_page_content: Optional[str] = None


class WorkflowConnectionOperation(BaseModel):
    operation: Literal["create", "update", "delete"]
    id: Optional[UUID] = None  # Required for update/delete, optional for create
    source_node_id: Optional[UUID] = None
    target_node_id: Optional[UUID] = None
    label: Optional[str] = None
    condition: Optional[str] = None
    priority: Optional[int] = None
    connection_metadata: Optional[Dict[str, Any]] = None


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WorkflowStatus] = None
    is_template: Optional[bool] = None
    default_language: Optional[str] = None
    canvas_data: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None
    agent_id: Optional[UUID] = None
    nodes: Optional[List[WorkflowNodeOperation]] = None
    connections: Optional[List[WorkflowConnectionOperation]] = None


class WorkflowResponse(WorkflowBase):
    id: UUID
    organization_id: UUID
    agent_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# ==============================
# WorkflowNode schemas
# ==============================

class WorkflowNodeBase(BaseModel):
    workflow_id: UUID
    node_type: NodeType
    name: str
    description: Optional[str] = None
    position_x: float = 0
    position_y: float = 0
    config: Dict[str, Any] = Field(default_factory=dict)
    
    # Message node fields
    message_text: Optional[str] = None
    
    # Condition node fields
    condition_expression: Optional[str] = None
    
    # Action node fields
    action_type: Optional[ActionType] = None
    action_config: Optional[Dict[str, Any]] = None
    
    # Transfer node fields
    transfer_rules: Optional[Dict[str, Any]] = None
    
    # Wait node fields
    wait_duration: Optional[int] = None  # Duration in seconds
    wait_until_condition: Optional[str] = None
    
    # Landing Page node fields
    landing_page_heading: Optional[str] = None
    landing_page_content: Optional[str] = None


class WorkflowNodeCreate(WorkflowNodeBase):
    pass


class WorkflowNodeUpdate(BaseModel):
    node_type: Optional[NodeType] = None
    name: Optional[str] = None
    description: Optional[str] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    config: Optional[Dict[str, Any]] = None
    
    # Landing Page node fields
    landing_page_heading: Optional[str] = None
    landing_page_content: Optional[str] = None


class WorkflowNodeResponse(WorkflowNodeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# ==============================
# WorkflowConnection schemas
# ==============================

class WorkflowConnectionBase(BaseModel):
    workflow_id: UUID
    source_node_id: UUID
    target_node_id: UUID
    label: Optional[str] = None
    condition: Optional[str] = None
    priority: int = 0
    connection_metadata: Dict[str, Any] = Field(default_factory=dict)


class WorkflowConnectionCreate(WorkflowConnectionBase):
    pass


class WorkflowConnectionUpdate(BaseModel):
    label: Optional[str] = None
    condition: Optional[str] = None
    priority: Optional[int] = None
    connection_metadata: Optional[Dict[str, Any]] = None


class WorkflowConnectionResponse(WorkflowConnectionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# ==============================
# Additional composite schemas
# ==============================

class WorkflowDetailResponse(WorkflowResponse):
    nodes: List[WorkflowNodeResponse]
    connections: List[WorkflowConnectionResponse]

    class Config:
        orm_mode = True 