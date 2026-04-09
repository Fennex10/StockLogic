import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";
import { createRestartStockAction } from "../action/create-restart-stock";
import { getRestartStockByIdAction } from "../action/get-restart-stock.action";

export const useRestartStock = (id: string) => {
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['restartStock', id],
    queryFn: () => getRestartStockByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: createRestartStockAction,
    onSuccess: (restartStock: CreateRestartStock) => {
      //Invalidate cache
      queryClient.invalidateQueries({queryKey: ['restartStocks']});
      queryClient.invalidateQueries({
        queryKey: ['provider', {id: restartStock.productId}]
      });
      //Update queryData
      queryClient.setQueryData(['restartStocks', {id: restartStock.productId}], restartStock);
    }
  })

  return {
    ...query,
    mutation
  }
}

