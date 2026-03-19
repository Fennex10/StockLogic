import { useQuery } from "@tanstack/react-query"
import { getProvidersAction } from "../action/get-providers.action";

export const useProviders = () => {

     return useQuery({
       queryKey: ['providers'],
       queryFn: () => getProvidersAction(),
       staleTime: 1000 * 60 * 5,
     });
}
