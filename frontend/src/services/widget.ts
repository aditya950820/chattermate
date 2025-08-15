import api from '@/services/api'
import type { Widget, WidgetCreate } from '@/types/widget'

class WidgetService {
  private baseUrl = '/widgets'

  async getWidgets(): Promise<Widget[]> {
    const response = await api.get(this.baseUrl)
    return response.data
  }

  async getWidget(id: string): Promise<Widget> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async createWidget(data: WidgetCreate): Promise<Widget> {
    const response = await api.post(this.baseUrl, data)
    return response.data
  }

  async deleteWidget(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`)
  }

  async getWidgetDetails(id: string): Promise<Widget> {
    const response = await api.get(`${this.baseUrl}/${id}/details`)
    return response.data
  }
}

export const widgetService = new WidgetService()
