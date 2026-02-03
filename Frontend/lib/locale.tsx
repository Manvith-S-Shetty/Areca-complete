'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import en from '@/locales/en.json'
import hi from '@/locales/hi.json'
import kn from '@/locales/kn.json'

interface LocaleContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, defaultValue?: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

const localeData: Record<string, any> = {
  en,
  hi,
  kn
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('locale') : 'en'
    const initial = saved || 'en'
    setLocaleState(initial)
  }, [])

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.')
    let value: any = localeData[locale] || {}
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return typeof value === 'string' ? value : (defaultValue || key)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext)
  if (!context) {
    return {
      locale: 'en',
      setLocale: () => {},
      t: (key, def) => def || key
    }
  }
  return context
}
