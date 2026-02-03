# Areca Project - Frontend and Backend Connection Status

## Current Status: ✅ CONNECTED

Both the frontend and backend are successfully running and communicating with each other.

## Services Running

1. **Backend (Cloudflare Worker)**
   - URL: `http://127.0.0.1:8787`
   - API endpoints accessible at `/api/*`
   - Health check: `http://127.0.0.1:8787/api/health`

2. **Frontend (Next.js)**
   - URL: `http://localhost:3001` (port 3000 was in use)
   - Configured to communicate with backend via environment variables

## Connection Verification

The frontend can successfully communicate with the backend through:
- Environment variable: `NEXT_PUBLIC_API_BASE=http://127.0.0.1:8787`
- API calls to endpoints like `/api/health`, `/api/login`, etc.

## How to Test the Connection

1. Visit the test page: http://localhost:3001/test-api
2. You should see a green success message showing the backend health data
3. Alternatively, you can test directly with curl:
   ```bash
   curl http://127.0.0.1:8787/api/health
   ```

## Running Services Commands

To restart or check the services:

### Backend (in areca-backend directory):
```bash
npx wrangler dev --local --persist-to=./.wrangler/state
```

### Frontend (in Frontend directory):
```bash
npm run dev
```

## API Endpoints Available

- `GET /api/health` - Server health check
- `POST /api/login` - User authentication
- `POST /api/detect` - Disease detection
- `POST /api/upload` - File uploads
- `GET /api/prices` - Market prices
- `POST /api/alerts/nearby` - Nearby alerts

## Configuration Files

1. **Frontend Environment**: `.env.local` sets `NEXT_PUBLIC_API_BASE`
2. **Backend Configuration**: `wrangler.toml` defines allowed origins and bindings

## Troubleshooting

If connection issues occur:
1. Ensure both services are running
2. Check that the ports match the configuration
3. Verify CORS settings in `wrangler.toml`
4. Confirm `NEXT_PUBLIC_API_BASE` in frontend `.env.local`