import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Create a mock router since App.vue uses RouterView
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' }
    }
  ]
})

describe('App', () => {
  it('renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('contains RouterView component', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })

  it('contains Toaster component', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.findComponent({ name: 'Toaster' }).exists()).toBe(true)
  })
})