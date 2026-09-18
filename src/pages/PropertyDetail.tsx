import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";
import { getPublishedPropertyBySlug } from "../lib/content/properties";
import type { Property, PropertyCategory } from "../types/content";
import { ArrowChip } from "../components/ArrowChip";
import { PriceBlock } from "../components/PriceBlock";
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

export function PropertyDetail() {
  const [, params] = useRoute<{ slug: string }>("/:locale/properties/:slug");
  const { lang, localePath } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [item, setItem] = useState<Property | null | undefined>(undefined);
  const [activeImage, setActiveImage] = useState(0);

  const slug = params?.slug;

  useEffect(() => {
    setItem(undefined);
    setActiveImage(0);
    if (!slug) return;
    let cancelled = false;
    getPublishedPropertyBySlug(slug)
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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = item ? pickLang(lang, item.titleZh, item.titleEn, item.titleJp) : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
        return;
      } catch {
        // user cancelled
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // ignore
    }
  };

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
          {pickLang(lang, "找不到這個物件", "Property not found", "物件が見つかりません")}
        </h1>
        <Link href={localePath("/properties")} className="rounded-lg px-8 py-4 bg-primary text-white font-label-caps text-xs uppercase tracking-wider">
          {pickLang(lang, "返回在售物件", "Back to Properties", "販売物件一覧に戻る")}
        </Link>
      </div>
    );
  }

  const title = pickLang(lang, item.titleZh, item.titleEn, item.titleJp);
  const category = pickLang(lang, CATEGORY_LABELS[item.category].zh, CATEGORY_LABELS[item.category].en, CATEGORY_LABELS[item.category].jp);
  const status = pickLang(lang, STATUS_LABELS[item.listingStatus].zh, STATUS_LABELS[item.listingStatus].en, STATUS_LABELS[item.listingStatus].jp);
  const location = pickLang(lang, item.locationZh, item.locationEn, item.locationJp);
  const description = pickLang(lang, item.descriptionZh, item.descriptionEn, item.descriptionJp);
  const images = [item.coverImage, ...item.gallery.filter((g) => g !== item.coverImage)];

  const specs = [
    item.layout && { label: pickLang(lang, "格局", "Layout", "間取り"), value: item.layout },
    item.landAreaSqm != null && { label: pickLang(lang, "土地面積", "Land Area", "土地面積"), value: `${item.landAreaSqm}㎡` },
    item.floorAreaSqm != null && { label: pickLang(lang, "建物面積", "Floor Area", "建物面積"), value: `${item.floorAreaSqm}㎡` },
    item.buildYear && { label: pickLang(lang, "屋齡／建築年", "Build Year", "築年"), value: item.buildYear },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col w-full relative">
      {/* HERO */}
      <section className="w-full relative min-h-[420px] md:min-h-[500px] flex items-center pt-32 md:pt-40 pb-section px-margin-mobile md:px-margin-desktop overflow-hidden border-b border-brand-500">
        <div className="content-col absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${item.coverImage}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 md:bg-gradient-to-r md:from-black/90 md:via-black/75 md:to-black/60"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="md:col-span-9 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full px-3 py-1 bg-brand-500 text-primary font-label-caps text-xs font-semibold uppercase tracking-wider">{category}</span>
              <span
                className={`rounded-full px-3 py-1 font-label-caps text-xs font-semibold uppercase tracking-wider ${
                  item.listingStatus === "sold" ? "bg-black/60 text-white/80" : "bg-white/90 text-primary"
                }`}
              >
                {status}
              </span>
              <span className="text-white/40">/</span>
              <span className="font-label-caps text-xs text-white/90 tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-brand-500">location_on</span>
                {location}
              </span>
            </div>
            <h1 className="font-display-lg-mobile md:font-headline-lg text-display-lg-mobile md:text-display-md text-white tracking-tight leading-tight">{title}</h1>
          </motion.div>
        </div>
      </section>

      {/* BODY */}
      <section className="w-full py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="content-col max-w-4xl mx-auto">
          <div className="mb-10 pb-6 border-b border-outline-variant flex items-center justify-between">
            <Link href={localePath("/properties")} className="font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-wider group">
              <span className="material-symbols-outlined text-sm transform group-hover:-translate-x-1 transition-transform">arrow_back</span>
              {pickLang(lang, "返回在售物件", "Back to Properties", "販売物件一覧に戻る")}
            </Link>
            <button
              onClick={handleShare}
              className="rounded-md px-4 py-2 border border-outline-variant hover:border-brand-500 bg-surface font-label-caps text-xs text-primary flex items-center gap-2 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-brand-500">share</span>
              <span>{copied ? pickLang(lang, "已複製連結！", "Link Copied!", "リンクをコピーしました！") : pickLang(lang, "分享物件", "Share", "シェア")}</span>
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-12">
            {item.priceJPY != null ? (
              <PriceBlock priceJPY={item.priceJPY} variant="detail" />
            ) : (
              <div className="rounded-xl border border-outline-variant bg-surface p-6 md:p-8">
                <span className="font-label-caps text-xs text-brand-500 uppercase tracking-widest">{pickLang(lang, "物件價格", "PROPERTY PRICE", "物件価格")}</span>
                <p className="font-headline-lg text-2xl text-primary font-medium mt-2">{pickLang(lang, "價格請洽詢", "Price on Request", "価格応相談")}</p>
              </div>
            )}

            {/* Gallery */}
            <div className="flex flex-col gap-3">
              <div className="rounded-xl w-full aspect-[16/9] overflow-hidden shadow-lg border border-outline-variant">
                <img src={images[activeImage]} alt={title} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`rounded-lg w-24 h-16 shrink-0 overflow-hidden border-2 transition-colors ${
                        idx === activeImage ? "border-brand-500" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs */}
            {specs.length > 0 && (
              <div className="rounded-r-xl p-8 bg-surface-warm border-l-4 border-brand-500 grid grid-cols-2 md:grid-cols-4 gap-6">
                {specs.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">{s.label}</span>
                    <span className="font-headline-md text-lg text-primary font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-4">
              <span className="font-label-caps text-xs text-brand-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-px bg-brand-500"></span>
                {pickLang(lang, "物件說明", "PROPERTY DESCRIPTION", "物件説明")}
              </span>
              <p className="max-w-[70ch] font-body-md text-primary text-base md:text-lg leading-relaxed whitespace-pre-line">{description}</p>
            </div>

            {/* Inquiry CTA */}
            <div className="pt-8 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href={`${localePath("/contact")}?property=${encodeURIComponent(item.slug)}`}
                className="rounded-lg w-full sm:w-auto px-8 py-4 bg-primary text-white hover:bg-primary/90 font-label-caps text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>{pickLang(lang, "諮詢此物件", "INQUIRE ABOUT THIS PROPERTY", "この物件について問い合わせる")}</span>
                <ArrowChip className="w-6 h-6" />
              </Link>
              <Link
                href={localePath("/properties")}
                className="rounded-lg w-full sm:w-auto px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-white font-label-caps text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>{pickLang(lang, "返回全部物件", "Back to All Properties", "すべての物件に戻る")}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
