'use client';

import type { Project } from '@/lib/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          Project code <span className="font-mono">{project.code}</span>
        </p>
        {project.description && <p className="text-sm">{project.description}</p>}
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Client list coming next — wired through <code>/api/v1/projects/:id/clients</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Maintenance calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Weekly view shows scheduled vs completed visits with DONE / OPEN color indicators.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Assigned worker list with per-worker completion metrics.
          </p>
        </CardContent>
      </Card>
    </article>
  );
}
