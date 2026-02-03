'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Globe, Bell, Lock } from 'lucide-react'

export default function SettingsPage() {
  const [farms, setFarms] = useState([
    { id: 1, name: 'Farm 1', location: 'Hassan, Karnataka' },
    { id: 2, name: 'Farm 2', location: 'Chikmagalur, Karnataka' },
  ])
  const [newFarm, setNewFarm] = useState('')

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-transparent">
      <Header />
      
      <main className="flex-1 px-4 py-8 md:py-12 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input placeholder="Your name" className="h-10" defaultValue="Farmer Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input placeholder="Your phone" className="h-10" defaultValue="+91 90000 00000" />
                </div>
                <Button>Update Profile</Button>
              </div>
            </Card>
          </motion.div>

          {/* Farms Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Your Farms</h2>
              <div className="space-y-3 mb-4">
                {farms.map((farm) => (
                  <div key={farm.id} className="p-3 rounded-lg bg-background border border-border">
                    <p className="font-medium">{farm.name}</p>
                    <p className="text-sm text-muted-foreground">{farm.location}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add a farm location" value={newFarm} onChange={(e) => setNewFarm(e.target.value)} className="h-10" />
                <Button>Add</Button>
              </div>
            </Card>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h2>
              <div className="space-y-3">
                {['Disease Alerts', 'Price Updates', 'Weather Warnings', 'System Updates'].map((pref) => (
                  <label key={pref} className="flex items-center gap-3 p-2 rounded hover:bg-background cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                    <span className="text-sm">{pref}</span>
                  </label>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Language Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Currently set to English</p>
              <Button variant="outline">Change Language</Button>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
