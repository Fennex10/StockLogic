import type { Category } from "../products/category.interface";

export interface CategoriesResponse {
    data: Category[];
    message: string;
}