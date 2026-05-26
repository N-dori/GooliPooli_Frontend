'use client';

import type { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';

interface Props {
  projects: Project[];
  emptyMessage?: string;
}

export function ProjectList({ projects, emptyMessage = 'No projects yet.' }: Props) {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }
  return (
    <ul className="space-y-2">
      {projects.map((p) => (
        <li key={p.id}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}
