"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle "receding" effect as a section scrolls past the top of the
 * viewport — dims and shrinks it very slightly instead of a hard cutoff.
 *
 * Deliberately cheap: no scroll listener, no per-frame JS, no blur filter
 * (blur is the most expensive thing you can animate — it forces the
 * compositor to repaint constantly and was the actual cause of the FPS
 * drops). IntersectionObserver only fires when the element crosses one of
 * a handful of thresholds, and the rest of the smoothing is a plain CSS
 * transition, so this costs effectively nothing during scroll.
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        const recedingAboveTop = entry.boundingClientRect.top < 0;
        const ratio = recedingAboveTop ? entry.intersectionRatio : 1;
        el.style.opacity = `${0.7 + 0.3 * ratio}`;
        el.style.transform = `scale(${0.985 + 0.015 * ratio})`;
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "opacity 0.25s ease-out, transform 0.25s ease-out", willChange: "opacity, transform" }}
    >
      {children}
    </div>
  );
}
