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
