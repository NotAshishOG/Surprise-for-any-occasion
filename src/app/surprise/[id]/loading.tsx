import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function LoadingSurprise() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {/* Outer wrapper mimicking the card wrapper shape */}
      <div className="relative w-full max-w-3xl min-h-[70vh] bg-white border-[6px] border-black rounded-[24px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-6 md:p-12 z-10 overflow-hidden">
        
        {/* Decorative Tape Skeleton */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-gray-200 border-2 border-black rotate-[-2deg]" />
        
        {/* Center envelope skeleton */}
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md">
          <Skeleton className="w-64 h-48 md:w-80 md:h-60 rounded-xl" />
          <Skeleton className="w-48 h-12 rounded-full" />
        </div>
        
        {/* Corner decorative skeletons */}
        <div className="absolute top-4 right-4 md:-right-8 md:-top-8 hidden md:block">
           <Skeleton className="w-20 h-20 rounded-full" />
        </div>
      </div>
    </main>
  );
}
