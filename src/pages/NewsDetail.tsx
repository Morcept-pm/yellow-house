import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { ClosingCta } from "../components/ClosingCta";
import { getPublishedNewsBySlug } from "../lib/content/news";
import type { NewsArticle } from "../types/content";
import { ArrowChip } from "../components/ArrowChip";
import { pickLang } from "../lib/utils";

export function NewsDetail() {
  const [, params] = useRoute<{ slug: string }>("/:locale/news/:slug");
  const { lang, t, localePath } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [item, setItem] = useState<NewsArticle | null | undefined>(undefined);

  const slug = params?.slug;

  useEffect(() => {
    setItem(undefined);
    if (!slug) return;
    let cancelled = false;
    getPublishedNewsBySlug(slug)
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (item) {
      const title = pickLang(lang, item.titleZh, item.titleEn, item.titleJp);
      document.title = `${title} | Yellow House`;
    }
  }, [slug, lang, item]);

  if (item === undefined) {
    return (
      <div className="w-full py-32 text-center text-on-surface-variant font-body-md">
        {pickLang(lang, "載入中...", "Loading...", "読み込み中...")}
      </div>
    );
  }

  if (item === null) {
    return (
      <div className="w-full py-32 flex flex-col items-center gap-6 text-center">
        <h1 className="font-headline-lg text-2xl text-primary">
          {pickLang(lang, "找不到這則消息", "Article not found", "記事が見つかりません")}
        </h1>
        <Link href={localePath("/news")} className="rounded-lg px-8 py-4 bg-primary text-white font-label-caps text-xs uppercase tracking-wider">
          {pickLang(lang, "返回最新消息", "Back to News", "ニュース一覧に戻る")}
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = pickLang(lang, item.titleZh, item.titleEn, item.titleJp);

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // user cancelled or fallback
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // fallback
    }
  };

  const title = pickLang(lang, item.titleZh, item.titleEn, item.titleJp);
  const category = pickLang(lang, item.categoryZh, item.categoryEn, item.categoryJp);
  const readTime = pickLang(lang, item.readTimeZh, item.readTimeEn, item.readTimeJp);
  const content = pickLang(lang, item.contentZh, item.contentEn, item.contentJp);

  return (
    <div className="flex flex-col w-full relative">
      {/* UNIFIED BANNER WITH HERO IMAGE */}
      <section className="w-full relative min-h-[420px] md:min-h-[500px] flex items-center pt-32 md:pt-40 pb-section px-margin-mobile md:px-margin-desktop overflow-hidden border-b border-brand-500">
        <div
          className="content-col absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${item.image}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 md:bg-gradient-to-r md:from-black/90 md:via-black/75 md:to-black/60"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-9 flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full px-3 py-1 bg-brand-500 text-primary font-label-caps text-xs font-semibold uppercase tracking-wider">
                {category}
              </span>
              <span className="font-label-caps text-xs text-white/80 tracking-wider">
                {item.date}
              </span>
              <span className="text-white/40">/</span>
              <span className="font-label-caps text-xs text-white/90 tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-brand-500">schedule</span>
                {readTime}
              </span>
            </div>
            <h1 className="font-display-lg-mobile md:font-headline-lg text-display-lg-mobile md:text-display-md text-white tracking-tight leading-tight">
              {title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="w-full py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="content-col max-w-4xl mx-auto">
          {/* Breadcrumb / Top Back */}
          <div className="mb-10 pb-6 border-b border-outline-variant flex items-center justify-between">
            <Link
              href={localePath("/news")}
              className="font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-wider group"
            >
              <span className="material-symbols-outlined text-sm transform group-hover:-translate-x-1 transition-transform">arrow_back</span>
              {pickLang(lang, "返回最新消息", "Back to News", "ニュース一覧に戻る")}
            </Link>

            <button
              onClick={handleShare}
              className="rounded-md px-4 py-2 border border-outline-variant hover:border-brand-500 bg-surface font-label-caps text-xs text-primary flex items-center gap-2 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-brand-500">share</span>
              <span>{copied ? pickLang(lang, "已複製連結！", "Link Copied!", "リンクをコピーしました！") : pickLang(lang, "分享文章", "Share", "シェア")}</span>
            </button>
          </div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-10"
          >
            {/* Lead Paragraph */}
            <p className="rounded-r-lg font-body-lg text-primary text-lg md:text-xl leading-relaxed border-l-4 border-brand-500 pl-6 py-2 bg-surface-container-low/50">
              {content.lead}
            </p>

            {/* Featured Photo in Article */}
            <div className="rounded-xl w-full aspect-[16/9] overflow-hidden shadow-lg border border-outline-variant my-4">
              <img
                src={item.image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Sections */}
            <div className="flex flex-col gap-10">
              {content.sections.map((sec, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <h2 className="font-headline-md text-2xl text-primary font-medium">
                    {sec.heading}
                  </h2>
                  <p className="max-w-[70ch] font-body-md text-on-surface-variant text-base md:text-lg leading-relaxed">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary Box */}
            <div className="rounded-xl p-8 bg-surface-warm border border-outline-variant mt-4">
              <span className="font-label-caps text-xs text-brand-500 uppercase tracking-widest block mb-2">
                {pickLang(lang, "總結觀點", "EXECUTIVE SUMMARY", "総括")}
              </span>
              <p className="font-body-md text-primary text-base md:text-lg leading-relaxed font-medium">
                {content.summary}
              </p>
            </div>

            {/* Bottom Actions: Share + Back */}
            <div className="pt-8 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href={localePath("/news")}
                className="rounded-lg w-full sm:w-auto px-8 py-4 bg-primary text-white hover:bg-primary/90 font-label-caps text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>{pickLang(lang, "返回最新消息", "Back to All News", "すべてのニュースに戻る")}</span>
              </Link>

              <button
                onClick={handleShare}
                className="rounded-lg w-full sm:w-auto px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-white font-label-caps text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span>{copied ? pickLang(lang, "已複製連結！", "Link Copied!", "リンクをコピーしました！") : pickLang(lang, "分享此文章", "Share Article", "この記事をシェア")}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ClosingCta title={t("cta.title")} />
    </div>
  );
}
