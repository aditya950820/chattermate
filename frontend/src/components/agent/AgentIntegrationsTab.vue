<!--
ChatterMate - Agent Integrations Tab
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
import { computed, ref, watch, onMounted } from 'vue'
import { checkShopifyConnection } from '@/services/shopify'

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
}


const props = defineProps({
  // Jira props
  jiraConnected: {
    type: Boolean,
    required: true
  },
  jiraLoading: {
    type: Boolean,
    required: true
  },
  createTicketEnabled: {
    type: Boolean,
    required: true
  },
  jiraProjects: {
    type: Array as () => JiraProject[],
    required: true
  },
  jiraIssueTypes: {
    type: Array as () => JiraIssueType[],
    required: true
  },
  selectedProject: {
    type: String,
    required: true
  },
  selectedIssueType: {
    type: String,
    required: true
  },
  loadingProjects: {
    type: Boolean,
    required: true
  },
  loadingIssueTypes: {
    type: Boolean,
    required: true
  },
  // Shopify props
  shopifyIntegrationEnabled: {
    type: Boolean,
    default: false
  },
  shopifyLoading: {
    type: Boolean,
    default: false
  },
  shopifyError: {
    type: String,
    default: ''
  }
})

// Local state for Shopify connection
const shopifyConnected = ref(false)
const shopifyShopDomain = ref('')
const shopifyLoading = ref(true)
const localShopifyEnabled = ref(props.shopifyIntegrationEnabled)
const shopifyToggleInProgress = ref(false)
const shopifyError = ref('')

const emit = defineEmits([
  'toggle-create-ticket',
  'handle-project-change',
  'handle-issue-type-change',
  'save-jira-config',
  'toggle-shopify-integration',
  'save-shopify-config'
])

// Create local copies of the props
const localSelectedProject = ref(props.selectedProject)
const localSelectedIssueType = ref(props.selectedIssueType)

// Watch for changes in the props to update the local copies
watch(() => props.selectedProject, (newValue) => {
  localSelectedProject.value = newValue
})

watch(() => props.selectedIssueType, (newValue) => {
  localSelectedIssueType.value = newValue
})

// Update localShopifyEnabled when prop changes
watch(() => props.shopifyIntegrationEnabled, (newValue) => {
  localShopifyEnabled.value = newValue
  // Reset error when parent updates the enabled state successfully
  shopifyError.value = ''
})

// Update error state when parent passes error
watch(() => props.shopifyError, (newValue) => {
  if (newValue) {
    shopifyError.value = newValue
    // Revert the toggle if there's an error
    localShopifyEnabled.value = props.shopifyIntegrationEnabled
  }
})

const ticketReasons = [
  "Issues without immediate resolution",
  "No transfer agent available",
  "Transfer requests not attended",
  "Customer follow-ups",
  "Complex issues requiring tracking"
]

const ticketTooltipContent = computed(() => {
  return `Create tickets when:\n${ticketReasons.map(reason => `• ${reason}`).join('\n')}`
})

const shopifyReasons = [
  "Display product information",
  "Answer product-specific questions",
  "Handle product recommendations",
  "Check stock availability",
  "Process product inquiries"
]

const shopifyTooltipContent = computed(() => {
  return `Enable Shopify features for:\n${shopifyReasons.map(reason => `• ${reason}`).join('\n')}`
})

const toggleCreateTicket = () => {
  emit('toggle-create-ticket')
}

const toggleShopifyIntegration = () => {
  // Store the previous value in case we need to revert
  
  // Show loading state
  shopifyToggleInProgress.value = true
  
  // Update the local state optimistically
  localShopifyEnabled.value = !localShopifyEnabled.value
  
  // Emit the event for parent to handle
  emit('toggle-shopify-integration')
  
  // The parent component should call an API method and handle errors
  // If an error occurs, the watch on props.shopifyError will revert the state
  
  // For demo purposes, let's set a timeout to simulate API call
  // This should be removed in production as the parent component should control this
  setTimeout(() => {
    // Auto-reset progress after 3 seconds if parent doesn't control it
    if (shopifyToggleInProgress.value) {
      shopifyToggleInProgress.value = false
    }
  }, 3000)
}

const handleProjectChange = () => {
  emit('handle-project-change', localSelectedProject.value)
}

const handleIssueTypeChange = () => {
  emit('handle-issue-type-change', localSelectedIssueType.value)
}

const saveJiraConfig = () => {
  emit('save-jira-config', {
    projectKey: localSelectedProject.value,
    issueTypeId: localSelectedIssueType.value
  })
}


// Fetch Shopify connection status
const fetchShopifyStatus = async () => {
  try {
    shopifyLoading.value = true
    const data = await checkShopifyConnection()
    shopifyConnected.value = data.connected
    shopifyShopDomain.value = data.shop_domain || ''
    console.log('Shopify connection status:', data)
  } catch (error) {
    console.error('Error checking Shopify connection:', error)
    shopifyConnected.value = false
  } finally {
    shopifyLoading.value = false
  }
}

// Fetch connection status on component mount
onMounted(async () => {
  await fetchShopifyStatus()
})
</script>

<template>
  <div class="integrations-tab">
    <section class="detail-section">
      <h3 class="section-title">Integrations</h3>
      <p class="section-description">
        Connect your agent with third-party tools to enhance its capabilities and streamline workflows.
      </p>
      
      <!-- Jira Integration -->
      <div class="integration-section">
        <h4 class="integration-title">Jira Integration</h4>
        <!-- Jira Ticket Creation Toggle -->
        <div class="ticket-toggle">
          <div class="toggle-header">
            <h5 class="toggle-title">Create Jira Tickets</h5>
            <label class="switch" v-tooltip="ticketTooltipContent">
              <input type="checkbox" 
                :checked="createTicketEnabled"
                @change="toggleCreateTicket"
              >
              <span class="slider"></span>
            </label>
          </div>
          <p class="helper-text">Create Jira tickets for issues that need further attention</p>
          
          <!-- Jira Connection Status -->
          <div v-if="jiraLoading" class="jira-status loading">
            Checking Jira connection...
          </div>
          <div v-else-if="!jiraConnected" class="jira-status not-connected">
            <span class="status-icon">⚠️</span>
            Jira is not connected
            <router-link to="/settings/integrations" class="connect-link">
              Connect Jira
            </router-link>
          </div>
          <div v-else class="jira-status connected">
            <span class="status-icon">✓</span>
            Jira is connected
          </div>
          
          <!-- Jira Project Selection -->
          <div v-if="createTicketEnabled && jiraConnected" class="jira-config">
            <div class="form-group">
              <label for="jira-project">Jira Project</label>
              <div v-if="loadingProjects" class="loading-indicator">Loading projects...</div>
              <select 
                v-else
                id="jira-project" 
                v-model="localSelectedProject"
                @change="handleProjectChange"
                :disabled="loadingProjects"
              >
                <option value="">Select a project</option>
                <option 
                  v-for="project in jiraProjects" 
                  :key="project.id" 
                  :value="project.key"
                >
                  {{ project.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="issue-type">Issue Type</label>
              <div v-if="loadingIssueTypes" class="loading-indicator">Loading issue types...</div>
              <select 
                v-else
                id="issue-type" 
                v-model="localSelectedIssueType"
                @change="handleIssueTypeChange"
                :disabled="!localSelectedProject || loadingIssueTypes"
              >
                <option value="">Select an issue type</option>
                <option 
                  v-for="issueType in jiraIssueTypes" 
                  :key="issueType.id" 
                  :value="issueType.id"
                >
                  {{ issueType.name }}
                </option>
              </select>
            </div>
            
            <button 
              class="save-config-btn"
              @click="saveJiraConfig"
              :disabled="!localSelectedProject || !localSelectedIssueType"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
      
      <!-- Shopify Integration -->
      <div class="integration-section">
        <h4 class="integration-title">Shopify Integration</h4>
        <div class="ticket-toggle">
          <div class="toggle-header">
            <h5 class="toggle-title">Enable Shopify Features</h5>
            <div class="toggle-with-loader">
              <div class="toggle-loader" v-if="shopifyToggleInProgress">
                <span class="loader-dot"></span>
                <span class="loader-dot"></span>
                <span class="loader-dot"></span>
              </div>
              <label class="switch" v-tooltip="shopifyTooltipContent">
                <input type="checkbox" 
                  v-model="localShopifyEnabled"
                  @change="toggleShopifyIntegration"
                  :disabled="shopifyLoading || props.shopifyLoading || shopifyToggleInProgress"
                >
                <span class="slider" :class="{ 'in-progress': shopifyToggleInProgress }"></span>
              </label>
            </div>
          </div>
          <p class="helper-text">Enable Shopify product information and features for this agent</p>
          
          <!-- Shopify Connection Status -->
          <div v-if="shopifyLoading" class="jira-status loading">
            Checking Shopify connection...
          </div>
          <div v-else-if="!shopifyConnected" class="jira-status not-connected">
            <span class="status-icon">⚠️</span>
            Shopify is not connected
            <router-link to="/settings/integrations" class="connect-link">
              Connect Shopify
            </router-link>
          </div>
          <div v-else class="jira-status connected">
            <span class="status-icon">✓</span>
            Connected to {{ shopifyShopDomain }}
          </div>
        </div>
        <!-- Add error message display -->
        <div v-if="shopifyError" class="shopify-error">
          <span class="error-icon">❌</span>
          {{ shopifyError }}
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.integrations-tab {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 var(--space-lg);
}

.detail-section {
  margin-bottom: var(--space-xl);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--space-xs);
}

.section-description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-lg);
  line-height: 1.5;
}

.integration-section {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  background-color: var(--background-soft);
  margin-bottom: var(--space-xl);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.integration-title {
  margin-bottom: var(--space-md);
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.toggle-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
}

.ticket-toggle {
  margin-top: var(--space-md);
}

.toggle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.helper-text {
  color: var(--text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-md);
  line-height: 1.5;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(224, 224, 224);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: rgb(255, 255, 255);
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input:checked + .slider {
  background-color: #4caf50;
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.jira-status {
  margin-top: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.jira-status.loading {
  background-color: var(--background-mute);
  color: var(--text-muted);
}

.jira-status.connected {
  background-color: var(--success-light);
  color: var(--success);
}

.jira-status.not-connected {
  background-color: var(--warning-light);
  color: var(--warning);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.connect-link {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--primary-soft);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.connect-link:hover {
  background-color: var(--primary-color);
  color: white;
}

.jira-config {
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background-color: var(--background-alt);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  border: 1px solid var(--border-color);
}

.shopify-info {
  background-color: var(--background-soft);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.shopify-info p {
  margin-bottom: var(--space-xs);
  font-size: var(--text-sm);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
}

.form-group select {
  padding: var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: var(--text-sm);
}

.form-group select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-indicator {
  font-size: var(--text-sm);
  color: var(--text-muted);
  padding: var(--space-sm);
}

.save-config-btn {
  margin-top: var(--space-lg);
  padding: var(--space-sm) var(--space-lg);
  background: #bb8873;
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  align-self: flex-start;
}

.save-config-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.save-config-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.shopify-error {
  margin-top: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  background-color: var(--error-light, #FEEAEA);
  color: var(--error, #EF4444);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.error-icon {
  margin-right: var(--space-xs);
}

.toggle-with-loader {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-loader {
  position: absolute;
  right: 55px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.loader-dot {
  width: 6px;
  height: 6px;
  background-color: var(--primary-color);
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-in-out;
}

.loader-dot:nth-child(2) {
  animation-delay: 0.5s;
}

.loader-dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.75);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

.slider.in-progress {
  opacity: 0.7;
  background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
  background-size: 20px 20px;
  animation: progress-animation 1s linear infinite;
}

@keyframes progress-animation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}
</style> 