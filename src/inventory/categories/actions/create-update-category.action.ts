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

  // if (rest.files && rest.files.length > 0) {
  //   formData.append('productImage', rest.files[0]);
  // }

  formData.append('categoryName', rest.categoryName ?? '');
  formData.append('productDescription', rest.categoryDescription ?? '');
  
  const { data } = await stockLogicApi<Category>({
    url: isCreating ? "/categories" : `/categories/${id}`, 
    method: isCreating ? "POST" : "PUT",
    data: formData,
  });

  return data;
};

// export const createUpdateProductAction = async (
//   productLike: Partial<CreateProduct> & { files?: File[] }
// ): Promise<Product> => {

//   await sleep(1500);

//   const { id, ...rest } = productLike;
//   const isCreating = !id || id === "new";

//   const formData = new FormData();

//   // 1. Aseguramos el ID para actualizaciones
//   if (!isCreating) {
//     formData.append('id', String(id));
//   }

//   // 2. Archivo
//   if (rest.files && rest.files.length > 0) {
//     formData.append('productImage', rest.files[0]);
//   }

//   // 3. Mapeo exacto (Verifica que estos nombres sean los que espera tu API)
//   formData.append('productName', rest.productName ?? '');
//   formData.append('productDescription', rest.productDescription ?? '');
//   formData.append('productPrice', String(rest.productPrice || 0));
//   formData.append('productCostPrice', String(rest.productCostPrice || 0));
//   formData.append('productCurrentStock', String(rest.productCurrentStock || 0));
//   formData.append('productMinStock', String(rest.productMinStock || 0));
//   formData.append('productMaxStock', String(rest.productMaxStock || 0));
//   formData.append('productCategoryId', rest.productCategoryId ?? '');
//   formData.append('productProviderId', rest.productProviderId ?? '');

//   const { data } = await stockLogicApi<Product>({
//     url: isCreating ? "/products" : `/products/${id}`,
//     method: isCreating ? "POST" : "PUT",
//     data: formData,
//     // Eliminamos el Content-Type manual para que el navegador gestione el boundary
//   });

//   return data; 
// };
