<!--
ChatterMate - Conversation Chat
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
import { onMounted, watch, nextTick, ref, computed } from 'vue'
import type { ChatDetail } from '@/types/chat'
import { useConversationChat } from '@/composables/useConversationChat'
import { useJiraTicket } from '@/composables/useJiraTicket'
import JiraTicketModal from '@/components/jira/JiraTicketModal.vue'
import sendIcon from '@/assets/sendbutton.svg'
import { userService } from '@/services/user'
import { marked } from 'marked'
import type { Renderer } from 'marked'

const props = defineProps<{
  chat: ChatDetail
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'chatUpdated', data: ChatDetail): void
  (e: 'clearUnread', sessionId: string): void
  (e: 'view-product', productId: string): void
}>()

// Create a local ref to track the current chat state
const currentChat = ref(props.chat)

const {
  newMessage,
  messagesContainer,
  formattedMessages,
  isLoading,
  showTakeoverButton,
  showTakenOverStatus,
  isChatClosed,
  canSendMessage,
  scrollToBottom,
  sendMessage,
  handleTakeover,
  updateChat,
  replaceChatFromProps,
  handledByAI,
  endChat
} = useConversationChat(props.chat, emit)

// Add Jira ticket functionality
const {
  jiraConnected,
  checkJiraStatus
} = useJiraTicket()

// State for Jira ticket modal
const showJiraTicketModal = ref(false)
const ticketSummary = ref('')

// Add state for end chat confirmation
const showEndChatConfirm = ref(false)

// Add marked configuration
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  breaks: true
})

// Configure marked renderer to add target="_blank" to links
const renderer = new marked.Renderer() as Renderer
renderer.link = function({ href, title, text }) {
  if (!href) return text || ''
  const link = `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`
  return link.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
}
marked.use({ renderer })

// Computed property to determine if the current user can end the chat
const canEndChat = computed(() => {
  // Can only end chat if:
  // 1. User can send messages (already handled by canSendMessage)
  // 2. Chat is not closed
  // 3. Current user is the one who took over the chat
  return canSendMessage.value && 
         !isChatClosed.value && 
         currentChat.value.user_id === userService.getUserId();
})

// Computed property to determine if the current user can create a ticket
const canCreateTicket = computed(() => {
  // Can only create ticket if:
  // 1. User can send messages (already handled by canSendMessage)
  // 2. Chat is not closed
  // 3. Current user is the one who took over the chat
  return canSendMessage.value && 
         !isChatClosed.value && 
         currentChat.value.user_id === userService.getUserId();
})

// Function to handle end chat request
const handleEndChatRequest = () => {
  showEndChatConfirm.value = true
}

// Function to confirm end chat
const confirmEndChat = () => {
  endChat(true) // true indicates to request rating
  showEndChatConfirm.value = false
}

// Function to cancel end chat
const cancelEndChat = () => {
  showEndChatConfirm.value = false
}

// Function to handle create ticket
const handleCreateTicket = async () => {
  // Get a summary from the last few messages
  const lastMessages = formattedMessages.value.slice(-3)
  const summary = lastMessages.map(m => m.message).join(' ').substring(0, 100) + '...'
  
  ticketSummary.value = summary
  showJiraTicketModal.value = true
}

// Function to handle ticket created
const handleTicketCreated = (ticketKey: string) => {
  // Add ticket key to message input
  newMessage.value = `Jira ticket created: ${ticketKey}`
  // Close the modal
  showJiraTicketModal.value = false
}

// Function to handle takeover
const onTakeover = async () => {
  try {
    await handleTakeover()
    // Update the currentChat ref with the latest chat data
    currentChat.value = {
      ...currentChat.value,
      status: 'open',
      user_id: userService.getUserId(),
      user_name: userService.getUserName()
    }
  } catch (error) {
    console.error('Error taking over chat:', error)
  }
}

// Watch for chat changes and update the internal state
watch(() => props.chat, (newChat) => {
  if (newChat) {
    // Only sync local state to avoid emitting events back to parent
    currentChat.value = newChat
    replaceChatFromProps(newChat)
  }
}, { immediate: true })

// Check Jira status on mount
onMounted(async () => {
  scrollToBottom()
  await checkJiraStatus()
})
</script>

<template>
  <div class="chat-layout">
    <header class="chat-header">
      <div class="user-info">
        <h2>{{ chat.customer.full_name || chat.customer.email }}</h2>
        <div v-if="handledByAI" class="chat-closed-status">
          <i class="fas fa-lock"></i>
          Handled by AI
        </div>
        <div v-if="showTakenOverStatus" class="taken-over-status">
          <i class="fas fa-user-clock"></i>
          Taken over by {{ chat.user_name || 'another agent' }}
        </div>
        <div v-if="isChatClosed" class="chat-closed-status">
          <i class="fas fa-lock"></i>
          Chat closed
        </div>
      </div>
      <div class="header-actions">
        <button 
          v-if="showTakeoverButton"
          class="takeover-btn"
          :disabled="isLoading"
          @click="onTakeover"
        >
          <i class="fas fa-hand-paper"></i>
          {{ isLoading ? 'Taking over...' : 'Take over chat' }}
        </button>
        <!-- Add Create Ticket button -->
        <button 
          v-if="canCreateTicket && jiraConnected" 
          class="create-ticket-btn"
          @click="handleCreateTicket"
        >
          <i class="fas fa-ticket-alt"></i>
          Create Ticket
        </button>
        <!-- End Chat button -->
        <button 
          v-if="canEndChat" 
          class="end-chat-btn"
          @click="handleEndChatRequest"
        >
          <i class="fas fa-door-open"></i>
          End Chat
        </button>
      </div>
    </header>

    <main class="chat-content">
      <div class="messages" ref="messagesContainer">
        <div 
          v-for="(message, idx) in formattedMessages" 
          :key="idx"
          class="message"
          :class="message.message_type === 'bot' || message.message_type === 'agent' ? 'bot' : 'user'"
        >
          <div class="message-content">
            <div class="message-bubble">
              <!-- Product message -->
              <template v-if="message.message_type === 'product' && message.attributes?.shopify_output?.products?.length">
                <div class="products-carousel">
                  <div v-html="marked(message.message || '')" class="product-message-text"></div>
                  <div class="carousel-items">
                    <div 
                      v-for="product in message.attributes.shopify_output.products" 
                      :key="product.id" 
                      class="product-card-compact"
                    >
                      <div class="product-image-compact" v-if="product.image?.src">
                        <img :src="product.image.src" :alt="product.title || ''" class="product-thumbnail">
                      </div>
                      <div class="product-info-compact">
                        <div class="product-text-area">
                          <div class="product-title-compact">{{ product.title }}</div>
                          <div class="product-variant-compact" v-if="product.variant_title">{{ product.variant_title }}</div>
                          <div class="product-price-compact">{{ product.price }}</div>
                        </div>
                        <div class="product-actions-compact">
                          <button 
                            class="view-details-button-compact"
                            @click="$emit('view-product', String(product?.id || 'unknown'))"
                          >
                            View product <span class="external-link-icon">↗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- Regular message with markdown -->
              <template v-else>
                <div v-html="marked(message.message || '')"></div>
              </template>
              <span class="message-time">{{ message.timeAgo }}</span>
            </div>
            <span v-if="message.message_type === 'bot' || message.message_type === 'agent'" class="agent-name">
              {{ message.message_type === 'bot' ? message.agent_name : message.user_name }}
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- End Chat Confirmation Modal -->
    <div v-if="showEndChatConfirm" class="end-chat-modal">
      <div class="end-chat-modal-content">
        <h3>End Chat</h3>
        <p>Are you sure you want to end this chat and request customer feedback?</p>
        <div class="end-chat-modal-actions">
          <button class="cancel-btn" @click="cancelEndChat">Cancel</button>
          <button class="confirm-btn" @click="confirmEndChat">End Chat & Request Rating</button>
        </div>
      </div>
    </div>

    <!-- Jira Ticket Modal -->
    <JiraTicketModal
      v-if="showJiraTicketModal"
      :chat-id="currentChat.session_id"
      :initial-summary="ticketSummary"
      @close="showJiraTicketModal = false"
      @ticket-created="handleTicketCreated"
    />

    <footer class="chat-input" v-if="!isChatClosed && !handledByAI">
      <div class="input-container" :class="{ disabled: !canSendMessage }">
        <input 
          v-model="newMessage"
          type="text" 
          placeholder="Type a message" 
          class="message-input"
          @keyup.enter="sendMessage"
          :disabled="!canSendMessage"
        >
        <button 
          class="send-button" 
          @click="sendMessage"
          :disabled="!newMessage.trim() || !canSendMessage"
        >
          <img :src="sendIcon" alt="Send" />
        </button>
      </div>
      <div v-if="!canSendMessage" class="input-message">
        {{ showTakeoverButton ? 'Take over the chat to send messages' : 
           handledByAI ? 'This chat is being handled by AI' : 
           isChatClosed  ? 'This chat has been closed' : 
           'Chat is being handled by ' + chat.user_name }}
      </div>
    </footer>

    <footer v-else-if="handledByAI" class="chat-closed-footer">
      <div class="chat-closed-message">
        <i class="fas fa-lock"></i>
        This chat is being handled by AI
      </div>
    </footer>
    <footer v-else class="chat-closed-footer">
      <div class="chat-closed-message">
        <i class="fas fa-lock"></i>
        This chat has been closed
      </div>
    </footer>
  </div>
</template>

<style scoped>
.chat-layout {
  display: flex;
  flex-direction: column;
  height: 70vh;
  width: 100%;
  background: var(--background-color);
  position: relative;
  overflow: hidden;
}

.chat-header {
  flex: 0 0 auto;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--background-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chat-content {
  flex: 1 1 auto;
  min-height: 0;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.messages {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-behavior: smooth;
}

.chat-input {
  flex: 0 0 auto;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background: var(--background-color);
  width: 100%;
}

.user-info h2 {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.status {
  font-size: 12px;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
}

.action-btn:hover {
  background: var(--background-mute);
}

.message {
  max-width: 70%;
  display: flex;
  margin-bottom: 12px;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
}

.message.user {
  margin-left: auto;
  justify-content: flex-end;
}

.message.bot {
  margin-right: auto;
  justify-content: flex-start;
}

.message-bubble {
  background: var(--background-soft);
  padding: 12px 16px;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  color: var(--text-primary);
  position: relative;
  max-width: 100%;
  word-wrap: break-word;
}

.message.user .message-bubble {
  background: var(--primary-color);
  color: var(--background-color);
  border-radius: 16px;
  border-bottom-right-radius: 4px;
}

.agent-name {
  font-size: 12px;
  color: var(--text-muted);
  padding-left: 4px;
  margin-top: 2px;
}

.message-time {
  font-size: 11px;
  color: var(--text-color-light);
  margin-top: 4px;
  display: block;
  text-align: right;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.message.bot .message-time {
  color: var(--text-muted);
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--background-soft);
  padding: 8px 16px;
  border-radius: 24px;
  border: 1px solid var(--border-color);
}

.input-container.disabled {
  opacity: 0.7;
  background: var(--background-mute);
}

.message-input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  padding: 8px 0;
  outline: none;
}

.message-input::placeholder {
  color: var(--text-placeholder);
}

.emoji-btn,
.attach-btn,
.send-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
}

.send-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}

.send-button:hover {
  opacity: 1;
}

.send-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.send-button img {
  width: 24px;
  height: 24px;
}

.takeover-btn {
  background: var(--primary-color);
  color: var(--background-color);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.takeover-btn:hover {
  background: var(--accent-color);
}

.takeover-btn:disabled {
  background: var(--background-mute);
  cursor: not-allowed;
}

.takeover-btn i {
  font-size: 16px;
}

.taken-over-status {
  font-size: 12px;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.taken-over-status i {
  font-size: 14px;
}

.input-message {
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 8px;
}

.message-input:disabled {
  cursor: not-allowed;
}

.chat-closed-status {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.chat-closed-status i {
  font-size: 14px;
}

.chat-closed-footer {
  flex: 0 0 auto;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background: var(--background-color);
  width: 100%;
}

.chat-closed-message {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.chat-closed-message i {
  font-size: 16px;
}

.end-chat-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  margin-right: 16px;
}

.end-chat-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.end-chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.end-chat-modal-content {
  background: var(--background-color);
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.end-chat-modal-content h3 {
  margin-top: 0;
  color: var(--text-primary);
  font-size: 18px;
}

.end-chat-modal-content p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.end-chat-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  background: var(--background-mute);
  color: var(--text-primary);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.cancel-btn:hover {
  background: var(--background-soft);
}

.create-ticket-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  margin-right: 16px;
}

.create-ticket-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

/* Add product carousel styles */
.products-carousel {
  margin: var(--space-xs) 0;
  width: 100%;
  padding: var(--space-xs);
  background: rgba(0, 0, 0, 0.02);
  border-radius: 20px;
}

.product-message-text {
  margin-bottom: var(--space-sm);
}

.carousel-items {
  display: flex;
  flex-direction: row;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
  overflow-x: auto;
  padding: var(--space-xs);
  padding-bottom: var(--space-md);
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
}

.product-card-compact {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06),
              0 1px 2px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  width: 180px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.product-card-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08),
              0 2px 4px rgba(0, 0, 0, 0.06);
}

.product-image-compact {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.product-thumbnail:hover {
  transform: scale(1.05);
}

.product-info-compact {
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.product-title-compact {
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.8em;
  color: black;
}

.product-variant-compact {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.product-price-compact {
  font-size: var(--text-sm);
  font-weight: 600;
  color: black;
}

.view-details-button-compact {
  width: 100%;
  padding: 8px 12px;
  background-color: white;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  font-size: var(--text-xs);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  gap: 4px;
}

.view-details-button-compact:hover {
  background-color: var(--background-soft);
  border-color: var(--border-color-hover);
}

.external-link-icon {
  font-size: 1em;
  line-height: 1;
}

/* Add styles for markdown content */
.message-bubble :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
}

.message-bubble :deep(p) {
  margin: 0;
}

.message-bubble :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.message-bubble :deep(a:hover) {
  text-decoration: underline;
}
</style> 