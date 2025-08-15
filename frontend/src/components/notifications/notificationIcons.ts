import chatIcon from '@/assets/chat.svg'
import knowledgeIcon from '@/assets/knowledge.svg'

export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'knowledge_processed':
    case 'knowledge_failed':
      return knowledgeIcon
    case 'chat':
      return chatIcon
    default:
      return ''
  }
}
