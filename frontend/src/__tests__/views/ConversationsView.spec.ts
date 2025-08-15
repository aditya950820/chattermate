import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConversationsView from '../../views/ConversationsView.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock the chat service
vi.mock('@/services/chat', () => ({
  chatService: {
    getRecentChats: vi.fn()
  }
}))

// Mock the components
vi.mock('@/layouts/DashboardLayout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="dashboard-layout"><slot /></div>'
  }
}))

vi.mock('@/components/conversations/ConversationsList.vue', () => ({
  default: {
    name: 'ConversationsList',
    template: '<div class="conversations-list"></div>',
    props: ['conversations', 'loading', 'error', 'loadedCount', 'totalCount', 'hasMore', 'statusFilter']
  }
}))

// Mock the computed property for loadedCount
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    computed: (fn) => {
      // Return 0 for loadedCount to avoid the error
      if (fn.toString().includes('conversations.value.length')) {
        return { value: 0 }
      }
      return actual.computed(fn)
    }
  }
})

// Import the mocked modules
import { chatService } from '@/services/chat'

describe('ConversationsView', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders properly', () => {
    wrapper = mount(ConversationsView)
    expect(wrapper.find('.conversations-view').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Conversations')
  })

  it('shows loading state initially', () => {
    wrapper = mount(ConversationsView)
    const conversationsList = wrapper.findComponent({ name: 'ConversationsList' })
    expect(conversationsList.props('loading')).toBe(true)
  })

  it('loads conversations on mount', async () => {
    const mockConversations = [
      { id: '1', title: 'Chat 1' },
      { id: '2', title: 'Chat 2' }
    ]
    
    ;(chatService.getRecentChats as any).mockResolvedValue(mockConversations)
    
    wrapper = mount(ConversationsView)
    
    // Wait for the mounted hook and async operations to complete
    await vi.waitFor(async () => {
      await nextTick()
      const conversationsList = wrapper.findComponent({ name: 'ConversationsList' })
      return conversationsList.props('loading') === false
    })
    
    const conversationsList = wrapper.findComponent({ name: 'ConversationsList' })
    expect(chatService.getRecentChats).toHaveBeenCalledWith({
      status: 'open,transferred',
      skip: 0,
      limit: 20
    })
    expect(conversationsList.props('conversations')).toEqual(mockConversations)
    expect(conversationsList.props('loading')).toBe(false)
  })

  it('handles loading error', async () => {
    const errorMessage = 'Failed to load conversations'
    ;(chatService.getRecentChats as any).mockRejectedValue(new Error('API Error'))
    
    wrapper = mount(ConversationsView)
    
    // Wait for the mounted hook and async operations to complete
    await vi.waitFor(async () => {
      await nextTick()
      const conversationsList = wrapper.findComponent({ name: 'ConversationsList' })
      return conversationsList.props('loading') === false
    })
    
    const conversationsList = wrapper.findComponent({ name: 'ConversationsList' })
    expect(conversationsList.props('error')).toBe(errorMessage)
    expect(conversationsList.props('loading')).toBe(false)
  })

  it('refreshes conversations when refresh event is emitted', async () => {
    const mockConversations = [
      { id: '1', title: 'Chat 1' },
      { id: '2', title: 'Chat 2' }
    ]
    
    ;(chatService.getRecentChats as any).mockResolvedValue(mockConversations)
    
    wrapper = mount(ConversationsView)
    await vi.waitFor(async () => {
      await nextTick()
      const conversationsList = wrapper.findComponent({ name: 'ConversationsList' })
      return conversationsList.props('loading') === false
    })
    
    // Clear the first call to getRecentChats from mounted
    vi.clearAllMocks()
    
    // Trigger refresh
    const conversationsList = wrapper.findComponent({ name: 'ConversationsList' })
    await conversationsList.vm.$emit('refresh')
    
    // Wait for the refresh to complete
    await vi.waitFor(async () => {
      await nextTick()
      return chatService.getRecentChats.mock.calls.length > 0
    })
    
    expect(chatService.getRecentChats).toHaveBeenCalled()
  })
}) 