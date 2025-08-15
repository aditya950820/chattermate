import api from './api'

/**
 * Check if Shopify is connected for the current organization
 */
export const checkShopifyConnection = async () => {
  try {
    // Gets the first connected shop to determine if Shopify is connected
    const response = await api.get('/shopify/shops?limit=1')
    const shops = response.data
    const isConnected = shops && shops.length > 0 && shops[0].is_installed
    
    // Return connection status and shop domain if available
    return { 
      connected: isConnected, 
      shop_domain: isConnected ? shops[0].shop_domain : '',
    }
  } catch (error) {
    console.error('Error checking Shopify connection:', error)
    return { connected: false }
  }
}

/**
 * Get the Shopify authorization URL
 * User needs to provide their shop domain
 */
export const connectToShopify = (shopDomain: string) => {
  if (!shopDomain.includes('.myshopify.com')) {
    shopDomain = `${shopDomain}.myshopify.com`
  }
  
  // The router will handle the redirection to the backend
  window.location.href = `/shopify/auth?shop=${encodeURIComponent(shopDomain)}`
}

/**
 * Disconnect Shopify integration
 * This will remove all Shopify shops associated with the current organization
 */
export const disconnectShopify = async (shopId: string) => {
  try {
    // Assuming you'll create this endpoint
    const response = await api.delete(`/shopify/shops/${shopId}`)
    return response.data
  } catch (error) {
    console.error('Error disconnecting Shopify:', error)
    throw error
  }
}

/**
 * Get all connected Shopify shops
 */
export const getShopifyShops = async () => {
  try {
    const response = await api.get('/shopify/shops')
    return response.data
  } catch (error) {
    console.error('Error getting Shopify shops:', error)
    throw error
  }
}

/**
 * Save agent-to-Shopify configuration
 */
export const saveAgentShopifyConfig = async (agentId: string, config: {
  enabled: boolean;
}) => {
  try {
    const response = await api.post(`/shopify/agent-config/${agentId}`, config)
    return response.data
  } catch (error) {
    console.error('Error saving agent Shopify config:', error)
    throw error
  }
}

/**
 * Get agent-to-Shopify configuration
 */
export const getAgentShopifyConfig = async (agentId: string) => {
  try {
    const response = await api.get(`/shopify/agent-config/${agentId}`)
    return response.data
  } catch (error) {
    console.error('Error getting agent Shopify config:', error)
    return { enabled: false }
  }
} 