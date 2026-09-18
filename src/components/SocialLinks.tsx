import type { ReactElement } from "react";
import type { SocialKey } from "../lib/socialLinks";
import { useSocialLinks } from "../lib/useSocialLinks";

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4c5 0 9 3.2 9 7.2 0 3.6-3.6 6.6-8.3 7.1-.3 0-.6.2-.4.6l.3 1.3c.1.3-.1.6-.5.5-2-.6-3.1-1.3-3.9-1.8C4.2 17.8 3 15 3 11.2 3 7.2 7 4 12 4Z" />
      <path d="M8.3 9.5v4.3M11 9.5v4.3M13.7 9.5v4.3M13.7 9.5h2.4M13.7 11.6h2.2M17.2 9.5v4.3l2.5-4.3v4.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6.6 17.4 4 20l2.7-.7A8.5 8.5 0 1 0 4.5 12 8.4 8.4 0 0 0 6.6 17.4Z" strokeLinejoin="round" />
      <path
        d="M9.2 9.6c.2-.6.5-.6.8-.6h.6c.2 0 .4 0 .5.3l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.2-.1.3 0 .5.3.6 1.3 1.6 1.9 1.9.2.1.3.1.5 0l.6-.5c.1-.1.3-.2.5-.1l1.6.7c.2.1.3.3.3.5v.6c0 .3-.4.9-1 1-1.6.4-4-.4-5.4-1.9-1.3-1.3-1.9-2.7-2-3.2-.1-.6 0-1.4.4-1.9Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M13.6 20V13h2l.3-2.5h-2.3V9c0-.7.2-1.2 1.2-1.2h1.3V5.6c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.1-3.2 3.2v1.8H9v2.5h2v7" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <circle cx="7.7" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M7.7 11v6" strokeLinecap="round" />
      <path d="M11.3 17v-3.6c0-1.3.8-2.2 2-2.2s1.9.8 1.9 2.2V17" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.3 17v-6" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<SocialKey, () => ReactElement> = {
  line: LineIcon,
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
};

export function SocialLinks({
  className = "",
  iconClassName = "",
  tone = "onLight",
}: {
  className?: string;
  iconClassName?: string;
  /** `onDark` for the dark inner-page sections, `onLight` for the bright footer. */
  tone?: "onDark" | "onLight";
}) {
  const socialLinks = useSocialLinks();
  const active = socialLinks.filter((s) => s.url.trim().length > 0);
  if (active.length === 0) return null;

  const toneClass =
    tone === "onDark"
      ? "border-white/20 text-white/70"
      : "border-outline-variant text-on-surface-variant";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {active.map((social) => {
        const Icon = SOCIAL_ICONS[social.key];
        return (
          <a
            key={social.key}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:text-brand-600 hover:border-brand-400 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${toneClass} ${iconClassName}`}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
