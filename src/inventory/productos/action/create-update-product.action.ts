import { stockLogicApi } from "@/api/stockLogicApi";
import type { Products } from "@/interface/products/products.interface";
import { sleep } from "@/lib/sleep";

export const createUpdateProductAction = async (
  productLike: Partial<Products>
): Promise<Products> => {

  await sleep(1500);

  const { id, ...rest } = productLike;

  const isCreating = !id || id === "new";

  const payload = {
    ...rest,
    price: Number(rest.price || 0),
    costPrice: Number(rest.costPrice || 0),
    currentStock: Number(rest.currentStock || 0),
    minStock: Number(rest.minStock || 0),
    maxStock: Number(rest.maxStock || 0),
  };

  const { data } = await stockLogicApi<Products>({
    url: isCreating ? "/products" : `/products/${id}`,
    method: isCreating ? "POST" : "PUT",
    data: payload,
  });

  const imageURL = `${import.meta.env.VITE_API_URL}${data.imageURL}`;

  return {
    ...data,
    imageURL
  };
};

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