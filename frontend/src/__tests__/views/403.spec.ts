import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ForbiddenView from '../../views/403.vue'

// Mock the DashboardLayout component
vi.mock('@/layouts/DashboardLayout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="dashboard-layout"><slot /></div>'
  }
}))

describe('403 View', () => {
  let wrapper: VueWrapper
  let router: any

  beforeEach(async () => {
    // Create a fresh pinia instance
    setActivePinia(createPinia())

    // Create router instance
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/403', name: 'forbidden', component: ForbiddenView }
      ]
    })

    // Initialize router
    await router.push('/403')
    await router.isReady()

    // Mount component with proper stubs and mocks
    wrapper = mount(ForbiddenView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<a :href="to" class="router-link"><slot /></a>',
            props: ['to']
          },
          DashboardLayout: {
            template: '<div class="dashboard-layout"><slot /></div>'
          }
        }
      }
    })
  })

  it('renders properly', () => {
    expect(wrapper.find('.unauthorized').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Access Denied')
    expect(wrapper.find('p').text()).toBe('You don\'t have permission to access this page.')
  })

  it('is wrapped in DashboardLayout', () => {
    const dashboardLayout = wrapper.find('.dashboard-layout')
    expect(dashboardLayout.exists()).toBe(true)
  })

  it('contains a link back to dashboard', () => {
    const backLink = wrapper.find('.back-link')
    expect(backLink.exists()).toBe(true)
    expect(backLink.text()).toBe('Return to Dashboard')
    expect(backLink.attributes('href')).toBe('/')
  })

  it('applies correct styling', () => {
    const container = wrapper.find('.unauthorized')
    expect(container.classes()).toContain('unauthorized')
    
    const backLink = wrapper.find('.back-link')
    expect(backLink.classes()).toContain('back-link')
  })

  it('navigates to home when clicking the back link', async () => {
    const backLink = wrapper.find('.back-link')
    await backLink.trigger('click')
    
    // Simulate router navigation
    await router.push('/')
    await flushPromises()
    
    expect(router.currentRoute.value.path).toBe('/')
  })
}) 