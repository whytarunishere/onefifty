import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function parseBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization
  if (!header || typeof header !== 'string') return null

  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  return token
}

function verifyAuthToken(token, jwtSecret) {
  return jwt.verify(token, jwtSecret)
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

            const path = new URL(req.url, 'http://localhost').pathname

            if (!env.MONGODB_URI) {
              sendJson(res, 500, { error: 'MONGODB_URI is not configured' })
              return
            }

            try {
              const db = await connectToDatabase(env.MONGODB_URI)

              if (path === '/api/get-prints' && req.method === 'GET') {
                const prints = await db.collection('prints').find({}).sort({ created_at: -1 }).toArray()
                sendJson(res, 200, prints)
                return
              }

              if (path === '/api/signup' && req.method === 'POST') {
                const body = await readJsonBody(req)
                const name = typeof body.name === 'string' ? body.name.trim() : ''
                const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
                const password = typeof body.password === 'string' ? body.password : ''

                if (!name || !email || !password) {
                  sendJson(res, 400, { error: 'name, email and password are required' })
                  return
                }

                if (password.length < 6) {
                  sendJson(res, 400, { error: 'Password must be at least 6 characters' })
                  return
                }

                const existing = await db.collection('users').findOne({ email })
                if (existing) {
                  sendJson(res, 409, { error: 'Email already registered' })
                  return
                }

                const passwordHash = await bcrypt.hash(password, 10)
                const created = await db.collection('users').insertOne({
                  name,
                  email,
                  password_hash: passwordHash,
                  created_at: new Date(),
                  updated_at: new Date(),
                })

                if (!env.JWT_SECRET) {
                  sendJson(res, 500, { error: 'JWT_SECRET is not configured' })
                  return
                }

                const user = { id: created.insertedId.toString(), name, email }
                const token = jwt.sign(
                  { sub: user.id, email: user.email, name: user.name },
                  env.JWT_SECRET,
                  { expiresIn: '7d' }
                )

                sendJson(res, 201, { user, token })
                return
              }

              if (path === '/api/login' && req.method === 'POST') {
                const body = await readJsonBody(req)
                const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
                const password = typeof body.password === 'string' ? body.password : ''

                if (!email || !password) {
                  sendJson(res, 400, { error: 'email and password are required' })
                  return
                }

                const foundUser = await db.collection('users').findOne({ email })
                if (!foundUser) {
                  sendJson(res, 401, { error: 'Invalid email or password' })
                  return
                }

                const isMatch = await bcrypt.compare(password, foundUser.password_hash || '')
                if (!isMatch) {
                  sendJson(res, 401, { error: 'Invalid email or password' })
                  return
                }

                if (!env.JWT_SECRET) {
                  sendJson(res, 500, { error: 'JWT_SECRET is not configured' })
                  return
                }

                const user = {
                  id: foundUser._id.toString(),
                  name: foundUser.name,
                  email: foundUser.email,
                }

                const token = jwt.sign(
                  { sub: user.id, email: user.email, name: user.name },
                  env.JWT_SECRET,
                  { expiresIn: '7d' }
                )

                sendJson(res, 200, { user, token })
                return
              }

              if (path === '/api/me' && req.method === 'GET') {
                if (!env.JWT_SECRET) {
                  sendJson(res, 500, { error: 'JWT_SECRET is not configured' })
                  return
                }

                const token = parseBearerToken(req)
                if (!token) {
                  sendJson(res, 401, { error: 'Unauthorized' })
                  return
                }

                const payload = verifyAuthToken(token, env.JWT_SECRET)
                const user = await db.collection('users').findOne(
                  { _id: new ObjectId(String(payload.sub)) },
                  { projection: { name: 1, email: 1 } }
                )

                if (!user) {
                  sendJson(res, 401, { error: 'Unauthorized' })
                  return
                }

                sendJson(res, 200, {
                  user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                  },
                })
                return
              }

              if (path === '/api/create-print' && req.method === 'POST') {
                if (!env.JWT_SECRET) {
                  sendJson(res, 500, { error: 'JWT_SECRET is not configured' })
                  return
                }

                const token = parseBearerToken(req)
                if (!token) {
                  sendJson(res, 401, { error: 'Unauthorized' })
                  return
                }

                const payload = verifyAuthToken(token, env.JWT_SECRET)
                const body = await readJsonBody(req)
                const headline = typeof body.headline === 'string' ? body.headline.trim() : ''
                const content = typeof body.content === 'string' ? body.content.trim() : ''

                if (!headline) {
                  sendJson(res, 400, { error: 'headline is required' })
                  return
                }

                if (headline.length > 100) {
                  sendJson(res, 400, { error: 'headline too long' })
                  return
                }

                if (content.length > 2000) {
                  sendJson(res, 400, { error: 'content too long' })
                  return
                }

                const result = await db.collection('prints').insertOne({
                  headline,
                  content,
                  author_name: payload.name || 'Anonymous Contributor',
                  author_id: String(payload.sub),
                  is_verified: false,
                  reprints: 0,
                  viewpoints: 0,
                  created_at: new Date(),
                })

                sendJson(res, 200, { success: true, printId: result.insertedId })
                return
              }

              if (path === '/api/delete-print' && req.method === 'DELETE') {
                if (!env.JWT_SECRET) {
                  sendJson(res, 500, { error: 'JWT_SECRET is not configured' })
                  return
                }

                const token = parseBearerToken(req)
                if (!token) {
                  sendJson(res, 401, { error: 'Unauthorized' })
                  return
                }

                const payload = verifyAuthToken(token, env.JWT_SECRET)
                const body = await readJsonBody(req)
                const id = body && (body.id || body._id)
                if (!id) {
                  sendJson(res, 400, { error: 'id is required' })
                  return
                }

                let objectId
                try {
                  const raw = typeof id === 'object' && id.$oid ? id.$oid : String(id)
                  objectId = new ObjectId(raw)
                } catch (err) {
                  sendJson(res, 400, { error: 'invalid id' })
                  return
                }

                const existing = await db.collection('prints').findOne({ _id: objectId })
                if (!existing) {
                  sendJson(res, 404, { error: 'Print not found' })
                  return
                }

                if (String(existing.author_id) !== String(payload.sub)) {
                  sendJson(res, 403, { error: 'Forbidden' })
                  return
                }

                await db.collection('prints').deleteOne({ _id: objectId })
                sendJson(res, 200, { success: true })
                return
              }

              sendJson(res, 405, { error: 'Method not allowed' })
            } catch (error) {
              console.error('Local API error:', error)
              sendJson(res, 500, {
                error: 'Internal Server Error',
                detail: error instanceof Error ? error.message : 'Unknown server error',
              })
            }
          })
        },
      },
    ],
  }
})
