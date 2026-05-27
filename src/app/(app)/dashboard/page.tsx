import { Activity, CheckCircle2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Operational overview</p>
      </header>
      <section className="grid grid-cols-2 gap-3">
        <StatTile label="Visits today" value="—" icon={CheckCircle2} />
        <StatTile label="Active workers" value="—" icon={Users} />
        <StatTile label="Missed visits" value="—" icon={Activity} />
      </section>
    </div>
  );
}
