"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function AccountMenu() {
  const { user, loading, signInWithEmail, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await signInWithEmail(email);
    setStatus(error ? "error" : "sent");
  }

  if (loading) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={user ? "Account menu" : "Sign in"}
        title={user ? user.email ?? "Account" : "Sign in to sync your cart across devices"}
        className="w-9 h-9 rounded-md border border-[var(--line)] flex items-center justify-center text-[var(--text-dim)] hover:border-[var(--accent-dim)] hover:text-[var(--accent)] transition-colors shrink-0"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-[260px] bg-[#0d0f15] border border-[var(--line)] rounded-xl p-4 shadow-2xl z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {user ? (
            <>
              <p className="font-mono-brand text-xs text-[var(--text-faint)] uppercase tracking-wide mb-1">
                Signed in
              </p>
              <p className="font-mono-brand text-sm truncate mb-4">{user.email}</p>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="w-full font-mono-brand text-[11px] uppercase tracking-wide py-2 rounded-md border border-[var(--line)] text-[var(--text-dim)] hover:border-[var(--red)] hover:text-[var(--red)] transition-all"
              >
                Sign out
              </button>
            </>
          ) : status === "sent" ? (
            <p className="font-mono-brand text-[13px] text-[var(--text-dim)] leading-relaxed">
              Check your email — click the link to sign in. Your cart will sync automatically.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="font-mono-brand text-xs text-[var(--text-faint)] uppercase tracking-wide mb-2">
                Sign in to sync your cart
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-[var(--bg-card)] border border-[var(--line)] rounded-md px-3 py-2 text-sm font-mono-brand outline-none focus:border-[var(--accent-dim)] mb-2"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full font-mono-brand text-[11px] uppercase tracking-wide py-2.5 rounded-md bg-[var(--accent)] text-[#04140b] font-bold hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send magic link"}
              </button>
              {status === "error" && (
                <p className="font-mono-brand text-[11px] text-[var(--red)] mt-2">
                  Something went wrong — try again.
                </p>
              )}
              <p className="font-mono-brand text-[10px] text-[var(--text-faint)] mt-2">
                No password — we email you a one-click sign-in link.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
