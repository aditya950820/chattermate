import fs from 'fs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Create swenv.js content
const swEnvContent = `
const firebaseConfig = {
  apiKey: "${process.env.VITE_FIREBASE_API_KEY}",
  authDomain: "${process.env.VITE_FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.VITE_FIREBASE_PROJECT_ID}",
  messagingSenderId: "${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.VITE_FIREBASE_APP_ID}",
  storageBucket: "${process.env.VITE_FIREBASE_STORAGE_BUCKET}",
  measurementId: "${process.env.VITE_FIREBASE_MEASUREMENT_ID}"
};
`

// Write to public/swenv.js
fs.writeFileSync('./public/swenv.js', swEnvContent)
console.log('Service worker environment file generated successfully!')
