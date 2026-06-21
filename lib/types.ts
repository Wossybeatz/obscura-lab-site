export type Product = {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: "kits" | "plugins";
  description: string;
  price: number;
  salePrice: number | null;
  badge: string | null;
  coverColor: string;
  coverImage: string | null;
  fileCount: number;
  format: string;
  genres: string[];
  previewUrl: string | null;
  payhipKey: string;
  featured: boolean;
};

export type Bundle = {
  id: string;
  slug: string;
  name: string;
  type: "bundle";
  description: string;
  includesProductIds: string[];
  regularPrice: number;
  bundlePrice: number;
  badge: string | null;
  coverColor: string;
  coverImage: string | null;
  payhipKey: string;
};
