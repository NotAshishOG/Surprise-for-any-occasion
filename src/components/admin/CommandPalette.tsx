'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Home, Users, Database, FileText, Settings, Gift,
  LogOut, MessageSquare, Flag
} from 'lucide-react';
import clsx from 'clsx';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <Command 
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        label="Global Command Menu"
      >
        <div className="px-4 border-b border-zinc-800 flex items-center">
          <Command.Input 
            autoFocus
            placeholder="Type a command or search..." 
            className="w-full bg-transparent text-white placeholder-zinc-500 h-12 focus:outline-none text-sm"
          />
          <button 
            onClick={() => setOpen(false)}
            className="text-xs text-zinc-500 hover:text-white px-2 py-1 bg-zinc-800 rounded"
          >
            ESC
          </button>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700">
          <Command.Empty className="py-6 text-center text-sm text-zinc-500">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="text-xs text-zinc-500 px-2 py-1">
            <CommandItem onSelect={() => runCommand(() => router.push('/admin'))} icon={<Home className="w-4 h-4"/>} title="Dashboard" />
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/surprises'))} icon={<Gift className="w-4 h-4"/>} title="Surprises" />
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/leads'))} icon={<Users className="w-4 h-4"/>} title="Leads" />
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/contact'))} icon={<MessageSquare className="w-4 h-4"/>} title="Contact Messages" />
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/storage'))} icon={<Database className="w-4 h-4"/>} title="Storage" />
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/reports'))} icon={<Flag className="w-4 h-4"/>} title="Reports" />
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/settings'))} icon={<Settings className="w-4 h-4"/>} title="Settings" />
          </Command.Group>

          <Command.Group heading="Actions" className="text-xs text-zinc-500 px-2 py-1 mt-2">
            <CommandItem 
              onSelect={() => runCommand(() => {
                fetch('/api/admin/logout', { method: 'POST' }).then(() => router.push('/admin/login'));
              })} 
              icon={<LogOut className="w-4 h-4 text-red-400"/>} 
              title="Logout" 
            />
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}

function CommandItem({ icon, title, onSelect }: { icon: React.ReactNode, title: string, onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 rounded-md cursor-pointer",
        "aria-selected:bg-zinc-800 aria-selected:text-white"
      )}
    >
      {icon}
      {title}
    </Command.Item>
  );
}
