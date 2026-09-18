/**
 * Brand lockup. Two colour variants live as separate SVGs in /public/brand so
 * they stay cacheable static assets; both are rendered stacked and cross-faded
 * so the header can swap tone on scroll without a flash of the wrong colour.
 *
 * Intrinsic artwork ratio is 71.8 x 43.2 (from the logo's vector bounding box).
 */
const RATIO = "71.8 / 43.2";

export function Logo({
  tone,
  className = "",
}: {
  tone: "onDark" | "onLight";
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`} style={{ aspectRatio: RATIO }}>
      {/* Only one <img> carries the alt text — the other is decorative, so the
          lockup is announced once regardless of which variant is visible. */}
      <img
        src="/brand/yh-logo.svg"
        alt="Yellow House"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
          tone === "onLight" ? "opacity-100" : "opacity-0"
        }`}
      />
      <img
        src="/brand/yh-logo-white.svg"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
          tone === "onDark" ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}
