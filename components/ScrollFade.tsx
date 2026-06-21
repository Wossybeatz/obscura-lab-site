"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps a section so that once it scrolls past the top of the viewport,
 * it gradually blurs, dims, and shrinks slightly — like it's receding into
 * the background — instead of just hard-cutting off. Sections still fully
 * in view (or below it) are unaffected.
 */
export default function ScrollFade({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const passed = -rect.top;
      // Fully receded once scrolled about 70% of the section's own height
      // past the top — keeps the effect proportional to section size.
      const progress = Math.min(Math.max(passed / (rect.height * 0.7 || 1), 0), 1);

      el.style.filter = progress > 0 ? `blur(${progress * 7}px)` : "";
      el.style.opacity = progress > 0 ? `${1 - progress * 0.55}` : "1";
      el.style.transform = progress > 0 ? `scale(${1 - progress * 0.035})` : "";

      frame = 0;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ willChange: "filter, opacity, transform" }}>
      {children}
    </div>
  );
}
