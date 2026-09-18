import { useEffect, useState } from "react";
import { watchGeneral } from "./content/siteSettings";
import { SOCIAL_KEY_ORDER, SOCIAL_LABELS, type SocialLinkConfig } from "./socialLinks";

/** Live-updating social link list, sourced from site_settings/general (admin-editable). */
export function useSocialLinks(): SocialLinkConfig[] {
  const [links, setLinks] = useState<SocialLinkConfig[]>(
    SOCIAL_KEY_ORDER.map((key) => ({ key, label: SOCIAL_LABELS[key], url: "" }))
  );

  useEffect(() => {
    return watchGeneral((general) => {
      setLinks(SOCIAL_KEY_ORDER.map((key) => ({ key, label: SOCIAL_LABELS[key], url: general.social?.[key] ?? "" })));
    });
  }, []);

  return links;
}
