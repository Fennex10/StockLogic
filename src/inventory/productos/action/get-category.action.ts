import { stockLogicApi } from "@/api/stockLogicApi";
import type { Categories } from "@/interface/products/categories.interface";

export const getCategorytByAction = async (): Promise<Categories[]> => {
    
    const {data} = await stockLogicApi.get<Categories[]>(`/categories`);

    return {
      ...data,
    }
}

