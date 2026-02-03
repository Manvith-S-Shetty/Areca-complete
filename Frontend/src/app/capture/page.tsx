'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import CameraCapture from '@/components/CameraCapture';
import { useLocale } from '@/lib/locale';

export default function CapturePage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <motion.main
        className="px-4 py-8 md:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t('capture.title')}
          </h1>
          <p className="text-neutral mb-8">
            {t('capture.description')}
          </p>
          <CameraCapture />
        </div>
      </motion.main>
    </div>
  );
}
