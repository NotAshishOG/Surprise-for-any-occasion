export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsForm } from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  let settings = await db.systemSettings.findUnique({
    where: { id: 'global' }
  });

  if (!settings) {
    settings = await db.systemSettings.create({
      data: { id: 'global' }
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-zinc-400" />
          Settings
        </h1>
        <p className="text-zinc-400">Configure global platform behavior and feature flags.</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
