import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProviderByIdAction } from "../action/get-provider-by.action";
import { createUpdateProviderAction } from "../action/create-update-category.action";
import type { Provider } from "@/interface/providers/provider.interface";


export const useProvider = (id: string) => {
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['provider', id],
    queryFn: () => getProviderByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: createUpdateProviderAction,
    onSuccess: (provider: Provider) => {
      //Invalidate cache
      queryClient.invalidateQueries({queryKey: ['providers']});
      queryClient.invalidateQueries({
        queryKey: ['provider', {id: provider.id}]
      });
      //Update queryData
      queryClient.setQueryData(['providers', {id: provider.id}], provider);
    }
  })

  return {
    ...query,
    mutation
  }
}