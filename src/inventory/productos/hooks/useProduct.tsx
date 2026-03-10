import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductByIdAction } from "../action/get-product-by.action"
import { createUpdateProductAction } from "../action/create-update-product.action";
import type { Product } from "@/interface/product.interface";


export const useProduct = (id: string) => {
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', {id}],
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

  //To delete
  // const handleSubmitForm = async (productLike: Partial<Product>) => {
  //   console.log({productLike})
  // } 

  return {
    ...query,
    mutation
    
  }

  
}
