import type { Category } from "./category.interface";

export interface CategoriesResponse {
    data: Category[];
    message: string;
}