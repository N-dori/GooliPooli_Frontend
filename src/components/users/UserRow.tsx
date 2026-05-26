'use client';

import type { PublicUser } from '@/lib/types';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDeleteUser } from '@/lib/hooks/useUsers';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

const ROLE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  project_manager: 'secondary',
  worker: 'outline',
};

interface Props {
  user: PublicUser;
}

export function UserRow({ user }: Props) {
  const { t } = useLocale();
  const currentUser = useAuthStore((s) => s.user);
  const deleteMutation = useDeleteUser();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isSelf = currentUser?.id === user.id;

  const initials = user.username.slice(0, 2).toUpperCase();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(user.id);
    setConfirmOpen(false);
  };

  return (
    <>
      <li className="flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={ROLE_VARIANT[user.role] ?? 'outline'}>{user.role}</Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/users/${user.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          {!isSelf && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </li>

      <ConfirmDialog
        open={confirmOpen}
        title={t('common.confirm')}
        description={t('users.deleteConfirm')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
