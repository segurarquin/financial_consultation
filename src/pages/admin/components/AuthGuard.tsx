import { Navigate } from 'react-router-dom';

const AUTH_KEY = 'confinlex_admin_auth';

export function isAdminAuthenticated(): boolean {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return false;
  try {
    const data = JSON.parse(stored);
    return data.authenticated === true && !!data.name;
  } catch {
    return false;
  }
}

export function getAdminName(): string {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return '';
  try {
    const data = JSON.parse(stored);
    return data.name || '';
  } catch {
    return '';
  }
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function adminLogin(id: string, name: string): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ authenticated: true, id, name }));
}

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}