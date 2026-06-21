"use client";

import Link from "next/link";
import SearchBox from "./SearchBox";
import AccountMenu from "./AccountMenu";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();

  return (
    <div className="sticky top-0 z-50 bg-[#06080a]/85 backdrop-blur-md border-b border-[#1c2326]">
      <div className="max-w-[1180px] mx-auto px-7 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-mono-brand font-extrabold text-lg tracking-wide shrink-0">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] blink shadow-[0_0_8px_var(--accent-glow)]" />
          AETRIS <span className="text-[var(--accent)] font-bold">/ LAB</span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/kits" className="text-xs font-mono-brand tracking-widest uppercase text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
            Kits
          </Link>
          <Link href="/bundles" className="text-xs font-mono-brand tracking-widest uppercase text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
            Bundles
          </Link>
          <Link href="/plugins" className="text-xs font-mono-brand tracking-widest uppercase text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
            Plugins
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-none justify-end">
          <div className="hidden sm:block">
            <SearchBox />
          </div>
          <Link
            href="/cart"
            className="relative w-9 h-9 border border-[var(--line)] rounded-md flex items-center justify-center text-[var(--text-dim)] hover:border-[var(--accent-dim)] hover:text-[var(--accent)] transition-colors shrink-0"
            aria-label="View cart"
            title="Your cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] rounded-full bg-[var(--accent)] text-[#04140b] text-[10px] font-bold font-mono-brand flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <AccountMenu />
        </div>
      </div>
      <div className="sm:hidden px-7 pb-3">
        <SearchBox />
      </div>
    </div>
  );
}
