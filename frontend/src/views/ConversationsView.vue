<!--
ChatterMate - Conversations View
Copyright (C) 2024 ChatterMate

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>
-->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ConversationsList from '@/components/conversations/ConversationsList.vue'
import type { Conversation, ChatDetail } from '@/types/chat'
import { chatService } from '@/services/chat'

const conversations = ref<Conversation[]>([])
const loading = ref(true)
const error = ref('')
const statusFilter = ref<'open' | 'closed'>('open')
const currentPage = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)
const totalCount = ref<number | null>(null)

// Computed property to show how many conversations are loaded
const loadedCount = computed(() => conversations.value?.length || 0)
const totalItems = computed(() => totalCount.value || loadedCount.value)

const loadConversations = async (page = 1, loadMore = false) => {
  error.value = ''
  
  if (page === 1 || !loadMore) {
    loading.value = true
  }
  
  const skip = (page - 1) * pageSize.value
  
  let newConversations: Conversation[] = []
  
  try {
    if (statusFilter.value === 'open') {
      newConversations = await chatService.getRecentChats({
        status: 'open,transferred',
        skip,
        limit: pageSize.value
      })
    } else {
      newConversations = await chatService.getRecentChats({
        status: statusFilter.value,
        skip,
        limit: pageSize.value
      })
    }
    
    // If we're loading more, append to existing conversations
    if (loadMore && page > 1) {
      conversations.value = [...(conversations.value || []), ...newConversations]
    } else {
      conversations.value = newConversations
    }
    
    // Check if there might be more conversations to load
    hasMore.value = newConversations?.length === pageSize.value
    currentPage.value = page
    
    // If we received fewer items than the page size, we can calculate the total
    if (newConversations?.length < pageSize.value) {
      totalCount.value = skip + (newConversations?.length || 0)
    }
    
  } catch (err) {
    error.value = 'Failed to load conversations'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadMoreConversations = () => {
  if (!loading.value && hasMore.value) {
    loadConversations(currentPage.value + 1, true)
  }
}

const updateFilter = (status: 'open' | 'closed') => {
  statusFilter.value = status
  currentPage.value = 1
  hasMore.value = true
  totalCount.value = null
  loadConversations(1)
}

const handleChatUpdated = (chatDetail: ChatDetail) => {
  // Update the conversation in the list if it exists
  const index = conversations.value.findIndex(c => c.session_id === chatDetail.session_id)
  if (index !== -1) {
    // Create a new conversation object with updated data
    const updatedConversation: Conversation = {
      ...conversations.value[index],
      last_message: chatDetail.messages[chatDetail.messages.length - 1]?.message || '',
      updated_at: chatDetail.updated_at,
      message_count: chatDetail.messages.length,
      status: chatDetail.status
    }
    
    // Create a new array with the updated conversation
    const updatedConversations = [...conversations.value]
    updatedConversations[index] = updatedConversation
    conversations.value = updatedConversations
  }
}

onMounted(() => loadConversations(1))
</script>

<template>
  <DashboardLayout>
    <header class="page-header" style="padding: var(--space-lg);">
        <h1>Conversations</h1>
    </header>
    <div class="conversations-view">
      <ConversationsList 
        :conversations="conversations"
        :loading="loading"
        :error="error"
        :status-filter="statusFilter"
        :has-more="hasMore"
        :loading-more="loading && currentPage > 1"
        :loaded-count="loadedCount"
        :total-count="totalItems"
        @refresh="loadConversations(1)"
        @update-filter="updateFilter"
        @load-more="loadMoreConversations"
        @chat-updated="handleChatUpdated"
        @clear-unread="() => {}"
      />
    </div>
  </DashboardLayout>
</template>

<style scoped>
.conversations-view {
  height: calc(100vh - 64px); /* Adjust based on header height */
  width: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
  background: #1a1a1a;
}
</style> 