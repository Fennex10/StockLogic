import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductByIdAction } from "../action/get-product-by.action"
import { createUpdateProductAction } from "../action/create-update-product.action";
import type { Product } from "@/interface/products/product.interface";

export const useProduct = (id: string) => {
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: Product) => {
      //Invalidate cache
      queryClient.invalidateQueries({queryKey: ['products']});
      queryClient.invalidateQueries({
        queryKey: ['product', {id: product.id}]
      });
      //Update queryData
      queryClient.setQueryData(['products', {id: product.id}], product);
    }
  })

  return {
    ...query,
    mutation
  }
}

// export const useProduct = (id: string) => {

//   const queryClient = useQueryClient();

//   const query = useQuery({
//     queryKey: ['product', id], // ✅ SIEMPRE así
//     queryFn: () => getProductByIdAction(id),
//     retry: false,
//     staleTime: 1000 * 60 * 5
//   });

//   const mutation = useMutation({
//     mutationFn: createUpdateProductAction,

//     onSuccess: (product: Product) => {

//       // 🔁 Refrescar lista
//       queryClient.invalidateQueries({ queryKey: ['products'] });

//       // 🔁 Refrescar producto individual (MISMA KEY)
//       queryClient.invalidateQueries({
//         queryKey: ['product', product.id]
//       });

//       // 🧠 Actualizar cache directamente
//       queryClient.setQueryData(['product', product.id], product);
//     }
//   });

//   return {
//     ...query,
//     mutation
//   };
// };

// En useProduct.ts
// export const useProduct = (id: string) => {
//   const queryClient = useQueryClient();

//   const query = useQuery({
//     // Usa el ID directamente, es más seguro y fácil de invalidar
//     queryKey: ['product', id], 
//     queryFn: () => getProductByIdAction(id),
//     retry: false,
//     staleTime: 1000 * 60 * 5
//   });

//   const mutation = useMutation({
//     mutationFn: createUpdateProductAction,
//     onSuccess: (product: Product) => {
//       // Invalida la lista general
//       queryClient.invalidateQueries({ queryKey: ['products'] });
      
//       // Invalida el producto específico usando la misma llave simple
//       queryClient.invalidateQueries({ queryKey: ['product', product.id] });

//       // Actualiza los datos manualmente para que el cambio sea instantáneo
//       queryClient.setQueryData(['product', product.id], product);
//     }
//   });

//   return { ...query, mutation };
// }
