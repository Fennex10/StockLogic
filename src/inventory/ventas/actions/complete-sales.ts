import { stockLogicApi } from "@/api/stockLogicApi";
import type { Sale } from "@/interface/sales/sale.interface";

export const completeSalesByAction = async (id: string): Promise<Sale> => {
    
    const {data} = await stockLogicApi.patch<Sale>(`/sales/${id}`);      
    return data;
}

