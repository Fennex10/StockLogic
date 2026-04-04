import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserManagerByIdAction } from "../actions/get-users-by.action";
import { createUpdateUsersManagerAction } from "../actions/create-update-user-manager.action";
import type { UserManager } from "@/interface/userManager/userManager.interface";


export const useUserManager = (id: string) => {
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserManagerByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: createUpdateUsersManagerAction,
    onSuccess: (user: UserManager) => {
      //Invalidate cache
      queryClient.invalidateQueries({queryKey: ['users']});
      queryClient.invalidateQueries({
        queryKey: ['user', {id: user.id}]
      });
      //Update queryData
      queryClient.setQueryData(['users', {id: user.id}], user);
    }
  })

  return {
    ...query,
    mutation
  }
}