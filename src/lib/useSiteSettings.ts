import { useEffect, useState } from "react";
import {
  watchCases,
  watchCategories,
  watchCompany,
  watchContact,
  watchNews,
  watchProperties,
  watchSeo,
  watchServices,
  watchHome,
  DEFAULT_HOME,
  DEFAULT_CASES,
  DEFAULT_CATEGORIES,
  DEFAULT_COMPANY,
  DEFAULT_CONTACT,
  DEFAULT_NEWS,
  DEFAULT_PROPERTIES,
  DEFAULT_SEO,
  DEFAULT_SERVICES,
} from "./content/siteSettings";
import type { Language } from "./LanguageContext";

type Watcher<T> = (cb: (v: T) => void) => () => void;

/**
 * Live value of one admin-editable site_settings doc. Starts from the bundled
 * default (identical to the admin's own default), so the page renders real
 * copy immediately and when Firestore is unreachable — same pattern as
 * useGeneral().
 */
function useWatched<T>(watch: Watcher<T>, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => watch(setValue), [watch]);
  return value;
}

export const useHomeSettings = () => useWatched(watchHome, DEFAULT_HOME);
export const useCompanySettings = () => useWatched(watchCompany, DEFAULT_COMPANY);
export const useContactSettings = () => useWatched(watchContact, DEFAULT_CONTACT);
export const useNewsSettings = () => useWatched(watchNews, DEFAULT_NEWS);
export const useCasesSettings = () => useWatched(watchCases, DEFAULT_CASES);
export const usePropertiesSettings = () => useWatched(watchProperties, DEFAULT_PROPERTIES);
export const useServicesSettings = () => useWatched(watchServices, DEFAULT_SERVICES);
export const useCategories = () => useWatched(watchCategories, DEFAULT_CATEGORIES);
export const useSeoSettings = () => useWatched(watchSeo, DEFAULT_SEO);

const SUFFIX: Record<Language, "Zh" | "En" | "Jp"> = { zh: "Zh", en: "En", jp: "Jp" };

/**
 * Reads a trilingual field from a settings object by its base name, e.g.
 * `tr(settings, "bannerH1", lang)` → settings.bannerH1Zh / En / Jp. Settings
 * docs all follow the `<field>Zh|En|Jp` naming the admin writes.
 */
export function tr<T extends object>(obj: T, base: string, lang: Language): string {
  const value = (obj as Record<string, unknown>)[`${base}${SUFFIX[lang]}`];
  return typeof value === "string" ? value : "";
}
