import type { Role } from '@/types/user'
import api from './api'

export interface Permission {
  id: number
  name: string
  description: string
}

export async function listRoles(): Promise<Role[]> {
    const response = await api.get('/roles')
    return response.data
}

export async function getRole(id: string): Promise<Role> {
  const response = await api.get(`/roles/${id}`)
  return response.data
}

export async function listPermissions(): Promise<Permission[]> {
  const response = await api.get('/roles/permissions/all')
  return response.data
}

export async function createRole(roleData: Partial<Role>): Promise<Role> {
  const response = await api.post('roles', roleData)
  return response.data
}

export async function updateRole(id: string, roleData: Partial<Role>): Promise<Role> {
  const response = await api.put(`roles/${id}`, roleData)
  return response.data
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`roles/${id}`)
} 