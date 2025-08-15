import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AIConfigSettings from '../../../views/settings/AIConfigSettings.vue'

// Mock the DashboardLayout component
vi.mock('@/layouts/DashboardLayout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="dashboard-layout"><slot /></div>'
  }
}))

// Mock the AISetup component
vi.mock('@/components/ai/AISetup.vue', () => ({
  default: {
    name: 'AISetup',
    template: '<div class="ai-setup"></div>',
    emits: ['ai-setup-complete']
  }
}))

describe('AIConfigSettings', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Create a fresh pinia instance
    setActivePinia(createPinia())

    // Mount component with proper stubs
    wrapper = mount(AIConfigSettings, {
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

  it('displays correct header content', () => {
    const header = wrapper.find('.page-header')
    expect(header.exists()).toBe(true)
    expect(header.find('h1').text()).toBe('AI Configuration')
    expect(header.find('.description').text()).toBe('Configure your AI provider settings')
  })

  it('is wrapped in DashboardLayout', () => {
    const dashboardLayout = wrapper.find('.dashboard-layout')
    expect(dashboardLayout.exists()).toBe(true)
  })

  it('contains AISetup component', () => {
    const aiSetup = wrapper.findComponent({ name: 'AISetup' })
    expect(aiSetup.exists()).toBe(true)
  })

  it('applies correct styling', () => {
    // Check container styling
    const container = wrapper.find('.dashboard-container')
    expect(container.classes()).toContain('dashboard-container')
    
    // Check settings section styling
    const settingsSection = wrapper.find('.settings-section')
    expect(settingsSection.classes()).toContain('settings-section')
    
    // Check header styling
    const header = wrapper.find('.page-header')
    expect(header.classes()).toContain('page-header')
  })

  it('maintains proper layout structure', () => {
    // Check nested structure
    const container = wrapper.find('.dashboard-container')
    const settingsSection = container.find('.settings-section')
    const header = settingsSection.find('.page-header')
    
    expect(container.exists()).toBe(true)
    expect(settingsSection.exists()).toBe(true)
    expect(header.exists()).toBe(true)
    
    // Verify AISetup is inside settings section
    const aiSetup = settingsSection.findComponent({ name: 'AISetup' })
    expect(aiSetup.exists()).toBe(true)
  })

  it('has accessible heading structure', () => {
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('AI Configuration')
    
    // Check that there's only one h1
    const h1s = wrapper.findAll('h1')
    expect(h1s).toHaveLength(1)
  })
}) 