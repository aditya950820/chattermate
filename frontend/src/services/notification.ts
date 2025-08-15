import api from './api'

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  notification_metadata?: Record<string, any>
  is_read: boolean
  created_at: string
}

export const notificationService = {
  async getNotifications(skip = 0, limit = 50): Promise<Notification[]> {
    const response = await api.get(`/notifications?skip=${skip}&limit=${limit}`)
    return response.data
  },

  async markAsRead(notificationId: number): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`)
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count')
    return response.data.count
  },
}
