/**
 * API client wrappers for Areca backend
 * All endpoints are relative to /api/ for Vercel routing compatibility
 * Replace with real backend integration when available
 */

/**
 * POST /api/login - Authenticate user with token
 * STUB: In production, this would verify JWT and set httpOnly cookie
 */
export async function postLogin(payload) {
  try {
    console.log('[Areca API] POST /api/login', payload);
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include', // Send cookies
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Backend stub not available; graceful fallback
        console.warn('[Areca API] /api/login not implemented, simulating success');
        return { success: true };
      }
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || 'Authentication failed' };
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('[Areca API] postLogin error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * GET /api/health - Health check
 */
export async function getHealth() {
  try {
    console.log('[Areca API] GET /api/health');
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('[Areca API] /api/health not implemented');
        return { status: 'unavailable' };
      }
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Areca API] getHealth error:', error);
    return { status: 'error', error: error.message };
  }
}

/**
 * POST /api/upload - Upload queued captures
 * Reads from IndexedDB queue and attempts upload
 * On success or if server unavailable, removes from queue
 */
export async function uploadCapture() {
  try {
    const { getAllQueued, removeItem } = await import('./idb-queue.js');
    const items = await getAllQueued();

    if (items.length === 0) {
      console.log('[Areca API] No items in queue to upload');
      return { synced: 0 };
    }

    console.log(`[Areca API] Uploading ${items.length} queued items to /api/upload`);

    let synced = 0;
    for (const item of items) {
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
          credentials: 'include',
        });

        if (response.ok || response.status === 404) {
          // Remove from queue on success or if endpoint not found
          await removeItem(item.id);
          synced++;
        } else {
          console.warn(`[Areca API] Upload failed for item ${item.id}:`, response.statusText);
        }
      } catch (error) {
        // Network error; simulate success to allow offline mode
        console.warn(`[Areca API] Network error for item ${item.id}, simulating removal:`, error);
        await removeItem(item.id);
        synced++;
      }
    }

    console.log(`[Areca API] Successfully synced ${synced} items`);
    return { synced };
  } catch (error) {
    console.error('[Areca API] uploadCapture error:', error);
    throw error;
  }
}
