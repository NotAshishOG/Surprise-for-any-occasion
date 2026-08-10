export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, Clock, FileImage, MoreVertical, Search } from 'lucide-react';
import { SurpriseStatus, Prisma } from '@prisma/client';

export default async function AdminSurprisesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page } = await searchParams;
  
  const currentPage = parseInt(page || '1', 10);
  const take = 20;
  const skip = (currentPage - 1) * take;

  const where: Prisma.SurpriseWhereInput = {};
  
  if (q) {
    where.OR = [
      { slug: { contains: q, mode: 'insensitive' } },
      { senderName: { contains: q, mode: 'insensitive' } },
      { customNickname: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (status && status !== 'ALL') {
    where.status = status as SurpriseStatus;
  }

  const [surprises, totalCount] = await Promise.all([
    db.surprise.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        _count: {
          select: { media: true, leads: true }
        }
      }
    }),
    db.surprise.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Surprises</h1>
          <p className="text-zinc-400">Manage and monitor all created cards.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* We will implement a client-side search component later if needed, for now just basic UI */}
          <form className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Search slug or name..." 
                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
            <select 
              name="status"
              defaultValue={status || 'ALL'}
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="REMOVED">Deleted</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors">
              Filter
            </button>
          </form>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Card Info</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Stats</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surprises.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No surprises found.
                  </td>
                </tr>
              ) : (
                surprises.map((surprise) => (
                  <tr key={surprise.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-200">{surprise.senderName} → {surprise.recipientNickname}</div>
                      <div className="text-xs mt-1 text-zinc-500">/{surprise.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        surprise.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        surprise.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {surprise.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1" title="Views"><Eye className="w-3.5 h-3.5" /> {surprise.viewCount}</span>
                        <span className="flex items-center gap-1" title="Media"><FileImage className="w-3.5 h-3.5" /> {surprise._count.media}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(surprise.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/surprises/${surprise.id}`}
                        className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <span className="sr-only">View Details</span>
                        <MoreVertical className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-sm text-zinc-500">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Link 
                href={`/admin/surprises?page=${Math.max(1, currentPage - 1)}${q ? `&q=${q}`:''}${status ? `&status=${status}`:''}`}
                className={`px-3 py-1 border border-zinc-700 rounded bg-zinc-800 text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-700'}`}
              >
                Prev
              </Link>
              <Link 
                href={`/admin/surprises?page=${Math.min(totalPages, currentPage + 1)}${q ? `&q=${q}`:''}${status ? `&status=${status}`:''}`}
                className={`px-3 py-1 border border-zinc-700 rounded bg-zinc-800 text-sm ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-700'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

