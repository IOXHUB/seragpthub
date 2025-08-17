import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="flex size-full items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <ShieldAlert className="size-24 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">403</h1>
          <h2 className="text-xl font-semibold">Erişim Reddedildi</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Bu sayfaya erişim yetkiniz bulunmamaktadır. 
            Admin Dashboard sadece yönetici kullanıcılar tarafından görüntülenebilir.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              Ana Sayfaya Dön
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/login">
              Farklı Hesapla Giriş Yap
            </Link>
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Yönetici erişimi için lütfen sistem yöneticinize başvurun.
        </p>
      </div>
    </div>
  );
}
