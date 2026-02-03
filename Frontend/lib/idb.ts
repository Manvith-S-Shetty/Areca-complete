export async function initDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('ArecaDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('captures')) {
        db.createObjectStore('captures', { keyPath: 'id' })
      }
    }
  })
}

export async function enqueueCapture(item: any) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['captures'], 'readwrite')
    const store = transaction.objectStore('captures')
    const request = store.add({ ...item, id: Date.now() })
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllQueued() {
  const db = await initDB()
  return new Promise<any[]>((resolve, reject) => {
    const transaction = db.transaction(['captures'], 'readonly')
    const store = transaction.objectStore('captures')
    const request = store.getAll()
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function removeQueuedItem(id: number) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['captures'], 'readwrite')
    const store = transaction.objectStore('captures')
    const request = store.delete(id)
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
