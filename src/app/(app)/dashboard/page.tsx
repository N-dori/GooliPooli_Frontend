'use client';

import { Activity, CheckCircle2, FolderKanban, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useProjectList } from '@/lib/hooks/useProjects';

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Activity;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-md bg-accent p-2 text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data } = useProjectList(1, 5);
  const total = data?.total ?? 0;
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Operational overview</p>
      </header>
      <section className="grid grid-cols-2 gap-3">
        <StatTile label="Projects" value={total} icon={FolderKanban} />
        <StatTile label="Visits today" value="—" icon={CheckCircle2} />
        <StatTile label="Active workers" value="—" icon={Users} />
        <StatTile label="Missed visits" value="—" icon={Activity} />
      </section>
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Recent projects</h2>
        <div className="space-y-2">
          {(data?.items ?? []).map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Code {p.code}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {data && data.items.length === 0 && (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
