import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "../lib/LanguageContext";
import { ClosingCta } from "../components/ClosingCta";
import { PageBanner } from "../components/PageBanner";
import { motion } from "motion/react";
import { listPublishedCases } from "../lib/content/cases";
import type { CaseArticle } from "../types/content";
import { ArrowChip } from "../components/ArrowChip";
import { PriceBlock } from "../components/PriceBlock";
import { pickLang } from "../lib/utils";

export function Cases() {
  const { t, lang, localePath } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;
  const [casesData, setCasesData] = useState<CaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title =
      lang === "zh" ? "Yellow House - 實績案例" : lang === "jp" ? "Yellow House - 実績紹介" : "Yellow House - Case Studies";
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    listPublishedCases()
      .then((data) => {
        if (!cancelled) setCasesData(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Categories list
  const categories = [
    { key: "ALL", labelZh: "全部案例", labelEn: "All Cases", labelJp: "すべての実績" },
    { key: "RESIDENTIAL", labelZh: "住宅不動產", labelEn: "Residential", labelJp: "住宅用不動産" },
    { key: "COMMERCIAL", labelZh: "商業與收益型", labelEn: "Commercial", labelJp: "商業・収益不動産" },
    { key: "DEVELOPMENT", labelZh: "土地開發與自建", labelEn: "Development", labelJp: "土地開発・注文建築" },
    { key: "RENOVATION", labelZh: "收購再販與翻新", labelEn: "Renovation & Resale", labelJp: "買取再販・リノベーション" },
    { key: "HOSPITALITY", labelZh: "住宿設施營運", labelEn: "Hospitality", labelJp: "宿泊施設運営" },
  ];

  // Category change handler (resets page)
  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  // Filtered cases
  const filteredCases = casesData.filter((item) => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "RESIDENTIAL") return item.categoryEn === "Residential";
    if (activeCategory === "COMMERCIAL") return item.categoryEn === "Commercial";
    if (activeCategory === "DEVELOPMENT") return item.categoryEn === "Development";
    if (activeCategory === "RENOVATION") return item.categoryEn === "Renovation & Resale";
    if (activeCategory === "HOSPITALITY") return item.categoryEn === "Hospitality";
    return true;
  });

  // Calculate dynamic total pages
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const gridEl = document.getElementById("cases-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col w-full font-body-md text-on-surface bg-background">
      <PageBanner
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
        kicker={t("cases.banner.tag")}
        title={t("cases.banner.h1")}
        desc={t("cases.banner.desc")}
      />

      {/* FILTER BUTTONS & CASES GRID */}
      <section id="cases-grid" className="w-full py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface scroll-mt-20">
        <div className="content-col flex flex-col gap-12">
          {/* CATEGORY BUTTONS */}
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            {categories.map((cat) => {
              const label = pickLang(lang, cat.labelZh, cat.labelEn, cat.labelJp);
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`cursor-pointer rounded-full px-5 py-2.5 font-label-caps text-xs uppercase tracking-wider transition-colors duration-300 ${
                    isActive
                      ? "bg-brand-500 text-primary"
                      : "bg-surface-warm text-on-surface-variant hover:bg-surface-warm-deep hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {loading && (
            <div className="py-16 text-center text-on-surface-variant font-body-md">
              {pickLang(lang, "載入中...", "Loading...", "読み込み中...")}
            </div>
          )}
          {!loading && error && (
            <div className="py-16 text-center text-on-surface-variant font-body-md">
              {pickLang(lang, "載入實績案例時發生錯誤，請稍後再試。", "Failed to load case studies. Please try again later.", "実績の読み込みに失敗しました。")}
            </div>
          )}
          {!loading && !error && filteredCases.length === 0 && (
            <div className="py-16 text-center text-on-surface-variant font-body-md">
              {pickLang(lang, "目前尚無實績案例。", "No case studies yet.", "現在実績はありません。")}
            </div>
          )}
          {/* CASES 3-COLUMN GRID */}
          <motion.div
            key={`${activeCategory}-${currentPage}`}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {currentCases.map((item) => {
              const title = pickLang(lang, item.titleZh, item.titleEn, item.titleJp);
              const desc = pickLang(lang, item.descZh, item.descEn, item.descJp);
              const category = pickLang(lang, item.categoryZh, item.categoryEn, item.categoryJp);
              const location = pickLang(lang, item.locationZh, item.locationEn, item.locationJp);

              return (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Link
                    href={localePath(`/cases/${item.slug}`)}
                    className="rounded-xl flex flex-col h-full bg-surface border border-outline-variant hover:border-brand-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group overflow-hidden"
                  >
                    {/* Featured Image */}
                    <div className="relative h-64 overflow-hidden bg-black/10">
                      <img
                        src={item.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full px-3 py-1 bg-primary/90 backdrop-blur-sm text-white font-label-caps text-xs uppercase tracking-wider">
                          {category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-between flex-grow gap-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs text-on-surface-variant font-label-caps">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-brand-500">location_on</span>
                            {location}
                          </span>
                          <span>{item.date}</span>
                        </div>
                        <h3 className="font-headline-md text-xl text-primary font-medium group-hover:text-brand-500 transition-colors leading-snug line-clamp-2">
                          {title}
                        </h3>
                        <p className="font-body-md text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                          {desc}
                        </p>
                        {item.priceJPY != null && <PriceBlock priceJPY={item.priceJPY} variant="compact" className="pt-1" />}
                      </div>

                      {/* Read More link */}
                      <div className="pt-4 border-t border-outline-variant flex items-center justify-between text-xs font-label-caps text-primary group-hover:text-brand-500 uppercase tracking-wider">
                        <span>{pickLang(lang, "查看專案詳情", "VIEW CASE DETAILS", "詳細を見る")}</span>
                        <ArrowChip className="w-6 h-6" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* DYNAMIC PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-outline-variant">
              {/* Prev button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-md px-4 py-2 border font-label-caps text-xs tracking-wider uppercase flex items-center gap-1 transition-colors ${
                  currentPage === 1
                    ? "border-outline-variant text-on-surface-variant/40 cursor-not-allowed"
                    : "border-outline-variant text-primary hover:border-brand-500 hover:text-brand-500 cursor-pointer"
                }`}
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                <span>{pickLang(lang, "上一頁", "Previous", "前へ")}</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`rounded-md w-10 h-10 border font-numeral-display text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-brand-500 border-brand-500 text-primary"
                      : "border-outline-variant bg-surface text-primary hover:border-primary"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded-md px-4 py-2 border font-label-caps text-xs tracking-wider uppercase flex items-center gap-1 transition-colors ${
                  currentPage === totalPages
                    ? "border-outline-variant text-on-surface-variant/40 cursor-not-allowed"
                    : "border-outline-variant text-primary hover:border-brand-500 hover:text-brand-500 cursor-pointer"
                }`}
              >
                <span>{pickLang(lang, "下一頁", "Next", "次へ")}</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <ClosingCta title={t("cases.cta.title")} />
    </div>
  );
}
