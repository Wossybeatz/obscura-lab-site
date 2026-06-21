"use client";

import { useEffect, useRef, useState } from "react";

const TEXT = "AETRIS / LAB";
const GLITCH_CHARS = "!<>-_\\/[]{}=+*^?#01░▒▓";

function randomChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

/**
 * Headline with three layered effects, a lighter CSS/JS-only take on the
 * glitchy animated wordmark on atrumlab.com (their red, ours green/teal):
 *  1. A perspective tilt that follows the cursor.
 *  2. A shifting gradient fill (.hero-shimmer-text) that "переливается"
 *     between accent shades, always running.
 *  3. Periodic glitch bursts that scramble random characters into
 *     symbols/binary digits before snapping back to the real text — the
 *     "laggy", decoding-terminal feel.
 */
export default function HeroHeading() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [display, setDisplay] = useState(TEXT);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    function scheduleGlitch() {
      timeoutId = setTimeout(runGlitch, 3500 + Math.random() * 3500);
    }

    function runGlitch() {
      let frame = 0;
      const totalFrames = 9;
      // Reveal characters back to normal in a random order, not left-to-right,
      // for a less mechanical, more "glitchy" resolve.
      const order = TEXT.split("").map((_, i) => i).sort(() => Math.random() - 0.5);

      intervalId = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          clearInterval(intervalId);
          setDisplay(TEXT);
          scheduleGlitch();
          return;
        }
        const revealed = new Set(order.slice(0, Math.floor((frame / totalFrames) * order.length)));
        setDisplay(
          TEXT.split("")
            .map((ch, i) => (ch === " " || ch === "/" || revealed.has(i) ? ch : randomChar()))
            .join("")
        );
      }, 55);
    }

    scheduleGlitch();
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLHeadingElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  }

  function handleMouseLeave() {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  }

  return (
    <h1
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-glow-text hero-shimmer-text font-mono-brand font-extrabold uppercase leading-[0.95] tracking-[-2px] text-[48px] md:text-[80px] lg:text-[96px] transition-transform duration-200 ease-out will-change-transform select-none"
    >
      {display}
    </h1>
  );
}
