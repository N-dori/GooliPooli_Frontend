'use client';

import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClientList } from '@/lib/hooks/useClients';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';
import { ClientList } from './ClientList';

export function ClientIndex() {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useClientList({ search: search || undefined });

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('clients.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.total} total` : t('common.loading')}
          </p>
        </div>
        {role === 'admin' && (
          <Button asChild size="sm">
            <Link href="/clients/new">
              <Plus className="mr-1 h-4 w-4" /> {t('clients.new')}
            </Link>
          </Button>
        )}
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
        <Input
          placeholder={t('clients.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rtl:pl-3 rtl:pr-9"
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {data && <ClientList clients={data.items} emptyMessage={t('clients.noClients')} />}
    </div>
  );
}
