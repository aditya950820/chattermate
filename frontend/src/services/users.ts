import api from './api'
import type { User } from '@/types/user'

export async function listUsers(): Promise<User[]> {
  const response = await api.get('users')
  return response.data
}

export async function getUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const response = await api.post('users', userData)
  return response.data
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  const response = await api.put(`users/${id}`, userData)
  return response.data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`users/${id}`)
}

export async function updateUserPassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
  await api.put(`users/${id}/password`, {
    current_password: currentPassword,
    new_password: newPassword
  })
}

export async function updateUserProfile(id: string, profileData: Partial<User>): Promise<User> {
  const response = await api.put(`users/${id}/profile`, profileData)
  return response.data
}

export async function uploadProfilePic(formData: FormData): Promise<User> {
  const response = await api.post('/users/me/profile-pic', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export async function updateUserStatus(id: string, isOnline: boolean): Promise<void> {
  await api.post(`/users/${id}/status`, { is_online: isOnline })
} 