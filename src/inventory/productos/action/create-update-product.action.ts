import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateProduct } from "@/interface/products/create-product.interface";
import type { Product } from "@/interface/products/product.interface";
// import { sleep } from "@/lib/sleep";

export const createUpdateProductAction = async (
  productLike: Partial<CreateProduct> & { files?: File[] } // Aceptamos los archivos
): Promise<Product> => {

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

  // 4. Petición
  const { data } = await stockLogicApi<Product>({
    url: isCreating ? "/products" : `/products/${id}`,
    method: isCreating ? "POST" : "PUT",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data' // Axios lo pone auto, pero no está de más
    }
  });

  return data; // El backend ya devuelve la URL con /api/uploads si lo configuramos antes
};

// export const createUpdateProductAction = async (
//   productLike: Partial<CreateProduct>
// ): Promise<Product> => {

//   await sleep(1500);

//   const { id, ...rest } = productLike;

//   const isCreating = !id || id === "new";

//   const payload = {
//     ...rest,
//     productPrice: Number(rest.productPrice || 0),
//     productCostPrice: Number(rest.productCostPrice || 0),
//     productCurrentStock: Number(rest.productCurrentStock || 0),
//     productMinStock: Number(rest.productMinStock || 0),
//     productMaxStock: Number(rest.productMaxStock || 0),
//   };

//   const { data } = await stockLogicApi<Product>({
//     url: isCreating ? "/products" : `/products/${id}`,
//     method: isCreating ? "POST" : "PUT",
//     data: payload,
//   });

//   const imageURL = `${import.meta.env.VITE_API_URL}${data.imageURL}`;

//   return {
//     ...data,
//     imageURL
//   };
// };

// import { stockLogicApi } from "@/api/stockLogicApi";
// import type{ Products } from "@/interface/products/products.interface"
// import { sleep } from "@/lib/sleep";

// export const createUpdateProductAction = async (
//     productLike: Partial<Products> & {files?: File[]}
//    ): Promise<Products> => {
    
//     await sleep(1500);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const {id, companyId, imageURL = [], files = [], ...rest} = productLike;

//     const isCreating = id === 'new';

//     rest.currentStock = Number(rest.currentStock || 0);
//     rest.price = Number(rest.price || 0);
    
//     //Preparing imageURL
//     if (files.length > 0) {
//         const newImageNames = await uploadFiles(files);
//         imageURL.push(...newImageNames);
//     }

//     const imageURLToSave = imageURL.map((image: string) => {
//         if (image.includes('http')) return image.split('/').pop() || '';
//         return image;
//     })
    
//     const {data} = await stockLogicApi<Products>({
//         url: isCreating ? '/products' : `/products/${id}`,
//         method: isCreating ? 'POST' : 'PATCH',
//         data: {
//             ...rest,
//             imageUrl: imageURLToSave,
//         }
//     })

//     return {
//         ...data,
//         imageURL: data.imageURL.map((image) => {
//             if (image.includes('http')) return image;
//             return `${import.meta.env.VITE_API_URL}/product/${image}`
//         })
//       }
//    }

// export interface FileUploadResponse {
//         secureUrl: string;
//         fileName: string;
// }

// const uploadFiles = async (files: File[]) => {
//     const uploadPromises = files.map(async(file) => {
//         const formData = new FormData();
//         formData.append('file', file);

//         const {data} = await stockLogicApi<FileUploadResponse>({
//             url: '/product',
//             method: 'POST',
//             data: formData,
//         })

//         return data.fileName;
//     });
    
//     const uploadedFileNames = await Promise.all(uploadPromises);
//     return uploadedFileNames; 
// }