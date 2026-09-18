import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { AdminShell } from "../../components/admin/AdminShell";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { getCaseById, createCase, updateCase, caseSlugExists } from "../../lib/content/cases";
import { normalizeSlug, isValidSlug } from "../../lib/slug";
import type { CaseArticleDoc, CaseDetailsBody, PublishStatus } from "../../types/content";

type Lang = "Zh" | "En" | "Jp";
const LANGS: { key: Lang; label: string }[] = [
  { key: "Zh", label: "中文" },
  { key: "En", label: "English" },
  { key: "Jp", label: "日本語" },
];

const EMPTY_DETAILS: CaseDetailsBody = { overview: "", highlights: [], strategy: "", outcome: "" };

const EMPTY: CaseArticleDoc = {
  slug: "",
  categoryZh: "",
  categoryEn: "",
  categoryJp: "",
  titleZh: "",
  titleEn: "",
  titleJp: "",
  descZh: "",
  descEn: "",
  descJp: "",
  image: "",
  locationZh: "",
  locationEn: "",
  locationJp: "",
  priceJPY: null,
  detailsZh: { ...EMPTY_DETAILS },
  detailsEn: { ...EMPTY_DETAILS },
  detailsJp: { ...EMPTY_DETAILS },
  status: "draft",
  sortOrder: 0,
  publishedAt: null,
  createdAt: null as never,
  updatedAt: null as never,
};

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

export function CaseEditor() {
  const [, params] = useRoute<{ id: string }>("/admin/cases/:id");
  const [, navigate] = useLocation();
  const id = params?.id;
  const isNew = id === "new";

  const [form, setForm] = useState<CaseArticleDoc>(EMPTY);
  const [lang, setLang] = useState<Lang>("Zh");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !id) return;
    getCaseById(id).then((doc) => {
      if (doc) setForm(doc);
      setLoading(false);
    });
  }, [id, isNew]);

  useEffect(() => {
    if (!slugTouched && isNew) setForm((f) => ({ ...f, slug: normalizeSlug(f.titleZh) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.titleZh]);

  const detailsKey = `details${lang}` as const;
  const details = form[detailsKey];
  const updateDetails = (patch: Partial<CaseDetailsBody>) => setForm({ ...form, [detailsKey]: { ...details, ...patch } });

  const updateHighlight = (idx: number, value: string) => {
    const highlights = details.highlights.map((h, i) => (i === idx ? value : h));
    updateDetails({ highlights });
  };
  const addHighlight = () => updateDetails({ highlights: [...details.highlights, ""] });
  const removeHighlight = (idx: number) => updateDetails({ highlights: details.highlights.filter((_, i) => i !== idx) });

  const handleSave = async () => {
    setError(null);
    if (!isValidSlug(form.slug)) {
      setError("網址代稱（slug）格式不正確，僅能使用小寫英數字與連字號。");
      return;
    }
    const dupe = await caseSlugExists(form.slug, isNew ? undefined : id);
    if (dupe) {
      setError("此網址代稱已被使用，請更換。");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const newId = await createCase(form);
        navigate(`/admin/cases/${newId}`, { replace: true });
      } else if (id) {
        await updateCase(id, form);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-on-surface-variant">載入中...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-lg text-2xl text-primary font-medium">{isNew ? "新增案例" : "編輯案例"}</h1>
        <button onClick={() => navigate("/admin/cases")} className="text-sm text-on-surface-variant hover:text-primary">
          ← 返回列表
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="網址代稱 (slug)">
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: normalizeSlug(e.target.value) });
              }}
              className={inputCls}
            />
          </Field>
          <Field label="發布狀態">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PublishStatus })} className={inputCls}>
              <option value="draft">草稿</option>
              <option value="published">已發布</option>
              <option value="archived">已下架</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="排序（數字越小越前面）">
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputCls} />
          </Field>
          <Field label="成交價格 (JPY，選填)">
            <input
              type="number"
              value={form.priceJPY ?? ""}
              onChange={(e) => setForm({ ...form, priceJPY: e.target.value === "" ? null : Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
        </div>

        <ImageUploader label="封面圖片" value={form.image} folder="cases" onChange={(url) => setForm({ ...form, image: url })} />

        <div className="flex gap-2 border-b border-outline-variant mt-4">
          {LANGS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLang(l.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                lang === l.key ? "border-brand-500 text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="分類">
              <input value={form[`category${lang}`]} onChange={(e) => setForm({ ...form, [`category${lang}`]: e.target.value })} className={inputCls} />
            </Field>
            <Field label="地點">
              <input value={form[`location${lang}`]} onChange={(e) => setForm({ ...form, [`location${lang}`]: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <Field label="標題">
            <input value={form[`title${lang}`]} onChange={(e) => setForm({ ...form, [`title${lang}`]: e.target.value })} className={inputCls} />
          </Field>
          <Field label="簡介">
            <textarea rows={2} value={form[`desc${lang}`]} onChange={(e) => setForm({ ...form, [`desc${lang}`]: e.target.value })} className={inputCls} />
          </Field>
          <Field label="專案概述 (overview)">
            <textarea rows={3} value={details.overview} onChange={(e) => updateDetails({ overview: e.target.value })} className={inputCls} />
          </Field>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className={labelCls}>關鍵規格與重點 (highlights)</span>
              <button onClick={addHighlight} type="button" className="text-xs text-primary hover:underline">
                ＋ 新增一項
              </button>
            </div>
            {details.highlights.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={h} onChange={(e) => updateHighlight(idx, e.target.value)} className={inputCls} />
                <button onClick={() => removeHighlight(idx)} type="button" className="text-xs text-red-600 hover:underline shrink-0">
                  移除
                </button>
              </div>
            ))}
          </div>

          <Field label="執行策略 (strategy)">
            <textarea rows={3} value={details.strategy} onChange={(e) => updateDetails({ strategy: e.target.value })} className={inputCls} />
          </Field>
          <Field label="成效與結果 (outcome)">
            <textarea rows={3} value={details.outcome} onChange={(e) => updateDetails({ outcome: e.target.value })} className={inputCls} />
          </Field>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-4 pt-6 border-t border-outline-variant">
          <button onClick={handleSave} disabled={saving} className="rounded-md px-6 py-3 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "儲存中..." : "儲存"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
