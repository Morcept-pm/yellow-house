import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useLanguage } from "../lib/LanguageContext";
import { motion } from "motion/react";
import { listPublishedProperties } from "../lib/content/properties";
import type { Property, PropertyCategory } from "../types/content";
import { PriceBlock } from "../components/PriceBlock";
import { PageBanner } from "../components/PageBanner";
import { ClosingCta } from "../components/ClosingCta";
import { Kicker } from "../components/Kicker";
import { pickLang } from "../lib/utils";

const CATEGORY_LABELS: Record<PropertyCategory, { zh: string; en: string; jp: string }> = {
  residential: { zh: "住宅不動產", en: "Residential", jp: "住宅用不動産" },
  commercial: { zh: "商業與收益型", en: "Commercial", jp: "商業・収益不動産" },
  land: { zh: "土地", en: "Land", jp: "土地" },
  hospitality: { zh: "住宿設施", en: "Hospitality", jp: "宿泊施設" },
};

const STATUS_LABELS: Record<Property["listingStatus"], { zh: string; en: string; jp: string }> = {
  available: { zh: "待售", en: "For Sale", jp: "販売中" },
  negotiating: { zh: "洽談中", en: "In Negotiation", jp: "商談中" },
  sold: { zh: "已成交", en: "Sold", jp: "成約済" },
};

const PER_PAGE = 8;

type StatusKey = "ALL" | Property["listingStatus"];
type CategoryKey = "ALL" | PropertyCategory;

/** A filter group rendered as a row of text links, not buttons. */
function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 border-t border-outline-variant py-5 md:grid-cols-12 md:gap-6">
      <span className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-brand-600 md:col-span-3">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:col-span-9">
        {options.map((o) => {
          const active = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange(o.key)}
              aria-pressed={active}
              className={`cursor-pointer font-body-md text-sm transition-colors ${
                active
                  ? "text-primary underline decoration-brand-500 decoration-2 underline-offset-[6px]"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Properties() {
  const { lang, localePath } = useLanguage();
  const [category, setCategory] = useState<CategoryKey>("ALL");
  const [status, setStatus] = useState<StatusKey>("ALL");
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = pickLang(lang, "Yellow House - 在售物件", "Yellow House - Properties for Sale", "Yellow House - 販売物件");
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    listPublishedProperties()
      .then((data) => !cancelled && setProperties(data))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Any filter change restarts paging, otherwise page 3 of a 1-page result is blank.
  useEffect(() => setPage(1), [category, status]);

  const categoryOptions: { key: CategoryKey; label: string }[] = [
    { key: "ALL", label: pickLang(lang, "全部", "All", "すべて") },
    ...(Object.keys(CATEGORY_LABELS) as PropertyCategory[]).map((key) => ({
      key: key as CategoryKey,
      label: pickLang(lang, CATEGORY_LABELS[key].zh, CATEGORY_LABELS[key].en, CATEGORY_LABELS[key].jp),
    })),
  ];

  const statusOptions: { key: StatusKey; label: string }[] = [
    { key: "ALL", label: pickLang(lang, "全部", "All", "すべて") },
    ...(Object.keys(STATUS_LABELS) as Property["listingStatus"][]).map((key) => ({
      key: key as StatusKey,
      label: pickLang(lang, STATUS_LABELS[key].zh, STATUS_LABELS[key].en, STATUS_LABELS[key].jp),
    })),
  ];

  const filtered = useMemo(
    () =>
      properties.filter(
        (p) => (category === "ALL" || p.category === category) && (status === "ALL" || p.listingStatus === status)
      ),
    [properties, category, status]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const emptyMessage = loading
    ? pickLang(lang, "載入中⋯", "Loading…", "読み込み中…")
    : error
    ? pickLang(lang, "載入物件時發生錯誤，請稍後再試。", "Failed to load properties. Please try again later.", "物件の読み込みに失敗しました。")
    : filtered.length === 0
    ? pickLang(lang, "沒有符合條件的物件。", "No properties match these filters.", "条件に一致する物件はありません。")
    : null;

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-surface font-body-md text-on-surface">
      <PageBanner
        image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2000&q=85"
        kicker={pickLang(lang, "在售物件", "Properties for sale", "販売物件")}
        title={pickLang(lang, "目前在售物件", "Current properties for sale", "現在販売中の物件")}
        desc={pickLang(
          lang,
          "精選目前實際在售的住宅、商用與土地物件，皆由本公司實際勘查與盡職調查後上架。",
          "A curated selection of residential, commercial, and land properties currently for sale, each verified through our own on-site due diligence.",
          "現在販売中の住宅・商業・土地物件を厳選してご紹介。すべて当社が現地調査を行ったうえで掲載しています。"
        )}
      />

      {/* ══ INDEX — grouped text-link filters ═════════════════════════════ */}
      <section className="w-full px-margin-mobile pt-section md:px-margin-desktop">
        <div className="content-col">
          <Kicker>Index</Kicker>
          <h2 className="mt-4 font-headline-md text-xl text-primary md:text-2xl">
            {pickLang(lang, "依條件篩選", "Refine your search", "条件から探す")}
          </h2>

          <div className="mt-8 flex flex-col">
            <FilterGroup
              label={pickLang(lang, "物件類型", "Property type", "物件タイプ")}
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
            <FilterGroup
              label={pickLang(lang, "銷售狀態", "Availability", "販売状況")}
              options={statusOptions}
              value={status}
              onChange={setStatus}
            />
            <div className="border-t border-outline-variant pt-5">
              <span className="font-body-md text-sm text-on-surface-variant">
                {pickLang(
                  lang,
                  `共 ${filtered.length} 件物件`,
                  `${filtered.length} ${filtered.length === 1 ? "property" : "properties"}`,
                  `全 ${filtered.length} 件`
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LISTING — one wide row per property ═══════════════════════════ */}
      <section className="w-full px-margin-mobile pb-section pt-12 md:px-margin-desktop">
        <div className="content-col">
          {emptyMessage && (
            <p className="py-20 text-center font-body-md text-on-surface-variant">{emptyMessage}</p>
          )}

          <ul className="flex flex-col">
            {current.map((item, i) => {
              const title = pickLang(lang, item.titleZh, item.titleEn, item.titleJp);
              const summary = pickLang(lang, item.summaryZh, item.summaryEn, item.summaryJp);
              const category = pickLang(lang, CATEGORY_LABELS[item.category].zh, CATEGORY_LABELS[item.category].en, CATEGORY_LABELS[item.category].jp);
              const location = pickLang(lang, item.locationZh, item.locationEn, item.locationJp);
              const statusLabel = pickLang(lang, STATUS_LABELS[item.listingStatus].zh, STATUS_LABELS[item.listingStatus].en, STATUS_LABELS[item.listingStatus].jp);

              /* Spec pairs, built only from fields this record actually has. */
              const specs = [
                item.layout && { label: pickLang(lang, "格局", "Layout", "間取り"), value: item.layout },
                item.landAreaSqm && {
                  label: pickLang(lang, "土地面積", "Land area", "土地面積"),
                  value: `${item.landAreaSqm} ㎡`,
                },
                item.floorAreaSqm && {
                  label: pickLang(lang, "建物面積", "Floor area", "建物面積"),
                  value: `${item.floorAreaSqm} ㎡`,
                },
                item.buildYear && {
                  label: pickLang(lang, "建築年", "Built", "築年"),
                  value: String(item.buildYear),
                },
              ].filter(Boolean) as { label: string; value: string }[];

              const tags = [category, statusLabel, location, item.layout].filter(Boolean) as string[];

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.05 }}
                  className="border-t border-outline-variant first:border-t-0"
                >
                  <Link
                    href={localePath(`/properties/${item.slug}`)}
                    className="group grid grid-cols-1 gap-6 py-8 md:grid-cols-12 md:gap-10 md:py-10"
                  >
                    <div className="md:col-span-5">
                      {/* 3:2 rather than 4:3 — a 4:3 crop ran taller than the
                          text column and left a dead gap above the price. */}
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface-warm">
                        <img
                          src={item.coverImage}
                          alt={title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                        {item.listingStatus === "sold" && (
                          <span className="absolute left-3 top-3 rounded-full bg-primary/80 px-3 py-1 font-label-caps text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">
                            {statusLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:col-span-7">
                      <div className="flex flex-col gap-2">
                        <span className="font-label-caps text-[11px] uppercase tracking-[0.18em] text-brand-600">
                          {location}
                        </span>
                        <h3 className="font-headline-md text-xl leading-snug text-primary transition-colors group-hover:text-brand-600 md:text-2xl">
                          {title}
                        </h3>
                        <p className="line-clamp-2 font-body-md text-sm leading-relaxed text-on-surface-variant">
                          {summary}
                        </p>
                      </div>

                      {specs.length > 0 && (
                        <dl className="flex flex-wrap gap-x-8 gap-y-2 border-t border-outline-variant pt-4">
                          {specs.map((s) => (
                            <div key={s.label} className="flex items-baseline gap-2">
                              <dt className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant">
                                {s.label}
                              </dt>
                              <dd className="font-headline-md text-sm text-primary">{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* Grey chips, the reference page's tag cluster. */}
                      <ul className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full bg-surface-warm-deep px-3 py-1 font-body-md text-xs text-on-surface-variant"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-2">
                        {item.priceJPY != null ? (
                          <PriceBlock priceJPY={item.priceJPY} variant="compact" />
                        ) : (
                          <span className="font-headline-md text-lg font-medium text-primary">
                            {pickLang(lang, "價格請洽詢", "Price on request", "価格応相談")}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest text-primary transition-colors group-hover:text-brand-600">
                          {pickLang(lang, "查看詳情", "View details", "詳細を見る")}
                          <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {pageCount > 1 && (
            <nav
              aria-label={pickLang(lang, "分頁", "Pagination", "ページ送り")}
              className="mt-14 flex items-center justify-center gap-1 border-t border-outline-variant pt-10"
            >
              {[
                { key: "first", icon: "keyboard_double_arrow_left", to: 1, disabled: page === 1 },
                { key: "prev", icon: "chevron_left", to: page - 1, disabled: page === 1 },
              ].map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => setPage(b.to)}
                  disabled={b.disabled}
                  aria-label={b.key}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-warm hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-lg">{b.icon}</span>
                </button>
              ))}

              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`h-10 min-w-10 rounded-full px-3 font-numeral-display text-sm transition-colors ${
                    n === page
                      ? "bg-brand-500 text-primary"
                      : "text-on-surface-variant hover:bg-surface-warm hover:text-primary"
                  }`}
                >
                  {n}
                </button>
              ))}

              {[
                { key: "next", icon: "chevron_right", to: page + 1, disabled: page === pageCount },
                { key: "last", icon: "keyboard_double_arrow_right", to: pageCount, disabled: page === pageCount },
              ].map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => setPage(b.to)}
                  disabled={b.disabled}
                  aria-label={b.key}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-warm hover:text-primary disabled:pointer-events-none disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-lg">{b.icon}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </section>

      <ClosingCta
        title={pickLang(
          lang,
          "找不到理想的物件？歡迎與我們聯繫",
          "Can't find the right property? Talk to us.",
          "ご希望の物件が見つからない方はお気軽にご相談ください"
        )}
      />
    </div>
  );
}
