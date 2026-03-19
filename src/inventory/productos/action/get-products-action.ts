import { stockLogicApi } from "@/api/stockLogicApi";
import type { ProductsResponse } from "@/interface/products/products.response";

export const getProductsAction = async (): Promise<ProductsResponse> => {
    
    const {data} = await stockLogicApi.get<ProductsResponse>(`/products`);  
    
    return data;
}

