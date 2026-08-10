'use client';

import { useState } from 'react';
import { Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function StorageActions() {
  const [cleaning, setCleaning] = useState(false);
  const [purging, setPurging] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleClean = async () => {
    if (!confirm('Are you sure you want to clean up media older than 24 hours?')) return;
    setCleaning(true);
    setMessage('');
    try {
      const res = await fetch('/api/jobs/cleanup');
      const data = await res.json();
      if (data.success) {
        setMessage(`Cleaned ${data.deletedMedia} media files.`);
        router.refresh();
      } else {
        setMessage(data.error || data.message || 'Cleanup failed.');
      }
    } catch (err) {
      setMessage('An error occurred during cleanup.');
    }
    setCleaning(false);
  };

  const handlePurge = async () => {
    if (!confirm('Are you sure you want to purge expired/removed cards and their media?')) return;
    setPurging(true);
    setMessage('');
    try {
      const res = await fetch('/api/jobs/purge');
      const data = await res.json();
      if (data.success) {
        setMessage(`Purged ${data.purgedCards} cards and their media.`);
        router.refresh();
      } else {
        setMessage(data.error || 'Purge failed.');
      }
    } catch (err) {
      setMessage('An error occurred during purge.');
    }
    setPurging(false);
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button 
          onClick={handleClean}
          disabled={cleaning || purging}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 rounded-lg text-sm transition-colors"
        >
          {cleaning ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Clean Old Media
        </button>
        <button 
          onClick={handlePurge}
          disabled={cleaning || purging}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          {purging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Purge Expired Cards
        </button>
      </div>
      {message && (
        <div className="text-xs text-zinc-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {message}
        </div>
      )}
    </div>
  );
}
