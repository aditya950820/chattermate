import type { User } from "@/types/user"

export interface BusinessHours {
  start: string
  end: string
  enabled: boolean
}

export interface BusinessHoursDict {
  monday: BusinessHours
  tuesday: BusinessHours
  wednesday: BusinessHours
  thursday: BusinessHours
  friday: BusinessHours
  saturday: BusinessHours
  sunday: BusinessHours
}

export interface Organization {
  id: string
  name: string
  domain: string
  timezone: string
  business_hours: BusinessHoursDict
  settings: Record<string, any>
  is_active: boolean
}

export interface OrganizationCreate {
  name: string
  domain: string
  timezone: string
  business_hours: BusinessHoursDict
  admin_email: string
  admin_name: string
  admin_password: string
  settings?: Record<string, any>
}

export interface OrganizationUpdate {
  name?: string
  domain?: string
  timezone?: string
  business_hours?: BusinessHoursDict
  settings?: Record<string, any>
}

export interface OrganizationResponse extends Omit<OrganizationCreate, 'admin_password'> {
  id: string
  is_active: boolean
  access_token?: string
  refresh_token?: string
  token_type?: string
  user: User
}
