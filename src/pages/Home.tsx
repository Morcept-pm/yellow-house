import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { RotatingImage, type RotatingFrame } from "../components/RotatingImage";
import { Kicker } from "../components/Kicker";
import { PriceBlock } from "../components/PriceBlock";
import { watchHome, DEFAULT_HOME } from "../lib/content/siteSettings";
import { listPublishedCases } from "../lib/content/cases";
import { listPublishedNews } from "../lib/content/news";
import { listPublishedProperties } from "../lib/content/properties";
import { pickLang } from "../lib/utils";
import type { SiteSettingsHome, CaseArticle, NewsArticle, Property } from "../types/content";

/* ------------------------------------------------------------------ *
 * Imagery
 *
 * Bundled hero photography (supplied by the client) is the only imagery
 * guaranteed to exist. Everything else on this page comes from real
 * published content in Firestore, so the homepage never shows invented
 * services or placeholder cards.
 * ------------------------------------------------------------------ */
const bundled = (n: number): RotatingFrame => ({
  src: `/hero/hero-${n}-1920.jpg`,
  srcSet: [800, 1280, 1920, 2560].map((w) => `/hero/hero-${n}-${w}.jpg ${w}w`).join(", "),
});
const BUNDLED_HERO: RotatingFrame[] = [bundled(1), bundled(2), bundled(3)];

/**
 * The five core business lines, each paired with the case category that
 * actually documents it — so the thumbnail beside a service is a real project
 * of that type, not decoration.
 */
const BUSINESSES = [
  { num: "01", key: "home.biz1", caseCategory: "Residential" },
  { num: "02", key: "home.biz2", caseCategory: "Commercial" },
  { num: "03", key: "home.biz3", caseCategory: "Renovation & Resale" },
  { num: "04", key: "home.biz4", caseCategory: "Development" },
  { num: "05", key: "home.biz5", caseCategory: "Hospitality" },
] as const;

const PERSPECTIVES = ["item1", "item2", "item3", "item4", "item5", "item6"] as const;

/** Property display labels — the front end has no `properties.*` i18n keys. */
const PROP_CATEGORY: Record<string, { zh: string; en: string; jp: string }> = {
  residential: { zh: "住宅不動產", en: "Residential", jp: "住宅用不動産" },
  commercial: { zh: "商業與收益型", en: "Commercial", jp: "商業・収益不動産" },
  land: { zh: "土地", en: "Land", jp: "土地" },
  hospitality: { zh: "住宿設施", en: "Hospitality", jp: "宿泊施設" },
};
const PROP_STATUS: Record<string, { zh: string; en: string; jp: string }> = {
  available: { zh: "待售", en: "For Sale", jp: "販売中" },
  negotiating: { zh: "洽談中", en: "In Negotiation", jp: "商談中" },
  sold: { zh: "已成交", en: "Sold", jp: "成約済" },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};
const inView = { once: true, margin: "-70px" } as const;

/**
 * Shared paging logic for the three "browse a page at a time" homepage
 * sections. Same behaviour everywhere; each section renders its slice with a
 * different layout. Bounded (not wrapping) so the counter always reads true.
 */
interface Paged<T> {
  page: number;
  pageCount: number;
  slice: T[];
  next: () => void;
  prev: () => void;
}

function usePaged<T>(items: T[], perPage: number): Paged<T> {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  // A filter/data change can shrink the list under the current page.
  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
  }, [pageCount, page]);
  const p = Math.min(page, pageCount - 1);
  return {
    page: p,
    pageCount,
    slice: items.slice(p * perPage, p * perPage + perPage),
    next: () => setPage((v) => Math.min(v + 1, pageCount - 1)),
    prev: () => setPage((v) => Math.max(v - 1, 0)),
  };
}

/** Counter + prev/next arrows shared by all three paged section headers. */
function SectionPager({
  page,
  pageCount,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center gap-4">
      <span className="font-numeral-display text-sm tabular-nums text-on-surface-variant">
        {String(page + 1).padStart(2, "0")}
        <span className="mx-1.5 text-outline-variant">/</span>
        {String(pageCount).padStart(2, "0")}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 0}
          aria-label={prevLabel}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant text-primary transition-colors hover:border-brand-500 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page === pageCount - 1}
          aria-label={nextLabel}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant text-primary transition-colors hover:border-brand-500 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export function Home() {
  const { t, lang, localePath } = useLanguage();
  const [home, setHome] = useState<SiteSettingsHome>(DEFAULT_HOME);
  const [cases, setCases] = useState<CaseArticle[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    document.title = pickLang(
      lang,
      "Yellow House - 日本在地的實務不動產夥伴 | 株式会社イエローハウスカンパニー",
      "Yellow House - Your Practical Real Estate Partner in Japan | Yellow House Company Inc.",
      "Yellow House - 日本の不動産を実務目線でサポート | 株式会社イエローハウスカンパニー"
    );
  }, [lang]);

  useEffect(() => watchHome(setHome), []);

  useEffect(() => {
    let cancelled = false;
    listPublishedCases()
      .then((rows) => !cancelled && setCases(rows))
      .catch(() => undefined);
    listPublishedNews()
      .then((rows) => !cancelled && setNews(rows))
      .catch(() => undefined);
    listPublishedProperties()
      .then((rows) => !cancelled && setProperties(rows))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const heroTitleLine1 =
    pickLang(lang, home.heroTitleLine1Zh, home.heroTitleLine1En, home.heroTitleLine1Jp) || t("home.hero.title_line1");
  const heroTitleLine2 =
    pickLang(lang, home.heroTitleLine2Zh, home.heroTitleLine2En, home.heroTitleLine2Jp) || t("home.hero.title_line2");
  const heroDesc = pickLang(lang, home.heroDescZh, home.heroDescEn, home.heroDescJp) || t("home.hero.desc");
  const heroCta = pickLang(lang, home.primaryCtaZh, home.primaryCtaEn, home.primaryCtaJp) || t("home.hero.consult");

  const heroFrames: RotatingFrame[] = useMemo(() => {
    const uploaded = (home.heroSlides ?? []).filter((s) => s.image.trim().length > 0);
    if (uploaded.length) return uploaded.map((s) => ({ src: s.image }));
    if (home.heroImage) return [{ src: home.heroImage }];
    return BUNDLED_HERO;
  }, [home.heroSlides, home.heroImage]);

  /** First published case of each business category — the service thumbnails. */
  const caseByCategory = useMemo(() => {
    const map = new Map<string, CaseArticle>();
    cases.forEach((c) => {
      if (!map.has(c.categoryEn) && c.image) map.set(c.categoryEn, c);
    });
    return map;
  }, [cases]);

  /** Cases not already shown as a business thumbnail, for the paged carousel. */
  const railCases = useMemo(() => {
    const used = new Set([...caseByCategory.values()].map((c) => c.id));
    return cases.filter((c) => c.image && !used.has(c.id));
  }, [cases, caseByCategory]);

  const propItems = useMemo(() => properties.filter((p) => p.coverImage), [properties]);
  const newsItems = useMemo(() => news.filter((n) => n.image), [news]);

  // Same paging logic, three page sizes → three visual rhythms.
  const propPager = usePaged<Property>(propItems, 1);
  const casePager = usePaged<CaseArticle>(railCases, 3);
  const newsPager = usePaged<NewsArticle>(newsItems, 4);

  const stats = [
    { icon: "history", label: t("home.stat.experience_label"), value: t("home.stat.experience_val") },
    { icon: "verified", label: t("home.stat.certified_label"), value: t("home.stat.certified_val") },
    { icon: "language", label: t("home.stat.global_label"), value: t("home.stat.global_val") },
    { icon: "description", label: t("home.stat.license_label"), value: t("home.stat.license_val") },
  ];

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-surface">
      {/* ══ A · HERO — full-bleed banner ══════════════════════════════════
          Edge-to-edge photography with the copy on a white panel that laps
          over its lower edge: full-width impact without darkening the image. */}
      <section className="relative w-full">
        <RotatingImage
          frames={heroFrames}
          index={heroIndex}
          onIndexChange={setHeroIndex}
          alt={`${heroTitleLine1}${heroTitleLine2}`}
          sizes="100vw"
          priority
          className="h-[86svh] min-h-[540px] w-full"
        />

        {/* No scrim behind the copy — legibility is carried by .text-shadow-hero
            alone (see the note in index.css). Only a faint bottom wash remains,
            for the carousel dots in the corner. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/25 to-transparent"
        />

        {/* Copy is anchored to the bottom-left of the content column, so it
            reads as one deliberate block rather than floating mid-banner. */}
        <div className="absolute inset-x-0 bottom-0 px-margin-mobile pb-12 md:px-margin-desktop md:pb-16">
          <div className="content-col">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <Kicker tone="onDark">
                {pickLang(lang, "日本正式宅建業執照", "Licensed brokerage in Japan", "正式な宅地建物取引業免許")}
              </Kicker>

              <h1 className="mt-5 font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white text-shadow-hero">
                {heroTitleLine1}
                <br />
                <span className="text-brand-400">{heroTitleLine2}</span>
              </h1>

              <p className="mt-5 line-clamp-3 max-w-xl font-body-md text-body-md leading-relaxed text-white/90 text-shadow-hero">
                {heroDesc}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={localePath("/contact")}
                  className="rounded-lg bg-brand-500 px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:bg-white"
                >
                  {heroCta}
                </Link>
                <Link
                  href={localePath("/services")}
                  className="group flex items-center gap-2 rounded-lg border border-white/50 px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white/15"
                >
                  {t("home.hero.view_properties")}
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Aligned to the content column: bottom-left under the copy on phones
            (clear of the fixed social buttons on the right edge), bottom-right
            on desktop where there is room beside the copy. */}
        {heroFrames.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 px-margin-mobile md:bottom-16 md:px-margin-desktop">
            <div className="content-col flex justify-start md:justify-end">
              <div className="pointer-events-auto flex items-center gap-2">
                {heroFrames.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroIndex(i)}
                    aria-label={pickLang(lang, `前往第 ${i + 1} 張`, `Go to image ${i + 1}`, `${i + 1}枚目へ`)}
                    aria-current={i === heroIndex}
                    className="group flex h-6 items-center"
                  >
                    <span
                      className={`block h-[3px] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-all duration-300 ${
                        i === heroIndex ? "w-10 bg-brand-500" : "w-5 bg-white/60 group-hover:bg-white"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ══ A2 · CREDENTIALS ══════════════════════════════════════════════
          Cards on the page's warm band rather than a solid orange stripe —
          the full-width colour block cut the page in half visually. */}
      <section className="w-full bg-surface pt-12 pb-12 md:pt-16 md:pb-16">
        <div className="px-margin-mobile md:px-margin-desktop">
          {/* 2 x 2 on phones, one row of four from lg. */}
          <div className="content-col grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={inView}
                variants={rise}
                transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
                /* Borderless light card, outline icon top-left, label bottom-left
                   — the layout from the supplied reference. No arrow affordance:
                   these are facts, not links, and an arrow would promise a
                   destination that does not exist. */
                /* Warm card on a white section: a white card on white had no
                   edge to read against. */
                className="flex h-full min-h-[148px] flex-col justify-between gap-6 rounded-xl bg-surface-warm-deep p-4 sm:p-5 md:min-h-[196px] md:p-6"
              >
                <span className="material-symbols-outlined text-[30px] leading-none text-primary/70 md:text-[38px]">
                  {s.icon}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-label-caps text-[10px] uppercase tracking-[0.22em] text-brand-600">
                    {s.label}
                  </span>
                  <span className="font-headline-md text-sm leading-snug text-primary md:text-lg">{s.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ B · BRAND STATEMENT ═══════════════════════════════════════════
          Full-width photograph, statement set on white beneath it.
          No top padding — the credentials block above already supplies the
          gap, and stacking both left an empty band the height of a section. */}
      <section className="w-full pb-section">
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inView}
          transition={{ duration: 0.7 }}
          src="/hero/hero-3-1920.jpg"
          srcSet="/hero/hero-3-1280.jpg 1280w, /hero/hero-3-1920.jpg 1920w, /hero/hero-3-2560.jpg 2560w"
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-[42vh] min-h-[260px] w-full object-cover md:h-[58vh]"
        />
        <div className="px-margin-mobile md:px-margin-desktop">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.55 }}
            className="content-col mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-12 md:gap-gutter"
          >
            <div className="flex flex-col gap-5 md:col-span-5">
              <Kicker>{t("home.perspective.tag")}</Kicker>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                {t("home.perspective.title")}
              </h2>
            </div>
            <div className="flex flex-col items-start gap-6 md:col-span-6 md:col-start-7">
              <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                {t("home.perspective.desc")}
              </p>
              <Link
                href={localePath("/company")}
                className="group inline-flex items-center gap-2 border-b-2 border-brand-500 pb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:text-brand-600"
              >
                {t("home.advisor.cta")}
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ C · CORE BUSINESSES ═══════════════════════════════════════════
          Even two-column grid of thumbnail buttons — same size, same
          baseline, one row height. */}
      <section className="w-full bg-surface-warm py-section px-margin-mobile md:px-margin-desktop">
        <div className="content-col">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between"
          >
            <div className="flex max-w-xl flex-col gap-4">
              <Kicker>{t("home.services.tag")}</Kicker>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                {t("home.services.title")}
              </h2>
            </div>
            <p className="max-w-sm font-body-md text-sm text-on-surface-variant md:pb-2">
              {t("home.services.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {BUSINESSES.map((biz, i) => {
              const sample = caseByCategory.get(biz.caseCategory);
              return (
                <motion.div
                  key={biz.num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={inView}
                  variants={rise}
                  transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
                >
                  <Link
                    href={localePath("/services")}
                    className="group flex h-full items-center gap-4 rounded-2xl border border-outline-variant bg-surface p-4 transition-colors duration-300 hover:border-brand-500 md:gap-5 md:p-5"
                  >
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-surface-warm-deep md:h-28 md:w-36">
                      {sample?.image && (
                        <img
                          src={sample.image}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                        />
                      )}
                      <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-br-xl bg-brand-500 font-numeral-display text-[11px] font-semibold text-primary">
                        {biz.num}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <h3 className="font-headline-md text-base leading-snug text-primary transition-colors group-hover:text-brand-600 md:text-lg">
                        {t(`${biz.key}.title`)}
                      </h3>
                      <p className="line-clamp-2 font-body-md text-xs leading-relaxed text-on-surface-variant md:text-sm">
                        {t(`${biz.key}.desc`)}
                      </p>
                    </div>

                    <span className="material-symbols-outlined shrink-0 text-brand-600 transition-transform duration-300 group-hover:translate-x-1">
                      chevron_right
                    </span>
                  </Link>
                </motion.div>
              );
            })}

            {/* Sixth cell completes the grid and leads to the full service page. */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={rise}
              transition={{ duration: 0.45, delay: 0.06 }}
            >
              <Link
                href={localePath("/services")}
                className="group flex h-full items-center justify-between gap-4 rounded-2xl bg-brand-500 p-4 transition-colors duration-300 hover:bg-primary md:p-5"
              >
                <span className="font-headline-md text-base leading-snug text-primary transition-colors group-hover:text-on-primary md:text-lg">
                  {pickLang(lang, "查看全部服務說明", "View all services", "サービス一覧を見る")}
                </span>
                <span className="material-symbols-outlined shrink-0 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:text-on-primary">
                  arrow_forward
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ D · 在售物件 — spotlight, one property at a time ═══════════════
          The most space-forward of the three paged sections: a single large
          split (image + details) with the pager stepping through listings. */}
      {propItems.length > 0 && (
        <section className="w-full py-section px-margin-mobile md:px-margin-desktop">
          <div className="content-col">
            <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4">
                <Kicker>Properties</Kicker>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                  {pickLang(lang, "在售物件", "Properties for sale", "販売中の物件")}
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href={localePath("/properties")}
                  className="group hidden items-center gap-2 border-b-2 border-brand-500 pb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:text-brand-600 sm:inline-flex"
                >
                  {pickLang(lang, "全部物件", "View all", "すべて見る")}
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
                <SectionPager
                  page={propPager.page}
                  pageCount={propPager.pageCount}
                  onPrev={propPager.prev}
                  onNext={propPager.next}
                  prevLabel={pickLang(lang, "上一件", "Previous", "前へ")}
                  nextLabel={pickLang(lang, "下一件", "Next", "次へ")}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {propPager.slice.map((item) => {
                const specs = [
                  item.layout,
                  item.landAreaSqm && `${pickLang(lang, "土地", "Land", "土地")} ${item.landAreaSqm}㎡`,
                  item.floorAreaSqm && `${pickLang(lang, "建物", "Floor", "建物")} ${item.floorAreaSqm}㎡`,
                  item.buildYear && `${pickLang(lang, "築", "Built", "築")} ${item.buildYear}`,
                ].filter(Boolean) as string[];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-gutter"
                  >
                    <Link
                      href={localePath(`/properties/${item.slug}`)}
                      className="group lg:col-span-7"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-surface-warm">
                        <img
                          src={item.coverImage}
                          alt={pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-surface/90 px-3 py-1 font-label-caps text-[11px] uppercase tracking-wider text-primary backdrop-blur-sm">
                            {pickLang(lang, PROP_CATEGORY[item.category].zh, PROP_CATEGORY[item.category].en, PROP_CATEGORY[item.category].jp)}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 font-label-caps text-[11px] uppercase tracking-wider backdrop-blur-sm ${
                              item.listingStatus === "available" ? "bg-brand-500 text-primary" : "bg-primary/75 text-white"
                            }`}
                          >
                            {pickLang(lang, PROP_STATUS[item.listingStatus].zh, PROP_STATUS[item.listingStatus].en, PROP_STATUS[item.listingStatus].jp)}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col justify-center gap-5 lg:col-span-5">
                      <span className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-brand-600">
                        {pickLang(lang, item.locationZh, item.locationEn, item.locationJp)}
                      </span>
                      <h3 className="font-headline-md text-2xl leading-snug text-primary md:text-3xl">
                        {pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                      </h3>
                      <p className="line-clamp-3 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                        {pickLang(lang, item.summaryZh, item.summaryEn, item.summaryJp)}
                      </p>

                      {specs.length > 0 && (
                        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-outline-variant pt-5">
                          {specs.map((s) => (
                            <li key={s} className="font-headline-md text-sm text-primary">
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
                        {item.priceJPY != null ? (
                          <PriceBlock priceJPY={item.priceJPY} variant="compact" />
                        ) : (
                          <span className="font-headline-md text-lg font-medium text-primary">
                            {pickLang(lang, "價格請洽詢", "Price on request", "価格応相談")}
                          </span>
                        )}
                        <Link
                          href={localePath(`/properties/${item.slug}`)}
                          className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-label-caps text-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-brand-500 hover:text-primary"
                        >
                          {pickLang(lang, "查看物件", "View property", "物件を見る")}
                          <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ══ E · 實績案例 — three cards per page, paged as a set ════════════ */}
      {railCases.length > 0 && (
        <section className="w-full bg-surface-warm py-section px-margin-mobile md:px-margin-desktop">
          <div className="content-col">
            <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4">
                <Kicker>Track record</Kicker>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                  {pickLang(lang, "實績案例", "Selected projects", "実績案例")}
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href={localePath("/cases")}
                  className="group hidden items-center gap-2 border-b-2 border-brand-500 pb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:text-brand-600 sm:inline-flex"
                >
                  {pickLang(lang, "全部案例", "View all", "すべて見る")}
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
                <SectionPager
                  page={casePager.page}
                  pageCount={casePager.pageCount}
                  onPrev={casePager.prev}
                  onNext={casePager.next}
                  prevLabel={pickLang(lang, "上一頁", "Previous", "前へ")}
                  nextLabel={pickLang(lang, "下一頁", "Next", "次へ")}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={casePager.page}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {casePager.slice.map((item) => (
                  <li key={item.id}>
                    <Link href={localePath(`/cases/${item.slug}`)} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
                        <img
                          src={item.image}
                          alt={pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-brand-500 text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined text-base">arrow_outward</span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-4">
                        <span className="font-label-caps text-[11px] uppercase tracking-[0.16em] text-brand-600">
                          {pickLang(lang, item.categoryZh, item.categoryEn, item.categoryJp)}
                        </span>
                        <h3 className="font-headline-md text-base leading-snug text-primary transition-colors group-hover:text-brand-600">
                          {pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                        </h3>
                        <span className="font-body-md text-xs text-on-surface-variant">
                          {pickLang(lang, item.locationZh, item.locationEn, item.locationJp)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ══ F · PERSPECTIVE ═══════════════════════════════════════════════ */}
      <section className="w-full py-section px-margin-mobile md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-gutter">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-surface-warm lg:sticky lg:top-28">
              <img
                src="/hero/hero-1-1280.jpg"
                srcSet="/hero/hero-1-800.jpg 800w, /hero/hero-1-1280.jpg 1280w, /hero/hero-1-1920.jpg 1920w"
                sizes="(min-width: 1024px) 32vw, 100vw"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <div className="lg:col-span-7 lg:col-start-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={rise}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <Kicker>{pickLang(lang, "判斷視角", "How we assess", "判断の視点")}</Kicker>
              <h2 className="max-w-lg font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                {t("home.advisor.title")}
              </h2>
            </motion.div>

            <ul className="mt-10 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {PERSPECTIVES.map((key, i) => (
                <motion.li
                  key={key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={inView}
                  variants={rise}
                  transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
                  className="flex flex-col gap-1.5 border-t border-outline-variant py-6"
                >
                  <span className="font-numeral-display text-sm font-semibold text-brand-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-headline-md text-lg text-primary">
                    {t(`home.perspective.${key}_title`)}
                  </h3>
                  <p className="font-body-md text-sm leading-relaxed text-on-surface-variant">
                    {t(`home.perspective.${key}_desc`)}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ G · REPRESENTATIVE ════════════════════════════════════════════ */}
      <section className="w-full bg-surface-warm py-section px-margin-mobile md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-gutter">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <div className="aspect-[5/4] overflow-hidden rounded-3xl">
              <img
                src="/hero/hero-2-1280.jpg"
                srcSet="/hero/hero-2-800.jpg 800w, /hero/hero-2-1280.jpg 1280w, /hero/hero-2-1920.jpg 1920w"
                sizes="(min-width: 1024px) 48vw, 100vw"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5 lg:col-span-5 lg:col-start-8"
          >
            <Kicker>{t("home.advisor.tag")}</Kicker>
            <div>
              <h3 className="font-headline-md text-2xl font-medium text-primary md:text-3xl">
                {t("home.advisor.name")}
              </h3>
              <p className="mt-1.5 font-label-caps text-sm text-on-surface-variant">{t("home.advisor.role")}</p>
            </div>
            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
              {t("home.advisor.desc")}
            </p>
            <Link
              href={localePath("/company")}
              className="mt-2 self-start rounded-lg border border-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:border-brand-500 hover:bg-brand-500"
            >
              {t("home.advisor.cta")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ H · 最新消息 — editorial list, paged rows ═════════════════════
          The quietest of the three: an index of rows (thumbnail + text), not a
          gallery. Distinct rhythm from the spotlight and the card carousel. */}
      {newsItems.length > 0 && (
        <section className="w-full py-section px-margin-mobile md:px-margin-desktop">
          <div className="content-col">
            <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
              <div className="flex flex-col gap-4">
                <Kicker>Insights</Kicker>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                  {pickLang(lang, "最新消息", "Latest insights", "最新情報")}
                </h2>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href={localePath("/news")}
                  className="group hidden items-center gap-2 border-b-2 border-brand-500 pb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:text-brand-600 sm:inline-flex"
                >
                  {pickLang(lang, "全部消息", "View all", "すべて見る")}
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
                <SectionPager
                  page={newsPager.page}
                  pageCount={newsPager.pageCount}
                  onPrev={newsPager.prev}
                  onNext={newsPager.next}
                  prevLabel={pickLang(lang, "上一頁", "Previous", "前へ")}
                  nextLabel={pickLang(lang, "下一頁", "Next", "次へ")}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={newsPager.page}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col"
              >
                {newsPager.slice.map((item) => (
                  <li key={item.id} className="border-t border-outline-variant last:border-b">
                    <Link
                      href={localePath(`/news/${item.slug}`)}
                      className="group flex items-center gap-5 py-5 md:gap-8 md:py-6"
                    >
                      <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl bg-surface-warm sm:w-36 md:w-44">
                        <img
                          src={item.image}
                          alt={pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <span className="font-label-caps text-[11px] uppercase tracking-[0.16em] text-brand-600">
                          {pickLang(lang, item.categoryZh, item.categoryEn, item.categoryJp)}
                        </span>
                        <h3 className="line-clamp-2 font-headline-md text-base leading-snug text-primary transition-colors group-hover:text-brand-600 md:text-lg">
                          {pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                        </h3>
                      </div>
                      <span className="material-symbols-outlined hidden shrink-0 text-brand-600 transition-transform duration-300 group-hover:translate-x-1 sm:inline">
                        arrow_forward
                      </span>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ══ H · CLOSING CTA ═══════════════════════════════════════════════ */}
      <section className="relative w-full">
        <img
          src="/hero/hero-1-1920.jpg"
          srcSet="/hero/hero-1-1280.jpg 1280w, /hero/hero-1-1920.jpg 1920w, /hero/hero-1-2560.jpg 2560w"
          sizes="100vw"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-[70vh] min-h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center px-margin-mobile md:px-margin-desktop">
          <div className="content-col">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={rise}
              transition={{ duration: 0.55 }}
              className="max-w-xl rounded-3xl bg-brand-500 p-8 shadow-[0_28px_70px_-40px_rgba(21,18,14,0.6)] md:p-12"
            >
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                {t("cta.title")}
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={localePath("/contact")}
                  className="rounded-lg bg-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-surface hover:text-primary"
                >
                  {t("cta.button")}
                </Link>
                <Link
                  href={localePath("/properties")}
                  className="rounded-lg border border-primary/40 px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
                >
                  {t("nav.properties")}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
