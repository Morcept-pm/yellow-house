import { useEffect, useRef, useState } from "react";
import { useLanguage, type Language } from "../lib/LanguageContext";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "zh", label: "中文" },
  { code: "en", label: "English" },
  { code: "jp", label: "日本語" },
];

export function LanguageSwitcher({
  className = "",
  tone = "onDark",
}: {
  className?: string;
  /** Colour of the trigger label — the header flips this as it scrolls. */
  tone?: "onDark" | "onLight";
}) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className={`flex items-center justify-center gap-1 min-h-[44px] px-2 font-label-caps text-label-caps transition-colors cursor-pointer ${
          tone === "onDark" ? "text-white/80 hover:text-white" : "text-primary/70 hover:text-primary"
        }`}
      >
        {current.label}
        <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 mt-2 w-36 rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg py-1 z-50"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 min-h-[44px] font-body-md text-sm transition-colors cursor-pointer ${
                  l.code === lang
                    ? "bg-brand-tint text-primary font-semibold"
                    : "text-primary hover:bg-surface-container-low"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
