'use client';

import { useState } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SystemSettingsData {
  websiteName: string;
  supportEmail: string;
  autoDeleteEnabled: boolean;
  leadCollectionEnabled: boolean;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  maxUploadSizeMb: number;
  maxHeroImages: number;
  maxPolaroidImages: number;
  maxBalloons: number;
  maxExtraImages: number;
  maxAudio: number;
}

export function SettingsForm({ initialSettings }: { initialSettings: SystemSettingsData }) {
  const [formData, setFormData] = useState<SystemSettingsData>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Settings updated successfully!' });
        router.refresh();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch (_err) {
      setStatusMessage({ type: 'error', text: 'Network error while saving settings.' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 space-y-8">
        
        {statusMessage && (
          <div className={`p-4 rounded-lg flex items-center gap-3 border text-sm ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* General */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 text-white">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Website Name</label>
              <input 
                type="text" 
                name="websiteName"
                value={formData.websiteName}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Support Email</label>
              <input 
                type="email" 
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Features & Controls */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 text-white">Features & Operations</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-colors">
              <input 
                type="checkbox" 
                name="autoDeleteEnabled"
                checked={formData.autoDeleteEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-950" 
              />
              <div>
                <div className="font-medium text-white text-sm">24 Hour Auto-Delete</div>
                <div className="text-xs text-zinc-500 mt-0.5">Automatically cleanup media files for unpublished drafts older than 24 hours.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-colors">
              <input 
                type="checkbox" 
                name="leadCollectionEnabled"
                checked={formData.leadCollectionEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-950" 
              />
              <div>
                <div className="font-medium text-white text-sm">Lead Collection</div>
                <div className="text-xs text-zinc-500 mt-0.5">Prompt users for contact details before generating shareable surprise link.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-colors">
              <input 
                type="checkbox" 
                name="analyticsEnabled"
                checked={formData.analyticsEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-950" 
              />
              <div>
                <div className="font-medium text-white text-sm">Track Card Views</div>
                <div className="text-xs text-zinc-500 mt-0.5">Increment view counter when recipients view a published surprise page.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-zinc-950 border border-red-900/40 rounded-lg cursor-pointer hover:border-red-900/60 transition-colors">
              <input 
                type="checkbox" 
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="w-4 h-4 rounded border-red-700 bg-zinc-800 text-red-500 focus:ring-red-500 focus:ring-offset-zinc-950" 
              />
              <div>
                <div className="font-medium text-red-400 text-sm">Maintenance Mode</div>
                <div className="text-xs text-red-500/70 mt-0.5">Disable public creation of new surprise cards.</div>
              </div>
            </label>
          </div>
        </div>

        {/* Upload Limits */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b border-zinc-800 pb-2 text-white">Media & Upload Limits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Max Upload Size (MB)</label>
              <input 
                type="number" 
                name="maxUploadSizeMb"
                value={formData.maxUploadSizeMb}
                onChange={handleChange}
                min="1"
                max="100"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Max Extra Images</label>
              <input 
                type="number" 
                name="maxExtraImages"
                value={formData.maxExtraImages}
                onChange={handleChange}
                min="1"
                max="20"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Max Balloons</label>
              <input 
                type="number" 
                name="maxBalloons"
                value={formData.maxBalloons}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end">
        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
