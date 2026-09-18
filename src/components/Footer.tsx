import { Link } from "wouter";
import { useLanguage } from "../lib/LanguageContext";
import { SocialLinks } from "./SocialLinks";
import { Logo } from "./Logo";
import { useSocialLinks } from "../lib/useSocialLinks";
import { useGeneral } from "../lib/useGeneral";
import { pickLang } from "../lib/utils";

export function Footer() {
  const { t, lang, localePath } = useLanguage();
  const socialLinks = useSocialLinks();
  const general = useGeneral();

  const address = pickLang(lang, general.addressZh, general.addressEn, general.addressJp);
  const license = pickLang(lang, general.licenseZh, general.licenseEn, general.licenseJp);
  const hours = pickLang(lang, general.hoursZh, general.hoursEn, general.hoursJp);

  // Always geocode from the Japanese address — Google resolves it reliably
  // regardless of which language the visitor is browsing in.
  const mapQuery = encodeURIComponent(general.addressJp.replace(/\n/g, " "));

  return (
    <footer className="w-full border-t border-outline-variant bg-surface-warm text-primary">
      <div className="px-margin-mobile md:px-margin-desktop pt-20 pb-8">
        <div className="content-col">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="flex flex-col gap-6 md:col-span-4">
              <Link href={localePath("/")} className="inline-block" aria-label="Yellow House">
                <Logo tone="onLight" className="h-12 md:h-14" />
              </Link>
              <p className="max-w-sm font-body-md text-sm leading-relaxed text-on-surface-variant">
                {t("footer.desc")}
              </p>
              <dl className="flex flex-col gap-3 font-body-md text-sm">
                <div className="flex gap-3">
                  <dt className="sr-only">Address</dt>
                  <span className="material-symbols-outlined mt-0.5 text-[18px] text-brand-600" aria-hidden="true">
                    location_on
                  </span>
                  <dd className="whitespace-pre-line text-on-surface-variant">{address}</dd>
                </div>
                {general.email && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Email</dt>
                    <span className="material-symbols-outlined mt-0.5 text-[18px] text-brand-600" aria-hidden="true">
                      mail
                    </span>
                    <dd>
                      <a
                        href={`mailto:${general.email}`}
                        className="text-on-surface-variant underline-offset-4 transition-colors hover:text-brand-600 hover:underline"
                      >
                        {general.email}
                      </a>
                    </dd>
                  </div>
                )}
                {hours && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Hours</dt>
                    <span className="material-symbols-outlined mt-0.5 text-[18px] text-brand-600" aria-hidden="true">
                      schedule
                    </span>
                    <dd className="whitespace-pre-line text-on-surface-variant">{hours}</dd>
                  </div>
                )}
              </dl>
            </div>

            <nav className="flex flex-col gap-4 md:col-span-4" aria-label={t("footer.nav")}>
              <h4 className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-brand-600">
                {t("footer.nav")}
              </h4>
              {/* Two columns now that the careers section is gone. */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { href: "/services", label: t("nav.services") },
                  { href: "/cases", label: t("nav.cases") },
                  { href: "/properties", label: t("nav.properties") },
                  { href: "/company", label: t("nav.company") },
                  { href: "/news", label: t("nav.news") },
                  { href: "/contact", label: t("nav.contact") },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={localePath(item.href)}
                    className="font-body-md text-sm text-on-surface-variant transition-colors hover:text-brand-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="flex flex-col gap-4 md:col-span-4">
              <h4 className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-brand-600">
                {t("footer.location")}
              </h4>
              {/* Real map instead of the stock photo that used to sit here.
                  The keyless embed can be refused (X-Frame-Options, ad/tracker
                  blockers, strict networks), so a usable fallback sits behind
                  it rather than leaving an empty grey box. */}
              <div className="relative h-48 overflow-hidden rounded-2xl border border-outline-variant bg-surface-warm-deep">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
                >
                  <span className="material-symbols-outlined text-2xl text-brand-600" aria-hidden="true">
                    map
                  </span>
                  <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant">
                    {pickLang(lang, "在 Google 地圖開啟", "Open in Google Maps", "Google マップで開く")}
                  </span>
                </a>
                <iframe
                  title={t("footer.map_label")}
                  src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              <Link
                href={localePath("/contact")}
                className="group flex items-center gap-2 font-label-caps text-xs uppercase tracking-wider text-primary transition-colors hover:text-brand-600"
              >
                {t("footer.map_label")}
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-0.5">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {socialLinks.some((s) => s.url) && (
            <div className="mb-8 flex flex-col gap-4 border-t border-outline-variant pt-8 md:flex-row md:items-center">
              <span className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                {t("footer.social")}
              </span>
              <SocialLinks />
            </div>
          )}

          {/* Extra right padding keeps the legal links clear of the fixed
              back-to-top / social buttons in the bottom-right corner. */}
          <div className="flex flex-col gap-4 border-t border-outline-variant pt-8 pr-0 text-label-caps text-on-surface-variant md:flex-row md:items-center md:justify-between md:pr-20">
            <div className="flex flex-col gap-1">
              <p>{t("footer.copyright")}</p>
              {license && <p className="text-[11px] text-on-surface-variant/70">{license}</p>}
            </div>
            <div className="flex gap-6">
              <Link href={localePath("/company")} className="transition-colors hover:text-brand-600">
                {t("footer.privacy")}
              </Link>
              <Link href={localePath("/company")} className="transition-colors hover:text-brand-600">
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
