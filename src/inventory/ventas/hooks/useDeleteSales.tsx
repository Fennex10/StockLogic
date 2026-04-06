import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSalesByAction } from "../actions/delete-sales"; 
import { toast } from "sonner"; 

export const useDeleteSales = () => {
  const queryClient = useQueryClient();

  const deleteSales = useMutation({
    mutationFn: (id: string) => deleteSalesByAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Venta eliminada correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al eliminar la venta");
    },
  });

  return deleteSales;
};