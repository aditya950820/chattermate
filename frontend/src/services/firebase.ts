import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
import { userService } from './user'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const initializeFirebase = () => {
  // Only initialize if we have the required config
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      initializeApp(firebaseConfig)
      console.log('Firebase initialized successfully')
    } catch (error) {
      console.warn('Firebase initialization failed:', error)
    }
  } else {
    console.log('Firebase not configured, skipping initialization')
  }
}

// Only create messaging if Firebase is properly configured
export const messaging = firebaseConfig.apiKey && firebaseConfig.projectId
  ? getMessaging(initializeApp(firebaseConfig))
  : null

export const requestNotificationPermission = async () => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log("Browser doesn't support notifications")
      return
    }

    // Check if Firebase is configured
    if (!messaging) {
      console.log('Firebase not configured, skipping notification setup')
      return
    }

    // Check if permission not already denied
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        const { getToken } = await import('firebase/messaging')
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        })
        // Update FCM token in backend
        await userService.updateFCMToken(token)
      }
    }
  } catch (err) {
    console.warn('Failed to get notification permission:', err)
  }
}
