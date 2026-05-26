'use client';

import type { ProjectWithDetails, UpdateProjectInput } from '@/lib/types';
import { ProjectStatus } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDeleteProject, useUpdateProject } from '@/lib/hooks/useProjects';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

interface Props {
  project: ProjectWithDetails;
}

export function ProjectHeader({ project }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(project.name);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateMutation = useUpdateProject(project.id);
  const deleteMutation = useDeleteProject();

  const handleNameSave = async () => {
    if (nameValue.trim() && nameValue !== project.name) {
      await updateMutation.mutateAsync({ name: nameValue.trim() } as UpdateProjectInput);
    }
    setEditing(false);
  };

  const handleStatusChange = async (status: string) => {
    await updateMutation.mutateAsync({ status: status as UpdateProjectInput['status'] });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(project.id);
    router.push('/projects');
  };

  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        {isAdmin && editing ? (
          <div className="flex items-center gap-2">
            <Input
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              autoFocus
              className="text-xl font-semibold"
            />
          </div>
        ) : (
          <h1
            className={`text-2xl font-semibold tracking-tight ${isAdmin ? 'cursor-pointer hover:underline' : ''}`}
            onClick={() => isAdmin && setEditing(true)}
          >
            {project.name}
          </h1>
        )}

        <div className="mt-1 flex items-center gap-2">
          {isAdmin ? (
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-md border bg-background px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {ProjectStatus.options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <StatusBadge status={project.status} />
          )}
          <span className="text-xs text-muted-foreground font-mono">{project.code}</span>
        </div>
      </div>

      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={t('common.confirm')}
        description={t('projects.deleteConfirm')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleteMutation.isPending}
      />
    </header>
  );
}
