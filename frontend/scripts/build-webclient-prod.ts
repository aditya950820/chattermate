import { build } from 'esbuild'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load production environment variables
dotenv.config({ path: '.env.prod' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildWebClientProd() {
  try {
    console.log('Building webclient with production configuration...')
    
    // Copy config.prod.js to config.js before building if it exists
    const configProdPath = resolve(dirname(__dirname), 'public/config.prod.js')
    const configPath = resolve(dirname(__dirname), 'public/config.js')
    
    if (fs.existsSync(configProdPath)) {
      fs.copyFileSync(configProdPath, configPath)
      console.log('Production config file copied successfully!')
    } else {
      console.warn('Warning: config.prod.js not found, using existing config.js')
    }

    // Set NODE_ENV to production for the build
    process.env.NODE_ENV = 'production'
    
    // Get API URL from environment or default
    const apiUrl = process.env.VITE_API_URL || 'https://api.chattermate.chat'
    console.log('Using API URL:', apiUrl)
    
    // Read the source file and replace the placeholder
    const sourceFile = resolve(dirname(__dirname), 'src/webclient/chattermate.js')
    const tempFile = resolve(dirname(__dirname), 'src/webclient/chattermate.temp.js')
    
    let sourceContent = fs.readFileSync(sourceFile, 'utf8')
    
    // Replace the getBaseUrl function with a direct return of the API URL
    sourceContent = sourceContent.replace(
      /\/\/ Get base URL - injected at build time or fallback to config[\s\S]*?function getBaseUrl\(\) \{[\s\S]*?\n  \}/,
      `// Get base URL - injected at build time
  function getBaseUrl() {
    return "${apiUrl}";
  }`
    )
    
    // Write temporary file
    fs.writeFileSync(tempFile, sourceContent)
    
    await build({
      entryPoints: [tempFile],
      bundle: true,
      minify: true,
      outfile: resolve(dirname(__dirname), 'public/webclient/chattermate.min.js'),
      format: 'iife',
      target: ['es2015'],
      loader: {
        '.svg': 'text',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    })
    
    // Clean up temporary file
    fs.unlinkSync(tempFile)

    console.log('Production web client built successfully!')
  } catch (error) {
    console.error('Production build failed:', error)
    process.exit(1)
  }
}

buildWebClientProd()
