<template>
  <div class="shopify-success-page">
    <div class="success-container">
      <div class="success-icon">✓</div>
      <h1>Shopify Connection Successful</h1>
      <p>Your Shopify store <strong>{{ shopName }}</strong> has been successfully connected to ChatterMate.</p>
      <p>You can now manage your AI agents and chat configurations from the ChatterMate dashboard.</p>
      <button class="primary-button" @click="openDashboard">Open ChatterMate Dashboard</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Get shop name from URL query parameters
const shopName = computed(() => {
  const shop = route.query.shop as string
  return shop ? shop.replace('.myshopify.com', '') : 'your store'
})

// Function to open the dashboard in a new tab
const openDashboard = () => {
  const dashboardUrl = `${window.location.origin}/ai-agents`
  window.open(dashboardUrl, '_blank')
}

// For analytics or tracking
onMounted(() => {
  console.log('Shopify connection success page loaded for shop:', shopName.value)
})
</script>

<style scoped>
.shopify-success-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #1F2937;
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background-color: #F9FAFB;
}

.success-container {
  max-width: 600px;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #111827;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.success-icon {
  color: #10B981;
  font-size: 48px;
  margin-bottom: 20px;
}

p {
  margin-bottom: 24px;
  color: #4B5563;
}

.primary-button {
  background-color: #F24611;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #D93B0A;
}
</style> 