import { useQuery } from "@tanstack/react-query"
import { getProductsAction } from "../action/get-products-action";


export const useProducts = () => {
    
     return useQuery({
       queryKey: ['products'],
       queryFn: () => getProductsAction(),
       staleTime: 1000 * 60 * 5,
     });
}
