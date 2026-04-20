import type { Product } from "../products/product.interface";

export interface Purchase {
    id:                  string;
    quantity:            number;
    createdAt:           Date;
    costPriceAtMovement: number;
    totalCost:           number;
    Product:             Product;
}