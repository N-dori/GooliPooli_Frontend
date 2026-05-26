import type { ProjectStatus, VisitStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type AnyStatus = ProjectStatus | VisitStatus;

const STATUS_VARIANTS: Record<AnyStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  active: 'success',
  paused: 'warning',
  archived: 'secondary',
  done: 'success',
  scheduled: 'secondary',
  in_progress: 'warning',
  completed: 'success',
  missed: 'destructive',
  cancelled: 'outline',
};

const STATUS_LABEL: Record<AnyStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
  done: 'Done',
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  missed: 'Missed',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }: { status: AnyStatus }) {
  return <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABEL[status]}</Badge>;
}
