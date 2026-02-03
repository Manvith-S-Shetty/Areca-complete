'use client'

import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DetectResultPage() {
  const result = {
    disease: 'Leaf Spot',
    severity: 'moderate',
    confidence: 0.87,
    recommendedActions: [
      'Apply fungicide immediately',
      'Increase air circulation',
      'Remove affected leaves'
    ],
    materials: ['Fungicide spray', 'Protective gloves', 'Pruning tools']
  }

  const severityColor = {
    mild: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    severe: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
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
          <Link href="/detect" className="text-sm text-primary hover:underline mb-4 inline-block">
            ← Back to Detection
          </Link>
          <h1 className="text-4xl font-bold mb-2">Detection Results</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Result Card */}
            <Card className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl font-bold mb-2">{result.disease}</h2>
                  <div className="flex gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${severityColor[result.severity as keyof typeof severityColor]}`}>
                      {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      {(result.confidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This disease requires immediate attention. Follow the recommended actions below to prevent further spread.
                </p>
              </div>
            </Card>

            {/* Recommended Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Recommended Actions
              </h3>
              <div className="space-y-3">
                {result.recommendedActions.map((action, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3 p-3 rounded-lg bg-background"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{action}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Required Materials */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Required Materials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.materials.map((material, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 rounded-lg bg-background border border-border"
                  >
                    <p className="text-sm font-medium">{material}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Sidebar Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Button className="w-full">Talk to Expert</Button>
            <Button variant="outline" className="w-full">Learn More</Button>
            <Button variant="outline" className="w-full">View Similar Cases</Button>
            <Link href="/detect" className="block">
              <Button variant="outline" className="w-full">New Capture</Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
