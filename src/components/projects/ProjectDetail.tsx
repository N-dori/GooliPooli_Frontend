'use client';

import type { ProjectWithDetails } from '@/lib/types';
import { useVisitsByMonth } from '@/lib/hooks/useVisits';
import { ProjectClientsPanel } from './ProjectClientsPanel';
import { ProjectHeader } from './ProjectHeader';
import { ProjectWorkDaysPanel } from './ProjectWorkDaysPanel';
import { ProjectWorkersPanel } from './ProjectWorkersPanel';

interface Props {
  project: ProjectWithDetails;
}

export function ProjectDetail({ project }: Props) {
  const now = new Date();
  // Fetch current + next month's visits to get work days list
  const { data: visitsData } = useVisitsByMonth(now.getFullYear(), now.getMonth() + 1);

  const projectVisits = (visitsData?.items ?? []).filter((v) => v.projectId === project.id);
  const workDates = Array.from(
    new Set(projectVisits.map((v) => v.scheduledDate.slice(0, 10))),
  ).sort();

  return (
    <article className="space-y-5">
      <ProjectHeader project={project} />
      <ProjectWorkersPanel project={project} />
      <ProjectClientsPanel project={project} />
      <ProjectWorkDaysPanel project={project} workDates={workDates} />
    </article>
  );
}
