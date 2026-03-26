import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCategoryByIdAction } from "../actions/get-category-by.action";
import { createUpdateCategoryAction } from "../actions/create-update-category.action";
import type { Category } from "@/interface/categories/category.interface";

export const useCategory = (id: string) => {
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: createUpdateCategoryAction,
    onSuccess: (category: Category) => {
      //Invalidate cache
      queryClient.invalidateQueries({queryKey: ['categories']});
      queryClient.invalidateQueries({
        queryKey: ['category', {id: category.id}]
      });
      //Update queryData
      queryClient.setQueryData(['categories', {id: category.id}], category);
    }
  })

  return {
    ...query,
    mutation
  }
}