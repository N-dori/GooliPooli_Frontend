'use client';

import { CalendarDays, CircleUser, Map, Sun, Users2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { cn } from '@/lib/utils';

// Five fixed nav items — Users management reached via profile/settings
const NAV_ITEMS = [
  { href: '/diary', labelKey: 'nav.today', icon: Sun },
  { href: '/map', labelKey: 'nav.map', icon: Map },
  { href: '/diary/month', labelKey: 'nav.month', icon: CalendarDays },
  { href: '/clients', labelKey: 'nav.clients', icon: Users2 },
  { href: '/profile', labelKey: 'nav.profile', icon: CircleUser },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav
      className={cn(
        'pb-safe fixed inset-x-0 bottom-0 z-30',
        'rounded-t-3xl bg-gray-100/90 backdrop-blur',
        'dark:bg-zinc-900/90',
      )}
    >
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-4 py-3 rtl:flex-row-reverse">
        {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
          // Active: exact match OR starts with href (but avoid /diary matching /diary/month)
          const active =
            pathname === href ||
            (href !== '/diary' && pathname.startsWith(href + '/')) ||
            (href === '/diary' && pathname === '/diary');

          const label = t(labelKey);

          return (
            <Link key={href} href={href} aria-label={label}>
              {active ? (
                /* Active pill */
                <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-primary">{label}</span>
                </div>
              ) : (
                /* Inactive: icon only */
                <div className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/60 dark:hover:bg-zinc-800/60">
                  <Icon className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
