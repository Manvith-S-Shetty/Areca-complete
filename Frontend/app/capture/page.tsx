'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import CameraCapture from '@/components/camera-capture'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Wifi, WifiOff, Loader2, Volume2 } from 'lucide-react'

export default function CapturePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [queueCount, setQueueCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [captures, setCaptures] = useState<any[]>([])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleCapture = (dataUrl: string) => {
    const newCapture = {
      id: Date.now(),
      dataUrl,
      timestamp: new Date().toLocaleString(),
      status: isOnline ? 'synced' : 'queued'
    }
    setCaptures([newCapture, ...captures])
    setQueueCount(prev => isOnline ? prev : prev + 1)
  }

  const handleSync = async () => {
    setIsSyncing(true)
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setQueueCount(0)
    setIsSyncing(false)
  }

  const toggleVoiceTips = () => {
    const text = "Point the camera at the crop clearly. Make sure there's good lighting. Capture the entire leaf or affected area."
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-4xl mx-auto w-full">
        {/* Status Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-2 text-primary">
                <Wifi className="w-5 h-5" />
                <span className="text-sm font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-500">
                <WifiOff className="w-5 h-5" />
                <span className="text-sm font-medium">Offline - Captures Queued</span>
              </div>
            )}
          </div>

          {queueCount > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <span className="text-sm text-muted-foreground">{queueCount} items queued</span>
              <Button 
                onClick={handleSync} 
                disabled={isSyncing || isOnline}
                size="sm"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Syncing...
                  </>
                ) : (
                  'Sync Now'
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Voice Tips Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button 
            onClick={toggleVoiceTips}
            variant="outline"
            className="w-full justify-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Listen to Capture Tips
          </Button>
        </motion.div>

        {/* Camera Capture */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <CameraCapture onCapture={handleCapture} />
        </motion.div>

        {/* Guidance */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100 text-sm">Capture Tips</p>
            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">Good lighting • Clear focus • Full crop view • Steady hand</p>
          </div>
        </motion.div>

        {/* Recent Captures */}
        {captures.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold mb-6">Recent Captures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {captures.map((capture) => (
                <Card key={capture.id} className="overflow-hidden hover:border-primary/30 transition-colors">
                  <img 
                    src={capture.dataUrl || "/placeholder.svg"} 
                    alt="Capture" 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {capture.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{capture.timestamp}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
