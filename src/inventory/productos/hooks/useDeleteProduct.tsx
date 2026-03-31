import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteProductsByAction } from "../action/delete-product"; 
import { toast } from "sonner"; 

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const deleteProduct = useMutation({
    mutationFn: (id: string) => DeleteProductsByAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al eliminar el producto");
    },
  });

  return deleteProduct;
};