import { AuthGuard } from '@/components/layout/AuthGuard';
import { BottomNav } from '@/components/layout/BottomNav';
import { TopBar } from '@/components/layout/TopBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen pb-24">
        <TopBar />
        <main className="mx-auto max-w-screen-sm px-4 py-4">{children}</main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
