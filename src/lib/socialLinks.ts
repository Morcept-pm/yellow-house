export type SocialKey = "line" | "instagram" | "whatsapp" | "facebook" | "linkedin" | "x";

export interface SocialLinkConfig {
  key: SocialKey;
  label: string;
  url: string;
}

// Real URLs now live in Firestore `site_settings/general.social`, editable from
// the admin backend at /admin — see useSocialLinks() below. This file only
// keeps the shared type + the ordered label list the hook renders from.
export const SOCIAL_LABELS: Record<SocialKey, string> = {
  line: "LINE",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
};

export const SOCIAL_KEY_ORDER: SocialKey[] = ["line", "instagram", "whatsapp", "facebook", "linkedin", "x"];
