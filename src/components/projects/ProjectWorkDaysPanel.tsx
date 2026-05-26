'use client';

import type { ProjectWithDetails } from '@/lib/types';
import { CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useCreateVisit } from '@/lib/hooks/useVisits';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

interface Props {
  project: ProjectWithDetails;
  workDates: string[]; // unique sorted date strings
}

export function ProjectWorkDaysPanel({ project, workDates }: Props) {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';
  const createVisit = useCreateVisit();

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);

  const workers = (project.members ?? []).filter(
    (m) => m.user?.role === 'worker' || m.user?.role === 'project_manager',
  );
  const clients = project.clients ?? [];

  const handleCreate = async () => {
    if (!date || clients.length === 0) return;
    const workerIds = selectedWorkerIds.length > 0 ? selectedWorkerIds : [null];
    for (const client of clients) {
      for (const workerId of workerIds) {
        await createVisit.mutateAsync({
          projectId: project.id,
          clientId: client.id,
          workerId,
          scheduledDate: date,
        });
      }
    }
    setModalOpen(false);
    setDate('');
    setSelectedWorkerIds([]);
  };

  const toggleWorker = (id: string) => {
    setSelectedWorkerIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">{t('projects.workDays')}</CardTitle>
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(true)}>
              <CalendarPlus className="mr-1 h-4 w-4" />
              {t('projects.createWorkDay')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {workDates.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('projects.noWorkDays')}</p>
          ) : (
            <ul className="space-y-1">
              {workDates.map((d) => (
                <li key={d}>
                  <Link
                    href={`/diary?date=${d}`}
                    className="block rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    {new Date(d + 'T00:00:00').toLocaleDateString('en', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <BottomSheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('projects.createWorkDay')}
      >
        <div className="space-y-4 pb-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {workers.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Workers (optional)</label>
              <div className="space-y-1">
                {workers.map((m) => (
                  <label key={m.userId} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedWorkerIds.includes(m.userId)}
                      onChange={() => toggleWorker(m.userId)}
                      className="rounded"
                    />
                    {m.user?.username ?? m.userId}
                  </label>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Will create {clients.length} visit{clients.length !== 1 ? 's' : ''} for all clients in
            this project.
          </p>

          <div className="flex gap-2 rtl:flex-row-reverse">
            <Button
              onClick={handleCreate}
              disabled={!date || clients.length === 0 || createVisit.isPending}
              className="flex-1"
            >
              {createVisit.isPending ? t('common.creating') : t('projects.createWorkDay')}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
