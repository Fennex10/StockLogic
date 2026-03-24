import { stockLogicApi } from "@/api/stockLogicApi";
import type { Category } from "@/interface/categories/category.interface";

export const deleteCategoriesByAction = async (id: string): Promise<Category> => {
    
    const {data} = await stockLogicApi.patch<Category>(`/categories/${id}`);      
    return data;
}

