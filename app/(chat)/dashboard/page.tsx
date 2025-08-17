import { auth } from '@/lib/auth-utils';
import { redirect, notFound } from 'next/navigation';
import { guestRegex } from '@/lib/constants';
import { GuestRegistrationPrompt } from '@/components/guest-registration-prompt';
import { SystemHealth } from '@/components/system-health';
import { isAdmin } from '@/lib/admin-utils';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  // Check if user is guest
  const isGuest = guestRegex.test(session.user?.email ?? '') || session.user?.type === 'guest';
  
  // Show registration prompt for guests
  if (isGuest) {
    return <GuestRegistrationPrompt />;
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Sistem durumu ve istatistikleri
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SystemHealth />
        
        {/* Future sections can be added here */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Kullanım İstatistikleri</h3>
          <p className="text-sm text-muted-foreground">Yakında eklenecek...</p>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">Son Aktiviteler</h3>
          <p className="text-sm text-muted-foreground">Yakında eklenecek...</p>
        </div>
      </div>
    </div>
  );
}
