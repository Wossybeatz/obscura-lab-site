"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[440px] mx-auto mt-2 border border-[var(--line)] rounded-lg overflow-hidden">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent border-none px-4.5 py-3.5 text-[var(--text)] font-mono-brand text-[13px] outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[var(--accent)] border-none px-6 text-[#04140b] font-bold font-mono-brand text-[13px] uppercase tracking-wide hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {status === "done" ? "Joined ✓" : "Join"}
      </button>
    </form>
  );
}
