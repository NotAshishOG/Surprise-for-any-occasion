'use client';

import { useState } from 'react';
import { Check, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ReportActions({ reportId, surpriseId }: { reportId: string; surpriseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: 'DISMISS' | 'DELETE_CARD') => {
    const confirmMsg = action === 'DISMISS' 
      ? 'Dismiss this report and mark card as safe?' 
      : 'Delete this card and mark status as REMOVED?';
    
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reportId, surpriseId })
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (_err) {
      alert('Network error while processing report action.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => handleAction('DISMISS')}
        disabled={loading}
        className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 rounded-lg transition-colors" 
        title="Mark as safe (Dismiss)"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      </button>
      <button 
        onClick={() => handleAction('DELETE_CARD')}
        disabled={loading}
        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 rounded-lg transition-colors" 
        title="Delete/Remove Card"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
