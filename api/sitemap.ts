/**
 * GET /sitemap.xml (rewritten here by vercel.json).
 *
 * The site is a client-rendered SPA, so crawlers can't discover the detail
 * pages by following links reliably. This lists every public route in all
 * three locales, plus each published news article, case study and property,
 * read straight from Firestore's REST API — no Admin SDK or secrets: the
 * same public read access the browser has, governed by firestore.rules.
 *
 * Runs on every request but is CDN-cached (see Cache-Control below), so
 * Firestore is read at most once an hour per region.
 */

const LOCALES = ["zh", "en", "jp"] as const;
// hreflang needs real BCP-47 codes; the URL segment for Japanese is "jp".
const HREFLANG: Record<(typeof LOCALES)[number], string> = { zh: "zh-TW", en: "en", jp: "ja" };
const DEFAULT_LOCALE = "zh";

const STATIC_PATHS = ["", "/services", "/company", "/cases", "/properties", "/news", "/contact"];
const COLLECTIONS = [
  { name: "news", path: "/news" },
  { name: "cases", path: "/cases" },
  { name: "properties", path: "/properties" },
] as const;

/** Same "=" / whitespace cleanup as src/lib/firebase.ts — the dashboard values once shipped as "=yellow-house-site". */
const env = (name: string) => process.env[name]?.trim().replace(/^=+/, "").trim() || "";

type Entry = { path: string; lastmod?: string };

interface RunQueryRow {
  document?: { fields?: { slug?: { stringValue?: string } }; updateTime?: string };
}

async function publishedSlugs(projectId: string, apiKey: string, collection: string): Promise<Entry[]> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents:runQuery` +
    (apiKey ? `?key=${encodeURIComponent(apiKey)}` : "");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } },
        select: { fields: [{ fieldPath: "slug" }] },
      },
    }),
  });
  if (!res.ok) throw new Error(`Firestore ${collection}: HTTP ${res.status}`);
  const rows = (await res.json()) as RunQueryRow[];
  return rows.flatMap((row) => {
    const slug = row.document?.fields?.slug?.stringValue;
    return slug ? [{ path: `/${encodeURIComponent(slug)}`, lastmod: row.document?.updateTime }] : [];
  });
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildSitemap(origin: string, entries: Entry[]): string {
  const urls = entries.flatMap(({ path, lastmod }) => {
    const alternates = [
      ...LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${xmlEscape(`${origin}/${l}${path}`)}"/>`
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(`${origin}/${DEFAULT_LOCALE}${path}`)}"/>`,
    ].join("\n");
    return LOCALES.map((l) =>
      [
        "  <url>",
        `    <loc>${xmlEscape(`${origin}/${l}${path}`)}</loc>`,
        lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "",
        alternates,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n")
    );
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

/** SITE_URL (e.g. https://www.yellowhouse.jp) wins once a custom domain exists; otherwise the request's own host. */
export function siteOrigin(request: Request): string {
  const configured = env("SITE_URL").replace(/\/+$/, "");
  return configured || new URL(request.url).origin;
}

export async function GET(request: Request): Promise<Response> {
  const origin = siteOrigin(request);
  const projectId = env("VITE_FIREBASE_PROJECT_ID");
  const apiKey = env("VITE_FIREBASE_API_KEY");

  const entries: Entry[] = STATIC_PATHS.map((path) => ({ path }));
  let partial = false;
  if (projectId) {
    const results = await Promise.allSettled(
      COLLECTIONS.map(async (c) =>
        (await publishedSlugs(projectId, apiKey, c.name)).map((e) => ({ ...e, path: `${c.path}${e.path}` }))
      )
    );
    for (const r of results) {
      if (r.status === "fulfilled") entries.push(...r.value);
      else {
        partial = true;
        console.error("[sitemap]", r.reason);
      }
    }
  } else {
    partial = true;
    console.error("[sitemap] VITE_FIREBASE_PROJECT_ID is not set; listing static pages only.");
  }

  return new Response(buildSitemap(origin, entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Don't let a failed Firestore read sit in the CDN for an hour.
      "Cache-Control": partial ? "public, s-maxage=60" : "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
