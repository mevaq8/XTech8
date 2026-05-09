import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, GripVertical, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket?: string;
  folder?: string;
  maxFiles?: number;
  maxSize?: number;
}

export function ImageUploader({
  images,
  onChange,
  bucket = "product-images",
  folder = "products",
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const newUrls: string[] = [];

      for (const file of acceptedFiles) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          if (data.publicUrl) {
            newUrls.push(data.publicUrl);
          }
        }
      }

      onChange([...images, ...newUrls]);
      setUploading(false);
    },
    [images, onChange, bucket, folder]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles,
    maxSize,
  });

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    // Make ghost semi-transparent
    requestAnimationFrame(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.4";
      }
    });
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDropOnItem = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }

    const newImages = [...images];
    const [movedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, movedItem);
    onChange(newImages);
    handleDragEnd();
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-sm text-slate-600 font-medium">
          {isDragActive ? "Şəkilləri buraxın..." : "Şəkilləri bura atın və ya seçin"}
        </p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
        {uploading && <p className="text-xs text-emerald-500 mt-2">Yüklənir...</p>}
      </div>

      {images.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <GripVertical className="w-3 h-3" />
            Şəkilləri sürüşdürərək sıralayın. Birinci şəkil əsas (primary) şəkil olacaq.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropOnItem(e, index)}
                className={`relative group aspect-square rounded-lg overflow-hidden border-2 bg-slate-50 cursor-grab active:cursor-grabbing transition-all duration-150 ${
                  dragOverIndex === index
                    ? "border-emerald-400 scale-105 shadow-lg"
                    : index === 0
                    ? "border-emerald-300 ring-1 ring-emerald-200"
                    : "border-slate-200"
                }`}
              >
                {url ? (
                  <img src={url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  </div>
                )}

                {/* Primary badge for first image */}
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5" fill="currentColor" />
                    Əsas
                  </div>
                )}

                {/* Drag handle indicator */}
                <div className="absolute top-1 right-8 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <GripVertical className="w-3 h-3 text-slate-500" />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
