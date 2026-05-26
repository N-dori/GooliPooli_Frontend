'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils';

interface Props {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export function UserAvatar({ size = 36, className, onClick }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?';

  const handleClick = onClick ?? (() => router.push('/profile'));

  return (
    <button
      onClick={handleClick}
      aria-label="Profile"
      className={cn(
        'flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-80',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.33 }}
    >
      {user?.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </button>
  );
}
