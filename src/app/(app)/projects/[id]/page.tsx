'use client';

import { useParams } from 'next/navigation';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { useProject } from '@/lib/hooks/useProjects';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useProject(params.id);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (!data) return null;
  return <ProjectDetail project={data} />;
}
