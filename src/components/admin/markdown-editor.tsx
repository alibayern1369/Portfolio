"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  folder?: string;
  label?: string;
  hint?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  rows = 10,
  placeholder,
  folder = "content",
  label = "محتوا (مارک‌داون)",
  hint = "برای افزودن عکس، دکمه «درج تصویر» را بزنید یا از قالب ![توضیح](آدرس) استفاده کنید.",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const insertAtCursor = (text: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value ? `${value}\n\n${text}` : text);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const needsLeadingNewline = before.length > 0 && !before.endsWith("\n");
    const insertion = `${needsLeadingNewline ? "\n\n" : ""}${text}\n\n`;
    const next = `${before}${insertion}${after}`;
    onChange(next);

    requestAnimationFrame(() => {
      const pos = before.length + insertion.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "خطا در آپلود");
        return;
      }

      const alt = file.name.replace(/\.[^.]+$/, "") || "تصویر";
      insertAtCursor(`![${alt}](${data.path})`);
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-medium">{label}</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
          {uploading ? "در حال آپلود..." : "درج تصویر"}
        </button>
      </div>

      {error && (
        <div className="mb-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-500">
          {error}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        dir="rtl"
        placeholder={placeholder ?? "متن را بنویسید...\n\nمثال تصویر:\n![توضیح تصویر](/api/media/1)"}
        className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm focus:border-foreground/20 focus:outline-none"
      />

      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
    </div>
  );
}
