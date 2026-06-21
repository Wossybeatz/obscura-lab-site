"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllProducts, getAllBundles } from "@/lib/products";

type SearchResult = {
  id: string;
  name: string;
  type: string;
  href: string;
};

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const index: SearchResult[] = useMemo(() => {
    const products = getAllProducts().map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      href: `/product/${p.slug}`,
    }));
    const bundles = getAllBundles().map((b) => ({
      id: b.id,
      name: b.name,
      type: "bundle",
      href: `/bundles/${b.slug}`,
    }));
    return [...products, ...bundles];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, index]);

  function handleSelect(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) handleSelect(results[0].href);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-[220px] md:max-w-[260px]">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Search kits, bundles..."
          aria-label="Search"
          className="w-full bg-transparent border border-[var(--line)] rounded-md px-3 py-1.5 text-xs font-mono-brand text-[var(--text)] placeholder-[var(--text-faint)] outline-none focus:border-[var(--accent-dim)] transition-colors"
        />
      </form>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0f15] border border-[var(--line)] rounded-md overflow-hidden shadow-2xl z-50">
          {results.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleSelect(item.href)}
              className="block px-3.5 py-2.5 text-sm hover:bg-[var(--bg-soft)] transition-colors border-b border-[var(--line-soft)] last:border-b-0"
            >
              <span className="font-mono-brand text-[var(--text)]">{item.name}</span>
              <span className="block font-mono-brand text-[10px] text-[var(--text-faint)] uppercase tracking-wide mt-0.5">
                {item.type}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
