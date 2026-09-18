import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { useGeneral } from "../lib/useGeneral";
import { ClosingCta } from "../components/ClosingCta";
import { PageBanner } from "../components/PageBanner";
import { Kicker } from "../components/Kicker";
import { pickLang } from "../lib/utils";

const rise = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const inView = { once: true, margin: "-70px" } as const;

export function Company() {
  const { t, lang, localePath } = useLanguage();
  const general = useGeneral();

  useEffect(() => {
    document.title = pickLang(
      lang,
      "Yellow House - 公司簡介 | 株式会社イエローハウスカンパニー",
      "Yellow House - Company Profile | Yellow House Company Inc.",
      "Yellow House - 会社案内 | 株式会社イエローハウスカンパニー"
    );
  }, [lang]);

  // Company facts, read live from the admin-editable settings doc.
  const overview = [
    { label: pickLang(lang, "公司名稱", "Company", "会社名"), value: pickLang(lang, general.companyNameZh, general.companyNameEn, general.companyNameJp) },
    { label: pickLang(lang, "所在地", "Location", "所在地"), value: pickLang(lang, general.addressZh, general.addressEn, general.addressJp) },
    { label: pickLang(lang, "宅建業執照", "License", "免許"), value: pickLang(lang, general.licenseZh, general.licenseEn, general.licenseJp) },
    general.email && { label: "Email", value: general.email },
    general.phone && { label: pickLang(lang, "電話", "Phone", "電話"), value: general.phone },
    { label: pickLang(lang, "營業時間", "Hours", "営業時間"), value: pickLang(lang, general.hoursZh, general.hoursEn, general.hoursJp) },
  ].filter(Boolean) as { label: string; value: string }[];

  const mapQuery = encodeURIComponent(general.addressJp.replace(/\n/g, " "));

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-surface">
      <PageBanner
        image="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=2000&q=85"
        kicker={t("company.banner.tag")}
        title={t("company.banner.h1")}
        desc={t("company.banner.desc")}
      >
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-white text-shadow-hero">
            {pickLang(lang, "實務經驗 15 年", "15 years track record", "実務経験15年")}
          </span>
          <span className="font-label-caps text-label-caps font-semibold uppercase tracking-widest text-brand-400 text-shadow-hero">
            KANAGAWA, JAPAN
          </span>
        </div>
      </PageBanner>

      {/* ══ 代表人訊息 ════════════════════════════════════════════════════ */}
      <section className="w-full px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-gutter">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-surface-warm">
              <img
                src="/hero/hero-2-1280.jpg"
                srcSet="/hero/hero-2-800.jpg 800w, /hero/hero-2-1280.jpg 1280w, /hero/hero-2-1920.jpg 1920w"
                sizes="(min-width: 1024px) 40vw, 100vw"
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
            className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7"
          >
            <Kicker>{t("company.rep.tag")}</Kicker>
            <h2 className="whitespace-pre-line font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              {t("company.rep.headline")}
            </h2>
            <div className="flex max-w-prose flex-col gap-5 font-body-md text-body-md leading-relaxed text-on-surface-variant">
              <p>{t("company.rep.p1")}</p>
              <p>{t("company.rep.p2")}</p>
            </div>
            <p className="font-label-caps text-sm font-semibold tracking-wider text-primary">
              {pickLang(
                lang,
                "黃經祐 ｜ 代表人・房東・不動產投資人",
                "Kei-Yu Huang ｜ Representative Director ・ Landlord ・ Investor",
                "黄経祐 ｜ 代表・オーナー・不動産投資家"
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ 核心理念 — soft quote band ════════════════════════════════════ */}
      <section className="w-full bg-surface-warm px-margin-mobile py-section md:px-margin-desktop">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          variants={rise}
          transition={{ duration: 0.55 }}
          className="content-col mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
        >
          <span className="font-display-lg text-6xl leading-none text-brand-400">“</span>
          <h2 className="-mt-6 whitespace-pre-line font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg leading-snug text-primary">
            {t("company.quote")}
          </h2>
          <p className="mt-2 max-w-2xl font-body-md text-body-md leading-relaxed text-on-surface-variant">
            {t("company.quote_desc")}
          </p>
        </motion.div>
      </section>

      {/* ══ 公司基本資料 — airy definition list ═══════════════════════════ */}
      <section className="w-full px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Kicker>{t("company.overview.tag")}</Kicker>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              {t("company.overview.title")}
            </h2>
          </div>

          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            className="flex flex-col lg:col-span-7 lg:col-start-6"
          >
            {overview.map((row) => (
              <motion.div
                key={row.label}
                variants={rise}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 gap-1 border-b border-outline-variant py-5 first:border-t md:grid-cols-4 md:gap-6 md:py-6"
              >
                <dt className="font-label-caps text-[11px] uppercase tracking-[0.16em] text-brand-600 md:pt-1">
                  {row.label}
                </dt>
                <dd className="whitespace-pre-line font-body-md text-body-md leading-relaxed text-primary md:col-span-3">
                  {row.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ══ 本社所在地 — bright image + address ═══════════════════════════ */}
      <section className="w-full bg-surface-warm px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-gutter">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5 }}
            className="order-1 flex flex-col gap-6 lg:col-span-5"
          >
            <Kicker>{t("company.visit.tag")}</Kicker>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              {t("company.visit.title")}
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <span className="material-symbols-outlined mt-0.5 text-[20px] text-brand-600" aria-hidden="true">
                  location_on
                </span>
                <p className="whitespace-pre-line font-body-md text-body-md leading-relaxed text-primary">
                  {pickLang(lang, general.addressZh, general.addressEn, general.addressJp)}
                </p>
              </div>
              {general.email && (
                <div className="flex gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-brand-600" aria-hidden="true">
                    mail
                  </span>
                  <a
                    href={`mailto:${general.email}`}
                    className="font-body-md text-body-md text-primary underline-offset-4 transition-colors hover:text-brand-600 hover:underline"
                  >
                    {general.email}
                  </a>
                </div>
              )}
              <div className="flex gap-3">
                <span className="material-symbols-outlined mt-0.5 text-[20px] text-brand-600" aria-hidden="true">
                  schedule
                </span>
                <p className="whitespace-pre-line font-body-md text-sm leading-relaxed text-primary">
                  {pickLang(lang, general.hoursZh, general.hoursEn, general.hoursJp)}
                </p>
              </div>
            </div>

            <Link
              href={localePath("/contact")}
              className="group mt-2 inline-flex items-center gap-2 self-start rounded-lg border border-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:border-brand-500 hover:bg-brand-500"
            >
              {t("cta.button")}
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 lg:col-span-6 lg:col-start-7"
          >
            {/* Real map, soft and bright — no dark overlay, no black label box. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-outline-variant bg-surface md:aspect-[16/11]">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 flex items-end p-5"
              >
                <span className="rounded-full bg-surface/90 px-4 py-1.5 font-label-caps text-[11px] uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
                  {pickLang(lang, "在 Google 地圖開啟", "Open in Google Maps", "Google マップで開く")}
                </span>
              </a>
              <iframe
                title={t("company.visit.title")}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.15]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <ClosingCta title={t("cta.title")} />
    </div>
  );
}
