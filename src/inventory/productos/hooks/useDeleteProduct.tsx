import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteProductsByAction } from "../action/delete-product"; // Ajusta la ruta
import { toast } from "sonner"; // O la librería de notificaciones que uses

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