# Areca - Mobile-First Plant Assistant for Farmers

A production-ready Next.js frontend for agricultural crop monitoring. Capture photos offline, queue uploads, and review analysis results. Fully accessible, multilingual (English, Hindi, Kannada), and optimized for mobile devices.

## Features

- 📱 **Mobile-First Design**: Optimized for field use on smartphones
- 📸 **Live Camera Capture**: Real-time photo capture with guidance overlay
- 🔄 **Offline Queue**: IndexedDB-based offline storage with sync capability
- 🌍 **Multilingual**: English, Hindi, and Kannada localization
- ♿ **Accessible**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- ✨ **Smooth Animations**: Framer Motion micro-interactions for better UX
- 🎤 **Voice Guidance**: Text-to-speech tips for low-literacy users
- 🚀 **Vercel Ready**: Deploy directly to Vercel with zero configuration

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Offline Storage**: IndexedDB
- **Language**: JavaScript/TypeScript

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd areca

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Home page
│   ├── login/          # Authentication page
│   ├── capture/        # Photo capture page
│   ├── dashboard/      # Upload management dashboard
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx      # Navigation header with locale selector
│   ├── CameraCapture.tsx # Main camera component
│   └── ui/             # Reusable UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
└── lib/
    ├── api.js          # API client wrappers
    ├── idb-queue.js    # IndexedDB offline queue
    └── locale.js       # i18n localization helpers
\`\`\`

## API Endpoints

The app expects these endpoints (can be stubs during development):

- `POST /api/login` - User authentication with JWT token
- `GET /api/health` - Server health check
- `POST /api/upload` - Upload queued captures

All endpoints should support relative URLs (`/api/*`) for Vercel routing.

## Offline Workflow

1. User captures photos on the Capture page
2. Photos are automatically enqueued to IndexedDB
3. When online, user can click "Sync Now" to upload
4. Queue status persists across browser sessions

## Localization

Translations are defined in `src/lib/locale.js`. To add a new language:

\`\`\`js
export const TRANSLATIONS = {
  // ... existing locales
  es: {
    'app.title': 'Areca',
    'capture.title': 'Capturar Fotos',
    // ... add all keys
  }
}
\`\`\`

Then update the locale selector in `src/components/Header.tsx`.

## Accessibility

- Semantic HTML elements and ARIA roles
- Keyboard navigation with visible focus states
- Screen reader support with alt text
- Voice guidance with Web Speech API
- Minimum color contrast ratios (WCAG AA)

## Environment Variables

Optional configuration via `.env.local`:

\`\`\`env
NEXT_PUBLIC_APP_NAME=Areca
\`\`\`

All API calls gracefully fallback if backend is unavailable (useful for development).

## Deployment to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

The app is automatically built and deployed. No environment variables required for basic functionality.

## Security Notes for Production

### HTTPS & Cookies

Before going live, ensure:

1. **HTTPS Only**: All traffic must be encrypted
2. **HttpOnly Cookies**: Auth tokens stored as httpOnly cookies (not accessible to JavaScript)
3. **Secure Flag**: Cookies only sent over HTTPS
4. **SameSite Policy**: Set to `Strict` to prevent CSRF attacks

Example backend implementation:

\`\`\`js
res.setHeader('Set-Cookie', [
  `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`
]);
\`\`\`

### Camera Permissions

- Only request camera access when needed (on the Capture page)
- Display clear messaging about why camera access is required
- Respect user's permission choices

## Testing

### Acceptance Criteria

- [x] `npm run build` completes without errors
- [x] `/login` POSTs to `/api/login` (gracefully handles missing backend)
- [x] `/capture` shows live video, captures photos, queues to IndexedDB
- [x] "Sync Now" attempts upload and removes queued items
- [x] Locale selector changes UI strings
- [x] Keyboard navigation and focus states work
- [x] Mobile-responsive on all screen sizes

### Manual Testing

1. **Camera Capture**
   \`\`\`bash
   npm run dev
   # Open http://localhost:3000/capture
   # Allow camera access
   # Click capture button, verify photo preview
   \`\`\`

2. **Offline Queue**
   \`\`\`js
   // In browser console
   import { getAllQueued } from '@/lib/idb-queue.js'
   getAllQueued().then(console.log)
   \`\`\`

3. **API Calls**
   \`\`\`js
   // Test health check
   import { getHealth } from '@/lib/api.js'
   getHealth().then(console.log)
   \`\`\`

## Performance Tips

- Photos are compressed to JPEG 80% quality to reduce file size
- IndexedDB queries are debounced to prevent excessive database access
- Images are lazy-loaded on the dashboard
- Framer Motion animations use GPU-accelerated transforms

## Troubleshooting

### Camera Not Working

- Check browser permissions: Settings → Privacy → Camera
- Ensure HTTPS (required for some browsers)
- Verify `navigator.mediaDevices.getUserMedia` is available

### Offline Queue Not Persisting

- Check IndexedDB in DevTools: Application → Storage → IndexedDB
- Ensure browser is not in private/incognito mode
- Verify localStorage is enabled

### API Calls Failing

- Confirm backend server is running
- Check network tab in DevTools for CORS issues
- Verify `/api/*` routes are correctly configured in Next.js

## Contributing

This is a frontend scaffold. To extend:

1. Add new locales in `src/lib/locale.js`
2. Create new pages in `src/app/`
3. Add UI components in `src/components/`
4. Implement real auth in `/api/login` (backend)
5. Implement crop analysis in `/api/upload` (backend)

## License

MIT

---

**Built with ❤️ for farmers using modern web technologies.**
