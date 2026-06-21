import { notFound } from "next/navigation";
import { getAllBundles, getBundleBySlug, getAllProducts, formatPrice } from "@/lib/products";
import PayhipButton from "@/components/PayhipButton";

export function generateStaticParams() {
  return getAllBundles().map((b) => ({ slug: b.slug }));
}

export default async function BundlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);

  if (!bundle) {
    notFound();
  }

  const allProducts = getAllProducts();
  const includedProducts = allProducts.filter((p) =>
    bundle.includesProductIds.includes(p.id)
  );
  const savings = bundle.regularPrice - bundle.bundlePrice;

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[800px] mx-auto px-7">
        <div
          className="aspect-[2/1] rounded-2xl border border-[var(--line)] checkerboard-art flex items-center justify-center relative mb-10"
          style={{ background: `linear-gradient(135deg, ${bundle.coverColor}, #161f1a)` }}
        >
          {bundle.badge && (
            <span className="absolute top-4 left-4 bg-[var(--accent)] text-[#04140b] font-mono-brand text-xs font-bold px-3 py-1.5 rounded">
              {bundle.badge}
            </span>
          )}
        </div>

        <span className="font-mono-brand text-xs text-[var(--text-faint)] uppercase tracking-[2px]">
          bundle
        </span>
        <h1 className="font-mono-brand text-4xl font-bold uppercase tracking-[-1px] mt-3">
          {bundle.name}
        </h1>
        <p className="text-[var(--text-dim)] mt-5 leading-relaxed max-w-[560px]">
          {bundle.description}
        </p>

        <div className="mt-10 border border-[var(--line)] rounded-lg overflow-hidden">
          {includedProducts.map((product, i) => (
            <div
              key={product.id}
              className={`flex items-center justify-between p-4 ${
                i !== includedProducts.length - 1 ? "border-b border-[var(--line)]" : ""
              }`}
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-[var(--text-faint)] font-mono-brand text-xs uppercase mt-0.5">
                  {product.type}
                </p>
              </div>
              <span className="font-mono-brand text-[var(--text-dim)] text-sm">
                {formatPrice(product.price)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-[var(--line)]">
          <div className="flex items-center justify-between">
            <div className="font-mono-brand">
              <span className="text-[var(--text-faint)] line-through text-xl mr-2">
                {formatPrice(bundle.regularPrice)}
              </span>
              <span className="text-3xl font-bold text-[var(--accent)]">
                {formatPrice(bundle.bundlePrice)}
              </span>
            </div>
            <span className="font-mono-brand text-[var(--accent)] text-sm font-bold">
              Save {formatPrice(savings)}
            </span>
          </div>
          <PayhipButton
            payhipKey={bundle.payhipKey}
            className="block w-full text-center mt-6 font-mono-brand text-[13px] tracking-wide uppercase px-7 py-4 rounded-md bg-[var(--accent)] text-[#04140b] font-bold hover:shadow-[0_0_24px_var(--accent-glow)] transition-all cursor-pointer"
          >
            Buy bundle now
          </PayhipButton>
        </div>
      </div>
    </section>
  );
}
