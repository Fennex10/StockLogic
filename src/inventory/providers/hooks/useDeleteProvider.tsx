import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProvidersByAction } from "../action/delete-provider"; 
import { toast } from "sonner"; 

export const useDeleteProvider = () => {
  const queryClient = useQueryClient();

  const deleteProvider = useMutation({
    mutationFn: (id: string) => deleteProvidersByAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast.success("Proveedor eliminado correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al eliminar el proveedor");
    },
  });

  return deleteProvider;
};