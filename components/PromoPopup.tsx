"use client";

import { useEffect, useState } from "react";

const PROMO_CODE = "LAB20";
const SESSION_KEY = "aetrislab_promo_shown";
const SHOW_AFTER_MS = 18000;
const COUNTDOWN_SECONDS = 10 * 60; // urgency timer, resets each time it's shown

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const showTimer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, SHOW_AFTER_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [visible]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — no-op, code is still visible to copy manually
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={() => setVisible(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-8 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[var(--line)] text-[var(--text-dim)] flex items-center justify-center hover:border-[var(--accent-dim)] hover:text-[var(--accent)] transition-colors"
        >
          ✕
        </button>

        <p className="font-mono-brand text-4xl font-extrabold tabular-nums text-[var(--text)] tracking-wide">
          {formatCountdown(secondsLeft)}
        </p>

        <p className="font-mono-brand text-xs tracking-[2px] text-[var(--accent)] uppercase mt-4">
          [ special offer ]
        </p>
        <p className="font-mono-brand text-[13px] text-[var(--text-dim)] mt-2">
          use promo code to get 20% discount
        </p>

        <div className="mt-6 flex items-center justify-between bg-[var(--bg-card)] border border-[var(--line)] rounded-md overflow-hidden">
          <span className="font-mono-brand text-lg font-bold tracking-[2px] px-5 py-3 text-[var(--text)]">
            {PROMO_CODE}
          </span>
          <button
            onClick={handleCopy}
            className="font-mono-brand text-xs font-bold uppercase tracking-wide px-5 py-3 h-full bg-[var(--accent)] text-[#04140b] hover:opacity-85 transition-opacity"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        <p className="font-mono-brand text-[11px] text-[var(--text-faint)] mt-4">
          code can be applied to any product or the whole cart
        </p>
      </div>
    </div>
  );
}
