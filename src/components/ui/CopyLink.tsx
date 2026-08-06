"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 w-full max-w-md">
      <div className="flex-1 truncate text-sm text-gray-500 px-2 font-mono">
        {fullUrl}
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Copy className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );
}
