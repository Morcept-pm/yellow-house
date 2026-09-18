import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { AdminShell } from "../../components/admin/AdminShell";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { GalleryUploader } from "../../components/admin/GalleryUploader";
import { getPropertyById, createProperty, updateProperty, propertySlugExists } from "../../lib/content/properties";
import { normalizeSlug, isValidSlug } from "../../lib/slug";
import type { ListingStatus, PropertyCategory, PropertyDoc, PublishStatus } from "../../types/content";

type Lang = "Zh" | "En" | "Jp";
const LANGS: { key: Lang; label: string }[] = [
  { key: "Zh", label: "中文" },
  { key: "En", label: "English" },
  { key: "Jp", label: "日本語" },
];

const EMPTY: PropertyDoc = {
  slug: "",
  category: "residential",
  listingStatus: "available",
  titleZh: "",
  titleEn: "",
  titleJp: "",
  summaryZh: "",
  summaryEn: "",
  summaryJp: "",
  descriptionZh: "",
  descriptionEn: "",
  descriptionJp: "",
  locationZh: "",
  locationEn: "",
  locationJp: "",
  priceJPY: null,
  layout: "",
  landAreaSqm: null,
  floorAreaSqm: null,
  buildYear: "",
  coverImage: "",
  gallery: [],
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

export function PropertyEditor() {
  const [, params] = useRoute<{ id: string }>("/admin/properties/:id");
  const [, navigate] = useLocation();
  const id = params?.id;
  const isNew = id === "new";

  const [form, setForm] = useState<PropertyDoc>(EMPTY);
  const [lang, setLang] = useState<Lang>("Zh");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !id) return;
    getPropertyById(id).then((doc) => {
      if (doc) setForm(doc);
      setLoading(false);
    });
  }, [id, isNew]);

  useEffect(() => {
    if (!slugTouched && isNew) setForm((f) => ({ ...f, slug: normalizeSlug(f.titleZh) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.titleZh]);

  const handleSave = async () => {
    setError(null);
    if (!isValidSlug(form.slug)) {
      setError("網址代稱（slug）格式不正確，僅能使用小寫英數字與連字號。");
      return;
    }
    const dupe = await propertySlugExists(form.slug, isNew ? undefined : id);
    if (dupe) {
      setError("此網址代稱已被使用，請更換。");
      return;
    }
    if (!form.coverImage) {
      setError("請至少上傳一張封面圖片。");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const newId = await createProperty(form);
        navigate(`/admin/properties/${newId}`, { replace: true });
      } else if (id) {
        await updateProperty(id, form);
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
        <h1 className="font-headline-lg text-2xl text-primary font-medium">{isNew ? "新增物件" : "編輯物件"}</h1>
        <button onClick={() => navigate("/admin/properties")} className="text-sm text-on-surface-variant hover:text-primary">
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
          <Field label="發布狀態（是否顯示於前台）">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PublishStatus })} className={inputCls}>
              <option value="draft">草稿</option>
              <option value="published">已發布</option>
              <option value="archived">已下架</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="物件類別">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as PropertyCategory })} className={inputCls}>
              <option value="residential">住宅</option>
              <option value="commercial">商業與收益型</option>
              <option value="land">土地</option>
              <option value="hospitality">住宿設施</option>
            </select>
          </Field>
          <Field label="銷售狀態">
            <select value={form.listingStatus} onChange={(e) => setForm({ ...form, listingStatus: e.target.value as ListingStatus })} className={inputCls}>
              <option value="available">待售</option>
              <option value="negotiating">洽談中</option>
              <option value="sold">已成交</option>
            </select>
          </Field>
          <Field label="排序（數字越小越前面）">
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="價格 (JPY，留空＝價格請洽詢)">
            <input
              type="number"
              value={form.priceJPY ?? ""}
              onChange={(e) => setForm({ ...form, priceJPY: e.target.value === "" ? null : Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="格局（如 3LDK）">
            <input value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })} className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="土地面積 (㎡，選填)">
            <input
              type="number"
              value={form.landAreaSqm ?? ""}
              onChange={(e) => setForm({ ...form, landAreaSqm: e.target.value === "" ? null : Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="建物面積 (㎡，選填)">
            <input
              type="number"
              value={form.floorAreaSqm ?? ""}
              onChange={(e) => setForm({ ...form, floorAreaSqm: e.target.value === "" ? null : Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="屋齡／建築年">
            <input value={form.buildYear} onChange={(e) => setForm({ ...form, buildYear: e.target.value })} className={inputCls} />
          </Field>
        </div>

        <ImageUploader label="封面圖片" value={form.coverImage} folder="properties" onChange={(url) => setForm({ ...form, coverImage: url })} />
        <GalleryUploader label="圖集（可多張）" value={form.gallery} folder="properties" onChange={(gallery) => setForm({ ...form, gallery })} />

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
          <Field label="地點">
            <input value={form[`location${lang}`]} onChange={(e) => setForm({ ...form, [`location${lang}`]: e.target.value })} className={inputCls} />
          </Field>
          <Field label="標題">
            <input value={form[`title${lang}`]} onChange={(e) => setForm({ ...form, [`title${lang}`]: e.target.value })} className={inputCls} />
          </Field>
          <Field label="簡介（列表卡片顯示）">
            <textarea rows={2} value={form[`summary${lang}`]} onChange={(e) => setForm({ ...form, [`summary${lang}`]: e.target.value })} className={inputCls} />
          </Field>
          <Field label="詳細說明（物件內頁顯示）">
            <textarea rows={6} value={form[`description${lang}`]} onChange={(e) => setForm({ ...form, [`description${lang}`]: e.target.value })} className={inputCls} />
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
