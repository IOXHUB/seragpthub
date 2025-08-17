import type { Session } from 'next-auth';

/**
 * Admin email listesi - bu kullanıcılar otomatik olarak admin haklarına sahip olur
 */
const ADMIN_EMAILS = [
  'admin@seragpt.com',
  'volkan@seragpt.com',
  // Buraya başka admin email'leri eklenebilir
];

/**
 * Kullanıcının admin olup olmadığını kontrol eder
 */
export function isAdmin(session: Session | null): boolean {
  if (!session?.user?.email) {
    return false;
  }

  // Admin email listesinde mi?
  if (ADMIN_EMAILS.includes(session.user.email)) {
    return true;
  }

  // User type admin mi?
  if (session.user.type === 'admin') {
    return true;
  }

  return false;
}

/**
 * Session'dan user type'ı belirler (admin email'leri için admin type döner)
 */
export function getUserType(email: string): 'regular' | 'admin' {
  if (ADMIN_EMAILS.includes(email)) {
    return 'admin';
  }
  return 'regular';
}
