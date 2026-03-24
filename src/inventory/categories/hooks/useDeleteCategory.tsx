import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoriesByAction } from "../actions/delete-category"; 
import { toast } from "sonner"; 

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationFn: (id: string) => deleteCategoriesByAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria eliminado correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al eliminar categoria");
    },
  });

  return deleteCategory;
};