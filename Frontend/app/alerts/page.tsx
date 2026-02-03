'use client'

import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Card } from '@/components/ui/card'
import { AlertCircle, MapPin } from 'lucide-react'

const alerts = [
  { id: 1, disease: 'Leaf Spot', district: 'Hassan', severity: 'moderate', distance: '2.3 km', cases: 12 },
  { id: 2, disease: 'Stem Borer', district: 'Chikmagalur', severity: 'severe', distance: '5.1 km', cases: 8 },
  { id: 3, disease: 'Powdery Mildew', district: 'Hassan', severity: 'mild', distance: '8.4 km', cases: 15 },
]

export default function AlertsPage() {
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
          <h1 className="text-4xl font-bold mb-2">Neighborhood Alerts</h1>
          <p className="text-muted-foreground">Disease alerts in your area</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {alerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{alert.disease}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.district}</span>
                        <span>•</span>
                        <span>{alert.distance}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.cases} reported cases</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${severityColor[alert.severity as keyof typeof severityColor]}`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
