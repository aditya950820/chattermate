import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load production environment variables
dotenv.config({ path: '.env.prod' })

// Create swenv.js content for production
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
console.log('Production service worker environment file generated successfully!')

// Copy config.prod.js to config.js if it exists
const configProdPath = './public/config.prod.js'
const configPath = './public/config.js'

if (fs.existsSync(configProdPath)) {
  fs.copyFileSync(configProdPath, configPath)
  console.log('Production config file copied successfully!')
} else {
  console.warn('Warning: config.prod.js not found, using existing config.js')
}
