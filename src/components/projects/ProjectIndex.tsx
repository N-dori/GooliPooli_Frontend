'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProjectList } from '@/lib/hooks/useProjects';
import { useAuthStore } from '@/lib/stores/authStore';
import { ProjectList } from './ProjectList';

export function ProjectIndex() {
  const [page] = useState(1);
  const role = useAuthStore((s) => s.user?.role);
  const { data, isLoading, error } = useProjectList(page, 20);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.total} total` : 'Loading…'}
          </p>
        </div>
        {role === 'admin' && (
          <Button asChild size="sm">
            <Link href="/projects/new">
              <Plus className="mr-1 h-4 w-4" /> New
            </Link>
          </Button>
        )}
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {data && <ProjectList projects={data.items} />}
    </div>
  );
}
