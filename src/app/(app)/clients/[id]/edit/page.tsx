'use client';

import { useParams } from 'next/navigation';
import { ClientForm } from '@/components/clients/ClientForm';
import { useClient } from '@/lib/hooks/useClients';

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useClient(id);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (!data) return null;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Client</h1>
      <ClientForm client={data} />
    </div>
  );
}
