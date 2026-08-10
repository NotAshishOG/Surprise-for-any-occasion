export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { Flag, Check, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { ReportActions } from '@/components/admin/ReportActions';

export default async function AdminReportsPage() {
  const reports = await db.report.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      surprise: { select: { slug: true, status: true } }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Flag className="w-6 h-6 text-red-400" />
            Reports
          </h1>
          <p className="text-zinc-400">Review flagged cards and moderate content.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Surprise</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Reporter IP Hash</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/surprises/${report.surpriseId}`} className="font-medium text-blue-400 hover:underline flex items-center gap-1">
                        /{report.surprise.slug} <ExternalLink className="w-3 h-3" />
                      </Link>
                      <div className="text-xs mt-1 text-zinc-500">Status: {report.surprise.status}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {report.reason}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-zinc-500">
                        {report.reporterIpHash}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-zinc-300">
                        {format(new Date(report.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ReportActions reportId={report.id} surpriseId={report.surpriseId} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

