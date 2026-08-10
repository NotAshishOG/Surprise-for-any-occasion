'use client';

import { useState } from 'react';
import { Loader2, Trash2, ShieldAlert, CheckCircle, FileEdit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SurpriseDetailActions({ surpriseId, currentStatus }: { surpriseId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/surprises/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHANGE_STATUS', surpriseId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (_err) {
      alert('Network error');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this card and all its uploaded media files? This cannot be undone!')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/surprises/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PERMANENT_DELETE', surpriseId })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/surprises');
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (_err) {
      alert('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {currentStatus !== 'PUBLISHED' && (
        <button
          onClick={() => handleStatusChange('PUBLISHED')}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
          Publish
        </button>
      )}

      {currentStatus !== 'DRAFT' && (
        <button
          onClick={() => handleStatusChange('DRAFT')}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg text-xs font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileEdit className="w-3.5 h-3.5" />}
          Mark Draft
        </button>
      )}

      {currentStatus !== 'REMOVED' && (
        <button
          onClick={() => handleStatusChange('REMOVED')}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 rounded-lg text-xs font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          Soft Delete
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors"
        title="Permanently remove card & files"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Delete Permanently
      </button>
    </div>
  );
}
