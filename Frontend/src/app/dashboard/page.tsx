'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getAllQueued, removeItem } from '@/lib/idb-queue';
import { useLocale } from '@/lib/locale';

interface QueuedItem {
  id: string;
  dataUrl: string;
  timestamp: number;
  synced?: boolean;
}

export default function DashboardPage() {
  const [queued, setQueued] = useState<QueuedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    const loadQueued = async () => {
      try {
        const items = await getAllQueued();
        setQueued(items);
      } catch (error) {
        console.error('[Areca] Failed to load queued items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQueued();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
      setQueued(queued.filter(item => item.id !== id));
    } catch (error) {
      console.error('[Areca] Failed to remove item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <motion.main
        className="px-4 py-8 md:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t('dashboard.title')}
          </h1>
          <p className="text-neutral mb-8">
            {t('dashboard.description')}
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-neutral">{t('common.loading')}</p>
            </div>
          ) : queued.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-neutral text-lg mb-4">
                  {t('dashboard.empty')}
                </p>
                <a href="/capture" className="text-primary font-semibold hover:underline">
                  {t('dashboard.startCapturing')}
                </a>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {queued.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.dataUrl || "/placeholder.svg"}
                        alt="Queued capture"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-neutral mb-2">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs rounded-full font-semibold">
                          {item.synced ? t('dashboard.synced') : t('dashboard.queued')}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                          className="mt-4 sm:mt-0 sm:ml-auto"
                        >
                          {t('common.remove')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
}
