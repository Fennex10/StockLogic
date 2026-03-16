// import { stockLogicApi } from "@/api/stockLogicApi"
// import type { ProductsResponse } from "@/interface/products/products.response"

// interface Options {
//     limit?: number | string;
//     offset?: number | string;
//     minPrice?: number;
//     maxPrice?: number;
//     query?: string;
// }

// export const getProductAction = async(
//     options: Options
// ):Promise<ProductsResponse> => {
//     const {limit, offset, minPrice, maxPrice, query} = options;
    
//     const {data} = await stockLogicApi.get<ProductsResponse>('/products', {
//         params: {
//             limit,
//             offset,
//             minPrice,
//             maxPrice,
//             q: query,
//         }
//     });

//     const productWithImageUrls = data.products.map((product) => ({
//         ...product,
//         images: data.products.map((image) => `${import.meta.env.VITE_API_URL}/product/${image}` ),
//     }));

//     return {
//         ...data,
//         products: productWithImageUrls
//     }
// }

import { stockLogicApi } from "@/api/stockLogicApi";
import type { ProductsResponse } from "@/interface/products/products.response";

export const getProductsAction = async (): Promise<ProductsResponse> => {
    
    // const {data} = await stockLogicApi.get<ProductsResponse>(`/products`);
     
    // return data;
    const { data } = await stockLogicApi.get<ProductsResponse>(`/products`);
    
    const productWithImageUrls = data.data.map((product) => {
        // Limpiamos los backslashes que vimos en tu consola (\\uploads\\...)
        const cleanPath = product.imageURL.replace(/\\/g, '/');
        
        return {
            ...product,
            // Creamos la URL completa. 
            // Si el backend ya incluye "/uploads", no lo repitas aquí.
            imageURL: `${import.meta.env.VITE_API_URL}${cleanPath}`
        };
    });

    return {
        ...data,
        data: productWithImageUrls
    };
}

