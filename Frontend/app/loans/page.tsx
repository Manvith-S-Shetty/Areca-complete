'use client'

import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IndianRupee, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const loans = [
  { id: 1, bank: 'State Bank of India', rate: 6.5, amount: '₹2-10 lakhs', term: '3-7 years', features: ['Flexible repayment', 'Low interest'] },
  { id: 2, bank: 'NABARD', rate: 5.8, amount: '₹1-20 lakhs', term: '3-10 years', features: ['Government backed', 'Subsidy eligible'] },
  { id: 3, bank: 'Private Cooperative', rate: 7.2, amount: '₹50k-5 lakhs', term: '1-5 years', features: ['Quick approval', 'Local support'] },
  { id: 4, bank: 'Agricultural Development Bank', rate: 6.0, amount: '₹2-15 lakhs', term: '3-8 years', features: ['Specialized', 'Expert guidance'] },
]

export default function LoansPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Farm Loans</h1>
          <p className="text-muted-foreground">Explore available loan options for farmers</p>
        </motion.div>

        {/* Loan Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {loans.map((loan, idx) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-6 hover:border-primary/30 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-lg font-bold mb-3">{loan.bank}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p><strong>Interest Rate:</strong> {loan.rate}% p.a.</p>
                      <p><strong>Loan Amount:</strong> {loan.amount}</p>
                      <p><strong>Tenure:</strong> {loan.term}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {loan.features.map((feature) => (
                        <span key={feature} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <Button className="w-full">Apply Now</Button>
                    <Link href="/loans/calculator">
                      <Button variant="outline" className="w-full">Calculate EMI</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
