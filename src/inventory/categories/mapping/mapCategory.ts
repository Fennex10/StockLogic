import type { Category } from "@/interface/categories/category.interface";
import type { CreateCategory } from "@/interface/categories/create-category";


export const mapToCreateCategory = (c: Category): CreateCategory => ({
  id: c.id || '',
  categoryName: c.name || '',
  categoryDescription: c.description || ''
});
