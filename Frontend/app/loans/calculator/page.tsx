'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(6.5)
  const [tenure, setTenure] = useState(5)

  const monthlyRate = rate / 12 / 100
  const numberOfPayments = tenure * 12
  const emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1))
  const totalAmount = emi * numberOfPayments
  const totalInterest = totalAmount - principal

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/loans" className="text-sm text-primary hover:underline mb-6 inline-block">
            ← Back to Loans
          </Link>
          <h1 className="text-4xl font-bold mb-2">EMI Calculator</h1>
          <p className="text-muted-foreground mb-8">Calculate your monthly loan payments</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Loan Amount (₹)</label>
                <Input
                  type="range"
                  min="10000"
                  max="2000000"
                  step="10000"
                  value={principal}
                  onChange={(e) => setPrincipal(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 p-3 bg-background rounded border border-border">
                  <p className="text-lg font-semibold">₹{principal.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Interest Rate (% p.a.)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tenure (Years)</label>
                <Input
                  type="number"
                  min="1"
                  max="15"
                  value={tenure}
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="h-10"
                />
              </div>
            </Card>
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
              <p className="text-muted-foreground text-sm mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold text-primary">₹{emi.toLocaleString()}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Principal Amount</span>
                  <span className="font-medium">₹{principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">₹{totalInterest.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Total Amount Payable</span>
                  <span className="font-bold text-lg">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of EMIs</span>
                  <span className="font-medium">{numberOfPayments}</span>
                </div>
              </div>
            </Card>

            <Button className="w-full">Apply for Loan</Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
