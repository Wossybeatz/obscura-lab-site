"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { supabaseBrowser } from "./supabase-browser";

export type CartItem = {
  id: string;
  kind: "product" | "bundle";
  slug: string;
  name: string;
  price: number;
  payhipKey: string;
  coverColor: string;
  coverImage: string | null;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "aetrislab_cart";

function mergeItems(a: CartItem[], b: CartItem[]): CartItem[] {
  const merged = [...a];
  for (const item of b) {
    if (!merged.some((i) => i.id === item.id)) merged.push(item);
  }
  return merged;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // Tracks whether the current `items` change came from the
  // remote-merge effect itself, so we don't immediately echo it back to
  // Supabase as a redundant write.
  const skipNextSyncRef = useRef(false);
  const syncedUserIdRef = useRef<string | null>(null);

  // Load from localStorage once on mount — this is the cart for signed-out
  // visitors, and the starting point merged with any signed-in user's
  // remote cart once auth resolves.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // When a user signs in, pull their saved cart from Supabase and merge it
  // with whatever's currently in this browser (union by id), so switching
  // devices never silently drops items either side already had.
  useEffect(() => {
    if (!hydrated || !user || syncedUserIdRef.current === user.id) return;
    syncedUserIdRef.current = user.id;

    supabaseBrowser
      .from("carts")
      .select("items")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const remoteItems = (data?.items as CartItem[] | undefined) ?? [];
        skipNextSyncRef.current = true;
        setItems((local) => mergeItems(local, remoteItems));
      });
  }, [hydrated, user]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      // Still push the merged result up, so both sides end up consistent.
    }
    if (user) {
      supabaseBrowser
        .from("carts")
        .upsert({ user_id: user.id, items, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error("cart sync failed:", error.message);
        });
    }
  }, [items, hydrated, user]);

  function addItem(item: CartItem) {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const count = items.length;
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
