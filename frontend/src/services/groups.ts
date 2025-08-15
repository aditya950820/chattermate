import type { User, UserGroup } from '@/types/user'
import api from './api'



export async function listGroups(): Promise<UserGroup[]> {
  const response = await api.get('/groups')
  return response.data
}

export async function createGroup(groupData: Partial<UserGroup>): Promise<UserGroup> {
  const response = await api.post('/groups', groupData)
  return response.data
}

export async function updateGroup(id: string, groupData: Partial<UserGroup>): Promise<UserGroup> {
  const response = await api.put(`/groups/${id}`, groupData)
  return response.data
}

export async function deleteGroup(id: string): Promise<void> {
  await api.delete(`/groups/${id}`)
}

export async function addUserToGroup(groupId: string, userId: string): Promise<void> {
  await api.post(`/groups/${groupId}/users/${userId}`)
}

export async function removeUserFromGroup(groupId: string, userId: string): Promise<void> {
  await api.delete(`/groups/${groupId}/users/${userId}`)
}

export async function getGroupUsers(groupId: string): Promise<UserGroup> {
  const response = await api.get(`user-groups/${groupId}`)
  return response.data
} 