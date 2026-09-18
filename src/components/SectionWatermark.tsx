export function SectionWatermark({ text }: { text: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none select-none absolute top-0 md:top-2 left-0 z-0 font-display-lg text-[34px] md:text-[88px] leading-none text-primary/[0.045] uppercase tracking-tighter whitespace-nowrap"
    >
      {text}
    </span>
  );
}
