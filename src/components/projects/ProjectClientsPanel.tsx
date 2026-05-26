'use client';

import type { Client, ProjectWithDetails } from '@/lib/types';
import { Pencil, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clientsApi } from '@/lib/api/clients';
import { useClientList } from '@/lib/hooks/useClients';
import { useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '@/lib/hooks/useProjects';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

interface Props {
  project: ProjectWithDetails;
}

export function ProjectClientsPanel({ project }: Props) {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: allClients } = useClientList({ page: 1 });

  const projectClients: Client[] = project.clients ?? [];
  const projectClientIds = new Set(projectClients.map((c) => c.id));

  const availableClients = (allClients?.items ?? []).filter(
    (c) => !projectClientIds.has(c.id),
  );

  const handleAdd = async () => {
    if (!selectedClientId) return;
    setLoading(true);
    try {
      await clientsApi.update(selectedClientId, { projectId: project.id });
      qc.invalidateQueries({ queryKey: projectKeys.detail(project.id) });
      toast.success('Client added to project');
      setSelectedClientId('');
      setAdding(false);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (clientId: string) => {
    setLoading(true);
    try {
      await clientsApi.update(clientId, { projectId: null });
      qc.invalidateQueries({ queryKey: projectKeys.detail(project.id) });
      toast.success('Client removed from project');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{t('projects.clients')}</CardTitle>
        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={() => setAdding(!adding)}>
            <Plus className="mr-1 h-4 w-4" />
            {t('projects.addClient')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {adding && isAdmin && (
          <div className="flex gap-2">
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select client…</option>
              {availableClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.address}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleAdd} disabled={!selectedClientId || loading}>
              {t('common.add')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        )}

        {projectClients.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('projects.noClients')}</p>
        ) : (
          <ul className="divide-y">
            {projectClients.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.address}</p>
                </div>
                <div className="ml-2 flex items-center gap-1">
                  {isAdmin && (
                    <>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href={`/clients/${c.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleRemove(c.id)}
                        disabled={loading}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
