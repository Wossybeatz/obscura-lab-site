"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { getEffectivePrice, formatPrice } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import { usePlayer } from "@/lib/player-context";

export default function ProductCard({ product }: { product: Product }) {
  const price = getEffectivePrice(product);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const isActive = currentTrack?.id === product.id && isPlaying;

  function handlePlayClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    playTrack({
      id: product.id,
      name: product.name,
      subtitle: `${product.type} · ${product.genres.join(", ")}`,
      coverImage: product.coverImage,
      coverColor: product.coverColor,
      // NOTE: this is a placeholder demo loop, not a real preview of this
      // product yet. Swap in a real preview clip via product.previewUrl
      // once you have one, and update this to use it instead.
      audioUrl: "/audio/demo-preview.mp3",
    });
  }

  return (
    <div className="group bg-[var(--bg-card)] border border-[var(--line)] rounded-[10px] overflow-hidden transition-all duration-200 hover:border-[var(--accent-dim)] hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]">
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className="aspect-square relative flex items-center justify-center border-b border-[var(--line)] overflow-hidden"
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
            <span className="absolute top-2.5 left-2.5 bg-[var(--accent)] text-[#04140b] font-mono-brand text-[10px] font-bold px-2 py-1 rounded z-10 tracking-wide">
              {product.badge}
            </span>
          )}
          <button
            onClick={handlePlayClick}
            aria-label={`Play preview of ${product.name}`}
            className="w-[46px] h-[46px] rounded-full bg-black/50 border border-[var(--accent)] text-[var(--accent)] flex items-center justify-center z-10 text-base transition-all hover:bg-[var(--accent)] hover:text-[#04140b] relative cursor-pointer"
          >
            {isActive ? "❚❚" : "▶"}
          </button>
        </div>
        <div className="p-4 pb-0">
          <span className="font-mono-brand text-[10px] text-[var(--text-faint)] uppercase tracking-[1.5px]">
            {product.type}
          </span>
          <h4 className="text-base mt-1.5 font-medium">{product.name}</h4>
        </div>
      </Link>
      <div className="p-4 pt-3.5 flex justify-between items-center">
        <span className="font-mono-brand font-bold text-[var(--accent)] text-[15px]">
          {product.salePrice && (
            <span className="text-[var(--text-faint)] line-through font-normal mr-1.5 text-[13px]">
              {formatPrice(product.price)}
            </span>
          )}
          {formatPrice(price)}
        </span>
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
          className="w-[30px] h-[30px] rounded-md border border-[var(--line)] text-[var(--text-dim)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all cursor-pointer"
        >
          +
        </AddToCartButton>
      </div>
    </div>
  );
}
