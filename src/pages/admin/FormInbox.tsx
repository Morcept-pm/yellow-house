import { useEffect, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { listSubmissionsAdmin, updateSubmissionStatus } from "../../lib/content/forms";
import type { FormSubmission, SubmissionStatus } from "../../types/content";

const STATUS_LABEL: Record<SubmissionStatus, string> = { new: "未處理", processing: "處理中", completed: "已完成" };
const STATUS_CLASS: Record<SubmissionStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export function FormInbox() {
  const [items, setItems] = useState<FormSubmission[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => listSubmissionsAdmin().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: SubmissionStatus) => {
    await updateSubmissionStatus(id, status);
    load();
  };

  return (
    <AdminShell>
      <h1 className="font-headline-lg text-2xl text-primary font-medium mb-8">表單收件匣</h1>

      {items === null && <p className="text-sm text-on-surface-variant">載入中...</p>}
      {items?.length === 0 && <p className="text-sm text-on-surface-variant">目前尚無表單資料。</p>}

      <div className="flex flex-col gap-3">
        {items?.map((item) => {
          const isOpen = expanded === item.id;
          const createdAt = item.createdAt?.toDate?.() as Date | undefined;
          return (
            <div key={item.id} className="rounded-lg bg-surface-container-lowest border border-outline-variant overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : item.id)} className="w-full flex items-center gap-4 p-5 text-left">
                <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${STATUS_CLASS[item.status]}`}>{STATUS_LABEL[item.status]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {item.name} {item.company && `（${item.company}）`}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {item.email} {item.phone && `｜ ${item.phone}`} {item.propertySlug && `｜ 物件：${item.propertySlug}`}
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant shrink-0">{createdAt ? createdAt.toLocaleString("zh-TW") : ""}</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 flex flex-col gap-4 border-t border-outline-variant pt-4">
                  <p className="text-sm whitespace-pre-line text-primary">{item.message}</p>
                  <p className="text-xs text-on-surface-variant">諮詢主題：{item.type || "—"}</p>
                  <div className="flex gap-2">
                    {(["new", "processing", "completed"] as SubmissionStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(item.id, s)}
                        disabled={item.status === s}
                        className={`rounded-md px-4 py-2 text-xs border transition-colors ${
                          item.status === s ? "border-primary bg-primary text-white" : "border-outline-variant hover:border-primary"
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
