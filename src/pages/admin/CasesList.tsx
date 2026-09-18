import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AdminShell } from "../../components/admin/AdminShell";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { listAllCasesAdmin, deleteCase } from "../../lib/content/cases";
import type { CaseArticle } from "../../types/content";

const STATUS_LABEL: Record<string, string> = { draft: "草稿", published: "已發布", archived: "已下架" };
const STATUS_CLASS: Record<string, string> = {
  draft: "bg-surface-container-low text-on-surface-variant",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-200 text-gray-600",
};

export function CasesList() {
  const [items, setItems] = useState<CaseArticle[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CaseArticle | null>(null);

  const load = () => listAllCasesAdmin().then(setItems);
  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-lg text-2xl text-primary font-medium">實績案例</h1>
        <Link href="/admin/cases/new" className="rounded-md px-5 py-3 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          ＋ 新增案例
        </Link>
      </div>

      {items === null && <p className="text-sm text-on-surface-variant">載入中...</p>}
      {items?.length === 0 && <p className="text-sm text-on-surface-variant">尚無任何案例，點擊右上角新增。</p>}

      <div className="flex flex-col gap-3">
        {items?.map((item) => (
          <div key={item.id} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-5 flex items-center gap-4">
            <img src={item.image} alt="" className="w-20 h-14 rounded-md object-cover bg-surface-container-low shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${STATUS_CLASS[item.status]}`}>{STATUS_LABEL[item.status]}</span>
                <span className="text-xs text-on-surface-variant">排序 {item.sortOrder}</span>
              </div>
              <p className="text-sm font-medium text-primary truncate">{item.titleZh}</p>
              <p className="text-xs text-on-surface-variant truncate">/{item.slug}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/cases/${item.id}`} className="rounded-md px-4 py-2 text-xs border border-outline-variant hover:border-primary transition-colors">
                編輯
              </Link>
              <button onClick={() => setPendingDelete(item)} className="rounded-md px-4 py-2 text-xs border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`確定要刪除「${pendingDelete?.titleZh}」嗎？`}
        description="刪除後無法復原。"
        danger
        confirmLabel="刪除"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete) await deleteCase(pendingDelete.id);
          setPendingDelete(null);
          load();
        }}
      />
    </AdminShell>
  );
}
