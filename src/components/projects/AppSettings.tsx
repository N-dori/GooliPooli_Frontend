'use client';

import type { Project, UpdateProjectInput } from '@/lib/types';
import { ProjectStatus, UpdateProjectSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppProject, useUpdateProject } from '@/lib/hooks/useProjects';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

function SettingsForm({ project }: { project: Project }) {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';
  const updateMutation = useUpdateProject(project.id);

  const form = useForm<UpdateProjectInput>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? '',
      status: project.status,
    },
  });

  useEffect(() => {
    form.reset({
      name: project.name,
      description: project.description ?? '',
      status: project.status,
    });
  }, [project.id, project.name, project.description, project.status, form]);

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        await updateMutation.mutateAsync(data);
      })}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">{t('projects.name')}</Label>
        <Input id="name" disabled={!isAdmin} {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">{t('projects.description')}</Label>
        <Input id="description" disabled={!isAdmin} {...form.register('description')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">{t('projects.status')}</Label>
        <select
          id="status"
          disabled={!isAdmin}
          {...form.register('status')}
          className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
        >
          {ProjectStatus.options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? t('common.saving') : t('common.save')}
        </Button>
      )}
    </form>
  );
}

export function AppSettings() {
  const { t } = useLocale();
  const { data, isLoading, error } = useAppProject();

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t('projects.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('projects.appInstanceHint')}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('projects.appInstance')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
          {data ? (
            <SettingsForm project={data} />
          ) : (
            !isLoading && (
              <p className="text-sm text-muted-foreground">{t('projects.noInstance')}</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
