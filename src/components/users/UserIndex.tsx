'use client';

import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserList } from '@/lib/hooks/useUsers';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { UserList } from './UserList';

export function UserIndex() {
  const { t } = useLocale();
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useUserList({ search: search || undefined });

  // Client-side filter as fallback
  const users = (data?.items ?? []).filter(
    (u) =>
      !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('users.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.total} total` : t('common.loading')}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/users/new">
            <Plus className="mr-1 h-4 w-4" /> {t('users.new')}
          </Link>
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
        <Input
          placeholder={t('users.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rtl:pl-3 rtl:pr-9"
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {data && <UserList users={users} />}
    </div>
  );
}
