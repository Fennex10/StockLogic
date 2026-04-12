import type { Product } from "../products/product.interface";

export interface Sale {
    id:            string;
    clientName:    string;
    code:          string;
    quantity:      number;
    totalPrice:    number;
    paymentMethod: string;
    registerDate:  Date;
    isCompleted:   boolean;
    completedAt:   null;
    productId:     string;
    companyId:     string;
    createdAt:     Date;
    updatedAt:     Date;
    Product:       Product;
}

