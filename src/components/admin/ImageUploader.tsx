import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
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
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              {url ? (
                <img src={url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
