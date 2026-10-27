import type { CategoryItem } from "../types/content";
import type { Language } from "./LanguageContext";
import { pickLang } from "./utils";

type Categorized = {
  category?: string;
  categoryZh?: string;
  categoryEn?: string;
  categoryJp?: string;
};

/**
 * The admin stores a category as a key into site_settings/categories, so
 * labels can be renamed in one place. Documents seeded before that switch
 * only carry categoryZh/En/Jp labels, so match those against the list too
 * (by any language, since a label may since have been reworded in another
 * one), and as a last resort show the stored labels as-is.
 */
export function resolveCategory(item: Categorized, list: CategoryItem[]): CategoryItem | null {
  if (item.category) {
    const byKey = list.find((c) => c.key === item.category);
    if (byKey) return byKey;
  }
  const byLabel = list.find(
    (c) =>
      (item.categoryEn && c.labelEn === item.categoryEn) ||
      (item.categoryZh && c.labelZh === item.categoryZh) ||
      (item.categoryJp && c.labelJp === item.categoryJp)
  );
  if (byLabel) return byLabel;
  if (item.categoryZh || item.categoryEn || item.categoryJp) {
    return {
      key: `legacy:${item.categoryEn || item.categoryZh || item.categoryJp}`,
      labelZh: item.categoryZh ?? "",
      labelEn: item.categoryEn ?? "",
      labelJp: item.categoryJp ?? "",
    };
  }
  return null;
}

export function categoryLabel(item: CategoryItem | null, lang: Language): string {
  return item ? pickLang(lang, item.labelZh, item.labelEn, item.labelJp) : "";
}
