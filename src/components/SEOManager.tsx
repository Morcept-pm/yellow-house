import { useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage, SUPPORTED_LANGS, HTML_LANG, DEFAULT_LANG } from "../lib/LanguageContext";

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

/**
 * Maintains <link rel="canonical"> and hreflang alternates for the current
 * route. The URL locale segment is always "jp" for Japanese (product
 * requirement), but hreflang/HTML lang must use the real BCP-47 code "ja" —
 * HTML_LANG is the single place that mapping lives.
 */
export function SEOManager() {
  const [location] = useLocation();
  const { lang } = useLanguage();

  useEffect(() => {
    const segments = location.split("/").filter(Boolean);
    const rest = segments.slice(1).join("/");
    const origin = window.location.origin;
    const pathFor = (l: string) => `${origin}/${l}${rest ? "/" + rest : ""}`;

    upsertLink("canonical", null, pathFor(lang));
    SUPPORTED_LANGS.forEach((l) => upsertLink("alternate", HTML_LANG[l], pathFor(l)));
    upsertLink("alternate", "x-default", pathFor(DEFAULT_LANG));
  }, [location, lang]);

  return null;
}
