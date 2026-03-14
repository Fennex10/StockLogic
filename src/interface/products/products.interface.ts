import type { User } from "../user.interface";

export interface Products {
    id:           string;
    name:         string;
    sku:          string;
    description:  string;
    imageURL:     string;
    price:        number;
    costPrice:    number;
    currentStock: number;
    minStock:     number;
    maxStock:     number;
    categoryId:   string;
    companyId:    User;
    createdAt:    Date;
    updatedAt:    Date;
}
