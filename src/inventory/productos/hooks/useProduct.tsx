import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductByIdAction } from "../action/get-product-by.action"
import { createUpdateProductAction } from "../action/create-update-product.action";
import type { Product } from "@/interface/products/product.interface";

export const useProduct = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdAction(id),
    enabled: !!id && id !== 'new',
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });

  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: async (product: Product) => {
      // Limpia CUALQUIER query que empiece por 'products' (la lista)
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      // Limpia CUALQUIER query que empiece por 'product' (el detalle)
      await queryClient.invalidateQueries({ queryKey: ['product'] });
      // Actualizamos manualmente el caché del ID específico
      queryClient.setQueryData(['product', product.id], product);
      // Forzamos un refetch inmediato de la lista para estar 100% seguros
      queryClient.refetchQueries({ queryKey: ['products'] });
    }
  });

  return {
    ...query,
    mutation
  }
}

// export const useProduct = (id: string) => {
//   const queryClient = useQueryClient();

//   const query = useQuery({
//     queryKey: ['product', id], // Aquí usas ['product', id]
//     queryFn: () => getProductByIdAction(id),
//     enabled: !!id && id !== 'new', // Seguridad extra
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });

//   const mutation = useMutation({
//     mutationFn: createUpdateProductAction,
//     onSuccess: (product: Product) => {
//       queryClient.invalidateQueries({ queryKey: ['products'] });
//       queryClient.invalidateQueries({ queryKey: ['product', product.id] });
//       queryClient.setQueryData(['product', product.id], product);
      
//       queryClient.invalidateQueries({ queryKey: ['sales'] });
//     }
//   });

//   return {
//     ...query,
//     mutation
//   };
// };
// export const useProduct = (id: string) => {
  
//   const queryClient = useQueryClient();

//   const query = useQuery({
//     queryKey: ['product', id],
//     queryFn: () => getProductByIdAction(id),
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });

//   const mutation = useMutation({
//     mutationFn: createUpdateProductAction,
//     onSuccess: (product: Product) => {
//       //Invalidate cache
//       queryClient.invalidateQueries({queryKey: ['products']});
//       queryClient.invalidateQueries({
//         queryKey: ['product', {id: product.id}]
//       });
//       //Update queryData
//       queryClient.setQueryData(['products', {id: product.id}], product);
//     }
//   })

//   return {
//     ...query,
//     mutation
//   }
// }

