import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { AdminShell } from "../../components/admin/AdminShell";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { getNewsById, createNews, updateNews, newsSlugExists } from "../../lib/content/news";
import { normalizeSlug, isValidSlug } from "../../lib/slug";
import type { NewsArticleDoc, NewsContentBody, PublishStatus } from "../../types/content";

type Lang = "Zh" | "En" | "Jp";
const LANGS: { key: Lang; label: string }[] = [
  { key: "Zh", label: "中文" },
  { key: "En", label: "English" },
  { key: "Jp", label: "日本語" },
];

const EMPTY_CONTENT: NewsContentBody = { lead: "", sections: [], summary: "" };

const EMPTY: NewsArticleDoc = {
  slug: "",
  categoryZh: "",
  categoryEn: "",
  categoryJp: "",
  titleZh: "",
  titleEn: "",
  titleJp: "",
  excerptZh: "",
  excerptEn: "",
  excerptJp: "",
  image: "",
  readTimeZh: "5 分鐘閱讀",
  readTimeEn: "5 min read",
  readTimeJp: "5分で読了",
  contentZh: { ...EMPTY_CONTENT },
  contentEn: { ...EMPTY_CONTENT },
  contentJp: { ...EMPTY_CONTENT },
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

export function NewsEditor() {
  const [, params] = useRoute<{ id: string }>("/admin/news/:id");
  const [, navigate] = useLocation();
  const id = params?.id;
  const isNew = id === "new";

  const [form, setForm] = useState<NewsArticleDoc>(EMPTY);
  const [lang, setLang] = useState<Lang>("Zh");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !id) return;
    getNewsById(id).then((doc) => {
      if (doc) setForm(doc);
      setLoading(false);
    });
  }, [id, isNew]);

  useEffect(() => {
    if (!slugTouched && isNew) {
      setForm((f) => ({ ...f, slug: normalizeSlug(f.titleZh) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.titleZh]);

  const contentKey = `content${lang}` as const;
  const content = form[contentKey];

  const updateContent = (patch: Partial<NewsContentBody>) => setForm({ ...form, [contentKey]: { ...content, ...patch } });

  const updateSection = (idx: number, patch: Partial<{ heading: string; body: string }>) => {
    const sections = content.sections.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    updateContent({ sections });
  };

  const addSection = () => updateContent({ sections: [...content.sections, { heading: "", body: "" }] });
  const removeSection = (idx: number) => updateContent({ sections: content.sections.filter((_, i) => i !== idx) });

  const handleSave = async () => {
    setError(null);
    if (!isValidSlug(form.slug)) {
      setError("網址代稱（slug）格式不正確，僅能使用小寫英數字與連字號。");
      return;
    }
    const dupe = await newsSlugExists(form.slug, isNew ? undefined : id);
    if (dupe) {
      setError("此網址代稱已被使用，請更換。");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const newId = await createNews(form);
        navigate(`/admin/news/${newId}`, { replace: true });
      } else if (id) {
        await updateNews(id, form);
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
        <h1 className="font-headline-lg text-2xl text-primary font-medium">{isNew ? "新增消息" : "編輯消息"}</h1>
        <button onClick={() => navigate("/admin/news")} className="text-sm text-on-surface-variant hover:text-primary">
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
        </div>

        <ImageUploader label="封面圖片" value={form.image} folder="news" onChange={(url) => setForm({ ...form, image: url })} />

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
            <Field label="閱讀時間">
              <input value={form[`readTime${lang}`]} onChange={(e) => setForm({ ...form, [`readTime${lang}`]: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <Field label="標題">
            <input value={form[`title${lang}`]} onChange={(e) => setForm({ ...form, [`title${lang}`]: e.target.value })} className={inputCls} />
          </Field>
          <Field label="摘要">
            <textarea rows={2} value={form[`excerpt${lang}`]} onChange={(e) => setForm({ ...form, [`excerpt${lang}`]: e.target.value })} className={inputCls} />
          </Field>
          <Field label="開場引言 (lead)">
            <textarea rows={2} value={content.lead} onChange={(e) => updateContent({ lead: e.target.value })} className={inputCls} />
          </Field>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className={labelCls}>內文段落</span>
              <button onClick={addSection} type="button" className="text-xs text-primary hover:underline">
                ＋ 新增段落
              </button>
            </div>
            {content.sections.map((sec, idx) => (
              <div key={idx} className="rounded-lg border border-outline-variant p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">段落 {idx + 1}</span>
                  <button onClick={() => removeSection(idx)} type="button" className="text-xs text-red-600 hover:underline">
                    移除
                  </button>
                </div>
                <input placeholder="小標題" value={sec.heading} onChange={(e) => updateSection(idx, { heading: e.target.value })} className={inputCls} />
                <textarea placeholder="內文" rows={3} value={sec.body} onChange={(e) => updateSection(idx, { body: e.target.value })} className={inputCls} />
              </div>
            ))}
          </div>

          <Field label="總結觀點 (summary)">
            <textarea rows={2} value={content.summary} onChange={(e) => updateContent({ summary: e.target.value })} className={inputCls} />
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
