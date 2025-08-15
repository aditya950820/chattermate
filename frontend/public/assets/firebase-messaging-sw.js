importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')
importScripts('swenv.js')

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload)

  // Extract notification data
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'images/logo.svg',
    data: payload.data,
  }

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)

  event.notification.close()

  if (event.action === 'open') {
    // Open the app when notification is clicked
    const appUrl = '/'
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i]
          if (client.url === appUrl && 'focus' in client) {
            return client.focus()
          }
        }
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(appUrl)
        }
      }),
    )
  }
})
