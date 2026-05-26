'use client';

import { BookOpen, Map, Users, Users2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);

  const items = [
    { href: '/diary', label: t('nav.diary'), icon: BookOpen },
    { href: '/clients', label: t('nav.clients'), icon: Users2 },
    { href: '/map', label: t('nav.map'), icon: Map },
    ...(role === 'admin'
      ? [{ href: '/users', label: t('nav.users'), icon: Users }]
      : []),
  ] as const;

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur dark:bg-background/90">
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-around px-2 pt-1 rtl:flex-row-reverse">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/' && pathname.startsWith(href + '/'));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
