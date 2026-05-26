'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMe } from '@/lib/hooks/useAuth';

export default function ProfilePage() {
  const { data: user } = useMe();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Username: </span>
            {user?.username ?? '—'}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {user?.email ?? '—'}
          </p>
          <p>
            <span className="text-muted-foreground">Role: </span>
            {user?.role ?? '—'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
