export interface Product {
  id: string;
  merchandiseId: string;
  title: string;
  handle: string;
  image: string;
  price: string;

  description?: string;

  origin?: string;

  roast?: string;

  notes?: string;
}