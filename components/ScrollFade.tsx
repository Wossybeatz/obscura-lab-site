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
      // Start the effect a bit early — while the section's top edge is
      // still ~18% of the viewport height below the actual top — instead
      // of waiting until it's fully scrolled past.
      const startAt = window.innerHeight * 0.18;
      const passed = startAt - rect.top;
      // Fully receded only after scrolling a full section height past that
      // point, and the effect itself is intentionally subtle (low max
      // blur/opacity/scale change) so it reads as a soft drift, not a fade.
      const progress = Math.min(Math.max(passed / (rect.height || 1), 0), 1);

      el.style.filter = progress > 0 ? `blur(${progress * 3}px)` : "";
      el.style.opacity = progress > 0 ? `${1 - progress * 0.3}` : "1";
      el.style.transform = progress > 0 ? `scale(${1 - progress * 0.02})` : "";

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
