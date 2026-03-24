import { stockLogicApi } from "@/api/stockLogicApi";
import type { Category } from "@/interface/categories/category.interface";
import type { CreateCategory } from "@/interface/categories/create-category";
import { sleep } from "@/lib/sleep";

export const createUpdateCategoryAction = async (
  categoryLike: Partial<CreateCategory> & { files?: File[] }
): Promise<Category> => {

  await sleep(1500);

  const { id, ...rest } = categoryLike;
  const isCreating = !id || id === "new";

  const formData = new FormData();
  
  formData.append('categoryName', rest.categoryName ?? '');
  formData.append('categoryDescription', rest.categoryDescription ?? '');
  
  const { data } = await stockLogicApi<Category>({
    url: isCreating ? "/categories" : `/categories/${id}`, 
    method: isCreating ? "POST" : "PUT",
    data: formData,
  });

  return data;
};

