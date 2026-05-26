'use client';

import type { Locale } from '@/lib/i18n/LocaleContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/lib/utils';

export function ProfilePreferencesSection() {
  const { t, locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();

  const locales: { value: Locale; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'he', label: 'HE' },
  ];

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {t('profile.preferences')}
      </h2>

      {/* Language toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{t('profile.language')}</span>
        <div className="flex items-center rounded-full border p-0.5">
          {locales.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLocale(value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                locale === value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{t('profile.darkMode')}</span>
        <button
          role="switch"
          aria-checked={theme === 'dark'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            theme === 'dark' ? 'bg-primary' : 'bg-muted',
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
              theme === 'dark' ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1',
            )}
          />
        </button>
      </div>
    </div>
  );
}
