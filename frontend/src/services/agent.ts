import api from './api'
import type { AgentCustomization, Agent, AgentUpdate } from '@/types/agent'
import { agentStorage } from '@/utils/storage'

export const agentService = {
  async getOrganizationAgents(): Promise<Agent[]> {
    const response = await api.get('/agent/list')
    // Store agents in local storage
    agentStorage.setAgents(response.data)
    return response.data
  },

  async createAgent(data: {
    name: string;
    display_name: string;
    agent_type: string;
    instructions: string[];
    is_active: boolean;
    use_workflow?: boolean;
  }): Promise<Agent> {
    const response = await api.post('/agent', data)
    
    // Update agent in local storage
    const agents = agentStorage.getAgents()
    agents.push(response.data)
    agentStorage.setAgents(agents)
    
    return response.data
  },

  async updateAgent(
    agentId: string,
    data: AgentUpdate
  ): Promise<Agent> {
    const response = await api.put(`/agent/${agentId}`, data)
    // Update agent in local storage
    agentStorage.updateAgent(response.data)
    return response.data
  },

  async updateCustomization(
    agentId: string,
    customization: AgentCustomization,
  ): Promise<AgentCustomization> {
    const response = await api.post(`/agent/${agentId}/customization`, customization)

    // Update agent customization in local storage
    const agents = agentStorage.getAgents()
    const agent = agents.find((a) => a.id === agentId)
    if (agent) {
      agent.customization = response.data
      agentStorage.updateAgent(agent)

      // Update active agent if it's the same one
      const activeAgent = agentStorage.getActiveAgent()
      if (activeAgent && activeAgent.id === agentId) {
        agentStorage.setActiveAgent(agent)
      }
    }

    return response.data
  },

  async uploadAgentPhoto(agentId: string, file: File): Promise<AgentCustomization> {
    const formData = new FormData()
    formData.append('photo', file)

    const response = await api.post(`/agent/${agentId}/customization/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Update agent customization in local storage
    const agents = agentStorage.getAgents()
    const agent = agents.find((a) => a.id === agentId)
    if (agent) {
      agent.customization = response.data
      agentStorage.updateAgent(agent)

      // Update active agent if it's the same one
      const activeAgent = agentStorage.getActiveAgent()
      if (activeAgent && activeAgent.id === agentId) {
        agentStorage.setActiveAgent(agent)
      }
    }

    return response.data
  },

  async updateAgentGroups(agentId: string, groupIds: string[]): Promise<Agent> {
    const response = await api.put(`/agent/${agentId}/groups`, groupIds)
    return response.data
  },

  async getAgentById(agentId: string): Promise<Agent> {
    const response = await api.get(`/agent/${agentId}`)
    return response.data
  },
  
  async generateInstructions(prompt: string, existingInstructions?: string[]): Promise<string[]> {
    const response = await api.post('/agent/generate-instructions', { 
        prompt,
        existing_instructions: existingInstructions 
    })
    return response.data
  }
}
