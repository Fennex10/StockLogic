import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserManagersByAction } from "../actions/delete-users-manager"; 
import { toast } from "sonner"; 

export const useDeleteUserManager = () => {
  const queryClient = useQueryClient();

  const deleteUserManager = useMutation({
    mutationFn: (id: string) => deleteUserManagersByAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al eliminar el usuario");
    },
  });

  return deleteUserManager;
};