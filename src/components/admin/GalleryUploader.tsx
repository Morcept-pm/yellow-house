import { useRef, useState } from "react";
import { uploadImage } from "../../lib/content/media";

interface GalleryUploaderProps {
  label: string;
  value: string[];
  folder: string;
  onChange: (urls: string[]) => void;
}

export function GalleryUploader({ label, value, folder, onChange }: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            try {
              uploadImage(file, folder)
                .promise.then((res) => resolve(res.url))
                .catch(reject);
            } catch (err) {
              reject(err);
            }
          })
      )
    )
      .then((urls) => onChange([...value, ...urls]))
      .catch((err) => setError(err instanceof Error ? err.message : "上傳失敗"))
      .finally(() => setUploading(false));
  };

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-3">
        {value.map((url, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
            >
              移除
            </button>
          </div>
        ))}
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-outline-variant hover:border-primary flex items-center justify-center text-xs text-on-surface-variant transition-colors disabled:opacity-50"
        >
          {uploading ? "上傳中..." : "＋ 新增圖片"}
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
      <span className="text-[11px] text-on-surface-variant">可一次選取多張，支援 JPG／PNG／WebP，單張最大 8MB</span>
    </div>
  );
}
