import AdminLayoutShell from './AdminLayoutShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chatmi Control Center - Admin Portal',
  description: 'Premium Admin Dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}
