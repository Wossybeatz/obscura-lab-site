import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import PayhipButton from "@/components/PayhipButton";
import SessionClock from "@/components/SessionClock";
import HeroHeading from "@/components/HeroHeading";
import { getFeaturedProducts, getAllBundles, formatPrice } from "@/lib/products";

export default function Home() {
  const featured = getFeaturedProducts();
  const mainBundle = getAllBundles()[0];

  return (
    <>
      {/* HERO */}
      <section className="relative py-28 md:py-[120px] text-center border-b border-[var(--line)]">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="inline-flex items-center gap-3 font-mono-brand text-xs tracking-[2px] text-[var(--accent)] border border-[var(--accent-dim)] rounded-full px-4 py-1.5 mb-8 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent-glow)]" />
            system online
            <span className="text-[var(--text-faint)] normal-case">
              · <SessionClock />
            </span>
          </div>
          <HeroHeading />
          <div className="flex gap-4 justify-center mt-10 flex-wrap px-4">
            <Link
              href="/kits"
              className="font-mono-brand text-[13px] tracking-wide uppercase px-7 py-3.5 rounded-md bg-[var(--accent)] text-[#04140b] font-bold hover:shadow-[0_0_24px_var(--accent-glow)] hover:-translate-y-px transition-all"
            >
              Explore kits →
            </Link>
            <Link
              href="/bundles"
              className="font-mono-brand text-[13px] tracking-wide uppercase px-7 py-3.5 rounded-md border border-[var(--line)] hover:border-[var(--accent-dim)] hover:text-[var(--accent)] transition-all"
            >
              View bundles
            </Link>
          </div>
          <div className="mt-14 font-mono-brand text-[13px] text-[var(--text-faint)] flex items-center justify-center gap-1.5">
            <span>root@aetrislab:~$ play_demo --pack=latest</span>
            <span className="w-2 h-3.5 bg-[var(--accent)] inline-block blink" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-b border-[var(--line)] bg-[var(--bg-soft)] py-3.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-12 marquee-track">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="font-mono-brand text-xs tracking-[2px] text-[var(--text-faint)] uppercase inline-flex items-center gap-12"
            >
              <em className="text-[var(--accent)] not-italic">•</em> TRAP KITS{" "}
              <em className="text-[var(--accent)] not-italic">•</em> R&amp;B LOOPS{" "}
              <em className="text-[var(--accent)] not-italic">•</em> DRUM RACKS{" "}
              <em className="text-[var(--accent)] not-italic">•</em> VOCAL CHOPS{" "}
              <em className="text-[var(--accent)] not-italic">•</em> MIDI PACKS{" "}
              <em className="text-[var(--accent)] not-italic">•</em> SAMPLE BUNDLES{" "}
              <em className="text-[var(--accent)] not-italic">•</em> PLUGINS COMING SOON
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-20 md:py-24">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="mb-12">
            <span className="font-mono-brand text-xs tracking-[3px] text-[var(--accent)] uppercase block mb-2.5">
              // collections
            </span>
            <h2 className="font-mono-brand text-3xl font-bold uppercase tracking-[-1px]">
              Browse the lab
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
            <Link href="/kits" className="group bg-[var(--bg)] hover:bg-[var(--bg-card)] p-9 relative transition-colors">
              <span className="font-mono-brand text-xs text-[var(--text-faint)]">01</span>
              <span className="absolute top-8 right-7 text-[var(--text-faint)] text-lg group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                ↗
              </span>
              <h3 className="font-mono-brand text-2xl mt-4.5 uppercase tracking-[-0.5px]">Drum kits</h3>
              <p className="text-[var(--text-dim)] text-sm mt-2.5">
                808s, hats, snares &amp; full trap drum racks.
              </p>
            </Link>
            <Link href="/kits" className="group bg-[var(--bg)] hover:bg-[var(--bg-card)] p-9 relative transition-colors">
              <span className="font-mono-brand text-xs text-[var(--text-faint)]">02</span>
              <span className="absolute top-8 right-7 text-[var(--text-faint)] text-lg group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                ↗
              </span>
              <h3 className="font-mono-brand text-2xl mt-4.5 uppercase tracking-[-0.5px]">Sample packs</h3>
              <p className="text-[var(--text-dim)] text-sm mt-2.5">
                Melodic loops, vocal chops &amp; r&amp;b textures.
              </p>
            </Link>
            <Link href="/bundles" className="group bg-[var(--bg)] hover:bg-[var(--bg-card)] p-9 relative transition-colors">
              <span className="font-mono-brand text-xs text-[var(--text-faint)]">03</span>
              <span className="absolute top-8 right-7 text-[var(--text-faint)] text-lg group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                ↗
              </span>
              <h3 className="font-mono-brand text-2xl mt-4.5 uppercase tracking-[-0.5px]">Bundles</h3>
              <p className="text-[var(--text-dim)] text-sm mt-2.5">
                Everything bundled together at a discount.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="pb-20 md:pb-24">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="font-mono-brand text-xs tracking-[3px] text-[var(--accent)] uppercase block mb-2.5">
                // most popular
              </span>
              <h2 className="font-mono-brand text-3xl font-bold uppercase tracking-[-1px]">
                Bestsellers
              </h2>
            </div>
            <Link
              href="/kits"
              className="font-mono-brand text-xs text-[var(--text-dim)] uppercase tracking-wide border-b border-[var(--line)] pb-0.5 hover:text-[var(--accent)] hover:border-[var(--accent-dim)] transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLE BANNER */}
      {mainBundle && (
        <section className="pb-20 md:pb-24">
          <div className="max-w-[1180px] mx-auto px-7">
            <div className="border border-[var(--accent-dim)] rounded-2xl bg-[var(--bg-card)] p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative overflow-hidden">
              <div className="relative z-10">
                <span className="font-mono-brand text-[11px] text-[var(--accent)] tracking-[2px] uppercase mb-3.5 block">
                  // bundle deal
                </span>
                <h3 className="font-mono-brand text-[28px] md:text-[34px] uppercase tracking-[-1px]">
                  {mainBundle.name}
                </h3>
                <p className="text-[var(--text-dim)] mt-3.5 max-w-[420px] text-sm leading-relaxed">
                  {mainBundle.description}
                </p>
                <div className="flex gap-8 mt-6 font-mono-brand">
                  <span className="text-sm text-[var(--text-dim)]">
                    Regular {formatPrice(mainBundle.regularPrice)}
                  </span>
                  <span className="text-sm text-[var(--accent)] font-bold">
                    Save {formatPrice(mainBundle.regularPrice - mainBundle.bundlePrice)}
                  </span>
                </div>
              </div>
              <div className="text-left md:text-right relative z-10 shrink-0">
                <div className="font-mono-brand">
                  <span className="text-[var(--text-faint)] line-through text-base">
                    {formatPrice(mainBundle.regularPrice)}
                  </span>
                  <span className="text-[var(--accent)] text-[42px] font-extrabold block mt-1">
                    {formatPrice(mainBundle.bundlePrice)}
                  </span>
                </div>
                <PayhipButton
                  payhipKey={mainBundle.payhipKey}
                  className="inline-block mt-4.5 font-mono-brand text-[13px] tracking-wide uppercase px-7 py-3.5 rounded-md bg-[var(--accent)] text-[#04140b] font-bold hover:shadow-[0_0_24px_var(--accent-glow)] transition-all cursor-pointer"
                >
                  Get the bundle →
                </PayhipButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT / TERMINAL */}
      <section className="pb-20 md:pb-24">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="mb-12">
            <span className="font-mono-brand text-xs tracking-[3px] text-[var(--accent)] uppercase block mb-2.5">
              // about
            </span>
            <h2 className="font-mono-brand text-3xl font-bold uppercase tracking-[-1px]">
              Behind the lab
            </h2>
          </div>
          <div className="bg-black border border-[var(--line)] rounded-[10px] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)] bg-[var(--bg-soft)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2.5 font-mono-brand text-xs text-[var(--text-faint)]">
                aetrislab — about.sh
              </span>
            </div>
            <div className="p-6 font-mono-brand text-[13px] leading-loose text-[var(--text-dim)]">
              <div>
                <span className="text-[var(--accent)]">$</span> whoami
              </div>
              <div className="text-[var(--text)]">
                aetris / lab — sound design studio for producers
              </div>
              <div className="mt-2">
                <span className="text-[var(--accent)]">$</span> cat mission.txt
              </div>
              <div className="text-[var(--text)]">
                No filler. Every loop and 808 is crafted, tested, and mixed to sit
                <br />
                right in your tracks from the first listen.
              </div>
              <div className="mt-2">
                <span className="text-[var(--accent)]">$</span> ls genres/
              </div>
              <div className="text-[var(--text)]">trap/&nbsp;&nbsp;r&amp;b/&nbsp;&nbsp;drill/&nbsp;&nbsp;experimental/</div>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[var(--accent)]">$</span>
                <span className="w-2 h-3.5 bg-[var(--accent)] inline-block blink" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
