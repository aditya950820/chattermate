/*
ChatterMate - MCP Tool Service
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

import api from './api'
import type { MCPTool, MCPToolCreate, MCPToolUpdate, MCPToolToAgent, AgentMCPTools } from '@/types/mcp'

export const mcpService = {
  // MCP Tool management
  async getOrganizationMCPTools(enabledOnly: boolean = true): Promise<MCPTool[]> {
    const response = await api.get('/mcp-tools', {
      params: { enabled_only: enabledOnly }
    })
    return response.data
  },

  async getMCPTool(toolId: number): Promise<MCPTool> {
    const response = await api.get(`/mcp-tools/${toolId}`)
    return response.data
  },

  async createMCPTool(data: MCPToolCreate): Promise<MCPTool> {
    const response = await api.post('/mcp-tools', data)
    return response.data
  },

  async updateMCPTool(toolId: number, data: MCPToolUpdate): Promise<MCPTool> {
    const response = await api.put(`/mcp-tools/${toolId}`, data)
    return response.data
  },

  async deleteMCPTool(toolId: number): Promise<void> {
    await api.delete(`/mcp-tools/${toolId}`)
  },

  // Agent-MCP Tool associations
  async getAgentMCPTools(agentId: string): Promise<AgentMCPTools> {
    const response = await api.get(`/mcp-tools/agent/${agentId}`)
    return response.data
  },

  async addMCPToolToAgent(mcpToolId: number, agentId: string): Promise<MCPToolToAgent> {
    const response = await api.post('/mcp-tools/agent-association', {
      mcp_tool_id: mcpToolId,
      agent_id: agentId
    })
    return response.data
  },

  async removeMCPToolFromAgent(mcpToolId: number, agentId: string): Promise<void> {
    await api.delete(`/mcp-tools/agent-association/${mcpToolId}/${agentId}`)
  }
} 