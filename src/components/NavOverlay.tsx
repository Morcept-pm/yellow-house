import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { useSocialLinks } from "../lib/useSocialLinks";
import { useGeneral } from "../lib/useGeneral";
import { SOCIAL_ICONS } from "./SocialLinks";
import { Logo } from "./Logo";
import { pickLang } from "../lib/utils";

export interface NavItem {
  href: string;
  label: string;
  /** Route name in English, shown as a small kicker above the localised label. */
  kicker: string;
}

/**
 * Full-screen navigation. The site uses a hamburger at every breakpoint
 * (not just mobile), so this is the only menu — it has to carry the whole
 * site map plus the contact details a visitor would otherwise hunt for.
 */
export function NavOverlay({
  open,
  onClose,
  items,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  currentPath: string;
}) {
  const { lang, localePath } = useLanguage();
  const socialLinks = useSocialLinks();
  const general = useGeneral();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes; while open the page behind must not scroll.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow, paddingRight } = document.body.style;
    // Compensate for the scrollbar we're about to remove so the page doesn't shift.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, onClose]);

  // Keep Tab inside the panel while it covers the page.
  const onKeyDownCapture = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const address = pickLang(lang, general.addressZh, general.addressEn, general.addressJp);
  const license = pickLang(lang, general.licenseZh, general.licenseEn, general.licenseJp);
  const activeSocial = socialLinks.filter((s) => s.url.trim().length > 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lang === "zh" ? "網站選單" : lang === "jp" ? "サイトメニュー" : "Site menu"}
          ref={panelRef}
          onKeyDownCapture={onKeyDownCapture}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[60] bg-surface overflow-y-auto"
        >
          {/* Mirrors the header row so the logo stays put and the close button
              lands exactly where the hamburger was. */}
          <div className="h-20 md:h-24 px-margin-mobile md:px-margin-desktop flex items-center justify-between">
            <Link href={localePath("/")} onClick={onClose} aria-label="Yellow House">
              <Logo tone="onLight" className="h-9 md:h-10" />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={lang === "zh" ? "關閉選單" : lang === "jp" ? "メニューを閉じる" : "Close menu"}
              className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full text-primary transition-colors hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>

          <div className="px-margin-mobile md:px-margin-desktop pb-16">
            <div className="content-col grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-gutter">
              <nav className="lg:col-span-7" aria-label="Primary">
                <ul className="flex flex-col">
                  {items.map((item, i) => {
                    const isActive = currentPath === item.href;
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.035, duration: 0.3, ease: "easeOut" }}
                        className="border-b border-outline-variant/60"
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="group flex items-baseline gap-4 py-3.5 md:gap-6 md:py-4"
                        >
                          <span className="w-[76px] shrink-0 font-label-caps text-[10px] uppercase tracking-[0.18em] text-brand-600 md:w-[92px]">
                            {item.kicker}
                          </span>
                          <span
                            className={`font-headline-md text-lg transition-colors md:text-2xl ${
                              isActive ? "text-brand-600" : "text-primary group-hover:text-brand-600"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="material-symbols-outlined ml-auto self-center text-brand-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                            arrow_forward
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.35 }}
                className="lg:col-span-4 lg:col-start-9"
              >
                <div className="rounded-2xl bg-surface-warm p-8">
                  <h2 className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-brand-600">
                    {lang === "zh" ? "聯絡我們" : lang === "jp" ? "お問い合わせ" : "Get in touch"}
                  </h2>
                  <dl className="mt-6 flex flex-col gap-5 font-body-md text-sm text-on-surface-variant">
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-on-surface-variant/70">Address</dt>
                      <dd className="mt-1 whitespace-pre-line text-primary">{address}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-on-surface-variant/70">Email</dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${general.email}`}
                          className="text-primary underline-offset-4 hover:text-brand-600 hover:underline"
                        >
                          {general.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-on-surface-variant/70">License</dt>
                      <dd className="mt-1 text-primary">{license}</dd>
                    </div>
                  </dl>

                  <Link
                    href={localePath("/contact")}
                    onClick={onClose}
                    className="mt-8 flex items-center justify-between gap-4 rounded-xl bg-brand-500 px-6 py-4 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    {lang === "zh" ? "預約諮詢" : lang === "jp" ? "相談を予約する" : "Book a consultation"}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </Link>

                  {activeSocial.length > 0 && (
                    <div className="mt-8 flex items-center gap-3">
                      {activeSocial.map((social) => {
                        const Icon = SOCIAL_ICONS[social.key];
                        return (
                          <a
                            key={social.key}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-brand-500 hover:text-brand-600"
                          >
                            <Icon />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
