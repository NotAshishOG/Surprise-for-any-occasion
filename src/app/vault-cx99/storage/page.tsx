export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { Database, Image as ImageIcon, Music } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { StorageActions } from '@/components/admin/StorageActions';

export default async function AdminStoragePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const take = 40;
  const skip = (currentPage - 1) * take;

  const [mediaAssets, totalCount, stats] = await Promise.all([
    db.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { surprise: { select: { slug: true } } }
    }),
    db.mediaAsset.count(),
    db.mediaAsset.aggregate({
      _sum: { sizeBytes: true },
    })
  ]);

  const totalStorageBytes = stats._sum.sizeBytes || 0;
  const totalStorageMB = (totalStorageBytes / 1024 / 1024).toFixed(2);
  const totalStorageGB = (totalStorageBytes / 1024 / 1024 / 1024).toFixed(2);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            Storage & Media
          </h1>
          <p className="text-zinc-400">Manage uploaded images and audio.</p>
        </div>
        <StorageActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2">
            <Database className="w-4 h-4" /> Total Storage Used
          </div>
          <div className="text-2xl font-bold">{totalStorageGB > '1' ? `${totalStorageGB} GB` : `${totalStorageMB} MB`}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Total Files
          </div>
          <div className="text-2xl font-bold">{totalCount}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2">
            <Database className="w-4 h-4" /> Storage Limit
          </div>
          <div className="text-2xl font-bold">5.00 GB</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaAssets.map((asset) => (
            <div key={asset.id} className="group relative aspect-square bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
              {asset.role === 'AUDIO' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                  <Music className="w-8 h-8 mb-2" />
                  <span className="text-xs">Audio</span>
                </div>
              ) : (
                <Image src={asset.url} alt={asset.role} fill className="object-cover" />
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <div className="text-xs text-white font-medium truncate mb-1">{asset.role}</div>
                <div className="text-xs text-zinc-300">{(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB</div>
                <Link href={`/admin/surprises/${asset.surpriseId}`} className="text-xs text-blue-400 hover:underline mt-1 truncate">
                  /{asset.surprise?.slug || 'orphan'}
                </Link>
                <a href={asset.url} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 bg-zinc-800/80 rounded-md text-white hover:bg-zinc-700">
                  <ImageIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {totalCount === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No media files found.
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-sm text-zinc-500">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Link 
                href={`/admin/storage?page=${Math.max(1, currentPage - 1)}`}
                className={`px-3 py-1 border border-zinc-700 rounded bg-zinc-800 text-sm ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-700'}`}
              >
                Prev
              </Link>
              <Link 
                href={`/admin/storage?page=${Math.min(totalPages, currentPage + 1)}`}
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

