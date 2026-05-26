'use client';

import type { Client } from '@/lib/types';
import { MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDeleteClient } from '@/lib/hooks/useClients';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

interface Props {
  client: Client;
}

export function ClientDetail({ client }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';
  const deleteMutation = useDeleteClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(client.id);
    router.push('/clients');
  };

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`;

  return (
    <article className="space-y-4">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{client.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!client.isActive && <Badge variant="secondary">Inactive</Badge>}
          {isAdmin && (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/clients/${client.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {client.phone && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('clients.phone')}</span>
              <a href={`tel:${client.phone}`} className="flex items-center gap-1 font-medium text-primary">
                <Phone className="h-4 w-4" />
                {client.phone}
              </a>
            </div>
          )}
          {client.gateCode && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('clients.gateCode')}</span>
              <span className="font-mono font-medium">{client.gateCode}</span>
            </div>
          )}
          {client.note && (
            <div>
              <p className="mb-1 text-muted-foreground">{t('clients.notes')}</p>
              <p className="rounded-md bg-muted/50 p-2 text-sm">{client.note}</p>
            </div>
          )}
          {(client.latitude != null || client.longitude != null) && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">GPS</span>
              <span className="font-mono text-xs">
                {client.latitude?.toFixed(6)}, {client.longitude?.toFixed(6)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" asChild>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          🧭 {t('clients.address')} — Navigate
        </a>
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        title={t('common.confirm')}
        description={t('clients.deleteConfirm')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleteMutation.isPending}
      />
    </article>
  );
}
