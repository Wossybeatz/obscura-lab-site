import productsData from "@/data/products.json";
import bundlesData from "@/data/bundles.json";
import { Product, Bundle } from "./types";

export function getAllProducts(): Product[] {
  return productsData as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function getAllBundles(): Bundle[] {
  return bundlesData as Bundle[];
}

export function getBundleBySlug(slug: string): Bundle | undefined {
  return getAllBundles().find((b) => b.slug === slug);
}

export function getEffectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

export function formatPrice(amount: number): string {
  return `$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)}`;
}
