import { stockLogicApi } from "@/api/stockLogicApi";
import type { ProvidersResponse } from "@/interface/providers/providers.response";

export const getProvidersAction = async (): Promise<ProvidersResponse> => {
    
    const {data} = await stockLogicApi.get<ProvidersResponse>(`/providers`);  
    
    return data;
}

