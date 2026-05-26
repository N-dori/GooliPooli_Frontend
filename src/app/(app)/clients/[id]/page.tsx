'use client';

import { useParams } from 'next/navigation';
import { ClientDetail } from '@/components/clients/ClientDetail';
import { useClient } from '@/lib/hooks/useClients';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useClient(id);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (!data) return null;
  return <ClientDetail client={data} />;
}
