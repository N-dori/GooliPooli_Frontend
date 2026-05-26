'use client';

import type { PublicUser } from '@/lib/types';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { UserRow } from './UserRow';

interface Props {
  users: PublicUser[];
}

export function UserList({ users }: Props) {
  const { t } = useLocale();
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('users.noUsers')}</p>;
  }
  return (
    <ul className="divide-y rounded-xl border bg-card px-4">
      {users.map((u) => (
        <UserRow key={u.id} user={u} />
      ))}
    </ul>
  );
}
