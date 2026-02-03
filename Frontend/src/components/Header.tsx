'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/locale';
import Button from './ui/Button';

export default function Header() {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();

  const locales = ['en', 'hi', 'kn'];

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <header className="bg-white border-b border-secondary sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">🌿 Areca</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-neutral hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/capture" className="text-neutral hover:text-primary transition-colors">
            {t('nav.capture')}
          </Link>
          <Link href="/dashboard" className="text-neutral hover:text-primary transition-colors">
            {t('nav.dashboard')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  locale === loc
                    ? 'bg-primary text-white'
                    : 'text-neutral hover:text-primary'
                }`}
                aria-label={`Switch to ${loc}`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
