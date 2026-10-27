/**
 * GET /robots.txt (rewritten here by vercel.json). Generated rather than a
 * static file because the Sitemap line must be an absolute URL, and the
 * production domain isn't fixed yet. Kept free of imports from sitemap.ts so
 * each function bundles on its own; the SITE_URL logic is the same there.
 */
function siteOrigin(request: Request): string {
  const configured = (process.env.SITE_URL ?? "").trim().replace(/^=+/, "").trim().replace(/\/+$/, "");
  return configured || new URL(request.url).origin;
}

export function GET(request: Request): Response {
  const body = ["User-agent: *", "Allow: /", "Disallow: /admin", "", `Sitemap: ${siteOrigin(request)}/sitemap.xml`, ""].join(
    "\n"
  );
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=86400" },
  });
}
