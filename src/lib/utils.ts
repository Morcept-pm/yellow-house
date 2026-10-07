import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language } from "./LanguageContext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Picks the field matching the current language from a { zh, en, jp } trio. */
export function pickLang<T>(lang: Language, zh: T, en: T, jp: T): T {
  return lang === "zh" ? zh : lang === "jp" ? jp : en;
}

/**
 * Resolves a path inside `public/` against Vite's configured base URL.
 *
 * On the normal root deployment this is a no-op ("/hero/x.jpg" stays
 * "/hero/x.jpg"). It matters for the standalone preview build, which is served
 * from a sub-path with `--base ./`, where a leading-slash URL would escape to
 * the host root and 404.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.endsWith("/") ? base : base + "/"}${path.replace(/^\//, "")}`;
}

/** Same as `asset()` for a whole `srcSet` string ("/a.jpg 800w, /b.jpg 1280w"). */
export function assetSrcSet(srcSet: string): string {
  return srcSet
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [url, ...rest] = entry.split(/\s+/);
      return [asset(url), ...rest].join(" ");
    })
    .join(", ");
}
