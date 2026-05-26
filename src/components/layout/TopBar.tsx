'use client';

import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/stores/authStore';

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
        <Link href="/dashboard" className="text-base font-semibold tracking-tight">
          Golipooli
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
          <Link href="/profile" aria-label="Profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
