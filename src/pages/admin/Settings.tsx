import { useEffect, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { ImageUploader } from "../../components/admin/ImageUploader";
import {
  DEFAULT_GENERAL,
  DEFAULT_HOME,
  DEFAULT_SEO,
  watchGeneral,
  watchHome,
  watchSeo,
  saveGeneral,
  saveHome,
  saveSeo,
} from "../../lib/content/siteSettings";
import type { HeroSlide, SiteSettingsGeneral, SiteSettingsHome, SiteSettingsSeo } from "../../types/content";

type Tab = "general" | "home" | "seo";

const inputCls = "rounded-md p-3 border border-outline-variant bg-surface focus:border-primary focus:outline-none text-sm w-full";
const labelCls = "text-xs text-on-surface-variant font-label-caps uppercase tracking-widest";

function Field({ label, children }: { label: string; children: import("react").ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="flex items-center gap-4 pt-6 border-t border-outline-variant mt-8">
      <button onClick={onSave} disabled={saving} className="rounded-md px-6 py-3 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
        {saving ? "儲存中..." : "儲存變更"}
      </button>
      {saved && <span className="text-sm text-green-700">已儲存</span>}
    </div>
  );
}

const EMPTY_SLIDE: HeroSlide = { image: "", captionZh: "", captionEn: "", captionJp: "" };

/**
 * Editor for the homepage hero carousel. Order matters (it is the play order),
 * so rows can be moved up/down. Leaving this empty makes the site fall back to
 * the single legacy hero image, and then to the images bundled in /public/hero.
 */
function HeroSlidesEditor({
  slides,
  onChange,
}: {
  slides: HeroSlide[];
  onChange: (next: HeroSlide[]) => void;
}) {
  const update = (i: number, patch: Partial<HeroSlide>) =>
    onChange(slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const move = (i: number, delta: number) => {
    const target = i + delta;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <label className={labelCls}>首頁輪播圖片</label>
        <span className="text-xs text-on-surface-variant">建議 3–5 張，橫幅、寬度 2000px 以上</span>
      </div>

      {slides.length === 0 && (
        <p className="rounded-md border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant">
          尚未設定輪播圖片，首頁目前顯示網站內建的預設圖片。
        </p>
      )}

      {slides.map((slide, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-md border border-outline-variant p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-label-caps uppercase tracking-widest text-on-surface-variant">
              第 {i + 1} 張
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="上移"
                className="rounded px-2 py-1 text-sm hover:bg-surface-container-low disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === slides.length - 1}
                aria-label="下移"
                className="rounded px-2 py-1 text-sm hover:bg-surface-container-low disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(slides.filter((_, idx) => idx !== i))}
                className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                刪除
              </button>
            </div>
          </div>
          <ImageUploader
            label="圖片"
            value={slide.image}
            folder="site/home"
            onChange={(url) => update(i, { image: url })}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="說明文字（中，可留空）">
              <input value={slide.captionZh} onChange={(e) => update(i, { captionZh: e.target.value })} className={inputCls} />
            </Field>
            <Field label="說明文字（英，可留空）">
              <input value={slide.captionEn} onChange={(e) => update(i, { captionEn: e.target.value })} className={inputCls} />
            </Field>
            <Field label="說明文字（日，可留空）">
              <input value={slide.captionJp} onChange={(e) => update(i, { captionJp: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...slides, { ...EMPTY_SLIDE }])}
        className="self-start rounded-md border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-white"
      >
        ＋ 新增一張輪播圖
      </button>
    </div>
  );
}

export function Settings() {
  const [tab, setTab] = useState<Tab>("general");
  const [general, setGeneral] = useState<SiteSettingsGeneral>(DEFAULT_GENERAL);
  const [home, setHome] = useState<SiteSettingsHome>(DEFAULT_HOME);
  const [seo, setSeo] = useState<SiteSettingsSeo>(DEFAULT_SEO);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => watchGeneral(setGeneral), []);
  useEffect(() => watchHome(setHome), []);
  useEffect(() => watchSeo(setSeo), []);

  const doSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      if (tab === "general") await saveGeneral(general);
      if (tab === "home") await saveHome(home);
      if (tab === "seo") await saveSeo(seo);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <h1 className="font-headline-lg text-2xl text-primary font-medium mb-2">網站設定</h1>
      <p className="text-sm text-on-surface-variant mb-8">修改後儲存，前台將於下次載入頁面時顯示最新內容。</p>

      <div className="flex gap-2 mb-8 border-b border-outline-variant">
        {([
          ["general", "公司基本資料"],
          ["home", "首頁內容"],
          ["seo", "SEO 設定"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key ? "border-brand-500 text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div className="flex flex-col gap-6 max-w-2xl">
          <Field label="公司名稱（中文）">
            <textarea rows={2} value={general.companyNameZh} onChange={(e) => setGeneral({ ...general, companyNameZh: e.target.value })} className={inputCls} />
          </Field>
          <Field label="公司名稱（英文）">
            <textarea rows={2} value={general.companyNameEn} onChange={(e) => setGeneral({ ...general, companyNameEn: e.target.value })} className={inputCls} />
          </Field>
          <Field label="公司名稱（日文）">
            <textarea rows={2} value={general.companyNameJp} onChange={(e) => setGeneral({ ...general, companyNameJp: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Email"><input value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className={inputCls} /></Field>
            <Field label="電話"><input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} className={inputCls} /></Field>
          </div>
          <Field label="執照字號（中文）"><input value={general.licenseZh} onChange={(e) => setGeneral({ ...general, licenseZh: e.target.value })} className={inputCls} /></Field>
          <Field label="地址（中文）"><textarea rows={2} value={general.addressZh} onChange={(e) => setGeneral({ ...general, addressZh: e.target.value })} className={inputCls} /></Field>
          <Field label="地址（英文）"><textarea rows={2} value={general.addressEn} onChange={(e) => setGeneral({ ...general, addressEn: e.target.value })} className={inputCls} /></Field>
          <Field label="地址（日文）"><textarea rows={2} value={general.addressJp} onChange={(e) => setGeneral({ ...general, addressJp: e.target.value })} className={inputCls} /></Field>
          <Field label="營業時間（中文）"><textarea rows={2} value={general.hoursZh} onChange={(e) => setGeneral({ ...general, hoursZh: e.target.value })} className={inputCls} /></Field>

          <h3 className="font-headline-md text-base text-primary font-medium mt-4">社群 / 即時通訊連結</h3>
          <p className="text-xs text-on-surface-variant -mt-4">留空則該圖示不會顯示在前台。請填入完整網址，例如 https://wa.me/8109xxxxxxx</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="LINE 連結"><input value={general.social.line} onChange={(e) => setGeneral({ ...general, social: { ...general.social, line: e.target.value } })} className={inputCls} placeholder="https://line.me/ti/p/xxxx" /></Field>
            <Field label="WhatsApp 連結"><input value={general.social.whatsapp} onChange={(e) => setGeneral({ ...general, social: { ...general.social, whatsapp: e.target.value } })} className={inputCls} placeholder="https://wa.me/819012345678" /></Field>
            <Field label="Instagram 連結"><input value={general.social.instagram} onChange={(e) => setGeneral({ ...general, social: { ...general.social, instagram: e.target.value } })} className={inputCls} placeholder="https://instagram.com/xxxx" /></Field>
            <Field label="Facebook 連結"><input value={general.social.facebook} onChange={(e) => setGeneral({ ...general, social: { ...general.social, facebook: e.target.value } })} className={inputCls} /></Field>
            <Field label="LinkedIn 連結"><input value={general.social.linkedin} onChange={(e) => setGeneral({ ...general, social: { ...general.social, linkedin: e.target.value } })} className={inputCls} /></Field>
            <Field label="X (Twitter) 連結"><input value={general.social.x} onChange={(e) => setGeneral({ ...general, social: { ...general.social, x: e.target.value } })} className={inputCls} /></Field>
          </div>
        </div>
      )}

      {tab === "home" && (
        <div className="flex flex-col gap-6 max-w-2xl">
          <HeroSlidesEditor
            slides={home.heroSlides ?? []}
            onChange={(heroSlides) => setHome({ ...home, heroSlides })}
          />
          <details className="rounded-md border border-outline-variant p-4">
            <summary className="cursor-pointer text-xs font-label-caps uppercase tracking-widest text-on-surface-variant">
              舊版單張主視覺（僅在上方輪播完全沒有圖片時才會顯示）
            </summary>
            <div className="pt-4">
              <ImageUploader label="首頁主視覺圖片" value={home.heroImage} folder="site/home" onChange={(url) => setHome({ ...home, heroImage: url })} />
            </div>
          </details>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="主標題第一行（中）"><input value={home.heroTitleLine1Zh} onChange={(e) => setHome({ ...home, heroTitleLine1Zh: e.target.value })} className={inputCls} /></Field>
            <Field label="主標題第一行（英）"><input value={home.heroTitleLine1En} onChange={(e) => setHome({ ...home, heroTitleLine1En: e.target.value })} className={inputCls} /></Field>
            <Field label="主標題第一行（日）"><input value={home.heroTitleLine1Jp} onChange={(e) => setHome({ ...home, heroTitleLine1Jp: e.target.value })} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="主標題第二行（中）"><input value={home.heroTitleLine2Zh} onChange={(e) => setHome({ ...home, heroTitleLine2Zh: e.target.value })} className={inputCls} /></Field>
            <Field label="主標題第二行（英）"><input value={home.heroTitleLine2En} onChange={(e) => setHome({ ...home, heroTitleLine2En: e.target.value })} className={inputCls} /></Field>
            <Field label="主標題第二行（日）"><input value={home.heroTitleLine2Jp} onChange={(e) => setHome({ ...home, heroTitleLine2Jp: e.target.value })} className={inputCls} /></Field>
          </div>
          <Field label="說明文字（中）"><textarea rows={3} value={home.heroDescZh} onChange={(e) => setHome({ ...home, heroDescZh: e.target.value })} className={inputCls} /></Field>
          <Field label="說明文字（英）"><textarea rows={3} value={home.heroDescEn} onChange={(e) => setHome({ ...home, heroDescEn: e.target.value })} className={inputCls} /></Field>
          <Field label="說明文字（日）"><textarea rows={3} value={home.heroDescJp} onChange={(e) => setHome({ ...home, heroDescJp: e.target.value })} className={inputCls} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="主要按鈕文字（中）"><input value={home.primaryCtaZh} onChange={(e) => setHome({ ...home, primaryCtaZh: e.target.value })} className={inputCls} /></Field>
            <Field label="主要按鈕文字（英）"><input value={home.primaryCtaEn} onChange={(e) => setHome({ ...home, primaryCtaEn: e.target.value })} className={inputCls} /></Field>
            <Field label="主要按鈕文字（日）"><input value={home.primaryCtaJp} onChange={(e) => setHome({ ...home, primaryCtaJp: e.target.value })} className={inputCls} /></Field>
          </div>
        </div>
      )}

      {tab === "seo" && (
        <div className="flex flex-col gap-6 max-w-2xl">
          <ImageUploader label="預設 OG 分享圖片" value={seo.ogImage} folder="site/seo" onChange={(url) => setSeo({ ...seo, ogImage: url })} />
          <Field label="預設網站標題（中）"><input value={seo.defaultTitleZh} onChange={(e) => setSeo({ ...seo, defaultTitleZh: e.target.value })} className={inputCls} /></Field>
          <Field label="預設網站標題（英）"><input value={seo.defaultTitleEn} onChange={(e) => setSeo({ ...seo, defaultTitleEn: e.target.value })} className={inputCls} /></Field>
          <Field label="預設網站標題（日）"><input value={seo.defaultTitleJp} onChange={(e) => setSeo({ ...seo, defaultTitleJp: e.target.value })} className={inputCls} /></Field>
          <Field label="預設網站描述（中）"><textarea rows={3} value={seo.defaultDescriptionZh} onChange={(e) => setSeo({ ...seo, defaultDescriptionZh: e.target.value })} className={inputCls} /></Field>
          <Field label="預設網站描述（英）"><textarea rows={3} value={seo.defaultDescriptionEn} onChange={(e) => setSeo({ ...seo, defaultDescriptionEn: e.target.value })} className={inputCls} /></Field>
          <Field label="預設網站描述（日）"><textarea rows={3} value={seo.defaultDescriptionJp} onChange={(e) => setSeo({ ...seo, defaultDescriptionJp: e.target.value })} className={inputCls} /></Field>
          <p className="text-xs text-on-surface-variant">
            提醒：本網站為前端 SPA（非伺服器端渲染），此處設定會更新瀏覽器分頁標題與 meta description，但社群分享預覽圖（OG）仍以 index.html 內建值為主，因為社群爬蟲多半不會執行 JavaScript。若需要每頁都能被正確預覽，未來可考慮加入預渲染（prerender）機制。
          </p>
        </div>
      )}

      <SaveBar onSave={doSave} saving={saving} saved={saved} />
    </AdminShell>
  );
}
