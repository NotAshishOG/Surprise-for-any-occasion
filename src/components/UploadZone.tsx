"use client";

import { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import { compressImage, isValidImageFile } from "@/lib/imageUtils";
import { Skeleton } from "./ui/Skeleton";

interface UploadZoneProps {
  label: string;
  fallbackText: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export function UploadZone({ label, fallbackText, onFileSelect, accept }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const isAudio = accept?.includes('audio') || file.type.startsWith('audio/');

    if (isAudio) {
      if (!file.type.startsWith('audio/')) {
        alert("Please upload a valid audio file");
        return;
      }
      setIsProcessing(true);
      onFileSelect(file);
      setPreview("audio");
      setIsProcessing(false);
      return;
    }

    if (!isValidImageFile(file)) {
      alert("Please upload a valid image (JPG, PNG, WEBP, GIF)");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const compressed = await compressImage(file);
      onFileSelect(compressed);
      
      const objectUrl = URL.createObjectURL(compressed);
      setPreview(objectUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div
        className={`relative w-full h-48 border-2 border-black rounded-xl flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer font-sans shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1
          ${isDragging ? "bg-[#FFD166]/20" : "bg-white"}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !preview && !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || "image/jpeg, image/png, image/webp, image/gif"}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {isProcessing ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
            <Skeleton className="w-full h-full" />
            <div className="absolute font-medium text-gray-500 animate-pulse">Processing...</div>
          </div>
        ) : preview === "audio" ? (
          <>
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#D0F0FF] rounded-xl border-4 border-black border-dashed">
              <span className="text-4xl mb-2">🎵</span>
              <span className="text-sm font-bold font-sans">Audio Selected</span>
            </div>
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-black hover:bg-gray-800 text-white rounded-full transition-colors z-10"
            >
              <X size={16} />
            </button>
          </>
        ) : preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover pointer-events-none" draggable={false} />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400 p-6 text-center">
            <UploadCloud className="w-10 h-10 mb-2 text-gray-300" />
            <span className="text-sm font-medium text-gray-600 mb-1">Click or drag image here</span>
            <span className="text-xs">{fallbackText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
