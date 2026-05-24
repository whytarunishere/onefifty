import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { MongoClient } from 'mongodb'

let cachedDb = null

async function connectToDatabase(mongodbUri) {
  if (cachedDb) return cachedDb

  const client = await MongoClient.connect(mongodbUri)
  cachedDb = client.db('onefifty_db')
  return cachedDb
}

async function readJsonBody(req) {
  return await new Promise((resolve, reject) => {
    const chunks = []

    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const rawBody = Buffer.concat(chunks).toString('utf8')
        resolve(rawBody ? JSON.parse(rawBody) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        include: '**/*.jsx',
      }),
      tailwindcss(),
      {
        name: 'local-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url || !req.url.startsWith('/api/')) {
              return next()
            }

            if (!env.MONGODB_URI) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'MONGODB_URI is not configured' }))
              return
            }

            try {
              const db = await connectToDatabase(env.MONGODB_URI)

              if (req.url === '/api/get-prints' && req.method === 'GET') {
                const prints = await db.collection('prints').find({}).sort({ created_at: -1 }).toArray()
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(prints))
                return
              }

              if (req.url === '/api/create-print' && req.method === 'POST') {
                const body = await readJsonBody(req)
                const result = await db.collection('prints').insertOne({
                  content: body.headline,
                  author_name: 'Anonymous Contributor',
                  is_verified: false,
                  reprints: 0,
                  viewpoints: 0,
                  created_at: new Date(),
                })

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, printId: result.insertedId }))
                return
              }

              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
            } catch (error) {
              console.error('Local API error:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Internal Server Error' }))
            }
          })
        },
      },
    ],
  }
})
