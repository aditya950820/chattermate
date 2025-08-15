import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import HumanAgentView from '../../views/HumanAgentView.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock the components
vi.mock('@/layouts/DashboardLayout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="dashboard-layout"><slot /></div>'
  }
}))

vi.mock('@/components/human-agent/UserList.vue', () => ({
  default: {
    name: 'UserList',
    template: '<div class="user-list"></div>'
  }
}))

vi.mock('@/components/human-agent/GroupList.vue', () => ({
  default: {
    name: 'GroupList',
    template: '<div class="group-list"></div>'
  }
}))

vi.mock('@/components/human-agent/RoleList.vue', () => ({
  default: {
    name: 'RoleList',
    template: '<div class="role-list"></div>'
  }
}))

describe('HumanAgentView', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(HumanAgentView)
  })

  it('renders properly', () => {
    expect(wrapper.find('.human-agent-container').exists()).toBe(true)
    expect(wrapper.find('.tab-nav').exists()).toBe(true)
    expect(wrapper.find('.content-area').exists()).toBe(true)
  })

  it('displays all tab buttons', () => {
    const tabButtons = wrapper.findAll('.tab-btn')
    expect(tabButtons).toHaveLength(3)
    expect(tabButtons[0].text()).toBe('Users')
    expect(tabButtons[1].text()).toBe('Groups')
    expect(tabButtons[2].text()).toBe('Roles')
  })

  it('shows UserList component by default', () => {
    expect(wrapper.findComponent({ name: 'UserList' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'GroupList' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'RoleList' }).exists()).toBe(false)
  })

  it('switches to GroupList when Groups tab is clicked', async () => {
    const groupsTab = wrapper.findAll('.tab-btn')[1]
    await groupsTab.trigger('click')

    expect(wrapper.findComponent({ name: 'UserList' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'GroupList' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'RoleList' }).exists()).toBe(false)
  })

  it('switches to RoleList when Roles tab is clicked', async () => {
    const rolesTab = wrapper.findAll('.tab-btn')[2]
    await rolesTab.trigger('click')

    expect(wrapper.findComponent({ name: 'UserList' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'GroupList' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'RoleList' }).exists()).toBe(true)
  })

  it('applies active class to selected tab button', async () => {
    // Initially Users tab should be active
    let tabButtons = wrapper.findAll('.tab-btn')
    expect(tabButtons[0].classes()).toContain('active')
    expect(tabButtons[1].classes()).not.toContain('active')
    expect(tabButtons[2].classes()).not.toContain('active')

    // Click Groups tab
    await tabButtons[1].trigger('click')
    tabButtons = wrapper.findAll('.tab-btn')
    expect(tabButtons[0].classes()).not.toContain('active')
    expect(tabButtons[1].classes()).toContain('active')
    expect(tabButtons[2].classes()).not.toContain('active')

    // Click Roles tab
    await tabButtons[2].trigger('click')
    tabButtons = wrapper.findAll('.tab-btn')
    expect(tabButtons[0].classes()).not.toContain('active')
    expect(tabButtons[1].classes()).not.toContain('active')
    expect(tabButtons[2].classes()).toContain('active')
  })

  it('is wrapped in DashboardLayout', () => {
    const dashboardLayout = wrapper.findComponent({ name: 'DashboardLayout' })
    expect(dashboardLayout.exists()).toBe(true)
  })
}) 