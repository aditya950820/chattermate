export interface KnowledgeUploadResponse {
  message?: string
  error?: string
  knowledge?: Array<{
    id: number
    name: string
    type: string
    status: string
  }>
}

export interface KnowledgePage {
  subpage: string
  created_at: string | null
  updated_at: string | null
}

export interface KnowledgeItem {
  id: number
  name: string
  type: string
  pages: KnowledgePage[]
  error?: string
}

export interface PaginatedKnowledgeResponse {
  knowledge: KnowledgeItem[]
  pagination: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
  }
}
