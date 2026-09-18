import type { SocialKey } from "../lib/socialLinks";
import { useSocialLinks } from "../lib/useSocialLinks";
import { SOCIAL_ICONS } from "./SocialLinks";
import { useLanguage } from "../lib/LanguageContext";
import { pickLang } from "../lib/utils";

// The floating widget is a quick-contact affordance, so it's scoped to
// chat-style channels only. Facebook/LinkedIn/X (if configured) still show
// in the regular <SocialLinks /> footer/contact block.
const FLOATING_KEYS: SocialKey[] = ["line", "instagram", "whatsapp"];

const LABELS: Record<SocialKey, { zh: string; en: string; jp: string }> = {
  line: { zh: "透過 LINE 聯繫我們", en: "Contact us on LINE", jp: "LINEでお問い合わせ" },
  instagram: { zh: "追蹤我們的 Instagram", en: "Visit our Instagram", jp: "Instagramをフォロー" },
  whatsapp: { zh: "透過 WhatsApp 聯繫我們", en: "Contact us on WhatsApp", jp: "WhatsAppでお問い合わせ" },
  facebook: { zh: "追蹤我們的 Facebook", en: "Visit our Facebook", jp: "Facebookをフォロー" },
  linkedin: { zh: "追蹤我們的 LinkedIn", en: "Visit our LinkedIn", jp: "LinkedInをフォロー" },
  x: { zh: "追蹤我們的 X", en: "Visit our X", jp: "Xをフォロー" },
};

export function FloatingSocial() {
  const { lang } = useLanguage();
  const socialLinks = useSocialLinks();
  const active = socialLinks.filter((s) => FLOATING_KEYS.includes(s.key) && s.url.trim().length > 0);
  if (active.length === 0) return null;

  return (
    <div className="fixed right-5 md:right-7 bottom-24 md:bottom-28 z-40 flex flex-col gap-2">
      {active.map((social, i) => {
        const Icon = SOCIAL_ICONS[social.key];
        const label = pickLang(lang, LABELS[social.key].zh, LABELS[social.key].en, LABELS[social.key].jp);
        return (
          <a
            key={social.key}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            // A three-high stack runs down most of a phone screen and collides
            // with content along the right edge, so phones get the primary
            // channel only; the full set returns from sm upwards.
            className={`group relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary text-white items-center justify-center shadow-md hover:bg-brand-500 hover:text-primary hover:-translate-x-1 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
              i > 0 ? "hidden sm:flex" : "flex"
            }`}
          >
            <Icon />
            <span
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary text-white text-xs font-label-caps px-3 py-1.5 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            >
              {label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
