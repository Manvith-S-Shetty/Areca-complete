'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Leaf, Menu, X, Globe } from 'lucide-react'
import { useLocale } from '@/lib/locale'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { locale, setLocale } = useLocale()

  const handleLocaleChange = () => {
    const locales = ['en', 'hi', 'kn']
    const currentIdx = locales.indexOf(locale)
    const nextLocale = locales[(currentIdx + 1) % locales.length]
    setLocale(nextLocale)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/detect', label: 'Detect' },
    { href: '/prices', label: 'Prices' },
    { href: '/loans', label: 'Loans' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg hidden sm:inline">Areca</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleLocaleChange}
            className="gap-2"
            title={`Current: ${locale.toUpperCase()}`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium">{locale.toUpperCase()}</span>
          </Button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-card"
        >
          <nav className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  )
}
