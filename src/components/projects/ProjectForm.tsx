'use client';

import { CreateProjectSchema, type CreateProjectInput } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateProject } from '@/lib/hooks/useProjects';

export function ProjectForm() {
  const router = useRouter();
  const create = useCreateProject();
  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: { name: '', description: '' },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        const created = await create.mutateAsync(data);
        router.push(`/projects/${created.id}`);
      })}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Project name</Label>
        <Input id="name" placeholder="Sunset Bay Pools" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Optional" {...form.register('description')} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Creating…' : 'Create project'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
