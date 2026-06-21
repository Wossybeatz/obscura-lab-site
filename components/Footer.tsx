import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="relative z-10 pt-16 pb-8">
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pb-12">
          <div>
            <div className="flex items-center gap-2.5 font-mono-brand font-extrabold text-lg mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              AETRIS <span className="text-[var(--accent)]">/ LAB</span>
            </div>
            <p className="text-[var(--text-dim)] text-sm max-w-[280px] leading-relaxed">
              Sound kits &amp; sample packs for producers who want their tracks to hit different.
            </p>
          </div>
          <div>
            <h5 className="font-mono-brand text-[11px] text-[var(--text-faint)] tracking-[2px] uppercase mb-4.5">
              Shop
            </h5>
            <Link href="/kits" className="block text-[var(--text-dim)] text-sm mb-3 hover:text-[var(--accent)] transition-colors">
              Drum kits
            </Link>
            <Link href="/bundles" className="block text-[var(--text-dim)] text-sm mb-3 hover:text-[var(--accent)] transition-colors">
              Bundles
            </Link>
            <Link href="/plugins" className="block text-[var(--text-dim)] text-sm mb-3 hover:text-[var(--accent)] transition-colors">
              Plugins
            </Link>
            <Link href="/license" className="block text-[var(--text-dim)] text-sm mb-3 hover:text-[var(--accent)] transition-colors">
              License terms
            </Link>
          </div>
          <div>
            <h5 className="font-mono-brand text-[11px] text-[var(--text-faint)] tracking-[2px] uppercase mb-4.5">
              Connect
            </h5>
            <a
              href="https://www.instagram.com/wossybeatz/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[var(--text-dim)] text-sm mb-3 hover:text-[var(--accent)] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@wossybeatz"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[var(--text-dim)] text-sm mb-3 hover:text-[var(--accent)] transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>

        <div className="border-t border-[var(--line)] pt-12 pb-12 text-center">
          <h3 className="font-mono-brand text-2xl uppercase tracking-[-0.5px]">
            Get exclusive deals
          </h3>
          <p className="font-mono-brand text-[13px] text-[var(--text-dim)] mt-2.5">
            Early access, discounts &amp; free drops. No spam.
          </p>
          <NewsletterForm />
        </div>

        <div className="border-t border-[var(--line)] pt-6 flex justify-between items-center flex-wrap gap-4">
          <p className="font-mono-brand text-xs text-[var(--text-faint)]">
            © 2026 AETRIS / LAB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
