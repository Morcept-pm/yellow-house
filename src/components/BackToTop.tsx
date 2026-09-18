import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 480);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:bg-brand-500 hover:text-primary transition-colors duration-300"
    >
      <span className="material-symbols-outlined text-xl">arrow_upward</span>
    </button>
  );
}
