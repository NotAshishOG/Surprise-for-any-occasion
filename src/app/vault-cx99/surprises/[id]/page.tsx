export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Eye, Clock, Hash, Globe, Image as ImageIcon, Music, Database } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { SurpriseDetailActions } from '@/components/admin/SurpriseDetailActions';

export default async function SurpriseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const surprise = await db.surprise.findUnique({
    where: { id },
    include: {
      media: { orderBy: { position: 'asc' } },
      leads: true,
      reports: true
    }
  });

  if (!surprise) return notFound();

  const heroImage = surprise.media.find(m => m.role === 'HERO');
  const polaroid = surprise.media.find(m => m.role === 'POLAROID');
  const extraImages = surprise.media.filter(m => m.role === 'EXTRA');
  
  const totalStorage = surprise.media.reduce((acc, m) => acc + m.sizeBytes, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/surprises" className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Card Details
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                surprise.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                surprise.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {surprise.status}
              </span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">/{surprise.slug}</p>
          </div>
        </div>
        <div className="sm:ml-auto flex flex-wrap items-center gap-3">
          <a href={`/surprise/${surprise.id}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
            Open Public Page
          </a>
          <SurpriseDetailActions surpriseId={surprise.id} currentStatus={surprise.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Core Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            {heroImage ? (
              <div className="w-full h-64 relative bg-zinc-950">
                <Image src={heroImage.url} alt="Hero" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              </div>
            ) : (
              <div className="w-full h-32 bg-zinc-800/50 flex items-center justify-center text-zinc-500">
                No Hero Image
              </div>
            )}
            
            <div className="p-6 relative -mt-16">
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-4">Content</h2>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="block text-zinc-500 mb-1">Occasion</span>
                    <span className="font-medium text-white">{surprise.occasion === 'CUSTOM' ? surprise.customOccasion : surprise.occasion}</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 mb-1">Sender</span>
                    <span className="font-medium text-white">{surprise.senderName}</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 mb-1">Recipient</span>
                    <span className="font-medium text-white">{surprise.recipientNickname === 'OTHER' ? surprise.customNickname : surprise.recipientNickname}</span>
                  </div>
                  <div>
                    <span className="block text-zinc-500 mb-1">Music</span>
                    <span className="font-medium text-white flex items-center gap-2">
                      {surprise.musicType === 'YOUTUBE' ? <><Globe className="w-4 h-4"/> YouTube</> : surprise.musicType === 'UPLOAD' ? <><Music className="w-4 h-4"/> Uploaded</> : 'None'}
                    </span>
                  </div>
                  <div className="col-span-2 mt-2">
                    <span className="block text-zinc-500 mb-2">Message</span>
                    <div className="p-4 bg-zinc-900/50 rounded-lg text-zinc-300 italic whitespace-pre-wrap">
                      &quot;{surprise.message}&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Media Gallery ({surprise.media.length})</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {polaroid && (
                <div className="group relative aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                  <Image src={polaroid.url} alt="Polaroid" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/70 backdrop-blur text-xs">
                    <span className="text-blue-400 font-bold block mb-1">POLAROID</span>
                    {surprise.polaroidCaption || 'No caption'}
                  </div>
                </div>
              )}
              {extraImages.map(img => (
                <div key={img.id} className="group relative aspect-square bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                  <Image src={img.url} alt="Extra" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/70 backdrop-blur text-xs">
                    <span className="text-zinc-400 block font-semibold mb-1">EXTRA</span>
                    {(img.sizeBytes / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Meta Data */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm text-sm">
            <h2 className="text-lg font-bold mb-4">Metadata</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 flex items-center gap-2"><Eye className="w-4 h-4"/> Views</span>
                <span className="font-medium text-white">{surprise.viewCount}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 flex items-center gap-2"><Clock className="w-4 h-4"/> Created</span>
                <span className="text-white">{format(new Date(surprise.createdAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500 flex items-center gap-2"><Database className="w-4 h-4"/> Storage</span>
                <span className="text-white">{(totalStorage / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="py-2">
                <span className="block text-zinc-500 flex items-center gap-2 mb-1"><Hash className="w-4 h-4"/> Creator IP Hash</span>
                <code className="text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-zinc-400 break-all">{surprise.creatorIpHash}</code>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm text-sm">
            <h2 className="text-lg font-bold mb-4">Lead Data</h2>
            {surprise.leads.length > 0 ? (
              <div className="space-y-3">
                {surprise.leads.map(lead => (
                  <div key={lead.id} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div className="font-medium text-white mb-1">{lead.name}</div>
                    <div className="text-zinc-400">{lead.email}</div>
                    <div className="text-zinc-400">{lead.phone}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 italic">No lead data collected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
