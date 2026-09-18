import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface RotatingFrame {
  src: string;
  /** Responsive candidates — only the bundled images have these. */
  srcSet?: string;
}

/**
 * Cross-fades through a set of images inside whatever box it is given.
 *
 * Deliberately has no scrim of its own: the redesign keeps photography bright,
 * so any darkening is the caller's decision, not baked in here.
 */
export function RotatingImage({
  frames,
  alt,
  sizes,
  intervalMs = 5600,
  index: controlledIndex,
  onIndexChange,
  paused = false,
  priority = false,
  className = "",
  imgClassName = "",
}: {
  frames: RotatingFrame[];
  alt: string;
  sizes?: string;
  intervalMs?: number;
  /** Optional external control — pass with onIndexChange to drive from outside. */
  index?: number;
  onIndexChange?: (i: number) => void;
  paused?: boolean;
  /** Set on the first above-the-fold image so it is not lazy-loaded. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const [internal, setInternal] = useState(0);
  const index = controlledIndex ?? internal;
  const setIndex = onIndexChange ?? setInternal;

  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const count = frames.length;
  const running = count > 1 && !paused && visible && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setIndex((index + 1) % count), intervalMs);
    return () => window.clearInterval(id);
    // `index` is intentionally a dependency: the timer restarts whenever the
    // frame changes, so manual navigation also resets the dwell time.
  }, [running, index, count, intervalMs, setIndex]);

  // Warm the next frame so the cross-fade never reveals a half-loaded image.
  const nextSrc = useMemo(() => (count > 1 ? frames[(index + 1) % count].src : null), [frames, index, count]);
  useEffect(() => {
    if (!nextSrc) return;
    const img = new Image();
    img.src = nextSrc;
  }, [nextSrc]);

  const frame = frames[Math.min(index, count - 1)];
  if (!frame) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={frame.src}
          srcSet={frame.srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      </AnimatePresence>
    </div>
  );
}
