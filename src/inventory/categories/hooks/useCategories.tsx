import { useQuery } from "@tanstack/react-query";
import { getCategorytByAction } from "../actions/get-category.action";

export const useCategories = () => {

  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategorytByAction(),
    staleTime: 1000 * 60 * 5,
  });

};
