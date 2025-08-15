import { ref } from 'vue'
import type { Agent } from '@/types/agent'
import { agentService } from '@/services/agent'

export function useAgentCreate() {
  const agentName = ref('')
  const useWorkflow = ref(false)
  const isCreating = ref(false)
  const error = ref('')

  const validateForm = () => {
    if (!agentName.value.trim()) {
      error.value = 'Agent name is required'
      return false
    }
    return true
  }

  const createAgent = async () => {
    if (!validateForm()) return null
    
    try {
      isCreating.value = true
      error.value = ''
      const newAgent = await agentService.createAgent({
        name: agentName.value.trim(),
        display_name: agentName.value.trim(),
        agent_type: 'custom',
        instructions: ['I am an AI assistant here to help with questions.'],
        is_active: true,
        use_workflow: useWorkflow.value
      })
      
      return newAgent
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create agent'
      return null
    } finally {
      isCreating.value = false
    }
  }

  return {
    agentName,
    useWorkflow,
    isCreating,
    error,
    createAgent
  }
} 