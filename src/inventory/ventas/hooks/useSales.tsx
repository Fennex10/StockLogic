import { useQuery } from "@tanstack/react-query"
import { getSalesAction } from "../actions/get-sales.action";

export const useSales = () => {

     return useQuery({
       queryKey: ['sales'],
       queryFn: () => getSalesAction(),
       staleTime: 1000 * 60 * 5,
     });
}
