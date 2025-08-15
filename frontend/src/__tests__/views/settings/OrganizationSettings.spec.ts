import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OrganizationSettings from '../../../views/settings/OrganizationSettings.vue'

// Mock the DashboardLayout component
vi.mock('@/layouts/DashboardLayout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="dashboard-layout"><slot /></div>'
  }
}))

// Mock the OrganizationSettingsSetup component
vi.mock('@/components/organization/Organizations.vue', () => ({
  default: {
    name: 'OrganizationSettingsSetup',
    template: '<div class="organization-settings-setup"></div>'
  }
}))

describe('OrganizationSettings', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Create a fresh pinia instance
    setActivePinia(createPinia())

    // Mount component with proper stubs
    wrapper = mount(OrganizationSettings, {
      global: {
        stubs: {
          DashboardLayout: {
            template: '<div class="dashboard-layout"><slot /></div>'
          }
        }
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.find('.dashboard-container').exists()).toBe(true)
    expect(wrapper.find('.settings-section').exists()).toBe(true)
  })

  it('is wrapped in DashboardLayout', () => {
    const dashboardLayout = wrapper.find('.dashboard-layout')
    expect(dashboardLayout.exists()).toBe(true)
  })

  it('contains OrganizationSettingsSetup component', () => {
    const orgSettings = wrapper.findComponent({ name: 'OrganizationSettingsSetup' })
    expect(orgSettings.exists()).toBe(true)
  })

  it('applies correct styling', () => {
    // Check container styling
    const container = wrapper.find('.dashboard-container')
    expect(container.classes()).toContain('dashboard-container')
    
    // Check settings section styling
    const settingsSection = wrapper.find('.settings-section')
    expect(settingsSection.classes()).toContain('settings-section')
  })

  it('maintains proper layout structure', () => {
    // Check nested structure
    const container = wrapper.find('.dashboard-container')
    const settingsSection = container.find('.settings-section')
    
    expect(container.exists()).toBe(true)
    expect(settingsSection.exists()).toBe(true)
    
    // Verify OrganizationSettingsSetup is inside settings section
    const orgSettings = settingsSection.findComponent({ name: 'OrganizationSettingsSetup' })
    expect(orgSettings.exists()).toBe(true)
  })
}) 