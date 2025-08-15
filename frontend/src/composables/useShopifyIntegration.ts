import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { checkShopifyConnection, saveAgentShopifyConfig, getAgentShopifyConfig } from '@/services/shopify'

export function useShopifyIntegration(agentId: string) {
  // Shopify integration state
  const shopifyConnected = ref(false)
  const shopifyShopDomain = ref('')
  const shopifyLoading = ref(true)
  const shopifyIntegrationEnabled = ref(false)
  
  /**
   * Check if Shopify is connected to the organization
   */
  const checkShopifyStatus = async (): Promise<void> => {
    try {
      shopifyLoading.value = true
      const data = await checkShopifyConnection()
      shopifyConnected.value = data.connected
      shopifyShopDomain.value = data.shop_domain || ''
    } catch (error) {
      console.error('Error checking Shopify connection:', error)
      shopifyConnected.value = false
    } finally {
      shopifyLoading.value = false
    }
  }
  
  /**
   * Fetch Shopify configuration for the agent
   */
  const fetchAgentShopifyConfig = async (): Promise<void> => {
    if (!shopifyConnected.value) return
    
    try {
      const config = await getAgentShopifyConfig(agentId)
      shopifyIntegrationEnabled.value = config.enabled || false
    } catch (error) {
      console.error('Error fetching agent Shopify config:', error)
      shopifyIntegrationEnabled.value = false
    }
  }
  
  /**
   * Toggle Shopify integration for the agent
   */
  const toggleShopifyIntegration = async (): Promise<void> => {
    try {
      if (!shopifyConnected.value && !shopifyIntegrationEnabled.value) {
        toast.error('Shopify is not connected. Connect Shopify in the integrations settings.')
        return
      }
      
      const newValue = !shopifyIntegrationEnabled.value
      
      await saveAgentShopifyConfig(agentId, {
        enabled: newValue
      })
      
      shopifyIntegrationEnabled.value = newValue
      toast.success(`Shopify integration ${newValue ? 'enabled' : 'disabled'}`)
    } catch (error) {
      console.error('Error toggling Shopify integration:', error)
      toast.error('Failed to update Shopify integration')
    }
  }
  
  /**
   * Save Shopify configuration
   */
  const saveShopifyConfig = async (): Promise<void> => {
    if (!shopifyConnected.value) {
      toast.error('Shopify is not connected')
      return
    }
    
    try {
      await saveAgentShopifyConfig(agentId, {
        enabled: true
      })
      
      shopifyIntegrationEnabled.value = true
      toast.success('Shopify configuration saved')
    } catch (error) {
      console.error('Failed to save Shopify config:', error)
      toast.error('Failed to save Shopify configuration')
    }
  }
  
  return {
    shopifyConnected,
    shopifyShopDomain,
    shopifyLoading,
    shopifyIntegrationEnabled,
    checkShopifyStatus,
    fetchAgentShopifyConfig,
    toggleShopifyIntegration,
    saveShopifyConfig
  }
} 