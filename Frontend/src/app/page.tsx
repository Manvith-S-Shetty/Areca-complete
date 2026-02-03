'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <Header />
      <motion.main
        className="flex flex-col items-center justify-center px-4 py-12 md:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="max-w-md text-center" variants={itemVariants}>
          <h1 className="text-4xl font-bold text-primary mb-4">Areca</h1>
          <p className="text-lg text-neutral mb-2">
            Your mobile-first plant and crop assistant
          </p>
          <p className="text-base text-gray-600 mb-8">
            Capture photos of your crops, upload results offline, and get instant analysis.
          </p>
        </motion.div>

        <motion.div className="flex flex-col gap-4 mt-8 w-full max-w-sm" variants={itemVariants}>
          <Link href="/capture" className="w-full">
            <Button variant="primary" className="w-full">
              Start Capturing
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button variant="secondary" className="w-full">
              View Dashboard
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl w-full"
          variants={containerVariants}
        >
          {[
            { title: 'Offline Ready', desc: 'Works without internet connection' },
            { title: 'Mobile First', desc: 'Optimized for field use' },
            { title: 'Low-bandwidth', desc: 'Minimal data usage for farmers' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-lg p-4 shadow-sm border border-secondary"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-primary">{feature.title}</h3>
              <p className="text-sm text-neutral mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
