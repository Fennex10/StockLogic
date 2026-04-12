import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeSalesByAction } from "../actions/complete-sales"; 
import { toast } from "sonner"; 

export const useCompleteSales = () => {
  const queryClient = useQueryClient();

  const deleteSales = useMutation({
    mutationFn: (id: string) => completeSalesByAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Venta completada correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al completar la venta");
    },
  });

  return deleteSales;
};