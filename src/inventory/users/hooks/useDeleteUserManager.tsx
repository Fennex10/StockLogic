import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserManagersByAction } from "../actions/delete-users-manager"; 
import { toast } from "sonner"; 

export const useDeleteUserManager = () => {
  const queryClient = useQueryClient();

  const deleteUserManager = useMutation({
    mutationFn: (id: string) => deleteUserManagersByAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Status del usuario cambiado correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al cambiar el status del usuario");
    },
  });

  return deleteUserManager;
};