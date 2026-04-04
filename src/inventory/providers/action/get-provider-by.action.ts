import { stockLogicApi } from "@/api/stockLogicApi";
import type { ProvidersResponse } from "@/interface/providers/provider.response";
import type { Provider } from "@/interface/providers/provider.interface";
import type { User } from "@/interface/user/user.interface";

export const getProviderByIdAction = async (id: string): Promise<Provider> => {
    if (!id || id === 'undefined') throw new Error('Id is required');

    if (id === 'new') {
        return {
            id: 'new',
            name: '',
            taxId: '',
            contactName:  '',
            email:        '',
            phone:        '',
            address:      '',
            website:      '',
            isActive: false,
            companyId: {} as User,
            createdAt: new Date(),
            updatedAt: new Date(),
            productCount: 0,
        }
    }
        
    const {data} = await stockLogicApi.get<ProvidersResponse>(`/products/${id}`);
    return data.data; 
}

