import { stockLogicApi } from "@/api/stockLogicApi";
import type { CategoryResponse } from "@/interface/categories/category.respnse";
import type { Category } from "@/interface/categories/category.interface";
import type { User } from "@/interface/user.interface";

export const getCategoryByIdAction = async (id: string): Promise<Category> => {
    if (!id || id === 'undefined') throw new Error('Id is required');

    if (id === 'new') {
        return {
            id: 'new',
            name: '',
            description:'',
            isActive: true,
            companyId: {} as User,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }
        
    const {data} = await stockLogicApi.get<CategoryResponse>(`/categories/${id}`);
    return data.data; 
}

