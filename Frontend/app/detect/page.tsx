'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import CameraCapture from '@/components/camera-capture'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/locale'
import Link from 'next/link'

export default function DetectPage() {
  const { t } = useLocale()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleCapture = async (dataUrl: string) => {
    setIsAnalyzing(true)
    // Simulate API call to /api/detect
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock result
    setResult({
      disease: 'Leaf Spot',
      severity: 'moderate',
      confidence: 0.87,
      recommendedActions: [
        'Apply fungicide immediately',
        'Increase air circulation',
        'Remove affected leaves'
      ],
      materials: ['Fungicide spray', 'Protective gloves', 'Pruning tools']
    })
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Disease Detection</h1>
          <p className="text-muted-foreground">Capture or upload an image to analyze</p>
        </motion.div>

        {!result ? (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <CameraCapture onCapture={handleCapture} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-3 items-center justify-center"
            >
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6"
            >
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
                  <p className="font-medium mb-2">Upload from Gallery</p>
                  <p className="text-sm text-muted-foreground">Click to select an image</p>
                </div>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/detect/result">
              <Button className="w-full mb-6">View Full Results</Button>
            </Link>

            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">{result.disease}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Severity</p>
                  <p className="text-lg font-semibold capitalize">{result.severity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <p className="text-lg font-semibold">{(result.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Button 
                onClick={() => setResult(null)}
                variant="outline"
                className="w-full"
              >
                Capture Again
              </Button>
            </div>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Card className="p-8 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="font-medium">Analyzing image...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
