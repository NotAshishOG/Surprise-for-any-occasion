export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';
import { Prisma } from '@prisma/client';

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  
  const currentPage = parseInt(page || '1', 10);
  const take = 50;
  const skip = (currentPage - 1) * take;

  const where: Prisma.ContactMessageWhereInput = {};
  
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { subject: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [messages, totalCount] = await Promise.all([
    db.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    db.contactMessage.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Contact Messages
          </h1>
          <p className="text-zinc-400">Support inquiries and messages.</p>
        </div>
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Search messages..." 
                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors hidden sm:block">
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
                <th className="px-6 py-4 font-medium">Sender</th>
                <th className="px-6 py-4 font-medium">Message Details</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 align-top w-64">
                      <div className="font-medium text-zinc-200">{msg.name}</div>
                      <div className="text-xs mt-1 text-zinc-400">{msg.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-300 mb-1">{msg.subject}</div>
                      <div className="text-zinc-500 line-clamp-2">{msg.message}</div>
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div className="text-zinc-300">
                        {format(new Date(msg.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {format(new Date(msg.createdAt), 'HH:mm')}
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
                href={`/admin/contact?page=${Math.max(1, currentPage - 1)}${q ? `&q=${q}`:''}`}
                className={`px-3 py-1 border border-zinc-700 rounded bg-zinc-800 text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-700'}`}
              >
                Prev
              </Link>
              <Link 
                href={`/admin/contact?page=${Math.min(totalPages, currentPage + 1)}${q ? `&q=${q}`:''}`}
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

