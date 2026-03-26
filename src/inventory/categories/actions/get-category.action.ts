import { stockLogicApi } from "@/api/stockLogicApi";
import type { CategoriesResponse } from "@/interface/categories/categories.reponse";

export const getCategorytByAction = async (): Promise<CategoriesResponse> => {
    
    const {data} = await stockLogicApi.get<CategoriesResponse>(`/categories`);
    return data;
}

