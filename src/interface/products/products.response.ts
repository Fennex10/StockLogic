import type { Products } from '@/interface/products/products.interface';

export interface ProductsResponse {
  count: number;
  pages: number;
  products: Products[];
}