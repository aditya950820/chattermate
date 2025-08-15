"""
ChatterMate - MCP Tool Schema
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

from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Union
from enum import Enum
from uuid import UUID
from app.models.mcp_tool import MCPTransportType


class MCPTransportTypeEnum(str, Enum):
    STDIO = "stdio"
    SSE = "sse"
    HTTP = "http"


class MCPToolBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Display name for the MCP server")
    description: Optional[str] = Field(None, description="Optional description of what this MCP server does")
    transport_type: MCPTransportTypeEnum
    enabled: bool = Field(default=True, description="Whether this MCP tool is enabled")
    
    # STDIO transport fields
    command: Optional[str] = Field(None, description="Command to run the MCP server (e.g., 'npx', 'uvx', 'node')")
    args: Optional[List[str]] = Field(None, description="Arguments to pass to the MCP server")
    env_vars: Optional[Dict[str, str]] = Field(None, description="Environment variables as key-value pairs")
    
    # SSE/HTTP transport fields
    url: Optional[str] = Field(None, description="Server URL for SSE/HTTP transport")
    headers: Optional[Dict[str, str]] = Field(None, description="HTTP headers as key-value pairs")
    timeout: Optional[int] = Field(None, ge=1, le=300, description="Connection timeout in seconds (1-300)")
    sse_read_timeout: Optional[int] = Field(None, ge=1, le=600, description="SSE read timeout in seconds (1-600)")
    terminate_on_close: Optional[bool] = Field(default=True, description="Whether to terminate connection when client is closed (HTTP only)")

    @validator('command')
    def validate_stdio_command(cls, v, values):
        if values.get('transport_type') == MCPTransportTypeEnum.STDIO and not v:
            raise ValueError('Command is required for STDIO transport')
        return v

    @validator('url')
    def validate_url(cls, v, values):
        if values.get('transport_type') in [MCPTransportTypeEnum.SSE, MCPTransportTypeEnum.HTTP] and not v:
            raise ValueError('URL is required for SSE/HTTP transport')
        return v


class MCPToolCreate(MCPToolBase):
    organization_id: Optional[UUID] = None


class MCPToolUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    enabled: Optional[bool] = None
    
    # STDIO transport fields
    command: Optional[str] = None
    args: Optional[List[str]] = None
    env_vars: Optional[Dict[str, str]] = None
    
    # SSE/HTTP transport fields
    url: Optional[str] = None
    headers: Optional[Dict[str, str]] = None
    timeout: Optional[int] = Field(None, ge=1, le=300)
    sse_read_timeout: Optional[int] = Field(None, ge=1, le=600)
    terminate_on_close: Optional[bool] = None


class MCPToolResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    transport_type: MCPTransportTypeEnum
    enabled: bool
    
    # STDIO transport fields
    command: Optional[str]
    args: Optional[List[str]]
    env_vars: Optional[Dict[str, str]]
    
    # SSE/HTTP transport fields
    url: Optional[str]
    headers: Optional[Dict[str, str]]
    timeout: Optional[int]
    sse_read_timeout: Optional[int]
    terminate_on_close: Optional[bool]
    
    organization_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MCPToolToAgentCreate(BaseModel):
    mcp_tool_id: int
    agent_id: UUID


class MCPToolToAgentResponse(BaseModel):
    id: int
    mcp_tool_id: int
    agent_id: UUID
    created_at: datetime
    mcp_tool: MCPToolResponse

    class Config:
        from_attributes = True


class AgentMCPToolsResponse(BaseModel):
    id: UUID
    name: str
    mcp_tools: List[MCPToolResponse] = []

    class Config:
        from_attributes = True 