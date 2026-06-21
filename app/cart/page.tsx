"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

// Payhip supports a real multi-item checkout link: stack the product keys
// as repeated cart_links[] params and it opens ONE combined payment form,
// e.g. https://payhip.com/buy?cart_links[]=KEY1&cart_links[]=KEY2
// (see https://help.payhip.com/article/126-direct-checkout-link). This is
// how a single checkout combining everything in the cart actually works,
// without needing Payhip's own embedded cart widget.
function buildCheckoutAllUrl(payhipKeys: string[]): string {
  const params = payhipKeys.map((key) => `cart_links[]=${encodeURIComponent(key)}`).join("&");
  return `https://payhip.com/buy?${params}`;
}

export default function CartPage() {
  const { items, removeItem, clear, total } = useCart();
  const hasDemoItem = items.some((i) => i.payhipKey === "DEMO_PLACEHOLDER");
  const realKeys = items.map((i) => i.payhipKey).filter((k) => k !== "DEMO_PLACEHOLDER");

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[800px] mx-auto px-7">
        <div className="mb-12">
          <span className="font-mono-brand text-xs tracking-[3px] text-[var(--accent)] uppercase block mb-2.5">
            // your cart
          </span>
          <h1 className="font-mono-brand text-3xl md:text-4xl font-bold uppercase tracking-[-1px]">
            Cart
          </h1>
          <p className="text-[var(--text-dim)] mt-3.5 max-w-[520px] text-sm leading-relaxed">
            Your cart is saved on this device. Hit checkout once everything you want is in here —
            all items go through in a single Payhip payment.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-[var(--line)] rounded-lg">
            <p className="font-mono-brand text-[var(--text-dim)] text-sm mb-5">
              Your cart is empty.
            </p>
            <Link
              href="/kits"
              className="font-mono-brand text-xs tracking-wide uppercase px-6 py-3 rounded-md bg-[var(--accent)] text-[#04140b] font-bold inline-block hover:shadow-[0_0_24px_var(--accent-glow)] transition-all"
            >
              Browse kits →
            </Link>
          </div>
        ) : (
          <>
            <div className="border border-[var(--line)] rounded-lg divide-y divide-[var(--line)]">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div
                    className="w-14 h-14 rounded-md border border-[var(--line)] shrink-0 overflow-hidden flex items-center justify-center"
                    style={
                      item.coverImage
                        ? {}
                        : { background: `linear-gradient(135deg, ${item.coverColor}, #161f1a)` }
                    }
                  >
                    {item.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-brand text-sm font-bold truncate">{item.name}</p>
                    <p className="font-mono-brand text-xs text-[var(--text-faint)] uppercase tracking-wide">
                      {item.kind}
                    </p>
                  </div>
                  <span className="font-mono-brand font-bold text-[var(--accent)] text-sm shrink-0">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="w-8 h-8 rounded-md border border-[var(--line)] text-[var(--text-dim)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors shrink-0 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {hasDemoItem && (
              <p className="font-mono-brand text-xs text-[var(--red)] mt-4">
                One or more items in your cart are demo products without a real Payhip key —
                remove them before checking out.
              </p>
            )}

            <div className="flex justify-between items-center mt-8 font-mono-brand gap-4 flex-wrap">
              <button
                onClick={clear}
                className="text-xs text-[var(--text-dim)] uppercase tracking-wide hover:text-[var(--red)] transition-colors"
              >
                Clear cart
              </button>
              <span className="text-sm text-[var(--text-dim)]">
                Total: <span className="text-[var(--accent)] font-bold text-lg">{formatPrice(total)}</span>
              </span>
            </div>

            <a
              href={realKeys.length > 0 ? buildCheckoutAllUrl(realKeys) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={realKeys.length === 0}
              className={`block w-full text-center mt-5 font-mono-brand text-[13px] tracking-wide uppercase px-7 py-4 rounded-md font-bold transition-all ${
                realKeys.length > 0
                  ? "bg-[var(--accent)] text-[#04140b] hover:shadow-[0_0_24px_var(--accent-glow)] cursor-pointer"
                  : "bg-[var(--bg-card)] text-[var(--text-faint)] cursor-not-allowed pointer-events-none"
              }`}
            >
              Checkout all ({items.length}) →
            </a>
          </>
        )}
      </div>
    </section>
  );
}
