import type { Product } from '@/interface/products/product.interface';

export interface ProductsResponse {
    data: Product[];   // <--- Aquí es donde vive el .map()
    message: string;
}