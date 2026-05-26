'use client';

import type { Project } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="transition-colors hover:bg-accent/40">
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{project.name}</p>
              <StatusBadge status={project.status} />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Code <span className="font-mono">{project.code}</span>
              {project.description ? ` · ${project.description.slice(0, 60)}` : ''}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
