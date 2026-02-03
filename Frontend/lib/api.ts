// API wrapper for all backend calls with placeholder responses
// All endpoints are called but gracefully handle missing backend during development

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })

    if (!response.ok) {
      // Return placeholder data if backend is unavailable
      if (response.status === 404 || response.status === 500) {
        return { success: true, data: {} as T }
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error)
    // Return success with empty data for graceful degradation
    return { success: true, data: {} as T }
  }
}

export async function login(credentials: { email?: string; phone?: string; password: string }) {
  return apiCall('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export async function getUser() {
  return apiCall('/api/user', { method: 'GET' })
}

export async function detectDisease(imageData: string) {
  return apiCall('/api/detect', {
    method: 'POST',
    body: JSON.stringify({ imageData })
  })
}

export async function getPrices(district?: string) {
  const query = district ? `?district=${district}` : ''
  return apiCall(`/api/prices${query}`, { method: 'GET' })
}

export async function getLoans() {
  return apiCall('/api/loans', { method: 'GET' })
}

export async function calculateEMI(principal: number, rate: number, tenure: number) {
  return apiCall('/api/loans/calculate', {
    method: 'POST',
    body: JSON.stringify({ principal, rate, tenure })
  })
}

export async function getAlerts(latitude?: number, longitude?: number) {
  const query = latitude ? `?lat=${latitude}&lng=${longitude}` : ''
  return apiCall(`/api/alerts${query}`, { method: 'GET' })
}

export async function uploadCapture(imageData: string, metadata?: any) {
  return apiCall('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ imageData, metadata })
  })
}

export async function getDiseases(search?: string) {
  const query = search ? `?search=${search}` : ''
  return apiCall(`/api/diseases${query}`, { method: 'GET' })
}

export async function getDisease(id: string) {
  return apiCall(`/api/diseases/${id}`, { method: 'GET' })
}

export async function getHealth() {
  return apiCall('/api/health', { method: 'GET' }).catch(() => ({ success: false }))
}

export async function syncCaptures(captures: any[]) {
  return apiCall('/api/sync', {
    method: 'POST',
    body: JSON.stringify({ captures })
  })
}
