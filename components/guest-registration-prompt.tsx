'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function GuestRegistrationPrompt() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">SeraGPT&apos;ye Hoş Geldiniz! 🤖</CardTitle>
          <CardDescription>
            Sohbet özelliklerini kullanabilmek için ücretsiz bir hesap oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              ✨ Sınırsız sohbet
            </p>
            <p className="flex items-center gap-2">
              🔄 Sohbet geçmişi
            </p>
            <p className="flex items-center gap-2">
              🌙 Tema seçenekleri
            </p>
            <p className="flex items-center gap-2">
              🤖 Çoklu AI model desteği
            </p>
          </div>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/register">
                Ücretsiz Kayıt Ol
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                Zaten hesabım var
              </Link>
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Kayıt olduğunuzda{' '}
            <Link href="#" className="underline">
              Kullanım Şartları
            </Link>{' '}
            ve{' '}
            <Link href="#" className="underline">
              Gizlilik Politikası
            </Link>
            'nı kabul etmiş olursunuz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
