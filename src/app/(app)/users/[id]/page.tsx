'use client';

import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserForm } from '@/components/users/UserForm';
import { useUser } from '@/lib/hooks/useUsers';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useUser(id);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Username: </span>
            {data.username}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {data.email}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-muted-foreground">Role: </span>
            <Badge variant="secondary">{data.role}</Badge>
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-base font-semibold">Edit User</h2>
        <UserForm user={data} />
      </div>
    </div>
  );
}
