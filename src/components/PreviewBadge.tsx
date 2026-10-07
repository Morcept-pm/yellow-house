import { useState } from "react";
import { X } from "lucide-react";
import { isFirebaseConfigured } from "../lib/firebase";

/**
 * Small, dismissible marker shown only when the site runs without a Firebase
 * backend, so the bundled demo news/cases/properties are never mistaken for
 * the client's live content. Sits bottom-left to stay clear of FloatingSocial
 * and BackToTop on the right.
 */
export function PreviewBadge() {
  const [dismissed, setDismissed] = useState(false);
  if (isFirebaseConfigured || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest/95 px-3 py-1.5 text-[11px] text-on-surface-variant shadow-sm backdrop-blur">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
      <span>預覽模式 · 顯示內建示範內容</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="關閉預覽模式提示"
        className="rounded-full p-0.5 hover:bg-surface-container"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
