export type Product = {
  id: string;
  merchandiseId: string;

  handle: string;
  title: string;

  category:
    | "Coffee"
    | "Espresso"
    | "Single Origin"
    | "Blend";

  image: string;
  price: string;

  origin: string;
  roast: string;
  notes: string;

  weight: string;
  grind: string;
  intensity: number;

  featured: boolean;

  description?: string;
};