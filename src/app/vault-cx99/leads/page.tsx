export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { Users, Search, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Prisma } from '@prisma/client';

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  
  const currentPage = parseInt(page || '1', 10);
  const take = 50;
  const skip = (currentPage - 1) * take;

  const where: Prisma.LeadWhereInput = {};
  
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [leads, totalCount] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        surprise: { select: { slug: true, occasion: true, status: true } }
      }
    }),
    db.lead.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Leads
          </h1>
          <p className="text-zinc-400">Manage collected contact information.</p>
        </div>
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Search name, email, phone..." 
                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors hidden sm:block">
              Filter
            </button>
          </form>
          <a href="/api/admin/export/leads" className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Contact Details</th>
                <th className="px-6 py-4 font-medium">Surprise</th>
                <th className="px-6 py-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-200">{lead.name}</div>
                      <div className="text-xs mt-1 text-zinc-400">{lead.email}</div>
                      <div className="text-xs mt-1 text-zinc-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.surprise ? (
                        <div>
                          <div className="font-medium text-zinc-300">{lead.surprise.occasion}</div>
                          <Link href={`/admin/surprises/${lead.cardId}`} className="text-xs mt-1 text-blue-400 hover:underline flex items-center gap-1">
                            /{lead.surprise.slug} <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic">Deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-300">
                        {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {format(new Date(lead.createdAt), 'HH:mm')}
                      </div>
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
                href={`/admin/leads?page=${Math.max(1, currentPage - 1)}${q ? `&q=${q}`:''}`}
                className={`px-3 py-1 border border-zinc-700 rounded bg-zinc-800 text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-700'}`}
              >
                Prev
              </Link>
              <Link 
                href={`/admin/leads?page=${Math.min(totalPages, currentPage + 1)}${q ? `&q=${q}`:''}`}
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

