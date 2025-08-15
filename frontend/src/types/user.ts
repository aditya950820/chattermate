import type { Permission } from "@/services/roles"

export interface Role {
  id: string
  name: string
  description?: string
  permissions?: Permission[]
  created_at?: string
  updated_at?: string
  is_default?: boolean 
}

export interface UserGroup {
  id: string
  name: string
  description?: string
  organization_id: string
  users?: User[]
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  organization_id: string
  is_active?: boolean
  groups?: UserGroup[]
  role?: Role
  created_at?: string
  updated_at?: string
  profile_pic?: string
  profile_pic_url?: string
  is_online?: boolean
  last_seen?: string
} 
