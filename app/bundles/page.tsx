import BundleCard from "@/components/BundleCard";
import { getAllBundles } from "@/lib/products";

export default function BundlesPage() {
  const bundles = getAllBundles();

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="mb-12">
          <span className="font-mono-brand text-xs tracking-[3px] text-[var(--accent)] uppercase block mb-2.5">
            // bundle deals
          </span>
          <h1 className="font-mono-brand text-3xl md:text-4xl font-bold uppercase tracking-[-1px]">
            Bundles
          </h1>
          <p className="text-[var(--text-dim)] mt-3.5 max-w-[520px]">
            Get multiple kits and packs together at a discount. One checkout, instant access to everything.
          </p>
        </div>
        {bundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-[var(--line)] rounded-lg">
            <p className="font-mono-brand text-[var(--text-dim)] text-sm">
              No bundles yet — check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
