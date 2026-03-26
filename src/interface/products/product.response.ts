import type { Product } from "./product.interface";

export interface ProductResponse {
  message: string;
  data: Product;
}
