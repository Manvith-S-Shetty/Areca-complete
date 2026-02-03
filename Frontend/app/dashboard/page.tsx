'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Card } from '@/components/ui/card'
import { BarChart3, Leaf, TrendingUp, CheckCircle2 } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const [captures, setCaptures] = useState<any[]>([])

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('captures')
    if (stored) {
      try {
        setCaptures(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load captures')
      }
    }
  }, [])

  const stats = [
    { icon: BarChart3, label: 'Total Captures', value: captures.length, color: 'text-primary' },
    { icon: CheckCircle2, label: 'Synced', value: captures.filter(c => c.status === 'synced').length, color: 'text-green-600' },
    { icon: TrendingUp, label: 'Success Rate', value: '100%', color: 'text-blue-600' },
    { icon: Leaf, label: 'Crops Analyzed', value: captures.length, color: 'text-emerald-600' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-5xl mx-auto w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track your captures and insights</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Captures List */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            
            {captures.length === 0 ? (
              <Card className="p-12 text-center">
                <Leaf className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No captures yet. Start by visiting the Capture page!</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {captures.map((capture) => (
                  <motion.div
                    key={capture.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 bg-card transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {capture.dataUrl && (
                        <img 
                          src={capture.dataUrl || "/placeholder.svg"} 
                          alt="Capture" 
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">Capture</p>
                        <p className="text-xs text-muted-foreground">{capture.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full flex-shrink-0">
                      {capture.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
