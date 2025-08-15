import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '@/services/user'
import { authService } from '@/services/auth'

export function useAuth() {
  const router = useRouter()
  const user = ref(userService.getCurrentUser())
  const isLoggingOut = ref(false)
  const error = ref('')

  const logout = async () => {
    try {
      isLoggingOut.value = true
      // Clear FCM token first
      await userService.clearFCMToken()
      // Then proceed with normal logout
      await authService.logout()
      router.push('/login')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to logout'
      console.error('Logout failed:', err)
    } finally {
      isLoggingOut.value = false
    }
  }

  return {
    user,
    logout,
    isLoggingOut,
    error,
  }
}
