import { stockLogicApi } from "@/api/stockLogicApi";
import type { SalesResponse } from "@/interface/sales/sales.response";

export const getSalesAction = async (): Promise<SalesResponse> => {
    
    const {data} = await stockLogicApi.get<SalesResponse>(`/sales`);  
    return data;
}

