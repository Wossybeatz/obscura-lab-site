import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/products";

export default function KitsPage() {
  const products = getProductsByCategory("kits");

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="mb-12">
          <span className="font-mono-brand text-xs tracking-[3px] text-[var(--accent)] uppercase block mb-2.5">
            // collection
          </span>
          <h1 className="font-mono-brand text-3xl md:text-4xl font-bold uppercase tracking-[-1px]">
            Kits &amp; sample packs
          </h1>
          <p className="text-[var(--text-dim)] mt-3.5 max-w-[520px]">
            Drum kits, sample packs and creative kits for trap, drill and r&amp;b producers.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
