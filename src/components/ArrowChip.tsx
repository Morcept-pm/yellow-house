export function ArrowChip({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md bg-brand-500 text-primary shrink-0 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary ${className}`}
    >
      <span className="material-symbols-outlined text-base leading-none transition-transform duration-300 group-hover:translate-x-0.5">
        arrow_forward
      </span>
    </span>
  );
}
