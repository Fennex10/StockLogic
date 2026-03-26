import { stockLogicApi } from "@/api/stockLogicApi";
import type { Provider } from "@/interface/providers/provider.interface";

export const deleteProvidersByAction = async (id: string): Promise<Provider> => {
    
    const {data} = await stockLogicApi.patch<Provider>(`/providers/${id}`);      
    return data;
}

