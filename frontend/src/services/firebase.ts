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
  initializeApp(firebaseConfig)
}

export const messaging = getMessaging(initializeApp(firebaseConfig))

export const requestNotificationPermission = async () => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.error("Browser doesn't support notifications")
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
    console.error('Failed to get notification permission:', err)
  }
}
