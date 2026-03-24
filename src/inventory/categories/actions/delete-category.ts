import { stockLogicApi } from "@/api/stockLogicApi";
import type { Category } from "@/interface/categories/category.interface";

export const DeleteProductsByAction = async (id: string): Promise<Category> => {
    
    const {data} = await stockLogicApi.delete<Category>(`/categories/${id}`);      
    return data;
}

