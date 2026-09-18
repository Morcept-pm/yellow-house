import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrencySelector } from "./CurrencySelector";
import { Logo } from "./Logo";
import { NavOverlay, type NavItem } from "./NavOverlay";

/**
 * The header floats over the page: transparent while the hero/banner image is
 * behind it, solid white once the user scrolls past it. Navigation is a
 * hamburger at every breakpoint — there is no desktop link bar.
 */
export function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, localePath } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks: NavItem[] = [
    { href: localePath("/"), label: t("nav.home"), kicker: "Home" },
    { href: localePath("/services"), label: t("nav.services"), kicker: "Services" },
    { href: localePath("/company"), label: t("nav.company"), kicker: "Company" },
    { href: localePath("/cases"), label: t("nav.cases"), kicker: "Cases" },
    { href: localePath("/properties"), label: t("nav.properties"), kicker: "Properties" },
    { href: localePath("/news"), label: t("nav.news"), kicker: "News" },
    { href: localePath("/contact"), label: t("nav.contact"), kicker: "Contact" },
  ];

  // Every page now opens on a full-bleed photograph, so the controls are white
  // until the header turns solid on scroll.
  const tone = scrolled ? "onLight" : "onDark";

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-outline-variant/70 shadow-[0_1px_20px_rgba(21,18,14,0.06)]"
            : // Fully transparent over the banner — no scrim, no border. White
              // controls carry their own text-shadow for legibility.
              "bg-transparent"
        }`}
      >
        <div
          className={`flex w-full items-center justify-between px-margin-mobile md:px-margin-desktop transition-all duration-300 ${
            scrolled ? "h-16 md:h-20" : "h-20 md:h-24"
          } ${
            // Soft drop-shadow (not a scrim) keeps the white logo/controls
            // legible over a bright banner now that the header is transparent.
            tone === "onDark" ? "[filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.35))]" : ""
          }`}
        >
          <Link href={localePath("/")} className="group flex items-center" aria-label="Yellow House">
            <Logo
              tone={tone}
              className={`transition-all duration-300 group-hover:opacity-80 ${
                scrolled ? "h-10 md:h-12" : "h-12 md:h-16"
              }`}
            />
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <LanguageSwitcher tone={tone} />
            <span
              className={`hidden h-4 w-px sm:block ${tone === "onLight" ? "bg-outline-variant" : "bg-white/25"}`}
            />
            <CurrencySelector tone={tone} />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("nav.menu")}
              aria-expanded={menuOpen}
              className={`ml-1 flex h-12 w-12 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                tone === "onLight" ? "text-primary hover:bg-brand-50" : "text-white hover:bg-white/15"
              }`}
            >
              {/* Two-bar burger rather than an icon font glyph, so it can animate. */}
              <span className="relative block h-[14px] w-6">
                <span className="absolute left-0 top-0 block h-[2px] w-full rounded-full bg-current" />
                <span className="absolute bottom-0 left-0 block h-[2px] w-2/3 rounded-full bg-current transition-all duration-300 group-hover:w-full" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <NavOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navLinks}
        currentPath={location}
      />
    </>
  );
}
