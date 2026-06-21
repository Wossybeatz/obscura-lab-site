"use client";

import { Product } from "@/lib/types";
import { usePlayer } from "@/lib/player-context";

export default function ProductPlayButton({ product }: { product: Product }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === product.id && isPlaying;

  function handleClick() {
    playTrack({
      id: product.id,
      name: product.name,
      subtitle: `${product.type} · ${product.genres.join(", ")}`,
      coverImage: product.coverImage,
      coverColor: product.coverColor,
      // Falls back to a generic demo loop for products without a real
      // preview clip yet (previewUrl is null in data/products.json).
      audioUrl: product.previewUrl ?? "/audio/demo-preview.mp3",
    });
  }

  return (
    <button
      onClick={handleClick}
      aria-label={`Play preview of ${product.name}`}
      className="w-20 h-20 rounded-full bg-black/50 border border-[var(--accent)] text-[var(--accent)] flex items-center justify-center text-3xl relative z-10 hover:bg-[var(--accent)] hover:text-[#04140b] transition-all cursor-pointer"
    >
      {isActive ? "❚❚" : "▶"}
    </button>
  );
}
