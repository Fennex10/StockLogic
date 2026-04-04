import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getSalesByIdAction } from "../actions/get-sales-by.action";
import { createSalesAction } from "../actions/create-sales.action";
import type { Sale } from "@/interface/sales/sale.interface";

export const useSale = (id: string) => {
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['sale', id],
    queryFn: () => getSalesByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: createSalesAction,
    onSuccess: (sale: Sale) => {
      //Invalidate cache
      queryClient.invalidateQueries({queryKey: ['sales']});
      queryClient.invalidateQueries({
        queryKey: ['sale', {id: sale.id}]
      });
      //Update queryData
      queryClient.setQueryData(['sales', {id: sale.id}], sale);
    }
  })

  return {
    ...query,
    mutation
  }
}