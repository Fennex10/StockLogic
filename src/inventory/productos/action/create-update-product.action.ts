import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateProduct } from "@/interface/products/create-product.interface";
import type { Product } from "@/interface/products/product.interface";
import { sleep } from "@/lib/sleep";

export const createUpdateProductAction = async (
  productLike: Partial<CreateProduct> & { file?: File | null }
  // { files?: File[] }
): Promise<Product> => {

  await sleep(1500);

  const { id, file, ...rest } = productLike;
  const isCreating = !id || id === "new";

  const formData = new FormData();

 if (file) {
  formData.append('productImage', file);
}

if (isCreating) {
  formData.append('productName', rest.productName ?? '');
  formData.append('productDescription', rest.productDescription ?? '');
  formData.append('productPrice', String(rest.productPrice || 0));
  formData.append('productCostPrice', String(rest.productCostPrice || 0));
  formData.append('productCurrentStock', String(rest.productCurrentStock || 0));
  formData.append('productMinStock', String(rest.productMinStock || 0));
  formData.append('productMaxStock', String(rest.productMaxStock || 0));
  formData.append('productCategoryId', rest.productCategoryId ?? '');
  formData.append('productProviderId', rest.productProviderId ?? '');
}

else {
  if (rest.productName !== undefined)
    formData.append('productName', rest.productName);

  if (rest.productDescription !== undefined)
    formData.append('productDescription', rest.productDescription);

  if (rest.productPrice !== undefined)
    formData.append('productPrice', String(rest.productPrice));

  if (rest.productCostPrice !== undefined)
    formData.append('productCostPrice', String(rest.productCostPrice));

  if (rest.productMinStock !== undefined)
    formData.append('productMinStock', String(rest.productMinStock));

  if (rest.productMaxStock !== undefined)
    formData.append('productMaxStock', String(rest.productMaxStock));

  if (rest.productCategoryId)
    formData.append('productCategoryId', rest.productCategoryId);

  if (rest.productProviderId)
    formData.append('productProviderId', rest.productProviderId);
}
  try {
  const { data } = await stockLogicApi<Product>({
    url: isCreating ? "/products" : `/products/${id}`, 
    method: isCreating ? "POST" : "PUT",
    data: formData,
   
  });

  return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
  console.log(error.response?.data); // 🔥 AQUÍ ESTÁ LA VERDAD
  throw error;
}
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
