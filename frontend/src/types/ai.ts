export interface AIProvider {
  value: string
  label: string
}

export interface AIModel {
  value: string
  label: string
}

export interface AIConfig {
  id: number
  organization_id: string // UUID
  model_type: string
  model_name: string
  is_active: boolean
  settings: Record<string, unknown>
}

export type AIConfigResponse = AIConfig

export interface AISetupResponse {
  message: string
  config: AIConfigResponse
}

export interface SetupStep {
  provider?: boolean
  model?: boolean
  key?: boolean
}
