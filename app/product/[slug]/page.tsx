import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getEffectivePrice, formatPrice } from "@/lib/products";
import PayhipButton from "@/components/PayhipButton";
import AddToCartButton from "@/components/AddToCartButton";
import ProductPlayButton from "./ProductPlayButton";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const price = getEffectivePrice(product);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1000px] mx-auto px-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div
            className="aspect-square rounded-2xl border border-[var(--line)] flex items-center justify-center relative overflow-hidden"
            style={
              product.coverImage
                ? {}
                : { background: `linear-gradient(135deg, ${product.coverColor}, #161f1a)` }
            }
          >
            {product.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.coverImage}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 checkerboard-art" />
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[var(--accent)] text-[#04140b] font-mono-brand text-xs font-bold px-3 py-1.5 rounded z-10">
                {product.badge}
              </span>
            )}
            <ProductPlayButton product={product} />
          </div>

          <div>
            <span className="font-mono-brand text-xs text-[var(--text-faint)] uppercase tracking-[2px]">
              {product.type}
            </span>
            <h1 className="font-mono-brand text-4xl font-bold uppercase tracking-[-1px] mt-3">
              {product.name}
            </h1>
            <p className="text-[var(--text-dim)] mt-5 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8 font-mono-brand text-sm">
              <div>
                <span className="text-[var(--text-faint)] block text-xs uppercase tracking-wide mb-1">
                  Format
                </span>
                {product.format}
              </div>
              <div>
                <span className="text-[var(--text-faint)] block text-xs uppercase tracking-wide mb-1">
                  Files
                </span>
                {product.fileCount} files
              </div>
              <div className="col-span-2">
                <span className="text-[var(--text-faint)] block text-xs uppercase tracking-wide mb-1">
                  Genres
                </span>
                {product.genres.join(", ")}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--line)]">
              <div className="flex items-center justify-between">
                <span className="font-mono-brand text-3xl font-bold text-[var(--accent)]">
                  {product.salePrice && (
                    <span className="text-[var(--text-faint)] line-through font-normal mr-2 text-xl">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  {formatPrice(price)}
                </span>
              </div>
              <div className="flex gap-3 mt-6">
                <PayhipButton
                  payhipKey={product.payhipKey}
                  className="flex-1 text-center font-mono-brand text-[13px] tracking-wide uppercase px-7 py-4 rounded-md bg-[var(--accent)] text-[#04140b] font-bold hover:shadow-[0_0_24px_var(--accent-glow)] transition-all cursor-pointer"
                >
                  Buy now
                </PayhipButton>
                <AddToCartButton
                  item={{
                    id: product.id,
                    kind: "product",
                    slug: product.slug,
                    name: product.name,
                    price,
                    payhipKey: product.payhipKey,
                    coverColor: product.coverColor,
                    coverImage: product.coverImage,
                  }}
                  className="font-mono-brand text-[13px] tracking-wide uppercase px-6 py-4 rounded-md border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
                >
                  Add to cart
                </AddToCartButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
