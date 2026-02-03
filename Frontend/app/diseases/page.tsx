'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, AlertCircle } from 'lucide-react'

const diseases = [
  { id: 1, name: 'Leaf Spot', severity: 'moderate', description: 'Fungal infection causing brown spots', treatments: 3 },
  { id: 2, name: 'Stem Borer', severity: 'severe', description: 'Insect pest damaging stems', treatments: 2 },
  { id: 3, name: 'Powdery Mildew', severity: 'mild', description: 'White powder coating on leaves', treatments: 3 },
  { id: 4, name: 'Root Rot', severity: 'severe', description: 'Fungal disease affecting roots', treatments: 2 },
  { id: 5, name: 'Leaf Curl', severity: 'mild', description: 'Viral infection causing leaf deformation', treatments: 1 },
  { id: 6, name: 'Scale Insects', severity: 'moderate', description: 'Small armored insects on stems', treatments: 2 },
]

export default function DiseasesPage() {
  const [search, setSearch] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('')

  const filtered = diseases.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) &&
    (!selectedSeverity || d.severity === selectedSeverity)
  )

  const severityColor = {
    mild: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    severe: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Disease Library</h1>
          <p className="text-muted-foreground">Browse common arecanut diseases and treatments</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search diseases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['mild', 'moderate', 'severe'].map((severity) => (
              <Button
                key={severity}
                variant={selectedSeverity === severity ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSeverity(selectedSeverity === severity ? '' : severity)}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Diseases Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.map((disease, idx) => (
            <motion.div
              key={disease.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{disease.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${severityColor[disease.severity as keyof typeof severityColor]}`}>
                    {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{disease.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{disease.treatments} treatments</span>
                  <Button size="sm" variant="ghost">Learn More →</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No diseases found matching your search</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
