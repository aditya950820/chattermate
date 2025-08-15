import api from './api'
import type { ChatDetail } from '@/types/chat'

export const sessionToAgentService = {
  async takeoverChat(sessionId: string) {
    const response = await api.post<ChatDetail>(`/sessions/${sessionId}/takeover`)
    return response.data
  }
} 