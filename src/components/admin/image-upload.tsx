"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (path: string) => void;
  folder?: string;
  label?: string;
  aspect?: "square" | "video" | "free";
}

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "تصویر",
  aspect = "free",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.path);
      } else {
        setError(data.error || "خطا در آپلود");
      }
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const aspectClass =
    aspect === "square" ? "aspect-square" :
    aspect === "video" ? "aspect-video" : "min-h-[160px]";

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      {error && (
        <div className="mb-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs">
          {error}
        </div>
      )}

      {value ? (
        <div className={`relative overflow-hidden rounded-xl border border-border bg-secondary ${aspectClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                تغییر
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${aspectClass}
            ${dragOver
              ? "border-foreground/40 bg-foreground/5"
              : "border-border hover:border-foreground/20 hover:bg-secondary/50"
            }
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">در حال آپلود...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  <span className="text-foreground">کلیک کنید</span>{" "}
                  <span className="text-muted-foreground">یا فایل را بکشید</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP — حداکثر ۵MB
                </p>
              </div>
              <Upload className="w-5 h-5 text-muted-foreground" />
            </>
          )}
        </div>
      )}

      <div className="mt-2">
        <input
          type="text"
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-left text-muted-foreground focus:outline-none focus:border-foreground/20"
          placeholder="یا مسیر فایل را وارد کنید: /images/..."
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
