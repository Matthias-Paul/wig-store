"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/src/features/admin/api/adminProductsApi";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 6,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        filesToUpload.map((file) => uploadImage(file)),
      );
      onChange([...images, ...uploaded.map((u) => u.imageUrl)]);
    } catch {
      toast.error("Some images failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div
            key={url}
            className="relative  aspect-square rounded-lg overflow-hidden ring-1 ring-black/5 group"
          >
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute cursor-pointer top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 bg-brand text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                Cover
              </span>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square cursor-pointer rounded-lg border-2 border-dashed border-gray-200 hover:border-brand/40 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-brand transition-colors"
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Upload size={20} />
            )}
            <span className="text-[11px] font-medium">
              {isUploading ? "Uploading..." : "Add Image"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs cursor-pointer text-gray-400 mt-2">
        {images.length}/{maxImages} images · First image is used as the cover
        photo
      </p>
    </div>
  );
}
