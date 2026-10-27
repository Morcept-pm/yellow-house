import type { ReactElement } from "react";
import type { SocialKey } from "../lib/socialLinks";
import { useSocialLinks } from "../lib/useSocialLinks";

// Official LINE mark (speech bubble with "LINE" knocked out), from Simple Icons.
function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
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
