export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import DashboardCharts from './DashboardCharts';
import { 
  Eye, 
  Gift, 
  Users, 
  MessageSquare,
  FileImage,
  TrendingUp,
  Clock
} from 'lucide-react';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';

export default async function AdminDashboard() {
  const now = new Date();
  
  // Basic Counts
  const [
    totalSurprises,
    publishedSurprises,
    drafts,
    deleted,
    totalViewsResult,
    totalMedia,
    totalLeads,
    totalContacts
  ] = await Promise.all([
    db.surprise.count(),
    db.surprise.count({ where: { status: 'PUBLISHED' } }),
    db.surprise.count({ where: { status: 'DRAFT' } }),
    db.surprise.count({ where: { status: 'REMOVED' } }),
    db.surprise.aggregate({ _sum: { viewCount: true } }),
    db.mediaAsset.count(),
    db.lead.count(),
    db.contactMessage.count()
  ]);

  const totalViews = totalViewsResult._sum.viewCount || 0;
  const avgViews = publishedSurprises > 0 ? (totalViews / publishedSurprises).toFixed(1) : '0';

  // Time-based stats
  const [todayCards, weekCards, monthCards] = await Promise.all([
    db.surprise.count({ where: { createdAt: { gte: startOfDay(now) } } }),
    db.surprise.count({ where: { createdAt: { gte: startOfWeek(now) } } }),
    db.surprise.count({ where: { createdAt: { gte: startOfMonth(now) } } })
  ]);

  // Chart data (Last 7 days creations)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return startOfDay(d);
  }).reverse();

  const chartData = await Promise.all(
    last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const count = await db.surprise.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDay
          }
        }
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
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-400">Monitor your platform&apos;s activity and growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cards" value={totalSurprises} icon={<Gift className="w-4 h-4" />} />
        <StatCard title="Published" value={publishedSurprises} icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard title="Total Views" value={totalViews} icon={<Eye className="w-4 h-4" />} />
        <StatCard title="Avg Views / Card" value={avgViews} icon={<BarChartIcon className="w-4 h-4" />} />
        <StatCard title="Created Today" value={todayCards} icon={<Clock className="w-4 h-4" />} />
        <StatCard title="Total Leads" value={totalLeads} icon={<Users className="w-4 h-4" />} />
        <StatCard title="Media Files" value={totalMedia} icon={<FileImage className="w-4 h-4" />} />
        <StatCard title="Messages" value={totalContacts} icon={<MessageSquare className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Cards Created (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <DashboardCharts data={chartData} />
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
              <span className="text-zinc-400">Drafts</span>
              <span className="font-medium">{drafts}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
              <span className="text-zinc-400">Deleted Cards</span>
              <span className="font-medium">{deleted}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
              <span className="text-zinc-400">Cards this Week</span>
              <span className="font-medium">{weekCards}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-400">Cards this Month</span>
              <span className="font-medium">{monthCards}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between text-zinc-400 mb-4">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

