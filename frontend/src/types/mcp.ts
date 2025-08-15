/*
ChatterMate - MCP Tool Types
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
*/

export type MCPTransportType = 'stdio' | 'sse' | 'http'

export interface MCPTool {
  id: number
  name: string
  description?: string
  transport_type: MCPTransportType
  enabled: boolean
  
  // STDIO transport fields
  command?: string
  args?: string[]
  env_vars?: Record<string, string>
  
  // SSE/HTTP transport fields
  url?: string
  headers?: Record<string, string>
  timeout?: number
  sse_read_timeout?: number
  terminate_on_close?: boolean
  
  organization_id: string
  created_at: string
  updated_at: string
}

export interface MCPToolCreate {
  name: string
  description?: string
  transport_type: MCPTransportType
  enabled: boolean
  
  // STDIO transport fields
  command?: string
  args?: string[]
  env_vars?: Record<string, string>
  
  // SSE/HTTP transport fields
  url?: string
  headers?: Record<string, string>
  timeout?: number
  sse_read_timeout?: number
  terminate_on_close?: boolean
}

export interface MCPToolUpdate {
  name?: string
  description?: string
  enabled?: boolean
  
  // STDIO transport fields
  command?: string
  args?: string[]
  env_vars?: Record<string, string>
  
  // SSE/HTTP transport fields
  url?: string
  headers?: Record<string, string>
  timeout?: number
  sse_read_timeout?: number
  terminate_on_close?: boolean
}

export interface MCPToolToAgent {
  id: number
  mcp_tool_id: number
  agent_id: string
  created_at: string
  mcp_tool: MCPTool
}

export interface AgentMCPTools {
  id: string
  name: string
  mcp_tools: MCPTool[]
} 