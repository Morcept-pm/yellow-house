import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { ClosingCta } from "../components/ClosingCta";
import { PageBanner } from "../components/PageBanner";
import { Kicker } from "../components/Kicker";
import { listPublishedNews } from "../lib/content/news";
import type { NewsArticle } from "../types/content";
import { pickLang } from "../lib/utils";
import { useCategories, useNewsSettings, tr } from "../lib/useSiteSettings";
import { resolveCategory, categoryLabel } from "../lib/categories";

const ALL = "ALL";

const rise = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export function News() {
  const { lang, localePath } = useLanguage();
  const settings = useNewsSettings();
  const categoryList = useCategories().news;
  const [category, setCategory] = useState<string>(ALL);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title =
      lang === "zh" ? "Yellow House - 最新消息" : lang === "jp" ? "Yellow House - ニュース" : "Yellow House - News & Market Insights";
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    listPublishedNews()
      .then((data) => !cancelled && setNewsData(data))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Category keys come from the admin-managed list; legacy docs are matched by label.
  const articles = newsData.map((item) => ({ item, cat: resolveCategory(item, categoryList) }));
  const tabs = [
    { key: ALL, label: pickLang(lang, "全部消息", "All", "すべて"), count: articles.length },
    ...categoryList.map((c) => ({
      key: c.key,
      label: categoryLabel(c, lang),
      count: articles.filter((a) => a.cat?.key === c.key).length,
    })),
  ];
  const filtered = articles.filter((a) => category === ALL || a.cat?.key === category);

  const emptyMessage = loading
    ? pickLang(lang, "載入中⋯", "Loading…", "読み込み中…")
    : error
    ? pickLang(lang, "載入最新消息時發生錯誤，請稍後再試。", "Failed to load news. Please try again later.", "ニュースの読み込みに失敗しました。")
    : filtered.length === 0
    ? pickLang(lang, "此分類目前尚無消息。", "No articles in this category yet.", "このカテゴリの記事はまだありません。")
    : null;

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-surface font-body-md text-on-surface">
      <PageBanner
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
        kicker={tr(settings, "bannerTag", lang)}
        title={tr(settings, "bannerH1", lang)}
        desc={tr(settings, "bannerDesc", lang)}
      />

      <section className="w-full px-margin-mobile py-section md:px-margin-desktop">
        <div className="content-col grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-gutter">
          {/* ── Category sidebar (horizontal pills on mobile, list on desktop) ── */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Kicker>Category</Kicker>
                <h2 className="font-headline-md text-lg text-primary">{tr(settings, "categoryTitle", lang)}</h2>
              </div>

              <nav className="flex flex-wrap gap-2 lg:flex-col lg:items-start lg:gap-1.5" aria-label={tr(settings, "categoryTitle", lang)}>
                {tabs.map((cat) => {
                  const active = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setCategory(cat.key)}
                      aria-pressed={active}
                      className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 font-label-caps text-xs uppercase tracking-wider transition-colors lg:w-full lg:justify-between ${
                        active
                          ? "bg-brand-500 text-primary"
                          : "bg-surface-warm text-on-surface-variant hover:bg-surface-warm-deep hover:text-primary"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={active ? "text-primary/70" : "text-on-surface-variant/60"}>{cat.count}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ── Article list — same editorial rows as the homepage section ── */}
          <div className="lg:col-span-9">
            {emptyMessage ? (
              <p className="py-16 text-center font-body-md text-on-surface-variant">{emptyMessage}</p>
            ) : (
              <motion.ul
                key={category}
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
                className="flex flex-col"
              >
                {filtered.map(({ item, cat }) => (
                  <motion.li
                    key={item.id}
                    variants={rise}
                    transition={{ duration: 0.4 }}
                    className="border-t border-outline-variant first:border-t-0"
                  >
                    <Link
                      href={localePath(`/news/${item.slug}`)}
                      className="group flex items-center gap-5 py-6 md:gap-7 md:py-7"
                    >
                      <div className="aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl bg-surface-warm sm:w-44 md:w-52">
                        <img
                          src={item.image}
                          alt={pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label-caps text-[11px] uppercase tracking-[0.16em] text-brand-600">
                          <span>{categoryLabel(cat, lang)}</span>
                          <span className="h-1 w-1 rounded-full bg-brand-400" />
                          <span className="normal-case tracking-normal text-on-surface-variant">
                            {pickLang(lang, item.readTimeZh, item.readTimeEn, item.readTimeJp)}
                          </span>
                        </div>
                        <h3 className="line-clamp-2 font-headline-md text-base leading-snug text-primary transition-colors group-hover:text-brand-600 md:text-lg">
                          {pickLang(lang, item.titleZh, item.titleEn, item.titleJp)}
                        </h3>
                        <p className="hidden line-clamp-2 font-body-md text-sm leading-relaxed text-on-surface-variant sm:block">
                          {pickLang(lang, item.excerptZh, item.excerptEn, item.excerptJp)}
                        </p>
                      </div>

                      <span className="material-symbols-outlined hidden shrink-0 text-brand-600 transition-transform duration-300 group-hover:translate-x-1 sm:inline">
                        arrow_forward
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
