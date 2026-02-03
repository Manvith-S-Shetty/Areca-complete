/**
 * IndexedDB queue for offline storage of captures
 * Stub implementation for a production-grade offline queue
 */

const DB_NAME = 'ArecaDB';
const STORE_NAME = 'captures';
const DB_VERSION = 1;

let dbInstance = null;

async function initDB() {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[Areca IDB] Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

export async function enqueueCapture(item) {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      ...item,
      id: `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const request = store.add(data);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(data.id);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[Areca IDB] Enqueue failed:', error);
    throw error;
  }
}

export async function getAllQueued() {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[Areca IDB] Get all failed:', error);
    return [];
  }
}

export async function removeItem(id) {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[Areca IDB] Remove failed:', error);
    throw error;
  }
}

export async function clearQueue() {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[Areca IDB] Clear failed:', error);
    throw error;
  }
}
