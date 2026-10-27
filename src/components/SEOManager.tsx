import { useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage, SUPPORTED_LANGS, HTML_LANG, DEFAULT_LANG } from "../lib/LanguageContext";
import { useSeoSettings, tr } from "../lib/useSiteSettings";

function upsertLink(rel: string, hreflang: string | null, href: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Maintains <link rel="canonical"> and hreflang alternates for the current
 * route. The URL locale segment is always "jp" for Japanese (product
 * requirement), but hreflang/HTML lang must use the real BCP-47 code "ja" —
 * HTML_LANG is the single place that mapping lives.
 *
 * Also applies the admin's SEO tab (site_settings/seo): the site-wide
 * description and share image. Pages still set their own document.title
 * (detail pages only once their content loads), so og:title follows the
 * <title> element rather than reading it once.
 */
export function SEOManager() {
  const [location] = useLocation();
  const { lang } = useLanguage();
  const seo = useSeoSettings();

  useEffect(() => {
    const segments = location.split("/").filter(Boolean);
    const rest = segments.slice(1).join("/");
    const origin = window.location.origin;
    const pathFor = (l: string) => `${origin}/${l}${rest ? "/" + rest : ""}`;

    upsertLink("canonical", null, pathFor(lang));
    SUPPORTED_LANGS.forEach((l) => upsertLink("alternate", HTML_LANG[l], pathFor(l)));
    upsertLink("alternate", "x-default", pathFor(DEFAULT_LANG));
  }, [location, lang]);

  useEffect(() => {
    const description = tr(seo, "defaultDescription", lang);
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", seo.ogImage);
    upsertMeta("property", "og:url", window.location.origin + location);
    upsertMeta("name", "twitter:card", seo.ogImage ? "summary_large_image" : "summary");
  }, [seo, lang, location]);

  useEffect(() => {
    const syncTitle = () => upsertMeta("property", "og:title", document.title);
    syncTitle();
    const titleEl = document.head.querySelector("title");
    if (!titleEl) return;
    const observer = new MutationObserver(syncTitle);
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
