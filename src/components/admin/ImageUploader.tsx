import { useRef, useState } from "react";
import { uploadImage } from "../../lib/content/media";

interface ImageUploaderProps {
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}

/** Single-image uploader: shows current image, lets you replace it via file picker. */
export function ImageUploader({ label, value, folder, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const { promise } = uploadImage(file, folder, setProgress);
      promise
        .then((res) => onChange(res.url))
        .catch((err) => setError(err instanceof Error ? err.message : "上傳失敗"))
        .finally(() => setProgress(null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
      setProgress(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">{label}</label>
      <div className="flex items-start gap-4">
        <div className="w-32 h-24 rounded-lg bg-surface-container-low border border-outline-variant overflow-hidden shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-on-surface-variant">無圖片</span>}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={progress !== null}
            className="rounded-md px-4 py-2 text-xs border border-outline-variant hover:border-primary transition-colors disabled:opacity-50"
          >
            {progress !== null ? `上傳中 ${progress}%` : value ? "更換圖片" : "上傳圖片"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-xs text-red-600 hover:underline text-left">
              移除圖片
            </button>
          )}
          {error && <span className="text-xs text-red-600">{error}</span>}
          <span className="text-[11px] text-on-surface-variant">支援 JPG／PNG／WebP，最大 8MB</span>
        </div>
      </div>
    </div>
  );
}
