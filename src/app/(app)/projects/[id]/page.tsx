'use client';

import { useParams } from 'next/navigation';
import { ProjectPreview } from '@/components/projects/ProjectPreview';
import { useProject } from '@/lib/hooks/useProjects';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useProject(params.id);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (!data) return null;
  return <ProjectPreview project={data} />;
}
