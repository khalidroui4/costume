// Simple admin authentication for static data
// In production, use proper authentication with database

const ADMIN_EMAIL = 'admin@costume-store.com';
const ADMIN_PASSWORD = 'admin123';

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
}

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  return (
    email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('adminUser');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    if (user.email === ADMIN_EMAIL && user.role === 'admin') {
      return user;
    }
  } catch (error) {
    return null;
  }
  
  return null;
}

export function setAdminUser(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adminUser', JSON.stringify(user));
}

export function removeAdminUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('adminUser');
}

export function isAdminLoggedIn(): boolean {
  return getAdminUser() !== null;
}

