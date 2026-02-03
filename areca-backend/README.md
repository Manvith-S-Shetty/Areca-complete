# Areca Cloudflare Worker Backend

Production-ready Cloudflare Worker that powers the `/api/*` surface used by the Areca Next.js frontend already present in this workspace. The Worker focuses on secure defaults, modular stubs that can be swapped for real services, and tight integration guidance so the two projects behave like a single fullstack deployment.

---

## Project Layout

```
areca-backend/
├─ src/index.js                 # Worker entry with routing, CORS, logging, and endpoints
├─ wrangler.toml                # Cloudflare configuration, bindings, and sample routes
├─ package.json                 # Scripts for dev, deploy, curl smoke tests, TestSpirit
├─ scripts/run-acceptance-tests.mjs
├─ tests/testspirit.plan.json   # Contract tests covering every route
└─ README.md                    # This document
```

---

## Prerequisites

- Node.js 18+ (for local tooling/scripts)
- Cloudflare Wrangler CLI (`npm install -g wrangler` or via `npx`)
- curl (used by acceptance tests)
- TestSpirit / TestSprite CLI (`npx testspirit` or `npx testsprite`)

---

## Configuration & Secrets

All runtime configuration flows through `wrangler.toml` bindings:

| Binding | Purpose |
| --- | --- |
| `WORKER_ALLOWLIST_ORIGINS` | Comma-separated list of allowed browser origins (`http://localhost:3000,http://127.0.0.1:3000` for local dev). |
| `FRONTEND_ORIGIN` | Where non-`/api/*` requests should be proxied (e.g. `http://localhost:3000` during dev or your deployed Next.js/Pages URL). |
| `MODEL_VERSION` | Displayed in `/api/health` and inference logs. |
| `INFERENCE_URL`, `INFERENCE_KEY` | Optional upstream model endpoint + key. If set, the Worker logs forwarding attempts for `/api/detect`. |
| `R2_BUCKET` | Optional Cloudflare R2 binding for `/api/upload`. Without it, the endpoint returns a stub response and guidance. |
| `MARKET_DATA_SOURCE` | Free-form string or URL identifying the market data feed feeding `/api/prices`. |
| `SENTRY_DSN` | Optional ingestion endpoint for error notifications. |
| `FRONTEND_ORIGIN` | Base URL that serves the built frontend. When set, any non-`/api/*` request is proxied there (e.g. `https://areca-frontend.pages.dev`). |
| `RATE_LIMIT_KV` | Optional KV namespace for sliding-window rate limiting (see comments in `src/index.js`). |

### Secrets & Bindings

```bash
cd areca-backend
wrangler secret put INFERENCE_KEY
wrangler secret put SENTRY_DSN
# Bind R2: Cloudflare Dashboard → R2 → Create Bucket → wrangler.toml [[r2_buckets]]
# Bind KV: Cloudflare Dashboard → Workers KV → Create Namespace → wrangler kv namespace list
```

> **Production cookies:** `POST /api/login` sets the `sb_token` cookie with `HttpOnly` + `SameSite=Lax`. In production you must serve the Worker behind HTTPS so the automatically inferred `Secure` attribute remains enabled (Worker inspects the request URL). Documented in *Authentication* below.

---

## Local Development Workflow

```bash
cd areca-backend
npm install
wrangler dev --local --persist-to=./.wrangler/state
```

- The Worker listens on `http://127.0.0.1:8787` by default.
- The frontend should send requests with credentials enabled (see Integration section).
- `.wrangler/state` is git-ignored so dev KV/R2 namespaces persist between runs.

### Running With TestSpirit

```bash
# Uses tests/testspirit.plan.json and defaults to http://127.0.0.1:8787
npm run test:testspirit
# …or run manually
npx testspirit run tests/testspirit.plan.json --base http://127.0.0.1:8787
```

TestSpirit scenarios cover **all** routes: health, login, detect, upload, prices, and alerts.

---

## Frontend Integration (Next.js)

1. Create `Frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_BASE=http://127.0.0.1:8787
   ```

2. Update `Frontend/lib/api.ts` (or equivalent fetchers) to prefer the base:
   ```ts
   const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? ''
   export async function apiCall(endpoint: string, options?: RequestInit) {
     const target = `${API_BASE}${endpoint}`
     return fetch(target, {
       ...options,
       credentials: 'include',
       headers: { 'Content-Type': 'application/json', ...options?.headers }
     })
   }
   ```

3. All frontend fetches **must** include `credentials: 'include'` so the `sb_token` cookie set by `/api/login` flows back to the Worker. Example:
   ```ts
   await fetch(`${API_BASE}/api/health`, { credentials: 'include' })
   ```

4. Production routing options:
   - **workers.dev**: set `NEXT_PUBLIC_API_BASE=https://areca-backend.<account>.workers.dev`.
   - **Custom domain**: map `example.com/api/*` to the Worker via `wrangler.toml` `routes` array (uncomment and supply your zone ID). When the Worker sits behind the same domain as the frontend, the frontend may keep relative `/api/*` URLs.

5. Set `FRONTEND_ORIGIN` so the Worker can serve the UI from `/`. During development keep it at `http://localhost:3000` (Wrangler proxies to your locally running Next.js app). For production, point it at the static build host (Cloudflare Pages, Vercel, etc.) so `https://your-domain.com/` flows through the Worker to the built frontend.
6. Update the frontend `.env.production` (or CI secrets) to reference the deployed Worker URL.

### Serving the frontend from `/`

The Worker now proxies every non-API request to `FRONTEND_ORIGIN`. Behavior:

- `GET /` → fetches `${FRONTEND_ORIGIN}/` and streams the HTML back via the Worker.
- Static assets (`/favicon.ico`, `/assets/*`, etc.) proxy through the same path.
- If `FRONTEND_ORIGIN` is not set, the Worker returns an HTML notice explaining how to configure it.
- Only `GET` and `HEAD` are allowed for proxied routes; other methods receive `405 Method Not Allowed`.

**Local workflow:** run `npm run dev` in `areca-backend` and, in another terminal, `npm run dev` inside `Frontend`. With `FRONTEND_ORIGIN=http://localhost:3000`, visiting `http://127.0.0.1:8787/` loads the Next.js UI via the Worker, while `/api/*` continues to hit the Worker APIs.

### Serving the Frontend via the Worker Root

- By default, non-`/api/*` requests return a helpful placeholder page.  
- Set `FRONTEND_ORIGIN` in `wrangler.toml` (or via `wrangler secret put FRONTEND_ORIGIN`) to the URL that serves your built Next.js assets:
  - Local dev: `FRONTEND_ORIGIN=http://127.0.0.1:3000` (the Next dev server). Start `npm run dev` in `Frontend/`, then the Worker will proxy `/` and static assets to that server while still handling `/api/*`.
  - Production: point to your static hosting origin, such as `https://areca-frontend.pages.dev` or an R2/Pages bucket.
- Any request path that doesn’t start with `/api` is forwarded to `FRONTEND_ORIGIN` while API calls keep the same Worker origin, giving you a single entrypoint for both UI and API.

---

## API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness endpoint: `{ "status": "ok", "ts": "<ISO>", "modelVersion": "<env>" }`. |
| `POST` | `/api/login` | Accepts `{ "token": "<jwt>" }`, sets `sb_token` cookie (HttpOnly, SameSite=Lax, Secure when HTTPS) and returns `{ "ok": true }`. README explains toggling cookie flags via HTTPS. |
| `POST` | `/api/detect` | `{ image: "<dataURL or base64>", metadata }` → stubbed inference response with `result.{ disease, confidence, severity, recommendations, materials, modelVersion }`. Logs placeholder call to `INFERENCE_URL`/`INFERENCE_KEY`. |
| `POST` | `/api/upload` | `{ filename, data }` uploads to bound `R2_BUCKET`; otherwise returns stub plus binding guidance. |
| `GET` | `/api/prices?location=<code>&since=<iso>` | Returns cached market price data with `Cache-Control: public, max-age=900`. Includes `source` pointing at `MARKET_DATA_SOURCE` and notes about ETL wiring. |
| `POST` | `/api/alerts/nearby` | `{ lat, lon, radius }` → stubbed alert list for dashboards/maps. |

### Cross-cutting behaviour

- **CORS:** Automatic pre-flight handling (`OPTIONS /api/*`), `Access-Control-Allow-Credentials: true`, and origin enforcement using `WORKER_ALLOWLIST_ORIGINS`.
- **Errors:** Uniform structure `{ "error": "...", "code": "...", "details": { correlationId, … } }`.
- **Logging:** Every request logs JSON containing endpoint, method, duration, `userId`, `correlationId`, and `modelVersion`. Hooks to Sentry/Logflare are stubbed in `reportError`.
- **Rate-limiting guidance:** If you bind `RATE_LIMIT_KV`, the Worker enforces a simple 60 req/min sliding window keyed by IP. Extend/replace with Durable Objects for finer control.
- **Observability:** `wrangler.toml` enables Worker Observability. Forward logs to Logflare (Cloudflare dashboard) by enabling Logpush.

---

## Uploads & Storage

- When `R2_BUCKET` exists, `/api/upload` writes `captures/<timestamp>-<filename>` to the bucket and returns `{ ok, key, url }`.
- When absent, the route still returns `{ ok: true }` and a note instructing you to bind R2.
- Bindings are configured in `wrangler.toml` under `[[r2_buckets]]`. Update `bucket_name`/`preview_bucket_name` to match your Cloudflare account, or remove the block if R2 isn’t available yet.

---

## Market Prices & ETL Notes

`/api/prices` reads `MARKET_DATA_SOURCE` to tell operators where data originates. Replace the stub array with live ETL output by:

1. Building a scheduled scraper that pushes JSON into KV/R2.
2. Update `handlePrices` to fetch from the chosen storage and adjust caching headers (`stale-while-revalidate` already baked in).

---

## Alerts

`/api/alerts/nearby` is the aggregation point for detection alerts and third-party weather/disease warnings. Replace the stub array with spatial queries from Durable Objects or external APIs. The payload structure already matches the frontend’s map/list UI (see `Frontend/app/alerts/page.tsx`).

---

## Authentication & Cookies

- `/api/login` simply trusts the `token` field and stores it as `sb_token`. Wire it to your real auth provider (Supabase, Cognito, etc.) later.
- **Secure flag:** In production (HTTPS), Workers automatically see `request.url` as `https://…` and add the `Secure` cookie attribute. For local development over HTTP, the attribute is omitted to avoid browser rejection. Document this to your team so the flag is always on in prod.
- To invalidate tokens, delete the cookie from the frontend (`document.cookie = 'sb_token=; Max-Age=0; path=/'`) or implement `/api/logout`.

---

## Testing & Acceptance

### 1. Curl-based checks (required)

```bash
BASE=http://127.0.0.1:8787

# /api/health
curl -sS "$BASE/api/health"

# /api/login (inspect Set-Cookie)
curl -i -sS -X POST "$BASE/api/login" \
  -H "Content-Type: application/json" \
  -d '{"token":"demo-token"}'

# /api/detect
curl -sS -X POST "$BASE/api/detect" \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA","metadata":{"lat":13.32,"lon":74.74}}'

# /api/upload
curl -sS -X POST "$BASE/api/upload" \
  -H "Content-Type: application/json" \
  -d '{"filename":"leaf.png","data":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"}'
```

Run all four at once:

```bash
npm run test:curl         # defaults to BASE=http://127.0.0.1:8787
API_BASE_URL=https://areca-backend.example.workers.dev npm run test:curl
```

### 2. TestSpirit Contract Tests

```bash
npm run test:testspirit
# or
npx testspirit run tests/testspirit.plan.json --base https://areca-backend.example.workers.dev
```

### 3. Frontend Smoke Test

- Start the Worker (`npm run dev`).
- Start the Next.js frontend in the sibling `Frontend/` folder.
- Visit `http://localhost:3000/dashboard` and interact with features that hit `/api/*`. Network tab should reveal requests targeting `http://127.0.0.1:8787/api/...` with `credentials: include`.

---

## Deployment

1. Auth with Cloudflare: `wrangler login`
2. Publish: `npm run deploy`
3. Bind secrets/buckets if not already done:
   ```bash
   wrangler secret put INFERENCE_KEY
   wrangler secret put SENTRY_DSN
   wrangler r2 bucket create areca-uploads
   wrangler r2 bucket create areca-uploads-dev
   wrangler d1 create areca-rate-limit   # optional KV/DO per needs
   ```
4. Configure routes:
   ```toml
   routes = [
     { pattern = "example.com/api/*", zone_id = "YOUR_ZONE_ID" }
   ]
   ```
5. Update DNS or Cloudflare Pages project so the frontend and backend share the same apex/subdomain.

---

## Logging & Observability

- **Structured logs:** Already JSON-formatted for Logpush/Logflare ingestion.
- **Sentry:** Set `SENTRY_DSN` to a Sentry Ingest URL (HTTP). Errors bubble through `reportError`.
- **Correlation IDs:** Each request includes (or creates) a `correlationId` so you can trace frontend logs to backend ones.

---

## Extending the Worker

- **Inference:** Replace the placeholder block in `handleDetect` with a real `fetch(env.INFERENCE_URL, { headers: { 'Authorization': `Bearer ${env.INFERENCE_KEY}` }, body })`.
- **Uploads:** Convert the returned `url` to signed, time-limited R2 URLs by integrating Cloudflare Signed URL helpers.
- **Rate limiting:** Swap the KV-based helper with Durable Objects when you need global counters or user-based quotas.
- **Additional APIs:** Add new routes via `router.<method>('/api/...', handler)` inside `src/index.js`. Keep responses within the documented error + logging patterns.

---

## Preparing for ZIP Export

The `areca-backend/` directory is self-contained:

1. `cd ..`
2. `Compress-Archive -Path areca-backend -DestinationPath areca-backend.zip` (PowerShell) or `zip -r areca-backend.zip areca-backend`.

You can now distribute or attach the backend bundle wherever needed.

---

## Troubleshooting

- **403 Origin not allowed:** Ensure your frontend origin appears in `WORKER_ALLOWLIST_ORIGINS`.
- **Missing cookies:** Frontend fetches must use `credentials: 'include'` and use the same domain/protocol as the Worker (or shareable subdomain). Verify via browser DevTools.
- **R2 not writing:** Double-check `wrangler.toml` bucket names and Cloudflare account bindings. Use `wrangler r2 object list areca-uploads`.
- **Rate limit triggered:** Remove/adjust `RATE_LIMIT_KV` binding or raise the `limit` value inside `enforceRateLimit`.

---

Happy shipping! This backend + the existing frontend now form a cohesive, testable Areca fullstack stack. Run TestSpirit, curl acceptance tests, then deploy with `wrangler publish`. Keep the README close for onboarding new contributors.

