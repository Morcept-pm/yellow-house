import type { ReactNode } from "react";

/**
 * Orange rule + small-caps label that opens every section on the site.
 *
 * `tone` follows the surface it sits on: brand orange on light backgrounds,
 * white over photography (where the rule stays orange for brand presence).
 */
export function Kicker({
  children,
  tone = "onLight",
  className = "",
}: {
  children: ReactNode;
  tone?: "onLight" | "onDark";
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-3 font-label-caps text-label-caps uppercase tracking-[0.2em] ${
        tone === "onDark" ? "text-white text-shadow-hero" : "text-brand-600"
      } ${className}`}
    >
      <span className="h-[2px] w-9 shrink-0 bg-brand-500" />
      {children}
    </span>
  );
}
