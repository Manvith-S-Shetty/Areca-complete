'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'

export default function TestApiPage() {
  const [healthData, setHealthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8787'
        const response = await fetch(`${apiUrl}/api/health`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setHealthData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        
        {loading && <p>Loading...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
        )}
        
        {healthData && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h2 className="text-xl font-semibold mb-2">✅ Backend Connection Successful!</h2>
            <p>Status: {healthData.status}</p>
            <p>Timestamp: {healthData.ts}</p>
            <p>Model Version: {healthData.modelVersion}</p>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Connection Details</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Frontend is running on: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code></li>
            <li>Backend is running on: <code className="bg-gray-100 px-2 py-1 rounded">http://127.0.0.1:8787</code></li>
            <li>API endpoint tested: <code className="bg-gray-100 px-2 py-1 rounded">/api/health</code></li>
          </ul>
        </div>
      </main>
    </div>
  )
}