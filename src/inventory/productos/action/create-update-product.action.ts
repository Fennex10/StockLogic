import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateProduct } from "@/interface/products/create-product.interface";
import type { Product } from "@/interface/products/product.interface";
import { sleep } from "@/lib/sleep";
// import { sleep } from "@/lib/sleep";

export const createUpdateProductAction = async (
  productLike: Partial<CreateProduct> & { files?: File[] } // Aceptamos los archivos
): Promise<Product> => {

  await sleep(1500);

  const { id, ...rest } = productLike;
  const isCreating = !id || id === "new";

  // 1. IMPORTANTE: Usar FormData para Multer
  const formData = new FormData();

  // 2. Si hay archivos nuevos, tomamos el primero (según tu backend .single())
  if (rest.files && rest.files.length > 0) {
    formData.append('productImage', rest.files[0]);
  }

  // 3. Agregar los demás campos al FormData
  formData.append('productName', rest.productName || '');
  formData.append('productDescription', rest.productDescription || '');
  formData.append('productPrice', String(rest.productPrice || 0));
  formData.append('productCostPrice', String(rest.productCostPrice || 0));
  formData.append('productCurrentStock', String(rest.productCurrentStock || 0));
  formData.append('productMinStock', String(rest.productMinStock || 0));
  formData.append('productMaxStock', String(rest.productMaxStock || 0));
  formData.append('productCategoryId', rest.productCategoryId || '');
  formData.append('productProviderId', rest.productProviderId || '');

  // 4. Petición
  const { data } = await stockLogicApi<Product>({
    url: isCreating ? "/products" : `/products/${id}`,
    method: isCreating ? "POST" : "PUT",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'  
    }
  });

  return data; 
};


