"use client";

import { useState } from "react";
import { useCart, CartItem } from "@/lib/cart-context";

export default function AddToCartButton({
  item,
  className,
  children,
}: {
  item: CartItem;
  className?: string;
  children: React.ReactNode;
}) {
  const { items, addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i) => i.id === item.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <button onClick={handleClick} className={className} aria-label={`Add ${item.name} to cart`}>
      {inCart || justAdded ? "✓" : children}
    </button>
  );
}
