import { useEffect, useState } from "react";
import { watchGeneral, DEFAULT_GENERAL } from "./content/siteSettings";
import type { SiteSettingsGeneral } from "../types/content";

/**
 * Live company details from site_settings/general (admin-editable).
 *
 * Until now the front end only read the `social` sub-object out of this doc,
 * so editing the company name/address/licence in the admin had no visible
 * effect. Anything on the public site that shows company details should read
 * it through here rather than hard-coding a copy.
 *
 * Falls back to DEFAULT_GENERAL, so the UI still renders correct content when
 * Firestore is unreachable or the doc has not been created yet.
 */
export function useGeneral(): SiteSettingsGeneral {
  const [general, setGeneral] = useState<SiteSettingsGeneral>(DEFAULT_GENERAL);
  useEffect(() => watchGeneral(setGeneral), []);
  return general;
}
