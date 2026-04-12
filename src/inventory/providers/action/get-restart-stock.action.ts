import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";

export const getRestartStockByIdAction = async (productId: string): Promise<CreateRestartStock> => {
    if (!productId || productId === 'undefined') throw new Error('Id is required');

    if (productId === 'new') {
        return {
            productId: 'new',
            productRestockQuantity: 0, 
            reference: '', 
        }
    }
        
    const {data} = await stockLogicApi.get<CreateRestartStock>(`/providers/${productId}`);
    return data; 
}

