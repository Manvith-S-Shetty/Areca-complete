'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { Leaf, Camera, BarChart3, AlertCircle, Zap } from 'lucide-react'
import { useLocale } from '@/lib/locale'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-background relative min-h-[600px] flex items-center justify-center px-4 py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          <motion.div 
            className="relative z-10 max-w-3xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight"
            >
              {t('hero.title')} <span className="text-primary">{t('hero.highlight')}</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/detect">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Camera className="mr-2 w-5 h-5" />
                  {t('cta.capture')}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t('cta.dashboard')}
                </Button>
              </Link>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { icon: Camera, title: t('features.capture.title'), desc: t('features.capture.desc') },
                { icon: Zap, title: t('features.insights.title'), desc: t('features.insights.desc') },
                { icon: BarChart3, title: t('features.track.title'), desc: t('features.track.desc') }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Quick Links Section */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">{t('quickLinks.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: '/diseases', icon: AlertCircle, label: t('quickLinks.diseases') },
                { href: '/prices', icon: BarChart3, label: t('quickLinks.prices') },
                { href: '/loans', icon: Zap, label: t('quickLinks.loans') },
                { href: '/alerts', icon: AlertCircle, label: t('quickLinks.alerts') }
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="p-4 bg-background border border-border rounded-lg hover:border-primary/30 transition-all duration-300 text-center cursor-pointer"
                  >
                    <link.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{link.label}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
