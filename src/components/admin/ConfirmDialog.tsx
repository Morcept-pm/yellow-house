interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "確認", danger, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="rounded-xl bg-surface-container-lowest max-w-sm w-full p-6 flex flex-col gap-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-headline-md text-lg text-primary font-medium">{title}</h3>
        {description && <p className="font-body-md text-sm text-on-surface-variant">{description}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="rounded-md px-4 py-2 text-sm border border-outline-variant hover:bg-surface-container-low transition-colors">
            取消
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm text-white transition-colors ${danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
