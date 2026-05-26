'use client';

import type { Client } from '@/lib/types';
import { ClientCard } from './ClientCard';

interface Props {
  clients: Client[];
  emptyMessage?: string;
}

export function ClientList({ clients, emptyMessage = 'No clients found.' }: Props) {
  if (clients.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }
  return (
    <ul className="space-y-2">
      {clients.map((c) => (
        <li key={c.id}>
          <ClientCard client={c} />
        </li>
      ))}
    </ul>
  );
}
