import { stockLogicApi } from "@/api/stockLogicApi";
import type { Product } from "@/interface/products/product.interface";

export const DeleteProductsByAction = async (id: string): Promise<Product> => {
    
    const {data} = await stockLogicApi.patch<Product>(`/products/${id}`);      
    return data;
}

