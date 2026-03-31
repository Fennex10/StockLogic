import { useQuery } from "@tanstack/react-query"
import { getUserRolesAction } from "../actions/get-use-roles.action";

export const useUserRoles = () => {

     return useQuery({
       queryKey: ['roles'],
       queryFn: () => getUserRolesAction(),
       staleTime: 1000 * 60 * 5,
    });
}
