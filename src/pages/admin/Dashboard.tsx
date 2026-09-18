import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AdminShell } from "../../components/admin/AdminShell";
import { listAllNewsAdmin } from "../../lib/content/news";
import { listAllCasesAdmin } from "../../lib/content/cases";
import { listAllPropertiesAdmin } from "../../lib/content/properties";
import { listSubmissionsAdmin } from "../../lib/content/forms";

export function Dashboard() {
  const [counts, setCounts] = useState<{ news: number; cases: number; properties: number; newSubmissions: number } | null>(null);

  useEffect(() => {
    Promise.all([listAllNewsAdmin(), listAllCasesAdmin(), listAllPropertiesAdmin(), listSubmissionsAdmin()])
      .then(([news, cases, properties, submissions]) => {
        setCounts({
          news: news.length,
          cases: cases.length,
          properties: properties.length,
          newSubmissions: submissions.filter((s) => s.status === "new").length,
        });
      })
      .catch(() => setCounts({ news: 0, cases: 0, properties: 0, newSubmissions: 0 }));
  }, []);

  const cards = [
    { label: "最新消息", value: counts?.news, href: "/admin/news" },
    { label: "實績案例", value: counts?.cases, href: "/admin/cases" },
    { label: "在售物件", value: counts?.properties, href: "/admin/properties" },
    { label: "待處理表單", value: counts?.newSubmissions, href: "/admin/forms" },
  ];

  return (
    <AdminShell>
      <h1 className="font-headline-lg text-2xl text-primary font-medium mb-8">儀表板</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-2 hover:border-brand-500 hover:-translate-y-0.5 transition-all"
          >
            <span className="text-xs text-on-surface-variant font-label-caps uppercase tracking-widest">{c.label}</span>
            <span className="font-headline-lg text-3xl text-primary font-medium">{c.value ?? "…"}</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
