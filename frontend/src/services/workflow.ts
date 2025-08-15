/**
 * ChatterMate - Workflow Service
 * Copyright (C) 2024 ChatterMate
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import api from './api'
import type { WorkflowCreate, WorkflowResponse } from '@/types/workflow'
import { WorkflowStatus } from '@/types/workflow'

export const workflowService = {
  async createWorkflow(data: WorkflowCreate): Promise<WorkflowResponse> {
    const response = await api.post('/workflow', data)
    return response.data
  },

  async getWorkflowByAgent(agentId: string): Promise<WorkflowResponse | null> {
    try {
      const response = await api.get(`/workflow/agent/${agentId}`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  async updateWorkflow(workflowId: string, data: Partial<WorkflowCreate>): Promise<WorkflowResponse> {
    const response = await api.put(`/workflow/${workflowId}`, data)
    return response.data
  },

  async deleteWorkflow(workflowId: string): Promise<void> {
    await api.delete(`/workflow/${workflowId}`)
  },

  async publishWorkflow(workflowId: string): Promise<WorkflowResponse> {
    const response = await api.put(`/workflow/${workflowId}`, { status: WorkflowStatus.PUBLISHED })
    return response.data
  },

  async unpublishWorkflow(workflowId: string): Promise<WorkflowResponse> {
    const response = await api.put(`/workflow/${workflowId}`, { status: WorkflowStatus.DRAFT })
    return response.data
  }
} 