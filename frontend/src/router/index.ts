import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { userService } from '@/services/user'
import { getSetupStatus } from '@/services/organization'
import { permissionChecks, hasAnyPermission } from '@/utils/permissions'
import HumanAgentView from '@/views/HumanAgentView.vue'
import OrganizationSettings from '@/views/settings/OrganizationSettings.vue'
import AIConfigSettings from '@/views/settings/AIConfigSettings.vue'
import IntegrationsSettings from '@/views/settings/IntegrationsSettings.vue'
import UserSettingsView from '@/views/UserSettingsView.vue'
import { useEnterpriseFeatures } from '@/composables/useEnterpriseFeatures'

// Initialize enterprise features
const { hasEnterpriseModule, loadModule, moduleImports, NotAvailableComponent } = useEnterpriseFeatures()

// Base routes
const baseRoutes = [
  {
    path: '/',
    redirect: '/ai-agents',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/SetupView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/shopify/success',
    name: 'shopify-success',
    component: () => import('@/views/ShopifySuccessView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/shopify/auth',
    name: 'shopify-auth',
    component: () => import('@/views/AIAgentView.vue'), // Dummy component, will redirect before rendering
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      // Get the shop parameter from the URL
      const shop = to.query.shop as string
      const embedded = to.query.embedded as string
      
      if (!shop) {
        next('/ai-agents')
        return
      }
      
      // If embedded=1, redirect to success page instead of backend
      if (embedded === '1') {
        console.log('Embedded Shopify app detected, redirecting to success page')
        return next({ 
          name: 'shopify-success',
          query: { shop: shop } 
        })
      }
      
      const queryParams = Object.entries(to.query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&')
      
      // Redirect to backend auth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL}/shopify/auth?${queryParams}`
    },
    meta: { requiresAuth: true },
  },
  {
    path: '/shopify/auth/callback',
    name: 'shopify-callback',
    component: () => import('@/views/AIAgentView.vue'), // Dummy component, will redirect before rendering
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      // Extract all query parameters
      const queryParams = Object.entries(to.query)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join('&')
      
     
      // Redirect to backend callback endpoint with all query parameters
      window.location.href = `${import.meta.env.VITE_API_URL}/shopify/auth/callback?${queryParams}`
    },
    meta: { requiresAuth: false }, // Shopify callback doesn't require authentication
  },
  {
    path: '/ai-agents',
    name: 'ai-agents',
    component: () => import('@/views/AIAgentView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('@/views/AnalyticsView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'dashboard',
      title: 'Analytics Dashboard',
      permissions: ['view_analytics']
    }
  },
  {
    path: '/widget/:id',
    name: 'widget',
    component: () => import('@/webclient/WidgetBuilder.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/conversations',
    name: 'conversations',
    component: () => import('../views/ConversationsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/human-agents',
    name: 'human-agents',
    component: HumanAgentView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/organization',
    name: 'organization-settings',
    component: OrganizationSettings,
    meta: {
      requiresAuth: true,
      layout: 'dashboard',
      permissions: ['manage_organization', 'view_organization']
    }
  },
  {
    path: '/settings/ai-config',
    name: 'ai-config-settings',
    component: AIConfigSettings,
    meta: {
      requiresAuth: true,
      layout: 'dashboard',
      permissions: ['manage_ai_config', 'view_ai_config']
    }
  },
  {
    path: '/settings/integrations',
    name: 'integrations-settings',
    component: IntegrationsSettings,
    meta: {
      requiresAuth: true,
      layout: 'dashboard',
      permissions: ['manage_organization']
    }
  },
  {
    path: '/settings/user',
    name: 'user-settings',
    component: UserSettingsView,
    meta: {
      requiresAuth: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/ai-agents',
  },
]

// Helper function to load enterprise component
const loadEnterpriseComponent = (path: string) => {
  if (!hasEnterpriseModule) {
    return NotAvailableComponent
  }
  return async () => {
    const module = await loadModule(path)
    return module?.default || NotAvailableComponent
  }
}

// Combine routes based on module availability
const allRoutes = hasEnterpriseModule ? [
  ...baseRoutes,
  {
    path: '/signup',
    name: 'signup',
    component: loadEnterpriseComponent(moduleImports.signupView),
    meta: { requiresAuth: false }
  },
  {
    path: '/explore',
    name: 'explore',
    component: loadEnterpriseComponent(moduleImports.exploreView),
    meta: { requiresAuth: false }
  },
  {
    path: '/settings/subscription',
    name: 'subscription',
    component: loadEnterpriseComponent(moduleImports.subscriptionView),
    meta: { 
      requiresAuth: true,
      layout: 'dashboard',
      title: 'Subscription Plans'
    }
  },
  {
    path: '/settings/subscription/setup/:planId',
    name: 'billing-setup',
    component: loadEnterpriseComponent(moduleImports.billingSetupView),
    meta: { requiresAuth: true }
  }
] : baseRoutes

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes
})

// Add subscription guard only if enterprise module is available
if (hasEnterpriseModule) {
  const loadGuard = async () => {
    try {
      const guardModule = await loadModule(moduleImports.subscriptionGuard)
      if (guardModule?.subscriptionGuard) {
        router.beforeEach(guardModule.subscriptionGuard)
      }
    } catch (error) {
      console.warn('Enterprise subscription guard not available:', error)
    }
  }
  loadGuard()
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // First, handle special routes that need immediate redirection
  const shopifyShop = to.query.shop as string
  const isShopifyRequest = !!shopifyShop && shopifyShop.endsWith('.myshopify.com')
  const embedded = to.query.embedded as string
  
  // If this is a Shopify callback route or success page, don't process further
  if (to.path === '/shopify/auth/callback' || to.path === '/shopify/success') {
    return next()
  }
  
  // Handle Shopify API request with shop parameter
  if (isShopifyRequest) {
    // If embedded=1, redirect to the success page
    if (embedded === '1') {
      console.log('Embedded Shopify app detected in navigation guard, redirecting to success page')
      return next({ 
        name: 'shopify-success',
        query: { shop: shopifyShop } 
      })
    }
    
    const isAuthenticated = userService.isAuthenticated()
    
    if (!isAuthenticated) {
      // Save Shopify parameters in localStorage to restore after login
      localStorage.setItem('shopifyRedirect', JSON.stringify({
        shop: shopifyShop,
        ...to.query
      }))
      // Redirect to login page
      return next('/login')
    } else {
      // User is authenticated, redirect to backend Shopify auth endpoint with embedded param
      const apiUrl = `${import.meta.env.VITE_API_URL}/shopify/auth?shop=${encodeURIComponent(shopifyShop)}&embedded=1`
      window.location.href = apiUrl
      // Return next() to prevent the Vue Router warning, even though we're redirecting
      return next()
    }
  }
  
  // Now check for standard app conditions
  const isAuthenticated = userService.isAuthenticated()
  const isSetupComplete = await getSetupStatus()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredPermissions = to.meta.permissions as string[] | undefined
  
  // Handle login completion for Shopify redirects
  if (to.path === '/ai-agents' && isAuthenticated && localStorage.getItem('shopifyRedirect')) {
    try {
      const shopifyParams = JSON.parse(localStorage.getItem('shopifyRedirect') || '{}')
      if (shopifyParams.shop) {
        // Clear stored redirect
        localStorage.removeItem('shopifyRedirect')
        // Redirect to backend Shopify auth endpoint with embedded param
        const apiUrl = `${import.meta.env.VITE_API_URL}/shopify/auth?shop=${encodeURIComponent(shopifyParams.shop)}&embedded=1`
        window.location.href = apiUrl
        return next()
      }
    } catch (e) {
      console.error('Error parsing Shopify redirect params:', e)
      localStorage.removeItem('shopifyRedirect')
    }
  }

  // Standard app navigation logic
  if (!isSetupComplete && to.path !== '/setup') {
    return next('/setup')
  } else if (!isAuthenticated && requiresAuth) {
    return next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    return next('/ai-agents')
  } else if (to.path === '/setup' && isSetupComplete) {
    return next('/ai-agents')
  } else if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    // Redirect to 403 page or dashboard if user lacks required permissions
    return next('/403')
  } else {
    return next()
  }
})

export default router
