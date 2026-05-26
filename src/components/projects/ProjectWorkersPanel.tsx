'use client';

import type { ProjectWithDetails } from '@/lib/types';
import { UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddProjectMember, useRemoveProjectMember } from '@/lib/hooks/useProjects';
import { useUserList } from '@/lib/hooks/useUsers';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

interface Props {
  project: ProjectWithDetails;
}

export function ProjectWorkersPanel({ project }: Props) {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';
  const [adding, setAdding] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const addMember = useAddProjectMember(project.id);
  const removeMember = useRemoveProjectMember(project.id);
  const { data: allUsers } = useUserList();

  const workers = (project.members ?? []).filter(
    (m) => m.user?.role === 'worker' || m.user?.role === 'project_manager',
  );

  const memberUserIds = new Set((project.members ?? []).map((m) => m.userId));
  const availableWorkers = (allUsers?.items ?? []).filter(
    (u) => (u.role === 'worker' || u.role === 'project_manager') && !memberUserIds.has(u.id),
  );

  const handleAdd = async () => {
    if (!selectedUserId) return;
    await addMember.mutateAsync({ userId: selectedUserId, role: 'member' });
    setSelectedUserId('');
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{t('projects.workers')}</CardTitle>
        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={() => setAdding(!adding)}>
            <UserPlus className="mr-1 h-4 w-4" />
            {t('projects.addWorker')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {adding && isAdmin && (
          <div className="flex gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select worker…</option>
              {availableWorkers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleAdd} disabled={!selectedUserId || addMember.isPending}>
              {t('common.add')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        )}

        {workers.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('projects.noWorkers')}</p>
        ) : (
          <ul className="space-y-1">
            {workers.map((m) => (
              <li key={m.userId} className="flex items-center justify-between py-1">
                <div>
                  <span className="text-sm font-medium">{m.user?.username ?? m.userId}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{m.user?.role}</span>
                </div>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => removeMember.mutateAsync(m.userId)}
                    disabled={removeMember.isPending}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
