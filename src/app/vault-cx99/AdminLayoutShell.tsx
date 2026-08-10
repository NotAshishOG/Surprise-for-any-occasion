'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Gift, 
  Users, 
  MessageSquare, 
  BarChart, 
  Database, 
  Flag, 
  Settings, 
  Shield,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CommandPalette } from '@/components/admin/CommandPalette';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  permission?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/vault-cx99', icon: LayoutDashboard },
  { name: 'Surprises', href: '/vault-cx99/surprises', icon: Gift, permission: 'surprises' },
  { name: 'Leads', href: '/vault-cx99/leads', icon: Users, permission: 'leads' },
  { name: 'Contact Messages', href: '/vault-cx99/contact', icon: MessageSquare, permission: 'contact' },
  { name: 'Analytics', href: '/vault-cx99/analytics', icon: BarChart, permission: 'analytics' },
  { name: 'Storage', href: '/vault-cx99/storage', icon: Database, permission: 'storage' },
  { name: 'Reports', href: '/vault-cx99/reports', icon: Flag, permission: 'reports' },
  { name: 'Settings', href: '/vault-cx99/settings', icon: Settings, permission: 'settings' },
  { name: 'Admin Users', href: '/vault-cx99/users', icon: Shield, permission: 'admin_users' },
];

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; username: string; role: string; permissions: string[] } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (_err) {
        // Silently handle if unauthenticated
      }
    };
    if (pathname !== '/vault-cx99/login') {
      fetchUser();
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/vault-cx99/login');
  };

  if (pathname === '/vault-cx99/login') {
    return <>{children}</>;
  }

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true; // Accessible to all logged-in admins (e.g. Dashboard)
    if (!user) return true; // Show until profile loads or default to full
    if (user.role === 'SUPER_ADMIN' || user.permissions?.includes('*')) return true;
    return user.permissions?.includes(item.permission);
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-blue-500/30">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed lg:static top-0 left-0 h-full w-[280px] bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col"
          >
            <div className="h-16 flex items-center px-6 border-b border-zinc-800 justify-between">
              <Link href="/vault-cx99" className="font-bold text-lg tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                Chatmi Control Center
              </Link>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/vault-cx99');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                      isActive 
                        ? "bg-blue-500/10 text-blue-400" 
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-zinc-800 space-y-3">
              {user && (
                <div className="px-3 py-2 bg-zinc-950/60 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-zinc-400 truncate">@{user.username}</div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {user.role === 'SUPER_ADMIN' ? 'Super' : 'Sub'}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 transition-colors w-64 text-left"
            >
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="ml-auto bg-zinc-800 px-1.5 rounded text-xs">⌘K</kbd>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[10px] text-zinc-400">@{user.username}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow">
                  {user.name ? user.name.charAt(0) : 'A'}
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-medium">
                A
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
