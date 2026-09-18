import type { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { pickLang } from "../lib/utils";

/**
 * The closing call to action shared by every page, matching the homepage:
 * a full-bleed photograph with a solid brand panel laid over it, rather than
 * type sitting on a darkened image.
 */
export function ClosingCta({
  title,
  image = "/hero/hero-1-1920.jpg",
  secondary,
}: {
  title?: ReactNode;
  image?: string;
  /** Optional second button, e.g. back to a listing. */
  secondary?: { label: ReactNode; href: string };
}) {
  const { t, lang, localePath } = useLanguage();

  return (
    <section className="relative w-full">
      <img
        src={image}
        srcSet={
          image.startsWith("/hero/")
            ? image.replace(/-\d+\.jpg$/, "-1280.jpg") +
              " 1280w, " +
              image.replace(/-\d+\.jpg$/, "-1920.jpg") +
              " 1920w, " +
              image.replace(/-\d+\.jpg$/, "-2560.jpg") +
              " 2560w"
            : undefined
        }
        sizes="100vw"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="h-[58vh] min-h-[380px] w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center px-margin-mobile md:px-margin-desktop">
        <div className="content-col">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55 }}
            className="max-w-xl rounded-3xl bg-brand-500 p-8 shadow-[0_28px_70px_-40px_rgba(21,18,14,0.6)] md:p-12"
          >
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              {title ?? t("cta.title")}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localePath("/contact")}
                className="rounded-lg bg-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-surface hover:text-primary"
              >
                {pickLang(lang, "預約諮詢", "Book consultation", "相談を予約する")}
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className="rounded-lg border border-primary/40 px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
