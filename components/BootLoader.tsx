"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "initializing system...",
  "loading core modules......... [OK]",
  "connecting audio engine...... [OK]",
  "loading sample library....... [OK]",
  "calibrating interface........ [OK]",
];

const SESSION_KEY = "obscuralab_booted";

export default function BootLoader() {
  // Only show once per browser tab session, not on every client-side
  // navigation — this is a "system boot" moment, not a route transition.
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length));
    }, 160);
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 9, 100);
        if (next >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setFading(true), 220);
          setTimeout(() => setVisible(false), 600);
        }
        return next;
      });
    }, 70);
    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[var(--bg)] flex items-center justify-center transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="font-mono-brand text-[13px] text-[var(--text-dim)] w-[320px]">
        <p className="text-2xl font-extrabold uppercase tracking-[-1px] mb-1 text-[var(--text)]">
          OBSCURA <span className="text-[var(--accent)]">/ LAB</span>
        </p>
        <div className="mt-6 space-y-1">
          {STEPS.slice(0, stepIndex).map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div className="mt-4 h-px bg-[var(--line)] relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[var(--text-faint)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          loading assets...
          <span className="ml-auto">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
