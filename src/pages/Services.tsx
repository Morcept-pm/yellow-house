import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { PageBanner } from "../components/PageBanner";
import { ClosingCta } from "../components/ClosingCta";
import { Kicker } from "../components/Kicker";
import { pickLang } from "../lib/utils";
import { useHomeSettings, useServicesSettings, tr } from "../lib/useSiteSettings";

/**
 * The five core business lines. Each carries its own photograph — the previous
 * version hid four of the five behind a tab switcher, which worked against the
 * brief of leading with imagery.
 */
const CORE_SERVICES = [
  {
    key: "home.biz1",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    icon: "real_estate_agent",
  },
  {
    key: "home.biz2",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    icon: "manage_accounts",
  },
  {
    key: "home.biz3",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    icon: "domain_add",
  },
  {
    key: "home.biz4",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85",
    icon: "architecture",
  },
  {
    key: "home.biz5",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85",
    icon: "hotel",
  },
] as const;

const rise = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const inView = { once: true, margin: "-70px" } as const;

export function Services() {
  const { t, lang, localePath } = useLanguage();
  const home = useHomeSettings();
  const services = useServicesSettings();
  const sv = (base: string) => tr(services, base, lang);
  const biz = (i: number, field: string, fallbackKey: string) => {
    const entry = home.bizTourItems?.[i];
    return (entry && tr(entry, field, lang)) || t(fallbackKey);
  };

  useEffect(() => {
    document.title = pickLang(
      lang,
      "Yellow House - 服務項目",
      "Yellow House - Services",
      "Yellow House - サービス内容"
    );
  }, [lang]);

  // Copy is admin-editable: the five businesses come from the homepage's
  // 主要業務範疇 list (site_settings/home), everything else from
  // site_settings/services. Icons and phase numbers stay in code.
  const acquisitionSteps = services.acquisitionSteps.map((step) => ({
    title: tr(step, "title", lang),
    desc: tr(step, "desc", lang),
  }));

  const PHASE_ICONS = ["account_balance_wallet", "description", "draw", "key"];
  const transactionPhases = services.transactionPhases.map((p, i) => ({
    phase: `PHASE ${String(i + 1).padStart(2, "0")}`,
    icon: PHASE_ICONS[i] ?? "check_circle",
    title: tr(p, "title", lang),
    desc: tr(p, "desc", lang),
    items: [tr(p, "item1", lang), tr(p, "item2", lang), tr(p, "item3", lang)].filter(Boolean),
  }));

  const taxes = [
    { icon: "shopping_cart", label: sv("buyLabel"), val: sv("buyVal") },
    { icon: "home_work", label: sv("holdLabel"), val: sv("holdVal") },
    { icon: "sell", label: sv("sellLabel"), val: sv("sellVal") },
  ];

  const mgmtItems = [sv("mgmtItem1"), sv("mgmtItem2"), sv("mgmtItem3"), sv("mgmtItem4")].filter(Boolean);

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-surface">
      <PageBanner
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85"
        kicker={sv("bannerTag")}
        title={sv("bannerH1")}
        desc={sv("bannerDesc")}
      />

      {/* ══ 五大業務 — every service gets its own full-width image row ══════ */}
      <section className="w-full px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col flex flex-col gap-4">
          <Kicker>{t("home.services.tag")}</Kicker>
          <h2 className="max-w-xl font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            {tr(home, "bizTourTitle", lang) || t("home.services.title")}
          </h2>
        </div>

        <div className="content-col mt-14 flex flex-col gap-16 md:gap-24">
          {CORE_SERVICES.map((svc, i) => (
            <motion.article
              key={svc.key}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={rise}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-gutter"
            >
              {/* Alternating sides keep the eye moving down the page. */}
              <div className={`md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}>
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-surface-warm">
                  <img
                    src={svc.img}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.04]"
                  />
                </div>
              </div>

              <div className={`flex flex-col gap-4 md:col-span-5 ${i % 2 ? "md:order-1 md:col-start-1" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <span className="material-symbols-outlined text-xl">{svc.icon}</span>
                  </span>
                  <span className="font-numeral-display text-sm font-semibold text-brand-600">
                    {t(`${svc.key}.num`)}
                  </span>
                </div>
                <h3 className="font-headline-md text-2xl text-primary md:text-[28px]">{biz(i, "title", `${svc.key}.title`)}</h3>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {biz(i, "desc", `${svc.key}.desc`)}
                </p>
                <ul className="mt-1 flex flex-col gap-2.5">
                  {["item1", "item2", "item3"].map((n) => (
                    <li key={n} className="flex items-start gap-2.5 font-body-md text-sm text-primary">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                      <span>{biz(i, n, `${svc.key}.${n}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ══ 交易四階段 — even card grid ═══════════════════════════════════ */}
      <section className="w-full bg-surface-warm px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col flex flex-col gap-4">
          <Kicker>{pickLang(lang, "交易流程", "Transaction flow", "取引の流れ")}</Kicker>
          <h2 className="max-w-xl font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            {sv("flowTitle")}
          </h2>
        </div>

        <div className="content-col mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {transactionPhases.map((p, i) => (
            <motion.div
              key={p.phase}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={rise}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              className="flex h-full flex-col gap-5 rounded-xl bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[34px] leading-none text-primary/70">{p.icon}</span>
                <span className="font-numeral-display text-[11px] uppercase tracking-[0.18em] text-brand-600">
                  {p.phase}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-headline-md text-lg text-primary">{p.title}</h3>
                <p className="font-body-md text-sm leading-relaxed text-on-surface-variant">{p.desc}</p>
              </div>
              <ul className="mt-auto flex flex-col gap-2 border-t border-outline-variant pt-4">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 font-body-md text-xs text-primary">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ 購置七步驟 — numbered two-column list ═════════════════════════ */}
      <section className="w-full px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col flex flex-col gap-4">
          <Kicker>{pickLang(lang, "購置流程", "Step by step", "購入ステップ")}</Kicker>
          <h2 className="max-w-xl font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            {sv("stepsTitle")}
          </h2>
        </div>

        <ol className="content-col mt-12 grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {acquisitionSteps.map((step, i) => (
            <motion.li
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              variants={rise}
              transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
              className="flex gap-5 border-t border-outline-variant py-6"
            >
              <span className="font-numeral-display text-sm font-semibold text-brand-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-headline-md text-lg leading-snug text-primary">{step.title}</h3>
                <p className="font-body-md text-sm leading-relaxed text-on-surface-variant">{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ══ 稅費 ══════════════════════════════════════════════════════════ */}
      <section className="w-full bg-surface-warm px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Kicker>{pickLang(lang, "費用與稅務", "Costs & taxes", "費用と税金")}</Kicker>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              {sv("taxesTitle")}
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-7 lg:col-start-6">
            {taxes.map((tax, i) => (
              <motion.div
                key={tax.label}
                initial="hidden"
                whileInView="visible"
                viewport={inView}
                variants={rise}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex items-start gap-5 rounded-xl bg-surface p-6"
              >
                <span className="material-symbols-outlined shrink-0 text-[30px] leading-none text-primary/70">
                  {tax.icon}
                </span>
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-brand-600">
                    {tax.label}
                  </span>
                  <p className="font-body-md text-sm leading-relaxed text-primary">{tax.val}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 租賃管理 ══════════════════════════════════════════════════════ */}
      <section className="w-full px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-gutter">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={rise}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <div className="aspect-[5/4] overflow-hidden rounded-2xl bg-surface-warm">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85"
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
            <Kicker>{pickLang(lang, "租賃管理", "Leasing & management", "賃貸管理")}</Kicker>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              {sv("mgmtTitle")}
            </h2>
            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
              {sv("mgmtDesc")}
            </p>
            <ul className="mt-1 flex flex-col gap-2.5">
              {mgmtItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-body-md text-sm text-primary">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={localePath("/properties")}
              className="group mt-3 inline-flex items-center gap-2 self-start border-b-2 border-brand-500 pb-1 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors hover:text-brand-600"
            >
              {pickLang(lang, "查看在售物件", "View properties", "販売物件を見る")}
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <ClosingCta title={sv("ctaTitle")} buttonLabel={sv("ctaBtn")} />
    </div>
  );
}
