import { useGeneral } from "../lib/useGeneral";

/**
 * Site-wide CSS from the admin's 進階設定 tab (site_settings/general.customCss).
 * Rendered as a <style> element after the app's own styles so it can override
 * them; empty by default.
 */
export function CustomCss() {
  const { customCss } = useGeneral();
  if (!customCss?.trim()) return null;
  return <style data-source="admin-custom-css">{customCss}</style>;
}
