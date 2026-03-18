import type { Product } from '@/interface/products/product.interface';

export interface ProductsResponse {
    data: Product[];   
    message: string;
}