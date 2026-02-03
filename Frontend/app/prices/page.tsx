'use client'

import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Bell } from 'lucide-react'

const priceData = [
  { district: 'Hassan', price: 45.50, change: 2.5, trend: 'up' },
  { district: 'Shimoga', price: 44.20, change: -1.2, trend: 'down' },
  { district: 'Chikmagalur', price: 46.80, change: 1.8, trend: 'up' },
  { district: 'Uttara Kannada', price: 43.10, change: -0.5, trend: 'down' },
]

export default function PricesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Market Prices</h1>
            <p className="text-muted-foreground">Live arecanut market rates by district</p>
          </div>
          <Button className="gap-2">
            <Bell className="w-4 h-4" />
            Subscribe
          </Button>
        </motion.div>

        {/* Price Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {priceData.map((item, idx) => (
            <motion.div
              key={item.district}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg">{item.district}</h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded ${item.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-xs font-medium">{Math.abs(item.change)}%</span>
                  </div>
                </div>
                <p className="text-3xl font-bold mb-2">₹{item.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Per kg</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-12 p-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900"
        >
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Prices are updated daily at 9 AM IST from the Agricultural Produce Market Committee (APMC).
          </p>
        </motion.div>
      </main>
    </div>
  )
}
