import { stockLogicApi } from "@/api/stockLogicApi";
import type { Product } from "@/interface/products/product.interface";
import type { Sale } from "@/interface/sales/sale.interface";
import type { SaleResponse } from "@/interface/sales/sale.response";

export const getSalesByIdAction = async (id: string): Promise<Sale> => {
    if (!id || id === 'undefined') throw new Error('Id is required');

    if (id === 'new') {
        return {
            id: 'new',
            clientName: '',
            code: '',
            quantity:    0,
            totalPrice: 0,
            paymentMethod: '',
            isCompleted: false,
            completedAt: null,
            productId: '',
            registerDate: new Date(),
            companyId: '',
            Product: {} as Product,
            createdAt: new Date(),
            updatedAt: new Date(),  
        }
    }
        
    const {data} = await stockLogicApi.get<SaleResponse>(`/sales/${id}`);
    return data.data.sales; 
}

