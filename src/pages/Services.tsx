import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { PageBanner } from "../components/PageBanner";
import { ClosingCta } from "../components/ClosingCta";
import { Kicker } from "../components/Kicker";
import { pickLang } from "../lib/utils";

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

  useEffect(() => {
    document.title = pickLang(
      lang,
      "Yellow House - 服務項目",
      "Yellow House - Services",
      "Yellow House - サービス内容"
    );
  }, [lang]);

  const acquisitionSteps =
    lang === "zh"
      ? [
          { title: "初步諮詢與需求確認", desc: "深入了解您的購置目的、預算範圍及特定偏好，為後續物件篩選奠定基礎。" },
          { title: "物件提案與篩選", desc: "提供符合條件之精選物件清單，包含獨家未公開案源，並進行優劣勢分析。" },
          { title: "現場看屋與環境勘查", desc: "安排專人陪同視察物件實況，檢視周邊環境機能與建築結構品質。" },
          { title: "價格協商與條件斡旋", desc: "代表買方與賣方進行價格及交易條件交涉，確保客戶利益最大化。" },
          { title: "重要事項說明與簽約", desc: "由專業宅地建物取引士進行詳盡的產權及法規說明，確認無誤後簽署買賣契約。" },
          { title: "貸款協助與資金規劃", desc: "協助外籍人士對接合適之金融機構辦理貸款，並規劃跨國匯款流程。" },
          { title: "交屋結算與產權移轉", desc: "會同司法書士辦理尾款結算及所有權移轉登記，正式交付鑰匙與產權文件。" },
        ]
      : lang === "jp"
      ? [
          { title: "初回相談とご要望の確認", desc: "ご購入の目的、ご予算、具体的なご希望を丁寧にヒアリングし、後続の物件選定の土台を構築します。" },
          { title: "物件のご提案と絞り込み", desc: "未公開物件を含む厳選リストをご提供し、それぞれのメリット・デメリットを分析いたします。" },
          { title: "内見と周辺環境の確認", desc: "専任担当が同行し、物件の実際の状態や周辺環境、建物の構造品質を確認します。" },
          { title: "価格交渉と条件調整", desc: "買主様の代理として売主様と価格及び取引条件を交渉し、お客様の利益を最大化します。" },
          { title: "重要事項説明とご契約", desc: "専門の宅地建物取引士が権利関係及び法令に関する詳細な説明を行い、ご納得いただいた上でご契約を締結します。" },
          { title: "融資サポートと資金計画", desc: "海外のお客様に適した金融機関との連携を支援し、国際送金の手続きを計画します。" },
          { title: "決済と所有権移転", desc: "司法書士と連携して残代金の決済及び所有権移転登記を行い、鍵と権利書類を正式にお引き渡しします。" },
        ]
      : [
          { title: "Initial Consultation & Goal Alignment", desc: "Deep dive into your purchase purpose, budget structure, and timeline to form a strategic baseline." },
          { title: "Curated Proposal & Off-Market Sourcing", desc: "Shortlist prime and exclusive off-market properties with exhaustive comparative analysis." },
          { title: "Private Viewings & Site Inspection", desc: "Coordinate discreet on-site or high-definition live virtual tours covering architectural build and neighborhood." },
          { title: "Price Negotiation & Terms Structuring", desc: "Actively advocate for your financial and contract terms to maximize value and security." },
          { title: "Explanation of Important Matters & Contract", desc: "Conducted by licensed Real Estate Transaction Specialists (宅建士) before formal signing." },
          { title: "Cross-Border Financing & Fund Flow", desc: "Introduce leading banks for non-resident mortgages and structure compliant capital routing." },
          { title: "Final Settlement & Title Transfer", desc: "Complete deed transfer and title registration with licensed judicial scriveners, followed by key handover." },
        ];

  const transactionPhases =
    lang === "zh"
      ? [
          { phase: "PHASE 01", icon: "account_balance_wallet", title: "準備階段", desc: "資金規劃與文件審核，確保買賣資格與跨境資金流暢到位。", items: ["資金證明備妥", "護照與身分認證文件", "印鑑證明申請"] },
          { phase: "PHASE 02", icon: "description", title: "執行階段", desc: "出具正式買付證明書，代表買方進行價格條件斡旋與簽約期程確認。", items: ["提出買付證明書", "賣方承諾與條件合意", "安排簽約日程"] },
          { phase: "PHASE 03", icon: "draw", title: "契約階段", desc: "宅建士重要事項說明與公證契約締結，確保法令產權無虞。", items: ["繳交訂金 (房價5-10%)", "簽署買賣契約書", "印花稅票貼付"] },
          { phase: "PHASE 04", icon: "key", title: "結算階段", desc: "司法書士共同會審完成尾款清算、稅費繳交與所有權移轉登記。", items: ["支付尾款與各項稅費", "辦理登記手續", "房屋點交與鑰匙交付"] },
        ]
      : lang === "jp"
      ? [
          { phase: "PHASE 01", icon: "account_balance_wallet", title: "準備段階", desc: "資金計画と書類確認を行い、取引資格と国際送金をスムーズに整えます。", items: ["資金証明のご用意", "パスポート及び本人確認書類", "印鑑証明の取得"] },
          { phase: "PHASE 02", icon: "description", title: "実行段階", desc: "正式な買付証明書を発行し、買主様の代理として価格交渉及び契約スケジュールを調整します。", items: ["買付証明書の提出", "売主様の承諾と条件合意", "契約日程の調整"] },
          { phase: "PHASE 03", icon: "draw", title: "契約段階", desc: "宅地建物取引士による重要事項説明と契約締結を行い、法的な権利関係を確実にします。", items: ["手付金のお支払い（物件価格の5〜10%）", "売買契約書へのご署名", "印紙税の貼付"] },
          { phase: "PHASE 04", icon: "key", title: "決済段階", desc: "司法書士立会いのもと残代金の決済、諸費用のお支払い、所有権移転登記を行います。", items: ["残代金及び諸費用のお支払い", "登記手続き", "鍵の引き渡し"] },
        ]
      : [
          { phase: "PHASE 01", icon: "account_balance_wallet", title: "Preparation", desc: "Capital planning, KYC verification, and notarized identity documentation readiness.", items: ["Proof of funds readiness", "Passport & notarized affidavit", "Affidavit of seal verification"] },
          { phase: "PHASE 02", icon: "description", title: "Execution", desc: "Issuing formal Letter of Intent, price negotiation, and timeline alignment with vendor.", items: ["Letter of Intent (買付證明書)", "Terms alignment with vendor", "Contract scheduling"] },
          { phase: "PHASE 03", icon: "draw", title: "Contract", desc: "Statutory explanation of important matters by licensed specialist and agreement execution.", items: ["Deposit payment (typically 5-10%)", "Purchase agreement execution", "Stamp duty tax handling"] },
          { phase: "PHASE 04", icon: "key", title: "Settlement", desc: "Final balance settlement, tax payment, and title transfer registration with judicial scriveners.", items: ["Balance & closing costs", "Title registration", "Handover & key delivery"] },
        ];

  const taxes = [
    { icon: "shopping_cart", label: t("services.taxes.buy_label"), val: t("services.taxes.buy_val") },
    { icon: "home_work", label: t("services.taxes.hold_label"), val: t("services.taxes.hold_val") },
    { icon: "sell", label: t("services.taxes.sell_label"), val: t("services.taxes.sell_val") },
  ];

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-surface">
      <PageBanner
        image="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85"
        kicker={t("services.banner.tag")}
        title={t("services.banner.h1")}
        desc={t("services.banner.desc")}
      />

      {/* ══ 五大業務 — every service gets its own full-width image row ══════ */}
      <section className="w-full px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col flex flex-col gap-4">
          <Kicker>{t("home.services.tag")}</Kicker>
          <h2 className="max-w-xl font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            {t("home.services.title")}
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
                <h3 className="font-headline-md text-2xl text-primary md:text-[28px]">{t(`${svc.key}.title`)}</h3>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {t(`${svc.key}.desc`)}
                </p>
                <ul className="mt-1 flex flex-col gap-2.5">
                  {["item1", "item2", "item3"].map((n) => (
                    <li key={n} className="flex items-start gap-2.5 font-body-md text-sm text-primary">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                      <span>{t(`${svc.key}.${n}`)}</span>
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
            {t("services.flow.title")}
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
            {t("services.steps.title")}
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
              {t("services.taxes.title")}
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
              {t("services.mgmt.title")}
            </h2>
            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
              {t("services.mgmt.desc")}
            </p>
            <ul className="mt-1 flex flex-col gap-2.5">
              {["item1", "item2", "item3", "item4"].map((n) => (
                <li key={n} className="flex items-start gap-2.5 font-body-md text-sm text-primary">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                  <span>{t(`services.mgmt.${n}`)}</span>
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

      <ClosingCta title={t("services.cta.title")} />
    </div>
  );
}
