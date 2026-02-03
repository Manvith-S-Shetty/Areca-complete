'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { postLogin } from '@/lib/api';
import { useLocale } from '@/lib/locale';

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setMessage({ type: 'error', text: t('login.emptyToken') });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await postLogin({ token });
      if (result.success) {
        setMessage({ type: 'success', text: t('login.success') });
        setToken('');
        // In a real app, redirect to dashboard or protected area
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || t('login.failed'),
        });
      }
    } catch (error) {
      console.error('[Areca] Login error:', error);
      setMessage({
        type: 'error',
        text: t('login.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <motion.main
        className="flex items-center justify-center px-4 py-12 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-primary mb-2">
              {t('login.title')}
            </h1>
            <p className="text-neutral mb-6">
              {t('login.description')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.tokenLabel')}
                </label>
                <Input
                  type="text"
                  placeholder={t('login.tokenPlaceholder')}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                />
              </div>

              {message && (
                <motion.div
                  className={`p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {message.text}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? t('common.loading') : t('login.submit')}
              </Button>
            </form>

            <p className="text-xs text-neutral text-center mt-6">
              {t('login.disclaimer')}
            </p>
          </motion.div>
        </Card>
      </motion.main>
    </div>
  );
}
