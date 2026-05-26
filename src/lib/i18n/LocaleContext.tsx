'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import en from './en.json';
import he from './he.json';

export type Locale = 'en' | 'he';

type Translations = typeof en;
const translations: Record<Locale, Translations> = { en, he };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyLocaleToDOM(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', locale === 'he' ? 'rtl' : 'ltr');
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('golipooli_locale') as Locale | null;
    const initial: Locale = stored === 'he' ? 'he' : 'en';
    setLocaleState(initial);
    applyLocaleToDOM(initial);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('golipooli_locale', l);
    applyLocaleToDOM(l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale] as Record<string, string>;
      return dict[key] ?? key;
    },
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
