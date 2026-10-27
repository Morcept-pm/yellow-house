import { useEffect, useState } from "react";
import { watchGeneral, DEFAULT_GENERAL } from "./content/siteSettings";
import { SOCIAL_KEY_ORDER, SOCIAL_LABELS, type SocialLinkConfig } from "./socialLinks";

// "#" was the old seed placeholder; the admin tells editors a blank link hides
// the icon, so treat the placeholder as blank too instead of rendering a dead link.
const usableUrl = (url: string | undefined) => {
  const trimmed = (url ?? "").trim();
  return trimmed === "#" ? "" : trimmed;
};

const toLinks = (social: Record<string, string> | undefined) =>
  SOCIAL_KEY_ORDER.map((key) => ({ key, label: SOCIAL_LABELS[key], url: usableUrl(social?.[key]) }));

/** Live-updating social link list, sourced from site_settings/general (admin-editable). */
export function useSocialLinks(): SocialLinkConfig[] {
  // Same pattern as Home.tsx's hero text: start from the bundled default so
  // the icons show immediately, and only when Firestore actually delivers a
  // snapshot (below) do they update to the real configured URLs.
  const [links, setLinks] = useState<SocialLinkConfig[]>(toLinks(DEFAULT_GENERAL.social));

  useEffect(() => {
    return watchGeneral((general) => setLinks(toLinks(general.social)));
  }, []);

  return links;
}
