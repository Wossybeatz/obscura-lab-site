import Link from "next/link";
import { Bundle } from "@/lib/types";
import { formatPrice } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";

export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const savings = bundle.regularPrice - bundle.bundlePrice;

  return (
    <div className="group bg-[var(--bg-card)] border border-[var(--line)] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[var(--accent-dim)]">
      <Link href={`/bundles/${bundle.slug}`} className="block">
        <div
          className="aspect-[2/1] relative flex items-center justify-center border-b border-[var(--line)] checkerboard-art"
          style={{ background: `linear-gradient(135deg, ${bundle.coverColor}, #161f1a)` }}
        >
          {bundle.badge && (
            <span className="absolute top-3 left-3 bg-[var(--accent)] text-[#04140b] font-mono-brand text-[10px] font-bold px-2.5 py-1 rounded z-10 tracking-wide">
              {bundle.badge}
            </span>
          )}
          <span className="font-mono-brand text-[var(--text-faint)] text-xs uppercase tracking-widest">
            {bundle.includesProductIds.length} items included
          </span>
        </div>
        <div className="px-6 pt-6">
          <h4 className="font-mono-brand text-xl uppercase tracking-[-0.5px]">{bundle.name}</h4>
          <p className="text-[var(--text-dim)] text-sm mt-2.5 leading-relaxed line-clamp-2">
            {bundle.description}
          </p>
        </div>
      </Link>
      <div className="p-6 pt-5 flex justify-between items-center">
        <div className="font-mono-brand">
          <span className="text-[var(--text-faint)] line-through text-sm mr-2">
            {formatPrice(bundle.regularPrice)}
          </span>
          <span className="text-[var(--accent)] font-bold text-xl">
            {formatPrice(bundle.bundlePrice)}
          </span>
          <span className="block text-[var(--accent)] text-xs mt-0.5">
            Save {formatPrice(savings)}
          </span>
        </div>
        <AddToCartButton
          item={{
            id: bundle.id,
            kind: "bundle",
            slug: bundle.slug,
            name: bundle.name,
            price: bundle.bundlePrice,
            payhipKey: bundle.payhipKey,
            coverColor: bundle.coverColor,
            coverImage: bundle.coverImage,
          }}
          className="font-mono-brand text-xs tracking-wide uppercase px-5 py-2.5 rounded-md border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all cursor-pointer inline-block"
        >
          Add to cart
        </AddToCartButton>
      </div>
    </div>
  );
}
