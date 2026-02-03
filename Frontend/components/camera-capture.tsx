'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Camera, X, Download } from 'lucide-react'

interface CameraCaptureProps {
  onCapture?: (dataUrl: string) => void
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setPermission('granted')
        }
      } catch (err) {
        console.error('Camera access denied:', err)
        setPermission('denied')
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    if (ctx) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      
      const dataUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(dataUrl)
      
      // Store in localStorage
      const captures = JSON.parse(localStorage.getItem('captures') || '[]')
      captures.unshift({
        id: Date.now(),
        dataUrl,
        timestamp: new Date().toLocaleString(),
        status: 'captured'
      })
      localStorage.setItem('captures', JSON.stringify(captures.slice(0, 20)))

      onCapture?.(dataUrl)
      setIsCapturing(true)
      setTimeout(() => setIsCapturing(false), 500)
    }
  }

  const handleReset = () => {
    setCapturedImage(null)
  }

  const downloadImage = () => {
    if (!capturedImage) return
    const link = document.createElement('a')
    link.href = capturedImage
    link.download = `areca-capture-${Date.now()}.jpg`
    link.click()
  }

  return (
    <div className="w-full">
      {permission === 'denied' ? (
        <Card className="p-8 text-center">
          <Camera className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="font-medium mb-2">Camera Access Denied</p>
          <p className="text-sm text-muted-foreground mb-4">Please enable camera access in your browser settings</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      ) : !capturedImage ? (
        <Card className="overflow-hidden">
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Guidance Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-56 h-72 border-2 border-primary/50 rounded-2xl" />
              <p className="text-white text-sm mt-8 text-center px-4">Align your crop within the frame</p>
            </div>

            {/* Capture Button */}
            <motion.div 
              className="absolute bottom-6 left-1/2 -translate-x-1/2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={handleCapture}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Camera className="w-7 h-7 text-white" />
              </button>
            </motion.div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="relative bg-black aspect-video">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
            
            {/* Success Check */}
            {isCapturing && (
              <motion.div
                initial={{ scale: 2, opacity: 1 }}
                animate={{ scale: 1, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-24 h-24 border-4 border-primary rounded-full" />
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 flex gap-3">
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button 
              onClick={downloadImage}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
