import { Router } from 'itty-router'

const router = Router()

router.options('/api/*', handleOptions)
router.get('/api/health', handleHealth)
router.post('/api/login', handleLogin)
router.post('/api/detect', handleDetect)
router.post('/api/upload', handleUpload)
router.get('/api/prices', handlePrices)
router.post('/api/alerts/nearby', handleAlertsNearby)
router.all('/api/*', () => createErrorResponse('Not Found', 'ERR_NOT_FOUND', 404))
router.all('*', handleFrontend)

export default {
  async fetch(request, env, ctx) {
    const start = Date.now()
    const correlationId = request.headers.get('cf-ray') ?? crypto.randomUUID()
    const allowedOrigin = resolveAllowedOrigin(request, env)
    const path = new URL(request.url).pathname
    request.isApiRequest = path.startsWith('/api')

    if (allowedOrigin === null && request.headers.get('origin')) {
      return createErrorResponse('Origin not allowed', 'ERR_ORIGIN_DENIED', 403, { correlationId })
    }

    request.correlationId = correlationId
    request.allowedOrigin = allowedOrigin
    request.userId = extractUserId(request)

    try {
      await enforceRateLimit(request, env)
      const response = await router.handle(request, env, ctx)
      if (request.skipCors || !request.isApiRequest) {
        return response
      }
      return withCors(response, request.allowedOrigin)
    } catch (error) {
      if (error instanceof BadRequestError) {
        return createErrorResponse(error.message, error.code, 400, {
          correlationId,
          field: error.field || null
        })
      }

      ctx.waitUntil(reportError(error, env, correlationId))
      return createErrorResponse('Internal server error', 'ERR_INTERNAL', 500, { correlationId })
    } finally {
      logRequest(request, Date.now() - start, env.MODEL_VERSION)
    }
  }
}

function resolveAllowedOrigin(request, env) {
  const origin = request.headers.get('origin')
  const allowlist = (env.WORKER_ALLOWLIST_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (!origin) {
    return allowlist.length ? allowlist[0] : '*'
  }

  if (allowlist.length === 0 || allowlist.includes(origin)) {
    return origin
  }

  return null
}

function buildCorsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With, X-Correlation-Id, sb-token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin'
  }
}

function withCors(response, origin) {
  if (!response) {
    return createErrorResponse('Not Found', 'ERR_NOT_FOUND', 404)
  }

  const headers = new Headers(response.headers)
  const corsHeaders = buildCorsHeaders(origin || '*')

  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value)
  }

  return new Response(response.body, { ...response, headers })
}

function handleOptions(request) {
  const headers = buildCorsHeaders(request.allowedOrigin || request.headers.get('origin') || '*')
  return new Response(null, { status: 204, headers })
}

function jsonResponse(data, status = 200, extraHeaders = {}, origin) {
  const headers = {
    'Content-Type': 'application/json',
    ...buildCorsHeaders(origin),
    ...extraHeaders
  }

  return new Response(JSON.stringify(data), { status, headers })
}

function createErrorResponse(message, code, status = 400, details) {
  return jsonResponse({ error: message, code, details }, status)
}

async function parseJson(request) {
  try {
    return await request.json()
  } catch {
    throw new BadRequestError('Invalid JSON payload')
  }
}

class BadRequestError extends Error {
  constructor(message, code = 'ERR_BAD_REQUEST') {
    super(message)
    this.name = 'BadRequestError'
    this.code = code
  }
}

async function enforceRateLimit(request, env) {
  if (!env.RATE_LIMIT_KV) {
    return
  }

  const key = `rl:${request.headers.get('cf-connecting-ip') || 'unknown'}`
  const now = Date.now()
  const windowMs = 60 * 1000
  const limit = 60

  const existing = await env.RATE_LIMIT_KV.get(key)
  let bucket = existing ? JSON.parse(existing) : { count: 0, reset: now + windowMs }

  if (bucket.reset < now) {
    bucket = { count: 0, reset: now + windowMs }
  }

  if (bucket.count >= limit) {
    const retryAfter = Math.ceil((bucket.reset - now) / 1000)
    throw new BadRequestError(`Rate limit exceeded. Retry in ${retryAfter}s`, 'ERR_RATE_LIMITED')
  }

  bucket.count += 1
  await env.RATE_LIMIT_KV.put(key, JSON.stringify(bucket), { expirationTtl: Math.ceil((bucket.reset - now) / 1000) })
}

function extractUserId(request) {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/sb_token=([^;]+)/)
  if (match) return match[1]
  return request.headers.get('x-user-id') || 'anonymous'
}

function logRequest(request, durationMs, modelVersion) {
  const cfRay = request.headers.get('cf-ray')
  console.log(
    JSON.stringify({
      level: 'info',
      event: 'request.complete',
      endpoint: new URL(request.url).pathname,
      method: request.method,
      durationMs,
      userId: request.userId,
      correlationId: request.correlationId,
      modelVersion: modelVersion || null,
      cfRay
    })
  )
}

async function reportError(error, env, correlationId) {
  console.error('Unhandled error', correlationId, error)

  if (!env?.SENTRY_DSN) {
    return
  }

  try {
    await fetch(env.SENTRY_DSN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        tags: { correlationId },
        extra: { name: error.name }
      })
    })
  } catch (sentryError) {
    console.error('Failed to notify Sentry', sentryError)
  }
}

async function handleHealth(request, env) {
  const payload = {
    status: 'ok',
    ts: new Date().toISOString(),
    modelVersion: env.MODEL_VERSION ?? null
  }
  return jsonResponse(payload, 200, {}, request.allowedOrigin)
}

async function handleLogin(request) {
  const body = await parseJson(request)
  const token = body?.token

  if (!token) {
    throw new BadRequestError('Missing token', 'ERR_TOKEN_REQUIRED')
  }

  const maxAge = 60 * 60 * 24 * 7 // 7 days
  const isSecure = request.url.startsWith('https://')
  const cookie = [
    `sb_token=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
    isSecure ? 'Secure' : ''
  ]
    .filter(Boolean)
    .join('; ')

  const response = jsonResponse({ ok: true }, 200, {}, request.allowedOrigin)
  response.headers.append('Set-Cookie', cookie)
  return response
}

async function handleDetect(request, env) {
  const body = await parseJson(request)
  const image = body?.image

  if (!image) {
    throw new BadRequestError('Missing image payload', 'ERR_IMAGE_REQUIRED')
  }

  const inferencePayload = {
    ok: true,
    result: {
      disease: 'arecanut_leaf_spot',
      confidence: 0.91,
      severity: 'moderate',
      recommendations: [
        'Inspect neighboring palms for similar lesions within 48 hours.',
        'Apply copper oxychloride @ 3 g/litre as a preventive spray.',
        'Improve drainage and avoid overhead irrigation for a week.'
      ],
      materials: [
        { name: 'Copper Oxychloride 50% WP', supplier: 'Local cooperative', availability: 'in_stock' },
        { name: 'Bio-control pack', supplier: 'Areca FPO', availability: 'preorder' }
      ],
      modelVersion: env.MODEL_VERSION ?? 'unknown'
    },
    metadata: {
      inferenceUrl: env.INFERENCE_URL || 'not-configured',
      received: new Date().toISOString()
    }
  }

  // Placeholder for real inference forwarding
  if (env.INFERENCE_URL && env.INFERENCE_KEY) {
    console.log(
      JSON.stringify({
        event: 'inference.forward',
        inferenceUrl: env.INFERENCE_URL,
        hasKey: Boolean(env.INFERENCE_KEY)
      })
    )
  }

  return jsonResponse(inferencePayload, 200, {}, request.allowedOrigin)
}

async function handleUpload(request, env) {
  const body = await parseJson(request)
  const filename = body?.filename
  const data = body?.data

  if (!filename || !data) {
    throw new BadRequestError('Missing file payload', 'ERR_UPLOAD_PAYLOAD')
  }

  const key = `captures/${Date.now()}-${sanitizeFilename(filename)}`

  if (env.R2_BUCKET) {
    const binary = decodeBase64(data)
    await env.R2_BUCKET.put(key, binary, {
      httpMetadata: { contentType: guessMimeType(filename) }
    })

    return jsonResponse(
      {
        ok: true,
        key,
        url: `https://r2.cloudflarestorage.com/${key}`
      },
      200,
      {},
      request.allowedOrigin
    )
  }

  return jsonResponse(
    {
      ok: true,
      key,
      url: null,
      note: 'Bind an R2 bucket (R2_BUCKET) to enable uploads.'
    },
    200,
    {},
    request.allowedOrigin
  )
}

async function handlePrices(request, env) {
  const url = new URL(request.url)
  const location = url.searchParams.get('location') ?? 'IN-KA'
  const since = url.searchParams.get('since') ?? new Date(Date.now() - 86400000).toISOString()

  const payload = {
    ok: true,
    location,
    since,
    source: env.MARKET_DATA_SOURCE || 'not-configured',
    prices: [
      { commodity: 'Arecanut (Chali)', unit: 'kg', price: 345, currency: 'INR', reportedAt: since },
      { commodity: 'Arecanut (Red)', unit: 'kg', price: 362, currency: 'INR', reportedAt: since }
    ],
    cache: { ttlSeconds: 900 }
  }

  return jsonResponse(
    payload,
    200,
    { 'Cache-Control': 'public, max-age=900, stale-while-revalidate=60' },
    request.allowedOrigin
  )
}

async function handleAlertsNearby(request) {
  const body = await parseJson(request)
  const { lat, lon, radius = 10 } = body || {}

  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new BadRequestError('lat and lon are required numbers', 'ERR_COORDINATES_REQUIRED')
  }

  const payload = {
    ok: true,
    alerts: [
      {
        id: 'alert-001',
        type: 'disease-hotspot',
        title: 'Leaf spot surge detected nearby',
        severity: 'high',
        radiusKm: radius,
        centroid: { lat, lon },
        issuedAt: new Date(Date.now() - 3600000).toISOString(),
        recommendations: [
          'Schedule scouting twice daily.',
          'Inform neighboring growers via FPO WhatsApp groups.'
        ]
      }
    ]
  }

  return jsonResponse(payload, 200, {}, request.allowedOrigin)
}

const FRONTEND_ALLOWED_METHODS = new Set(['GET', 'HEAD'])
const FRONTEND_FALLBACK_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Areca</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 2rem; line-height: 1.6; }
      code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Areca backend</h1>
    <p>The Cloudflare Worker is running, but no frontend origin has been configured for root requests.</p>
    <p>Set the <code>FRONTEND_ORIGIN</code> variable in <code>wrangler.toml</code> (or via <code>wrangler secret put</code>) so the Worker can proxy/static serve your built Next.js app.</p>
    <p>Example: <code>FRONTEND_ORIGIN=https://areca-frontend.pages.dev</code>.</p>
    <p>API endpoints remain available under <code>/api/*</code> (try <a href="/api/health">/api/health</a>).</p>
  </body>
</html>`

async function handleFrontend(request, env) {
  request.skipCors = true

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  if (!FRONTEND_ALLOWED_METHODS.has(request.method)) {
    return new Response('Method Not Allowed', { status: 405 })
  }

  if (!env.FRONTEND_ORIGIN) {
    return new Response(FRONTEND_FALLBACK_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }

  try {
    const targetUrl = buildFrontendTarget(request.url, env.FRONTEND_ORIGIN)
    const headers = cloneHeadersForProxy(request.headers, targetUrl.host)
    return await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      redirect: 'manual'
    })
  } catch (error) {
    console.error('frontend.proxy.failed', error)
    return new Response(FRONTEND_FALLBACK_HTML, {
      status: 502,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
}

function buildFrontendTarget(requestUrl, origin) {
  const source = new URL(requestUrl)
  const target = new URL(origin)
  target.pathname = source.pathname
  target.search = source.search
  return target
}

function cloneHeadersForProxy(sourceHeaders, host) {
  const headers = new Headers()
  for (const [key, value] of sourceHeaders.entries()) {
    if (key.toLowerCase() === 'host') continue
    headers.set(key, value)
  }
  headers.set('host', host)
  return headers
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')
}

function decodeBase64(data) {
  const base64 = data.includes(',') ? data.split(',').pop() : data
  const binary = atob(base64)
  const len = binary.length
  const buffer = new Uint8Array(len)
  for (let i = 0; i < len; i += 1) {
    buffer[i] = binary.charCodeAt(i)
  }
  return buffer
}

function guessMimeType(filename = '') {
  if (filename.endsWith('.png')) return 'image/png'
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg'
  if (filename.endsWith('.webp')) return 'image/webp'
  return 'application/octet-stream'
}

