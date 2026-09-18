import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Kicker } from "./Kicker";

/**
 * Inner-page header, matching the homepage banner: a full-bleed photograph
 * with the copy set directly on it in white, carried by `.text-shadow-hero`
 * rather than the heavy black scrim the pages used to share.
 *
 * Shorter than the homepage hero — these are page headers, not the first
 * impression, so they should not cost a whole screen before the content.
 */
export function PageBanner({
  image,
  kicker,
  title,
  desc,
  children,
}: {
  image: string;
  kicker: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  /** Optional extras (badges, meta) rendered under the description. */
  children?: ReactNode;
}) {
  return (
    <section className="relative w-full">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        /* Page banners are the LCP element on their route. */
        fetchPriority="high"
        decoding="async"
        className="h-[52vh] min-h-[340px] w-full object-cover md:h-[58vh]"
      />

      {/* Kept light: just enough weight in the lower-left for white type. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 px-margin-mobile pb-10 md:px-margin-desktop md:pb-14">
        <div className="content-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex max-w-3xl flex-col gap-4"
          >
            <Kicker tone="onDark">{kicker}</Kicker>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white text-shadow-hero">
              {title}
            </h1>
            {desc && (
              <p className="max-w-2xl font-body-md text-body-md leading-relaxed text-white/90 text-shadow-hero">
                {desc}
              </p>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
