/**
 * ChatterMate - Agent Workflow Composable
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

import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { workflowService } from '@/services/workflow'
import type { WorkflowResponse, WorkflowCreate } from '@/types/workflow'

export function useAgentWorkflow(agentId: string) {
  const workflow = ref<WorkflowResponse | null>(null)
  const workflowLoading = ref(false)
  const workflowError = ref('')
  const createWorkflowLoading = ref(false)

  const hasWorkflow = computed(() => workflow.value !== null)

  const fetchWorkflow = async () => {
    try {
      workflowLoading.value = true
      workflowError.value = ''
      workflow.value = await workflowService.getWorkflowByAgent(agentId)
    } catch (error: any) {
      console.error('Error fetching workflow:', error)
      
      // Don't show error toast for 404 - it means agent doesn't have a workflow yet (normal state)
      if (error.response?.status !== 404) {
        workflowError.value = error.response?.data?.detail || 'Failed to fetch workflow'
        toast.error('Failed to fetch workflow', {
          duration: 4000,
          closeButton: true
        })
      } else {
        // For 404, just log and set workflow to null
        console.log('No workflow found for agent - agent has no workflow yet')
        workflow.value = null
        workflowError.value = ''
      }
    } finally {
      workflowLoading.value = false
    }
  }

  const createWorkflow = async (data: Omit<WorkflowCreate, 'agent_id'>) => {
    try {
      createWorkflowLoading.value = true
      workflowError.value = ''
      
      const workflowData: WorkflowCreate = {
        ...data,
        agent_id: agentId
      }
      
      const newWorkflow = await workflowService.createWorkflow(workflowData)
      workflow.value = newWorkflow
      
      toast.success('Workflow created successfully', {
        duration: 4000,
        closeButton: true
      })
      
      return newWorkflow
    } catch (error: any) {
      console.error('Error creating workflow:', error)
      workflowError.value = error.response?.data?.detail || 'Failed to create workflow'
      toast.error('Failed to create workflow', {
        duration: 4000,
        closeButton: true
      })
      throw error
    } finally {
      createWorkflowLoading.value = false
    }
  }

  const updateWorkflow = async (workflowId: string, data: Partial<WorkflowCreate>) => {
    try {
      workflowLoading.value = true
      workflowError.value = ''
      
      const updatedWorkflow = await workflowService.updateWorkflow(workflowId, data)
      workflow.value = updatedWorkflow
      
      toast.success('Workflow updated successfully', {
        duration: 4000,
        closeButton: true
      })
      
      return updatedWorkflow
    } catch (error: any) {
      console.error('Error updating workflow:', error)
      workflowError.value = error.response?.data?.detail || 'Failed to update workflow'
      toast.error('Failed to update workflow', {
        duration: 4000,
        closeButton: true
      })
      throw error
    } finally {
      workflowLoading.value = false
    }
  }

  const deleteWorkflow = async (workflowId: string) => {
    try {
      workflowLoading.value = true
      workflowError.value = ''
      
      await workflowService.deleteWorkflow(workflowId)
      workflow.value = null
      
      toast.success('Workflow deleted successfully', {
        duration: 4000,
        closeButton: true
      })
    } catch (error: any) {
      console.error('Error deleting workflow:', error)
      workflowError.value = error.response?.data?.detail || 'Failed to delete workflow'
      toast.error('Failed to delete workflow', {
        duration: 4000,
        closeButton: true
      })
      throw error
    } finally {
      workflowLoading.value = false
    }
  }

  return {
    workflow,
    workflowLoading,
    workflowError,
    createWorkflowLoading,
    hasWorkflow,
    fetchWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  }
} 