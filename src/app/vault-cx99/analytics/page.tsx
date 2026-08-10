export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { BarChart, TrendingUp, Eye, Users, Gift, Database } from 'lucide-react';
import Link from 'next/link';
import DashboardCharts from '../DashboardCharts';

export default async function AdminAnalyticsPage() {
  const [
    totalSurprises,
    publishedCount,
    draftCount,
    removedCount,
    totalViewsResult,
    totalLeads,
    topSurprises,
    totalMediaStats
  ] = await Promise.all([
    db.surprise.count(),
    db.surprise.count({ where: { status: 'PUBLISHED' } }),
    db.surprise.count({ where: { status: 'DRAFT' } }),
    db.surprise.count({ where: { status: 'REMOVED' } }),
    db.surprise.aggregate({ _sum: { viewCount: true } }),
    db.lead.count(),
    db.surprise.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
      select: { id: true, slug: true, senderName: true, recipientNickname: true, viewCount: true, status: true, createdAt: true }
    }),
    db.mediaAsset.aggregate({ _sum: { sizeBytes: true }, _count: true })
  ]);

  const totalViews = totalViewsResult._sum.viewCount || 0;
  const avgViews = publishedCount > 0 ? (totalViews / publishedCount).toFixed(1) : '0';
  const totalMB = ((totalMediaStats._sum.sizeBytes || 0) / 1024 / 1024).toFixed(2);

  // Daily Creations (Last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const chartData = await Promise.all(
    last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const count = await db.surprise.count({
        where: { createdAt: { gte: date, lt: nextDay } }
      });
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        creations: count
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart className="w-6 h-6 text-purple-400" />
          Analytics & Performance
        </h1>
        <p className="text-zinc-400">Detailed insights into surprise card creations, views, and engagement.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold">{totalViews}</div>
          <div className="text-xs text-zinc-500 mt-2">Avg {avgViews} views per published card</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Published Cards</span>
            <Gift className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{publishedCount}</div>
          <div className="text-xs text-zinc-500 mt-2">{draftCount} drafts • {removedCount} deleted</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Total Leads</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">{totalLeads}</div>
          <div className="text-xs text-zinc-500 mt-2">{publishedCount > 0 ? `${((totalLeads / publishedCount) * 100).toFixed(1)}% conversion rate` : '0%'}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Media Storage</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400">{totalMB} MB</div>
          <div className="text-xs text-zinc-500 mt-2">{totalMediaStats._count} total uploaded files</div>
        </div>
      </div>

      {/* Chart */}
      <DashboardCharts data={chartData} />

      {/* Top Cards Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Most Viewed Cards
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3 font-medium">Card Slug</th>
                <th className="px-6 py-3 font-medium">Sender</th>
                <th className="px-6 py-3 font-medium">Recipient</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {topSurprises.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No card activity yet.</td>
                </tr>
              ) : (
                topSurprises.map((card) => (
                  <tr key={card.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/admin/surprises/${card.id}`} className="font-medium text-blue-400 hover:underline">
                        /{card.slug}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-zinc-200">{card.senderName}</td>
                    <td className="px-6 py-3 text-zinc-300">{card.recipientNickname}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        card.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        card.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-white">{card.viewCount}</td>
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
