import { stockLogicApi } from "@/api/stockLogicApi";
import type { Products } from "@/interface/products/products.interface";
import type { User } from "@/interface/user.interface";


export const getProductByIdAction = async (id: string): Promise<Products> => {
    if (!id) throw new Error('Id is required');

    if (id === 'new') {
        return {
            id: 'new',
            name: '',
            description:'',
            imageURL: '',
            price: 0,
            sku: '',
            costPrice: 0,
            currentStock: 0,
            minStock: 0,
            maxStock: 0,
            categoryId: '',
            companyId: {} as User,
            createdAt: new Date(),
            updatedAt: new Date(),
 
        }
    }

    const {data} = await stockLogicApi.get<Products>(`/products/${id}`);

    return {
      ...data,
    }
}

