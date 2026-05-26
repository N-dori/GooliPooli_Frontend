'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useLocale } from '@/lib/i18n/LocaleContext';

const ROUTE_TITLES: Record<string, string> = {
  '/diary/month': 'nav.month',
  '/diary': 'nav.today',
  '/clients': 'nav.clients',
  '/map': 'nav.map',
  '/users': 'nav.users',
  '/profile': 'profile.title',
  '/projects': 'projects.title',
  '/dashboard': 'nav.today',
};

export function TopBar() {
  const pathname = usePathname();
  const { t } = useLocale();

  // Find the best-matching route title
  const titleKey =
    Object.keys(ROUTE_TITLES)
      .sort((a, b) => b.length - a.length)
      .find((k) => pathname === k || pathname.startsWith(k + '/')) ?? '';
  const title = titleKey ? t(ROUTE_TITLES[titleKey]) : 'Golipooli';

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur dark:bg-background/90">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
        <Link href="/diary" className="text-base font-semibold tracking-tight">
          {title}
        </Link>
        <UserAvatar size={36} />
      </div>
    </header>
  );
}
